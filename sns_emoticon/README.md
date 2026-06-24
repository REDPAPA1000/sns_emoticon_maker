# SNS Emoticon Maker

사용자가 직접 발급한 Gemini API Key로 이미지를 SNS 이모티콘/스티커 스타일로 변환하는 BYOK 방식의 웹앱입니다.

## 현재 버전

`v0.3.1`

## 구현된 기능

- Gemini API Key 직접 입력 방식
- 이미지 업로드
- 실제 이모티콘 마켓 흐름을 참고한 12개 스타일 샘플
- 선택한 스타일로 단일 이모티콘 생성
- 기본 문구 8종 세트 생성
- 개별 PNG 다운로드
- 원본 8종 ZIP 다운로드
- 플랫폼 규격별 ZIP 내보내기
- 밝은 배경 1차 투명 처리
- KakaoTalk, Telegram, WhatsApp, Discord, LINE, Instagram 규격 프리셋

## 실행 방법

```bash
npm install
npm run dev
```

Next.js가 출력하는 로컬 주소로 접속합니다. `3000` 포트를 사용할 수 없으면 다른 포트를 지정할 수 있습니다.

```bash
npm run dev -- --port 3001
```

## 검증 명령

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## BYOK 운영 방식

이 프로젝트는 운영자가 공용 API Key를 서버에 넣어두는 방식이 아닙니다. 사용자가 본인의 Gemini API Key를 직접 입력합니다.

- API Key는 브라우저 `localStorage`에 저장됩니다.
- 이미지 생성 요청을 처리하는 동안에는 서버 API로 전달됩니다.
- DB에는 저장하지 않습니다.

## 스타일 샘플

스타일 샘플은 `public/samples/styles`에 있는 고정 참고 이미지입니다. 실제 카카오 이모티콘샵과 LINE Creators Market의 인기 흐름을 참고했지만, 판매 중인 이모티콘 이미지를 복사하지는 않습니다.

현재 스타일:

- 미니 캐릭터
- 말랑 동물
- 회색 고양이
- 햄스터 리액션
- 누렁이 감성
- 공손 메시지
- 사회생활
- 커플 하트
- 짤 반응
- 큰글씨 톡
- 낙서톡
- 팬덤 응원

## 남은 작업

- 더 정교한 배경 제거
- Gemini 생성 실패 시 재시도/안내 강화
- 24종 또는 32종 세트 옵션
- GIF/APNG 생성
- Chrome Extension 완성
- 플랫폼 제출 규격 검사와 메타데이터 생성
