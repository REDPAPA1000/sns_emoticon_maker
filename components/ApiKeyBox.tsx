'use client';

import { useEffect, useState } from 'react';

const AI_STUDIO_KEY_URL = 'https://aistudio.google.com/app/apikey';

type ApiKeyBoxProps = {
  onChange: (key: string) => void;
};

type KeyStatus = 'idle' | 'checking' | 'valid' | 'invalid';

export default function ApiKeyBox({ onChange }: ApiKeyBoxProps) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<KeyStatus>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setKey(saved);
    onChange(saved);
    if (saved.trim().length >= 20) {
      setStatus('valid');
      setMessage('저장된 API Key가 있습니다. 실제 생성 단계에서 최종 확인됩니다.');
    }
  }, [onChange]);

  useEffect(() => {
    const trimmed = key.trim();

    if (!trimmed) {
      setStatus('idle');
      setMessage('');
      return;
    }

    if (trimmed.length < 20) {
      setStatus('invalid');
      setMessage('API Key가 너무 짧습니다. 복사한 키 전체를 붙여넣어 주세요.');
      return;
    }

    setStatus('checking');
    setMessage('API Key를 확인하는 중입니다.');

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/validate-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: trimmed })
        });
        const json = await response.json();

        if (!response.ok || json.status === 'invalid') {
          setStatus('invalid');
          setMessage(json.error || 'API Key를 확인해 주세요.');
          return;
        }

        setStatus('valid');
        setMessage(json.message || json.warning || 'API Key가 입력되었습니다. 실제 생성 단계에서 최종 확인됩니다.');
      } catch {
        setStatus('valid');
        setMessage('API Key가 입력되었습니다. 네트워크 검사는 건너뛰고 실제 생성 단계에서 최종 확인됩니다.');
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [key]);

  function save(value: string) {
    setKey(value);
    onChange(value);

    if (value) {
      localStorage.setItem('gemini_api_key', value);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }

  const statusLabel = status === 'idle'
    ? 'API Key 미입력'
    : status === 'checking'
      ? '검사 중'
      : status === 'valid'
        ? '입력됨'
        : '확인 필요';

  const messageClass = status === 'invalid' ? 'error-text' : status === 'valid' ? 'success-text' : 'small';

  return (
    <div className="card">
      <h3>1. Gemini API Key</h3>
      <p className="small">
        무료 배포를 위해 사용자의 개인 키를 브라우저 localStorage에만 저장합니다. 서버 DB에는 저장하지 않습니다.
      </p>

      <div className="key-input-row">
        <input
          className="input key-input"
          value={key}
          onChange={(event) => save(event.target.value)}
          placeholder="Google AI Studio에서 발급한 API Key 붙여넣기"
          type="password"
          autoComplete="off"
        />
        <span className={`key-status-dot ${status}`} aria-label={statusLabel} title={statusLabel} />
      </div>

      <div className="button-row">
        <a className="btn" href={AI_STUDIO_KEY_URL} target="_blank" rel="noreferrer">
          Gemini API Key 발급
        </a>
      </div>

      {message && <p className={`small ${messageClass}`}>{message}</p>}

      <details className="helper-box">
        <summary>Gemini API Key가 뭔가요?</summary>
        <ol className="small">
          <li>Google AI Studio에 접속합니다.</li>
          <li>Google 계정으로 로그인합니다.</li>
          <li>Create API key를 눌러 키를 발급합니다.</li>
          <li>발급된 API Key를 이 칸에 붙여넣습니다.</li>
        </ol>
        <p className="small">API Key는 비밀번호처럼 다뤄야 합니다. 다른 사람에게 공유하지 마세요.</p>
      </details>
    </div>
  );
}
