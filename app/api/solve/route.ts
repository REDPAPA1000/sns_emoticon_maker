import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

const CLAUDE_BIN = process.env.CLAUDE_CLI_PATH || '/opt/node22/bin/claude';

const PROMPT = `당신은 수학, 과학, 국어, 영어 전문 선생님입니다.
이미지에 있는 문제를 보고 아래 형식 그대로 한국어로 답변하세요.

규칙:
- 마크다운 기호(**, ##, *, -, \`, > 등)는 절대 사용하지 마세요
- 수식은 텍스트로 표현하세요 (예: x^2, sqrt(n), sigma^2, mu)
- 각 섹션 헤더는 반드시 이모지로 시작하세요
- 풀이 단계는 반드시 "1단계. 제목" 형식을 사용하세요

📌 문제
(이미지의 문제 텍스트를 정확하게 옮겨 적으세요. 수식과 조건 포함)

✏️ 풀이 과정
1단계. [단계 제목]
[계산 및 설명을 여러 줄로]

2단계. [단계 제목]
[계산 및 설명]

(필요한 만큼 단계 추가)

✅ 정답
[최종 정답을 명확하게]

💡 핵심 공식
[공식 1]
[공식 2]`;

function callClaude(imageBase64: string, mimeType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const message = JSON.stringify({
      type: 'user',
      message: {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mimeType, data: imageBase64 },
          },
          { type: 'text', text: PROMPT },
        ],
      },
    });

    const child = spawn(CLAUDE_BIN, [
      '-p',
      '--input-format', 'stream-json',
      '--output-format', 'stream-json',
      '--verbose',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Claude CLI 오류 (code ${code}): ${stderr.slice(0, 300)}`));
        return;
      }

      let solution = '';
      for (const line of stdout.split('\n')) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === 'result') {
            solution = event.result || '';
            break;
          }
          if (event.type === 'rate_limit_event') {
            const info = event.rate_limit_info;
            if (info?.status === 'hard_limited') {
              reject(new Error('Claude 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요.'));
              return;
            }
          }
        } catch {
          // skip non-JSON lines
        }
      }

      if (!solution) {
        reject(new Error('Claude 응답을 파싱할 수 없습니다.'));
        return;
      }

      resolve(solution);
    });

    child.on('error', (err) => {
      reject(new Error(`Claude CLI를 찾을 수 없습니다: ${err.message}`));
    });

    child.stdin.write(message);
    child.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { imageDataUrl?: string };
    const { imageDataUrl } = body;

    if (!imageDataUrl) {
      return NextResponse.json({ error: 'imageDataUrl이 필요합니다.' }, { status: 400 });
    }

    const [meta, base64] = imageDataUrl.split(',');
    const mimeType = meta.match(/data:(.*);base64/)?.[1] || 'image/jpeg';

    const solution = await callClaude(base64, mimeType);
    return NextResponse.json({ solution });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
