"""
Manim AI Automation - Core Pipeline

Generates Manim animation code via an LLM provider (Claude / Gemini / Ollama),
renders it using the manim CLI, and retries with error feedback on failure.

프로바이더 선택:
- claude:  유료, 코드 생성 정확도 최고
- gemini:  무료 티어 있음 (https://aistudio.google.com/apikey)
- ollama:  로컬 완전 무료, 무제한 (노트북에서 실행)

영상 품질은 프로바이더와 무관합니다 (Manim이 렌더링). 같은 코드면 같은 영상.
"""

import os
import re
import subprocess
import sys
import textwrap
import time

import providers

SYSTEM_PROMPT_BASE = textwrap.dedent("""
당신은 Manim Community Edition(ManimCE) 수학 애니메이션 전문가입니다.
Python과 Manim 라이브러리를 사용해 수학 개념을 시각적으로 설명하는 코드를 작성합니다.

─── 반드시 지켜야 할 코드 작성 규칙 ───────────────────────────────────

기본 구조:
- 반드시 `from manim import *` 로 시작합니다.
- 씬 클래스 이름은 항상 `MathAnimation` 으로 고정합니다.
- `construct(self)` 메서드 안에 모든 애니메이션 로직을 작성합니다.

한국어 폰트 (반드시 이 두 가지만 사용):
- 제목·강조: Text("내용", font="NanumSquareRound ExtraBold", font_size=44)
- 본문·레이블: Text("내용", font="NanumSquareRound", font_size=22)
- MathTex·Tex는 폰트 지정 없이 그대로 사용합니다.
- ⚠️ 절대 금지: MathTex/Tex 안에 한국어를 넣지 마세요.
  (예: MathTex(r"\\frac{높이}{밑변}") → LaTeX 컴파일 오류 발생!)
  한국어가 필요하면 Text 로 만들고, 수식은 a, b, c 같은 기호로 표현하세요.

교육 영상 구성 (원리 → 공식 순서):
- 개념의 "원리"를 먼저 시각적으로 유도해 보여주세요.
- 마지막에 "공식 정리"를 표나 강조 박스로 깔끔하게 정리하세요.
- 섹션이 바뀔 때는 FadeOut 으로 화면을 비우고 다음 섹션을 그리세요.
- 각 섹션 상단에 ①②③ 번호와 소제목(Text)을 붙이세요.

16:9 레이아웃 (Manim 기본 프레임: 가로 14.22 × 세로 8.0):
- 제목 전용 구역: y > 2.0 (title.to_edge(UP, buff=0.35) 후 sep line 추가)
- 그래픽/시각화 구역: 왼쪽(x < 0.5), y 범위 -3.6 ~ 1.8
- 수식/설명 구역: 오른쪽(x > 1.5), y 범위 -3.0 ~ 1.8
- 어떤 그래픽 요소도 y > 1.9 를 침범하면 안 됩니다 (제목 겹침 방지).
- 도형 크기는 프레임 경계(-7.1 ~ 7.1, -4.0 ~ 4.0)를 넘지 않게 합니다.

기타:
- 색상은 Manim 내장 상수(BLUE, RED, GREEN, YELLOW, WHITE, GRAY_B 등)를 사용합니다.
- 코드는 ManimCE 최신 버전 기준으로 작성합니다.
- 응답은 반드시 파이썬 코드 블록(```python ... ```) 형식으로만 반환합니다.
- 코드 외의 설명은 코드 블록 밖에 최소한으로만 작성합니다.
""").strip()

SYSTEM_PROMPT_BASIC = SYSTEM_PROMPT_BASE + "\n\n" + textwrap.dedent("""
─── 기본(Basic) 레벨 영상 제작 원칙 ───────────────────────────────────
대상: 중학생, 수학을 어려워하는 학생
목표: 영상만 봐도 혼자 이해할 수 있을 만큼 쉽게

- 일상 생활 예시로 시작하세요 (사진 복사, 지도, 그림자 등).
- 개념을 한 번에 하나씩 천천히 단계별로 보여주세요.
- 핵심 1~2가지만 전달하고 나머지는 생략하세요.
- 복잡한 수식보다 색깔·크기·움직임으로 설명하세요.
- 핵심 문장은 화면에 짧게 텍스트로 표시하세요 (예: "두 각이 같으면 닮음!").
- 영상 길이: 40~60초.
""").strip()

SYSTEM_PROMPT_ADVANCED = SYSTEM_PROMPT_BASE + "\n\n" + textwrap.dedent("""
─── 심화(Advanced) 레벨 영상 제작 원칙 ────────────────────────────────
대상: 개념을 이미 아는 학생, 시험 대비
목표: 수학적 엄밀성 + 증명 과정 이해

- 정의 → 조건 → 증명 → 예제 순서로 구성하세요.
- MathTex로 수식을 정확하게 표현하세요.
- 증명 과정을 단계별로 논리적으로 보여주세요.
- 여러 예제와 반례를 포함하세요.
- 영상 길이: 60~90초.
""").strip()

SYSTEM_PROMPT = SYSTEM_PROMPT_BASIC  # 기본값


def extract_code(text: str) -> str:
    """Extract Python code from a markdown code block if present."""
    match = re.search(r"```python\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"```\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def generate_manim_code(
    topic: str,
    provider: str = "claude",
    model: str | None = None,
    error_log: str | None = None,
    level: str = "기본",
) -> str:
    """Ask the chosen LLM to generate (or fix) Manim code for the topic."""
    system = SYSTEM_PROMPT_BASIC if level == "기본" else SYSTEM_PROMPT_ADVANCED
    user_message = (
        f"다음 수학 주제를 설명하는 Manim 애니메이션 코드를 작성해주세요:\n\n{topic}"
    )
    if error_log:
        user_message += (
            "\n\n이전 렌더링에서 아래 오류가 발생했습니다. "
            f"원인을 분석하고 수정된 전체 코드를 작성해주세요:\n\n{error_log}"
        )

    raw_text = providers.generate(provider, system, user_message, model)
    return extract_code(raw_text)


def syntax_check(code: str) -> tuple[bool, str]:
    """Quick Python syntax validation before invoking manim."""
    try:
        compile(code, "<generated_scene>", "exec")
        return True, ""
    except SyntaxError as exc:
        return False, f"SyntaxError: {exc.msg} (line {exc.lineno})"


def render_manim(code: str, output_dir: str = "output", quality: str = "l") -> tuple[bool, str]:
    """
    Write code to a temp file and render with the manim CLI.

    quality: 'l' (480p, 빠름), 'm' (720p), 'h' (1080p), 'k' (4K)
    Returns (success, error_log).
    """
    os.makedirs(output_dir, exist_ok=True)
    scene_file = os.path.join(output_dir, "_temp_scene.py")

    with open(scene_file, "w", encoding="utf-8") as f:
        f.write(code)

    cmd = [
        sys.executable, "-m", "manim",
        f"-q{quality}",
        scene_file,
        "MathAnimation",
        "--output_file", "MathAnimation",
        "--media_dir", output_dir,
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    except subprocess.TimeoutExpired:
        return False, "렌더링 시간 초과 (300초)"
    except FileNotFoundError:
        return False, "manim 명령을 찾을 수 없습니다. `pip install manim` 을 실행하세요."

    if result.returncode == 0:
        return True, ""

    error_log = (result.stdout + "\n" + result.stderr).strip()
    return False, error_log


def find_output_video(output_dir: str) -> str | None:
    """Locate the rendered MP4 under the manim media tree."""
    for root, _dirs, files in os.walk(output_dir):
        for name in files:
            if name == "MathAnimation.mp4":
                return os.path.join(root, name)
    return None


def generate_and_render(
    topic: str,
    provider: str = "claude",
    model: str | None = None,
    max_retries: int = 3,
    output_dir: str = "output",
    quality: str = "l",
    level: str = "기본",
) -> dict:
    """
    Full pipeline: topic → LLM code → syntax check → manim render → retry on error.

    Returns a dict: topic, provider, success, attempts, video, output_dir, error.
    """
    print(f"\n[Topic] {topic}")
    print(f"[Provider] {provider} (model: {model or providers.DEFAULT_MODELS.get(provider, '?')})")

    error_log: str | None = None

    for attempt in range(1, max_retries + 1):
        print(f"  Attempt {attempt}/{max_retries}: generating code...", end=" ", flush=True)
        try:
            code = generate_manim_code(topic, provider, model, error_log, level)
        except providers.ProviderError as exc:
            print(f"\n    Provider error: {exc}")
            return _result(topic, provider, False, attempt, None, output_dir, str(exc))

        ok, syntax_err = syntax_check(code)
        if not ok:
            print(f"syntax FAIL ({syntax_err})")
            error_log = syntax_err
            if attempt < max_retries:
                time.sleep(1)
            continue

        print("rendering...", end=" ", flush=True)
        success, error_log = render_manim(code, output_dir, quality)

        if success:
            video = find_output_video(output_dir)
            print(f"OK → {video}")
            return _result(topic, provider, True, attempt, video, output_dir, None)

        print(f"FAILED\n    Error: {error_log[:200]}")
        if attempt < max_retries:
            time.sleep(1)

    return _result(topic, provider, False, max_retries, None, output_dir, error_log)


def _result(topic, provider, success, attempts, video, output_dir, error):
    return {
        "topic": topic,
        "provider": provider,
        "success": success,
        "attempts": attempts,
        "video": video,
        "output_dir": output_dir,
        "error": error,
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate a Manim animation from a topic description.")
    parser.add_argument("topic", help="수학 주제 설명 (예: '피타고라스 정리를 삼각형으로 시각화')")
    parser.add_argument(
        "--provider", default=os.environ.get("MANIM_PROVIDER", "claude"),
        choices=["claude", "gemini", "ollama"],
        help="LLM 프로바이더 (기본값: claude, 환경변수 MANIM_PROVIDER로도 설정 가능)",
    )
    parser.add_argument("--model", default=None, help="모델 이름 (생략 시 프로바이더별 기본값)")
    parser.add_argument("--retries", type=int, default=3, help="최대 재시도 횟수 (기본값: 3)")
    parser.add_argument("--output", default="output", help="출력 디렉터리 (기본값: output)")
    parser.add_argument(
        "--quality", default="l", choices=["l", "m", "h", "k"],
        help="렌더링 품질 l=480p m=720p h=1080p k=4K (기본값: l)",
    )
    args = parser.parse_args()

    result = generate_and_render(
        args.topic,
        provider=args.provider,
        model=args.model,
        max_retries=args.retries,
        output_dir=args.output,
        quality=args.quality,
    )
    status = "성공" if result["success"] else "실패"
    print(f"\n결과: {status} | 프로바이더: {result['provider']} | 시도: {result['attempts']}")
    if result["success"]:
        print(f"영상: {result['video']}")
    else:
        print(f"오류: {result['error']}")
        sys.exit(1)
