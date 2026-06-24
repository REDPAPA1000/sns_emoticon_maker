# Math Visual Automation

AI를 이용해 수학·과학 개념을 Manim 영상으로 자동 생성하는 도구입니다.
텍스트로 개념을 입력하면 MP4 영상을 자동으로 만들어줍니다.

## 프로바이더 (골라서 사용)

| 프로바이더 | 비용 | 설정 |
|---|---|---|
| `ollama` | 완전 무료 | 로컬 노트북, 인터넷 불필요 |
| `gemini` | 무료 티어 | `GEMINI_API_KEY` 환경변수 |
| `claude` | 유료 | `ANTHROPIC_API_KEY` 환경변수 |

## 설치

```bash
# 시스템 의존성 (Ubuntu/Debian)
apt-get install -y ffmpeg libcairo2-dev libpango1.0-dev texlive texlive-latex-extra

# Python 패키지
pip install -r requirements.txt

# Ollama 사용 시 모델 다운로드
ollama pull qwen2.5-coder:7b
```

## 사용법

### 단일 영상

```bash
python generate_manim.py "이차방정식의 근의 공식" --provider ollama
python generate_manim.py "미분의 기하학적 의미" --provider gemini
python generate_manim.py "피타고라스 정리" --provider claude --quality h
```

### 일괄 생성 (batch)

```bash
python batch_process.py --provider ollama
python batch_process.py --provider ollama --tags calculus
python batch_process.py --provider gemini --ids pythagorean_theorem fourier_transform
```

### 주요 옵션

| 옵션 | 설명 | 기본값 |
|---|---|---|
| `--provider` | `ollama` / `gemini` / `claude` | `claude` |
| `--quality` | `l`=480p `m`=720p `h`=1080p | `l` |
| `--retries` | 오류 시 자동 재시도 횟수 | 3 |

## 파일 구조

```
/
├── generate_manim.py   # 단일 영상 생성 파이프라인
├── batch_process.py    # 일괄 생성
├── providers.py        # LLM 프로바이더 (Claude/Gemini/Ollama)
├── requirements.txt
├── data/
│   └── topics.json     # 주제 목록 (교육과정 기반으로 확장 예정)
├── templates/
│   └── base_scene.py   # Manim 씬 템플릿
└── sns_emoticon/       # SNS 이모티콘 웹앱 (별도 프로젝트)
```

## 출력

생성된 영상은 `output/` 폴더에 저장됩니다.
