"""
Manim AI Automation - Core Pipeline

Generates Manim animation code via Claude API, renders it using subprocess,
and retries with error feedback on failure.
"""

import os
import re
import subprocess
import sys
import textwrap
import time

import anthropic

SYSTEM_PROMPT = textwrap.dedent("""
당신은 Manim Community Edition(ManimCE) 수학 애니메이션 전문가입니다.
Python과 Manim 라이브러리를 사용해 수학 개념을 시각적으로 설명하는 코드를 작성합니다.

코드 작성 규칙:
- 반드시 `from manim import *` 로 시작합니다.
- 씬 클래스 이름은 항상 `MathAnimation` 으로 고정합니다.
- `construct(self)` 메서드 안에 모든 애니메이션 로직을 작성합니다.
- 텍스트는 한국어와 영어를 혼용해도 됩니다.
- 수식은 LaTeX 형식으로 `MathTex` 를 사용합니다.
- 애니메이션은 `self.play()`, `self.wait()` 로 구성합니다.
- 색상은 Manim 내장 상수(BLUE, RED, GREEN, YELLOW, WHITE 등)를 사용합니다.
- 코드는 ManimCE 최신 버전 기준으로 작성합니다.
- 응답은 반드시 파이썬 코드 블록(```python ... ```) 형식으로만 반환합니다.
""".strip())


def extract_code(text: str) -> str:
    """Extract Python code from markdown code block if present."""
    match = re.search(r"```python\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r"```\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def generate_manim_code(client: anthropic.Anthropic, topic: str, error_log: str | None = None) -> str:
    """Call Claude to generate or fix Manim code for the given topic."""
    user_message = (
        f"다음 수학 주제를 설명하는 Manim 애니메이션 코드를 작성해주세요:\n\n{topic}"
    )
    if error_log:
        user_message += (
            f"\n\n이전 렌더링에서 아래 오류가 발생했습니다. 원인을 분석하고 수정된 코드를 작성해주세요:\n\n{error_log}"
        )

    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=4096,
        thinking={"type": "adaptive"},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    raw_text = ""
    for block in response.content:
        if block.type == "text":
            raw_text = block.text
            break

    return extract_code(raw_text)


def render_manim(code: str, output_dir: str = "output") -> tuple[bool, str]:
    """
    Write code to a temp file and render with manim CLI.
    Returns (success, error_log).
    """
    os.makedirs(output_dir, exist_ok=True)
    scene_file = os.path.join(output_dir, "_temp_scene.py")

    with open(scene_file, "w", encoding="utf-8") as f:
        f.write(code)

    cmd = [
        sys.executable, "-m", "manim",
        "-ql",                   # low quality for fast preview
        scene_file,
        "MathAnimation",
        "--output_file", "MathAnimation",
        "--media_dir", output_dir,
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except subprocess.TimeoutExpired:
        return False, "렌더링 시간 초과 (120초)"
    except FileNotFoundError:
        return False, "manim 명령을 찾을 수 없습니다. `pip install manim` 을 실행하세요."

    if result.returncode == 0:
        return True, ""

    error_log = (result.stdout + "\n" + result.stderr).strip()
    return False, error_log


def generate_and_render(
    topic: str,
    api_key: str | None = None,
    max_retries: int = 3,
    output_dir: str = "output",
) -> dict:
    """
    Full pipeline: topic → Claude code → manim render → retry on error.

    Returns a dict with keys: topic, success, attempts, output_dir, error.
    """
    client = anthropic.Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))

    print(f"\n[Topic] {topic}")
    error_log: str | None = None
    code = ""

    for attempt in range(1, max_retries + 1):
        print(f"  Attempt {attempt}/{max_retries}: generating code...", end=" ", flush=True)
        try:
            code = generate_manim_code(client, topic, error_log)
        except anthropic.APIError as exc:
            print(f"API error: {exc}")
            return {"topic": topic, "success": False, "attempts": attempt, "output_dir": output_dir, "error": str(exc)}

        print("rendering...", end=" ", flush=True)
        success, error_log = render_manim(code, output_dir)

        if success:
            print("OK")
            return {"topic": topic, "success": True, "attempts": attempt, "output_dir": output_dir, "error": None}

        print(f"FAILED\n    Error: {error_log[:200]}")

        if attempt < max_retries:
            time.sleep(1)

    return {"topic": topic, "success": False, "attempts": max_retries, "output_dir": output_dir, "error": error_log}


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate a Manim animation from a topic description.")
    parser.add_argument("topic", help="수학 주제 설명 (예: '피타고라스 정리를 삼각형으로 시각화')")
    parser.add_argument("--retries", type=int, default=3, help="최대 재시도 횟수 (기본값: 3)")
    parser.add_argument("--output", default="output", help="출력 디렉터리 (기본값: output)")
    args = parser.parse_args()

    result = generate_and_render(args.topic, max_retries=args.retries, output_dir=args.output)
    status = "성공" if result["success"] else "실패"
    print(f"\n결과: {status} | 시도: {result['attempts']} | 출력: {result['output_dir']}")
    if not result["success"]:
        print(f"오류: {result['error']}")
        sys.exit(1)
