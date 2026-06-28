import { NextRequest, NextResponse } from 'next/server';

type SolveBody = {
  apiKey?: string;
  imageDataUrl?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SolveBody;
    const { apiKey, imageDataUrl } = body;

    if (!apiKey || !imageDataUrl) {
      return NextResponse.json({ error: 'apiKey, imageDataUrl are required.' }, { status: 400 });
    }

    const [meta, base64] = imageDataUrl.split(',');
    const mimeType = meta.match(/data:(.*);base64/)?.[1] || 'image/jpeg';

    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const prompt = `당신은 수학, 과학, 국어, 영어 전문 선생님입니다.
이미지에 있는 문제를 분석하고 단계별 풀이를 작성해주세요.

반드시 아래 형식 그대로 한국어로 답변하세요. 마크다운 기호(**, ##, *, - 등)는 절대 사용하지 마세요.

📌 문제 파악
(문제 유형과 핵심을 2~3줄로 설명)

✏️ 풀이 과정
1단계. ...
2단계. ...
3단계. ...
(필요한 만큼 단계를 추가하세요. 수식은 텍스트로 표현: 예) x^2 + 2x + 1 = 0)

✅ 최종 정답
(정답을 명확히 작성)

💡 핵심 공식 / 개념
(이 문제에서 사용된 주요 공식이나 개념을 한 줄씩 정리)`;

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
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Gemini API 호출 실패');
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;

    if (!text) {
      throw new Error('Gemini 응답에 텍스트가 없습니다.');
    }

    return NextResponse.json({ solution: text });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
