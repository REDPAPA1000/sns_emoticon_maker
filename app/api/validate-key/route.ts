import { NextRequest, NextResponse } from 'next/server';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';

    if (!apiKey) {
      return NextResponse.json({ status: 'invalid', valid: false, error: 'API Key를 입력해 주세요.' }, { status: 400 });
    }

    if (apiKey.length < 20) {
      return NextResponse.json({ status: 'invalid', valid: false, error: 'API Key가 너무 짧습니다. 복사한 키 전체를 붙여넣어 주세요.' }, { status: 400 });
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        return NextResponse.json({ status: 'valid', valid: true, message: 'API Key가 정상적으로 확인되었습니다.' });
      }

      const text = await response.text();
      return NextResponse.json({
        status: 'unknown',
        valid: true,
        warning: '키 길이는 충분합니다. 다만 Google의 모델 목록 조회가 실패했습니다. API 제한, 지역, 권한 설정, 키 종류 차이 때문일 수 있으니 실제 생성으로 확인해 주세요.',
        detail: text
      });
    } catch (error: unknown) {
      return NextResponse.json({
        status: 'unknown',
        valid: true,
        warning: '키 길이는 충분합니다. 네트워크 또는 Google 응답 문제로 실시간 검증을 완료하지 못했습니다. 실제 생성으로 확인해 주세요.',
        detail: getErrorMessage(error)
      });
    }
  } catch (error: unknown) {
    return NextResponse.json({ status: 'invalid', valid: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
