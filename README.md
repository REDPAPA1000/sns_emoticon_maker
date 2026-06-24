# Main Automation with AI

AI와 자동화 도구를 결합한 프로젝트 모음입니다.

## 프로젝트 구조

```
.
├── manim_automation/     # 수학 영상 자동 생성 (Claude/Gemini/Ollama + Manim)
└── sns_emoticon/         # SNS 이모티콘 메이커 웹앱 (Next.js + Gemini API)
```

---

## manim_automation — 수학 영상 자동화

수학 개념을 자연어로 입력하면 AI가 Manim 코드를 작성하고 MP4 영상을 자동 렌더링합니다.

### 프로바이더 (골라서 사용)

| 프로바이더 | 비용 | 설정 |
|---|---|---|
| `ollama` | 완전 무료 | 로컬 노트북에 Ollama 설치 |
| `gemini` | 무료 티어 | `GEMINI_API_KEY` |
| `claude` | 유료 | `ANTHROPIC_API_KEY` |

### 빠른 시작

```bash
cd manim_automation
pip install -r requirements.txt

# Ollama (무료, 노트북)
ollama pull qwen2.5-coder:7b
python generate_manim.py "피타고라스 정리를 삼각형으로 시각화" --provider ollama

# Gemini (무료 티어)
export GEMINI_API_KEY=...
python generate_manim.py "미분의 기하학적 의미" --provider gemini

# 일괄 생성
python batch_process.py --provider ollama
```

→ 자세한 내용: [`manim_automation/README.md`](manim_automation/README.md)

---

## sns_emoticon — SNS 이모티콘 메이커

사진 한 장으로 SNS 이모티콘 8종을 자동 생성하는 BYOK 웹앱입니다.
Gemini API Key를 직접 입력해 사용합니다.

```bash
cd sns_emoticon
npm install
npm run dev
```

→ 자세한 내용: [`sns_emoticon/README.md`](sns_emoticon/README.md)
