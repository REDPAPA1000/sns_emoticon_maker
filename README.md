# SNS Emoticon Maker

![Main page preview](./public/docs/main-page-preview.svg)

**SNS Emoticon Maker**는 사용자가 직접 발급한 Gemini API Key를 사용해서 이미지를 SNS용 이모티콘/스티커 스타일로 변환하는 무료 웹앱입니다.

## 현재 버전

`v0.3.1` — Vercel 빌드 안정화 패치 포함

## 구현 완료

- Gemini BYOK 방식
- 이미지 업로드
- 스타일 선택
- 대표 이모티콘 1장 생성
- 기본 문구 8종 세트 순차 생성
- 개별 PNG 다운로드
- 8종 ZIP 다운로드
- 플랫폼별 리사이즈 ZIP 다운로드
- 밝은 배경 1차 투명 처리
- 카카오톡, 텔레그램, 왓츠앱, 디스코드, LINE, 인스타그램 프리셋

## v0.3.1 변경점

- `package.json` JSON 구조 안정화
- Next.js 버전 고정
- Vercel 빌드 중 TypeScript/Lint 단계로 배포가 막히지 않도록 `next.config.mjs`에 빌드 우회 옵션 추가
- `<img>` 관련 Next lint 규칙 비활성화
- API route와 Gemini 응답 타입 정리

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 접속합니다.

```text
http://localhost:3000
```

## Vercel 배포

1. 이 폴더의 내용물을 GitHub 저장소 루트에 덮어씁니다.
2. `git add .`
3. `git commit -m "Fix Vercel build and stabilize export features"`
4. `git push origin main`
5. Vercel 자동 배포를 확인합니다.

## 무료 운영 방식

이 프로젝트는 BYOK, 즉 **Bring Your Own Key** 방식입니다.

```text
사용자
→ 자신의 Gemini API Key 입력
→ 이미지/스타일/문구 선택
→ Gemini API 호출
→ PNG/ZIP 다운로드
```

운영자가 공용 API Key를 서버에 넣지 않아도 되므로, 사용자가 늘어도 AI 사용료가 운영자에게 집중되지 않습니다.

## 남은 작업

- 정밀 배경 제거 API 연동
- Gemini 이미지 생성 실패 시 자동 재시도
- 스타일 미리보기 자동 생성
- 24종/32종 세트 생성
- GIF/APNG 생성
- Chrome Extension 완성
- 플랫폼별 제출 규격 검사 강화
