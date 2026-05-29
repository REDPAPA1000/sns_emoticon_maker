import { NextRequest, NextResponse } from 'next/server';
import { callGeminiImage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, imageDataUrl, stylePrompt, phrase } = body;
    if (!apiKey || !imageDataUrl || !stylePrompt) {
      return NextResponse.json({ error: 'apiKey, imageDataUrl, stylePrompt are required.' }, { status: 400 });
    }
    const image = await callGeminiImage({ apiKey, imageDataUrl, stylePrompt, phrase });
    return NextResponse.json({ image });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
