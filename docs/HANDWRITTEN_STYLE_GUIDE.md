# AI 풀이 노트 — 손글씨 스타일 지침서

> REDPAPA | 최종 수정: 2026-06-28

---

## 1. 디자인 철학

손으로 노트를 정리하는 학생의 느낌을 재현하는 것이 핵심입니다.

- **노트 종이**가 주인공. UI 크롬(헤더 바, 버튼 등)이 노트를 방해해선 안 된다
- 섹션 구분은 **형광펜으로 박스 친 것처럼** 표현한다
- 단계 번호는 **원 모양 뱃지**로, 색상으로 시각적 위계를 만든다
- 정답은 **노란 형광펜 강조** 효과로 별도 처리한다
- 페이지 상단 타이틀과 하단 서명은 노트에 **직접 써 넣은 것처럼** 보여야 한다

---

## 2. 색상 팔레트

### 2-1. 섹션별 색상 (형광펜 박스)

| 섹션 | 배경 | 테두리 | 헤더 텍스트 | 본문 텍스트 |
|------|------|--------|------------|------------|
| 📌 문제 | `#dbeafe` | `#93c5fd` | `#1d4ed8` | `#1e3a8a` |
| ✏️ 풀이 과정 | `#fefce8` | `#fcd34d` | `#92400e` | `#78350f` |
| ✅ 정답 (full box) | `#fef9c3` | `#fbbf24` | `#92400e` | `#7c2d12` |
| 💡 핵심 공식 | `#d1fae5` | `#6ee7b7` | `#065f46` | `#064e3b` |

### 2-2. 단계 뱃지 색상

단계 번호 순서대로 순환 적용합니다.

| 순서 | 색상 | HEX |
|------|------|-----|
| 1단계 | 빨강 | `#ef4444` |
| 2단계 | 초록 | `#22c55e` |
| 3단계 | 보라 | `#8b5cf6` |
| 4단계 | 주황 | `#f97316` |
| 5단계 | 하늘 | `#06b6d4` |
| 6단계 | 분홍 | `#ec4899` |
| 7단계~ | 1번부터 반복 | — |

### 2-3. 노트 배경 & 줄선

| 요소 | 값 |
|------|-----|
| 종이 배경 | `#fefef8` (아이보리 화이트) |
| 줄선 색상 | `#cad9ea` (연한 파랑) |
| 줄 간격 | 40px (화면) / 34px (인쇄) |
| 줄 두께 | 1px |

### 2-4. 페이지 타이틀 & 서명

| 요소 | 색상 | 크기 |
|------|------|------|
| 타이틀 (`AI 풀이 노트`) | `#1e3a8a` | 28px |
| 브랜드 (`REDPAPA`) | `#b0bfd4` | 17px |
| 페이지 룰(하단 선) | `#b0c4de → transparent` 그라디언트 | 2px |
| 하단 서명 | `#b8c8d8` | 15px |

---

## 3. 폰트

| 용도 | 폰트 | 대체 |
|------|------|------|
| 노트 본문 (손글씨) | `Nanum Pen Script` | `Gowun Handwriting`, cursive |
| UI / 시스템 텍스트 | `Inter`, `Pretendard`, system-ui | — |
| 뱃지 숫자 | `system-ui` (작고 선명하게) | — |

> Google Fonts 로드: `https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap`
>
> Python PIL: `/usr/share/fonts/truetype/nanum/NanumPen.ttf` (apt: `fonts-nanum-extra`)

---

## 4. 레이아웃 구조

```
┌─────────────────────────────────────────────────┐
│ AI 풀이 노트                           REDPAPA   │  ← nb-page-header (줄 1)
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━               │  ← nb-page-rule
├─────────────────────────────────────────────────┤
│ ┌─────────────────────┐                          │
│ │ 📌 문제             │  ← nb-pill (blue)         │
│ └─────────────────────┘                          │
│   문제 텍스트 줄 1...                            │  ← nb-line (blue body)
│   문제 텍스트 줄 2...                            │
│                                                 │
│ ┌─────────────────────┐                          │
│ │ ✏️ 풀이 과정         │  ← nb-pill (amber)        │
│ └─────────────────────┘                          │
│  ● 1단계 제목                                    │  ← nb-step-row (red badge)
│    계산 내용 줄 1...                              │  ← nb-line (brown body)
│    계산 내용 줄 2...                              │
│  ● 2단계 제목                                    │  ← nb-step-row (green badge)
│    계산 내용...                                  │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ ✅ 정답          최종 답안 내용               │ │  ← nb-answer-box (gold full)
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ ┌─────────────────────┐                          │
│ │ 💡 핵심 공식         │  ← nb-pill (green)        │
│ └─────────────────────┘                          │
│   공식 1...                                      │  ← nb-line (dark green)
│   공식 2...                                      │
├─────────────────────────────────────────────────┤
│                            AI 풀이 노트 · REDPAPA│  ← nb-page-footer
└─────────────────────────────────────────────────┘
```

---

## 5. 컴포넌트별 CSS 명세

### 5-1. 노트 종이 (`.notebook-paper`)

```css
background-color: #fefef8;
background-image: repeating-linear-gradient(
  transparent, transparent 39px,
  #cad9ea 39px, #cad9ea 40px
);
box-shadow:
  4px 6px 24px rgba(0,0,0,0.14),
  inset 0 0 80px rgba(255,252,210,0.35);
font-family: 'Nanum Pen Script', cursive;
font-size: 20px;
line-height: 40px;
```

### 5-2. 섹션 헤더 필 (`.nb-pill`)

```css
display: inline-block;
padding: 2px 18px 2px 14px;
border-radius: 20px;
font-size: 19px;
font-weight: 700;
margin: 8px 0 2px;
line-height: 38px;
/* background / border / color → 섹션별 인라인 스타일 */
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
```

### 5-3. 단계 뱃지 (`.nb-step-badge`)

```css
width: 26px; height: 26px;
border-radius: 50%;
display: inline-flex;
align-items: center;
justify-content: center;
color: white;
font-family: system-ui;
font-size: 13px;
font-weight: 800;
-webkit-print-color-adjust: exact;
print-color-adjust: exact;
/* background → 단계 번호별 인라인 스타일 */
```

### 5-4. 정답 박스 (`.nb-answer-box`)

```css
margin: 10px 0 6px;
padding: 10px 20px 14px;
border-radius: 12px;
/* background / border → 인라인 스타일 */
```

정답 텍스트 (`.nb-answer-line`): `font-size: 26px; font-weight: 700`

### 5-5. 페이지 타이틀 (`.nb-page-header`)

```css
display: flex;
align-items: baseline;
justify-content: space-between;
padding: 6px 24px 0;
line-height: 40px;  /* 첫 줄선에 정확히 앉힘 */
```

`.nb-page-title-text`: `font-size: 28px; color: #1e3a8a`  
`.nb-page-brand`: `font-size: 17px; color: #b0bfd4`

---

## 6. AI 프롬프트 포맷 (Gemini API)

AI가 반환하는 텍스트가 노트 렌더러와 정확히 매핑되어야 합니다.

```
📌 문제
[이미지의 문제 텍스트 그대로]

✏️ 풀이 과정
1단계. [단계 제목]
[계산/설명 줄]

2단계. [단계 제목]
[계산/설명 줄]

✅ 정답
[최종 정답 한 줄]

💡 핵심 공식
[공식 1]
[공식 2]
```

**파서 규칙:**
- `📌 / ✏️ / ✅ / 💡` 로 시작하는 줄 → 섹션 헤더 (`.nb-pill`)
- `1단계. / 2단계. ...` 패턴 → 단계 뱃지 행 (`.nb-step-row`)
- 나머지 줄 → 본문 (`.nb-line`)

---

## 7. Python PIL 구현 매핑

`scripts/generate_note.py` 의 주요 상수가 웹 CSS와 어떻게 매핑되는지 정리합니다.

| PIL 상수 | 값 | 웹 CSS 대응 |
|----------|-----|-------------|
| `BG` | `(252,252,245)` | `.notebook-paper { background-color: #fefef8 }` |
| `LINE_C` | `(200,214,229)` | `#cad9ea` 줄선 |
| `LINE_H` | `42px` (화면 40px) | `line-height: 40px` |
| `PEN` | `NanumPen.ttf` | `'Nanum Pen Script'` (Google Fonts) |
| `C['q']` box | `(219,234,254)` → `#dbeafe` | 📌 `.nb-pill` background |
| `C['p']` box | `(255,243,196)` → `#fefce8` | ✏️ `.nb-pill` background |
| `C['a']` box | `(255,236,100)` → `#fef9c3` | ✅ `.nb-answer-box` background |
| `C['h']` box | `(209,250,229)` → `#d1fae5` | 💡 `.nb-pill` background |
| `C['s1']` badge | `(239,68,68)` → `#ef4444` | 1단계 `.nb-step-badge` |
| `C['s2']` badge | `(34,197,94)` → `#22c55e` | 2단계 `.nb-step-badge` |
| `C['s3']` badge | `(139,92,246)` → `#8b5cf6` | 3단계 `.nb-step-badge` |
| `C['s4']` badge | `(249,115,22)` → `#f97316` | 4단계 `.nb-step-badge` |

---

## 8. PDF 인쇄 설정

### 브라우저 (`window.print()`)

```css
@page {
  size: A4;
  margin: 12mm 14mm;
}
```

- 배경색 인쇄 필수: `-webkit-print-color-adjust: exact; print-color-adjust: exact`
- 인쇄 시 폰트 크기 조정: 20px → 16px, 줄 간격 40px → 34px

### Python PIL (`scripts/generate_note.py`)

```python
A4_W = 1240   # 150 DPI 기준
A4_H = 1754
DPI  = 150
LINE_H = 42

img.save("note.pdf", "PDF", resolution=DPI)
```

---

## 9. 확장 가이드

### 새 과목 색상 추가

`app/solver/page.tsx` 의 `SECTION_STYLES`에 이모지 키 추가:

```typescript
'🔬': { pillBg: '#fce7f3', pillBorder: '#f9a8d4', pillText: '#9d174d', bodyColor: '#831843' }
```

AI 프롬프트에 해당 이모지 섹션 추가.

### 단계 색상 순서 변경

`STEP_COLORS` 배열 순서 변경:

```typescript
const STEP_COLORS = ['#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];
```

### 줄 간격 조정

CSS: `line-height`, `repeating-linear-gradient` 의 `39px/40px` 동시 수정  
PIL: `LINE_H` 상수 수정

---

*이 지침서는 Python PIL 스크립트와 Next.js 웹앱이 동일한 시각적 품질을 유지하기 위한 단일 소스입니다.*
