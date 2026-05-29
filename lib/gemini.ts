export type GenerateRequest = {
  apiKey: string;
  imageDataUrl: string;
  stylePrompt: string;
  phrase?: string;
};

type GeminiPart = {
  text?: string;
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
  inline_data?: {
    mime_type?: string;
    data?: string;
  };
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
  }>;
};

export async function callGeminiImage({ apiKey, imageDataUrl, stylePrompt, phrase }: GenerateRequest) {
  const [meta, base64] = imageDataUrl.split(',');
  const mimeType = meta.match(/data:(.*);base64/)?.[1] || 'image/png';
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

  const prompt = [
    'Turn the uploaded image into a reusable SNS sticker/emoticon.',
    'Keep the main identity and key visual traits of the subject.',
    stylePrompt,
    phrase ? `Add short Korean sticker text: ${phrase}` : 'No text unless visually necessary.',
    'Transparent background if possible, centered subject, clean sticker outline, square composition.'
  ].join('\n');

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }
      ],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Gemini image generation failed');
  }

  const json = (await response.json()) as GeminiResponse;
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((part) => part.inlineData || part.inline_data);
  const inline = imagePart?.inlineData || imagePart?.inline_data;
  const data = inline?.data;
  const outputMimeType = inline && 'mimeType' in inline ? inline.mimeType : inline?.mime_type;

  if (!data) {
    throw new Error('No image returned from Gemini. Try a different model or prompt.');
  }

  return `data:${outputMimeType || 'image/png'};base64,${data}`;
}
