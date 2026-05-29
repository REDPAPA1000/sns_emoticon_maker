# SNS Emoticon Maker

SNS Emoticon Maker is a BYOK tool for creating SNS stickers from uploaded images with a user's own Gemini API key.

## Current Version

`v0.3.1`

## Implemented

- Gemini BYOK flow
- Image upload
- 18 curated style presets with fixed visual samples
- Single sticker generation
- 8 phrase set generation
- Individual PNG download
- Original 8 image ZIP download
- Platform-sized ZIP export
- Basic bright-background transparency cleanup
- KakaoTalk, Telegram, WhatsApp, Discord, LINE, and Instagram export presets

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js. If port `3000` is unavailable, use another port:

```bash
npm run dev -- --port 3001
```

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## BYOK Policy

The user's Gemini API key is saved only in browser `localStorage`. It is sent to the app's server API only while processing a generation request and is not stored in a database.

## Style Samples

The style library uses fixed sample images from `public/samples/styles`. These images are references for expected visual direction, not generated output for the user's uploaded image.

## Remaining Work

- Higher-quality background removal API integration
- Better Gemini failure retry guidance
- Optional larger sticker sets
- GIF/APNG export
- Chrome extension finalization
- Platform submission rule checks and metadata generation
