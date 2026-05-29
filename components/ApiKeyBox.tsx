'use client';

import { useEffect, useState } from 'react';

const AI_STUDIO_KEY_URL = 'https://aistudio.google.com/app/apikey';

type ApiKeyBoxProps = {
  onChange: (key: string) => void;
};

export default function ApiKeyBox({ onChange }: ApiKeyBoxProps) {
  const [key, setKey] = useState('');
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setKey(saved);
    onChange(saved);
  }, [onChange]);

  function save(value: string) {
    setKey(value);
    onChange(value);
    setStatus('idle');
    setMessage('');

    if (value) {
      localStorage.setItem('gemini_api_key', value);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }

  async function validateKey() {
    const trimmed = key.trim();
    setMessage('');

    if (!trimmed) {
      setStatus('invalid');
      setMessage('Gemini API Key를 먼저 입력해 주세요.');
      return;
    }

    if (!trimmed.startsWith('AIza')) {
      setStatus('invalid');
      setMessage('Gemini API Key는 보통 AIza로 시작합니다. 복사한 키를 다시 확인해 주세요.');
      return;
    }

    setChecking(true);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmed })
      });
      const json = await response.json();

      if (!response.ok || !json.valid) {
        throw new Error(json.error || 'API Key가 유효하지 않습니다.');
      }

      setStatus('valid');
      setMessage('API Key가 정상적으로 확인되었습니다.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'API Key 검증 중 오류가 발생했습니다.';
      setStatus('invalid');
      setMessage(errorMessage);
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="card">
      <h3>1. Gemini API Key</h3>
      <p className="small">
        무료 배포를 위해 사용자의 개인 키를 브라우저 localStorage에만 저장합니다. 서버 DB에는 저장하지 않습니다.
      </p>

      <input
        className="input"
        value={key}
        onChange={(event) => save(event.target.value)}
        placeholder="AIza..."
        type="password"
        autoComplete="off"
      />

      <div className="button-row">
        <button className="btn secondary" type="button" disabled={checking} onClick={validateKey}>
          {checking ? '검사 중...' : 'API Key 유효성 검사'}
        </button>
        <a className="btn" href={AI_STUDIO_KEY_URL} target="_blank" rel="noreferrer">
          Gemini API Key 발급
        </a>
      </div>

      {message && (
        <p className={`small ${status === 'invalid' ? 'error-text' : 'success-text'}`}>{message}</p>
      )}

      <details className="helper-box">
        <summary>Gemini API Key가 뭔가요?</summary>
        <ol className="small">
          <li>Google AI Studio에 접속합니다.</li>
          <li>Google 계정으로 로그인합니다.</li>
          <li>Create API key를 눌러 키를 발급합니다.</li>
          <li>발급된 AIza... 형태의 키를 이 칸에 붙여넣습니다.</li>
        </ol>
        <p className="small">API Key는 비밀번호처럼 다뤄야 합니다. 다른 사람에게 공유하지 마세요.</p>
      </details>
    </div>
  );
}
