import { NextRequest, NextResponse } from 'next/server';
import { callGeminiImage } from '@/lib/gemini';

type GenerateBody = {
  apiKey?: string;
  imageDataUrl?: string;
  stylePrompt?: string;
  phrase?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;
    const { apiKey, imageDataUrl, stylePrompt, phrase } = body;

    if (!apiKey || !imageDataUrl || !stylePrompt) {
      return NextResponse.json(
        { error: 'apiKey, imageDataUrl, stylePrompt are required.' },
        { status: 400 }
      );
    }

    const image = await callGeminiImage({ apiKey, imageDataUrl, stylePrompt, phrase });
    return NextResponse.json({ image });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
