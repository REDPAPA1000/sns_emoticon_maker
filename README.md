# SNS Emoticon Maker

![Main page preview](./public/docs/main-page-preview.svg)

**SNS Emoticon Maker**는 사용자가 직접 발급한 Gemini API Key를 사용해서 이미지를 SNS용 이모티콘/스티커 스타일로 변환하는 무료 웹앱입니다.

## 현재 버전

`v0.3.0`

## 이번 버전에서 완료된 기능

- Vercel 배포 안정화를 위한 `package.json` 정리
- Next.js 15.5.7 고정
- React 19.1.0 고정
- Gemini API Key 입력 및 브라우저 localStorage 저장
- 이미지 업로드
- 스타일 선택
- 대표 이모티콘 1장 생성
- 대표 PNG 다운로드
- 기본 문구 8종 세트 순차 생성
- 8종 생성 진행률 표시
- 8종 결과 그리드 표시
- 개별 PNG 다운로드
- JSZip 기반 원본 8종 ZIP 다운로드
- 플랫폼별 규격 선택
- Canvas 기반 플랫폼별 리사이즈
- 플랫폼별 8종 ZIP 다운로드
- 밝은/흰색 배경 투명 처리 1차 기능

## 지원 플랫폼 프리셋

| 플랫폼 | 규격 | 내보내기 |
|---|---:|---|
| 카카오톡 | 360×360 | PNG ZIP |
| 텔레그램 | 512×512 | PNG ZIP |
| 왓츠앱 | 512×512 | PNG ZIP |
| 디스코드 | 320×320 | PNG ZIP |
| LINE | 370×320 | PNG ZIP |
| 인스타그램 | 512×512 | PNG ZIP |

## 아직 남은 기능

- 정밀 인물/사물 배경 제거 API 연동
- 움직이는 GIF/APNG 스티커
- 카카오/LINE 제출용 메타데이터 자동 생성
- 플랫폼별 용량 최적화
- Chrome Extension 우클릭 연동
- 스타일 미리보기 자동 생성

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

1. GitHub에 전체 폴더를 push합니다.
2. Vercel에서 해당 저장소를 Import합니다.
3. Framework Preset은 Next.js로 둡니다.
4. 별도 환경변수는 필요 없습니다.

## 무료 운영 방식

이 프로젝트는 BYOK, 즉 **Bring Your Own Key** 방식입니다.

```text
사용자
→ 자신의 Gemini API Key 입력
→ 이미지 업로드
→ 스타일 선택
→ Gemini API 호출
→ PNG/ZIP 다운로드
```

운영자가 공용 API Key를 서버에 넣지 않아도 되므로, 사용자가 늘어도 AI 사용료가 운영자에게 집중되지 않습니다.

## 기본 문구 8종

```text
좋아!
고마워
ㅋㅋㅋ
화이팅
미안
대박
잘자
인정
```

## 사용 흐름

```text
Gemini API Key 입력
→ 이미지 업로드
→ 스타일 선택
→ 대표 1장 또는 8종 세트 생성
→ 플랫폼 선택
→ 플랫폼 규격 ZIP 다운로드
```
