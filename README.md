# SNS Emoticon Maker

무료 배포를 목표로 하는 BYOK(Bring Your Own Key) 방식의 SNS 이모티콘/스티커 제작 웹앱입니다.

## 핵심 정책

- 운영자는 AI 사용료를 부담하지 않습니다.
- 사용자는 자신의 Gemini API Key를 입력합니다.
- API Key는 브라우저 localStorage에만 저장하고 DB에 저장하지 않습니다.
- 서버 API는 사용자의 키를 받아 Gemini API에 전달만 합니다.

## 지원 목표 플랫폼

- KakaoTalk
- Telegram
- WhatsApp
- Discord
- LINE
- Instagram

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Initial SNS emoticon maker"
git branch -M main
git remote add origin https://github.com/YOUR_ID/sns_emoticon_maker.git
git push -u origin main
```

## Vercel 배포

1. GitHub에 이 폴더를 업로드합니다.
2. Vercel에서 New Project를 선택합니다.
3. `sns_emoticon_maker` 저장소를 연결합니다.
4. Framework는 Next.js로 자동 인식됩니다.
5. Deploy를 누릅니다.

## 다음 개발 단계

- 배경 제거 기능 추가
- 캔버스 기반 360/512/320 리사이즈
- 8종 대표 문구 일괄 생성
- ZIP 다운로드
- 플랫폼별 자동 규격 검사
- Chrome Extension 연동
