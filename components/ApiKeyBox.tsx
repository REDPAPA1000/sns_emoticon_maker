'use client';

import { useCallback, useEffect, useState } from 'react';

export type ApiKeyStatus = 'idle' | 'checking' | 'valid' | 'invalid';

type ApiKeyBoxProps = {
  onChange: (key: string) => void;
  onStatusChange: (status: ApiKeyStatus) => void;
};

const STATUS_MESSAGE: Record<ApiKeyStatus, string> = {
  idle: 'API Key를 입력하면 자동으로 검증합니다.',
  checking: 'API Key를 검증하는 중입니다.',
  valid: '사용 가능한 API Key입니다.',
  invalid: 'API Key를 확인하지 못했습니다.'
};

export default function ApiKeyBox({ onChange, onStatusChange }: ApiKeyBoxProps) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<ApiKeyStatus>('idle');
  const [message, setMessage] = useState(STATUS_MESSAGE.idle);
  const [guideOpen, setGuideOpen] = useState(false);

  const updateStatus = useCallback((nextStatus: ApiKeyStatus, nextMessage = STATUS_MESSAGE[nextStatus]) => {
    setStatus(nextStatus);
    setMessage(nextMessage);
    onStatusChange(nextStatus);
  }, [onStatusChange]);

  const save = useCallback((value: string) => {
    setKey(value);
    onChange(value);
    if (value) localStorage.setItem('gemini_api_key', value);
    else localStorage.removeItem('gemini_api_key');
  }, [onChange]);

  const validateKey = useCallback(async (value = key) => {
    const trimmed = value.trim();

    if (!trimmed) {
      updateStatus('idle');
      return;
    }

    updateStatus('checking');

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: trimmed })
      });
      const json = await response.json();

      if (response.ok && json.valid) {
        updateStatus('valid', json.message || STATUS_MESSAGE.valid);
        return;
      }

      updateStatus('invalid', json.error || STATUS_MESSAGE.invalid);
    } catch {
      updateStatus('invalid', '네트워크 문제로 API Key를 확인하지 못했습니다.');
    }
  }, [key, updateStatus]);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setKey(saved);
    onChange(saved);
  }, [onChange]);

  useEffect(() => {
    const trimmed = key.trim();

    if (!trimmed) {
      updateStatus('idle');
      return;
    }

    const timer = window.setTimeout(() => {
      void validateKey(trimmed);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [key, updateStatus, validateKey]);

  return (
    <section className="panel key-panel">
      <div className="panel-header">
        <div>
          <span className="step-label">STEP 1</span>
          <h2>Gemini API Key 설정</h2>
        </div>
        <button className="ghost-button" type="button" onClick={() => setGuideOpen(true)}>
          API Key 발급 방법
        </button>
      </div>

      <label className="input-label" htmlFor="gemini-api-key">API Key</label>
      <div className="key-input-row">
        <input
          id="gemini-api-key"
          className="input"
          value={key}
          onChange={(event) => save(event.target.value)}
          placeholder="AIza..."
          type="password"
        />
        <button className="ghost-button compact" type="button" onClick={() => void validateKey()} disabled={!key || status === 'checking'}>
          검증
        </button>
        <span className={`status-light ${status}`} title={message} aria-label={`API Key 상태: ${message}`} />
      </div>
      <p className={`status-message ${status}`}>{message}</p>

      {guideOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setGuideOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="api-key-guide-title" onClick={(event) => event.stopPropagation()}>
            <div className="panel-header">
              <div>
                <span className="step-label">GUIDE</span>
                <h2 id="api-key-guide-title">Gemini API Key 발급 방법</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setGuideOpen(false)} aria-label="닫기">x</button>
            </div>
            <ol className="guide-list">
              <li>Google AI Studio에 접속합니다.</li>
              <li>Google 계정으로 로그인합니다.</li>
              <li><b>Get API key</b> 또는 <b>API 키 만들기</b>를 선택합니다.</li>
              <li>새 키를 복사해 이 입력칸에 붙여넣습니다.</li>
            </ol>
            <a className="btn" href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              Google AI Studio 열기
            </a>
            <p className="small guide-note">
              키는 이 브라우저의 localStorage에 저장됩니다. 생성 요청 중 서버 API로 전달되지만 DB에는 저장하지 않습니다.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
