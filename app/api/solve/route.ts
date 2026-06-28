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
이미지에 있는 문제를 보고 아래 형식 그대로 한국어로 답변하세요.

규칙:
- 마크다운 기호(**, ##, *, -, \`, > 등)는 절대 사용하지 마세요
- 수식은 텍스트로 표현하세요 (예: x^2, sqrt(n), sigma^2, mu, P(0<=Z<=z))
- 각 섹션 헤더는 반드시 이모지로 시작하세요
- 풀이 단계는 반드시 "1단계. 제목" 형식을 사용하세요

📌 문제
(이미지의 문제 텍스트를 정확하게 옮겨 적으세요. 수식, 조건, 보기 포함)

✏️ 풀이 과정
1단계. [단계 제목]
[이 단계의 계산 및 설명을 여러 줄로 작성]

2단계. [단계 제목]
[이 단계의 계산 및 설명]

3단계. [단계 제목]
[이 단계의 계산 및 설명]

(단계는 문제에 맞게 필요한 만큼 추가)

✅ 정답
[최종 정답을 명확하게 한 줄로]

💡 핵심 공식
[이 문제에서 사용된 주요 공식을 한 줄씩]
[개념 설명도 포함]`;

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
