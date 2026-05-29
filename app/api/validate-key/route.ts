import { NextRequest, NextResponse } from 'next/server';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'Gemini API Key를 입력해 주세요.' }, { status: 400 });
    }

    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({ valid: false, error: 'Gemini API Key는 보통 AIza로 시작합니다.' }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ valid: false, error: text || 'API Key 검증에 실패했습니다.' }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error: unknown) {
    return NextResponse.json({ valid: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
