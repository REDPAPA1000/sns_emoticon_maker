# Math Visual Automation

수학 개념을 자연어로 입력하면 **LLM이 Manim 코드를 작성하고 자동으로 MP4 영상을 렌더링**하는 도구입니다.
사용자는 Manim 코드를 직접 작성하지 않아도 됩니다.

## 작동 방식

```
개념 입력 → LLM 코드 생성 → 문법 검사 → Manim 렌더링 → 오류 시 자동 수정 재시도 → MP4 저장
```

## 프로바이더 3종 (골라서 사용)

| 프로바이더 | 비용 | 설정 | 비고 |
|---|---|---|---|
| `claude` | 유료 | `ANTHROPIC_API_KEY` | 코드 생성 정확도 최고 |
| `gemini` | **무료 티어** | `GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `ollama` | **완전 무료** | 노트북에 Ollama 설치 | 인터넷·API키 불필요, 무제한 |

> **영상 품질은 프로바이더와 무관합니다.** 영상은 Manim이 렌더링하므로 같은 코드면 항상 같은 품질입니다.
> 프로바이더는 '코드 생성 정확도'에만 영향을 주며, 틀려도 자동 재시도 루프가 보정합니다.

## 설치

```bash
# 1) 시스템 의존성 (Ubuntu/Debian)
apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev texlive texlive-latex-extra texlive-fonts-recommended

# 2) Python 패키지
pip install -r requirements.txt

# 3) (Ollama 사용 시) 코드 생성에 강한 모델 받기
ollama pull qwen2.5-coder:7b
```

## 사용법

### 단일 영상 — Ollama (완전 무료)

```bash
python generate_manim.py "피타고라스 정리를 삼각형으로 시각화" --provider ollama
```

### 단일 영상 — Gemini (무료 티어)

```bash
export GEMINI_API_KEY=...
python generate_manim.py "미분의 기하학적 의미" --provider gemini
```

### 단일 영상 — Claude

```bash
export ANTHROPIC_API_KEY=sk-ant-...
python generate_manim.py "푸리에 변환" --provider claude --quality h
```

### 일괄 생성 (batch)

```bash
# topics.json 전체를 Ollama로 생성
python batch_process.py --provider ollama

# 태그/ID 필터
python batch_process.py --provider gemini --tags calculus geometry
python batch_process.py --provider ollama --ids fourier_transform pythagorean_theorem
```

### 옵션

| 옵션 | 설명 | 기본값 |
|---|---|---|
| `--provider` | `claude` / `gemini` / `ollama` | `claude` |
| `--model` | 모델 이름 직접 지정 | 프로바이더별 기본값 |
| `--retries` | 자동 수정 최대 재시도 | 3 |
| `--quality` | `l`=480p `m`=720p `h`=1080p `k`=4K | `l` |

기본 프로바이더는 환경변수로도 고정 가능: `export MANIM_PROVIDER=ollama`

## 출력

생성된 MP4는 `output/<주제>/videos/.../MathAnimation.mp4` 에 저장됩니다.
배치 실행 시 `output/batch_report.json` 에 성공/실패 리포트가 남습니다.

## 파일 구조

```
.
├── generate_manim.py   # 핵심 파이프라인 (생성→검사→렌더→재시도)
├── batch_process.py    # 일괄 처리
├── providers.py        # LLM 프로바이더 추상화 (claude/gemini/ollama)
├── requirements.txt
├── data/topics.json    # 샘플 수학 주제 목록
└── templates/base_scene.py
```
