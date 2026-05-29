# SNS Emoticon Maker Planning

## Product Direction

SNS Emoticon Maker is a lightweight BYOK web app. Users upload an image, choose a market-informed visual style, choose a short phrase, and generate SNS sticker assets using their own Gemini API key.

## Design Principles

- Keep the service free to operate by avoiding an operator-owned API key.
- Never store user API keys in a database.
- Make style selection visual and compact.
- Use real market references for style direction, but do not copy paid sticker assets.
- Keep export tooling browser-side where practical.
- Treat platform exports as preparation helpers, not guaranteed official submission packages.

## Style Library Decision

The previous sample set was too abstract and did not resemble styles users commonly see in KakaoTalk. The current library is based on observed categories from Kakao Emoticon Shop and LINE Creators Market:

- Mini character
- Soft animal
- Small gray cat
- Hamster reaction
- Yellow dog
- Polite message
- Work life
- Couple heart
- Meme reaction
- Big text
- Hand-drawn talk
- Idol fan

The samples are original reference thumbnails. They should communicate direction, not duplicate actual commercial sticker packs.

## Reference Sources

- Kakao Emoticon Shop search and popular style categories: https://e.kakao.com/search
- Kakao popular items: https://e.kakao.com/item/hot
- Kakao big emoticon category: https://e.kakao.com/style/group/12?sort=HOT&t_obj=search_style
- LINE Creators Market: https://creator.line.me/

## Future Scope

- Replace SVG references with higher-quality original raster samples.
- Add a source-backed style review workflow before adding new presets.
- Add more accurate background removal.
- Add optional 24 or 32 image sticker sets.
- Add GIF/APNG generation.
- Complete the Chrome extension flow.
