# SNS Emoticon Maker Planning

## Product Direction

SNS Emoticon Maker is a lightweight BYOK web app. Users upload an image, choose a visual style, choose a short phrase, and generate SNS sticker assets using their own Gemini API key.

## Design Principles

- Keep the service free to operate by avoiding an operator-owned API key.
- Never store user API keys in a database.
- Make style selection visual, not text-only.
- Keep export tooling browser-side where practical.
- Treat platform exports as preparation helpers, not guaranteed official submission packages.

## MVP Scope

- Gemini API key input
- Image upload
- Curated style library with fixed reference samples
- Single sticker generation
- 8 phrase set generation
- PNG and ZIP downloads
- Platform size presets
- Basic background cleanup

## Style Library Decision

The previous 20 style list included overlapping or confusing options. The current library uses 18 styles:

- Chibi
- K-Messenger
- Mascot
- Webtoon
- 3D Toy
- Meme Reaction
- Pet Kawaii
- Flat Emoji
- K-Pop Fandom
- Doodle
- Crayon
- Stickman
- Pixel Art
- Paper Cutout
- Clay
- Watercolor
- AI Glitch
- Graffiti

`japanese-kawaii` was removed because it overlapped with Chibi and K-Messenger. `ugly-cute` was removed because it can be mistaken for low-quality output rather than an intentional style.

## Future Scope

- More accurate background removal
- Generated style sample refresh workflow
- 24 or 32 image sticker sets
- GIF/APNG generation
- Chrome extension flow from image context menus
- Platform submission metadata helpers
