'use client';
import { useEffect, useState } from 'react';

export default function ApiKeyBox({ onChange }: { onChange: (key:string)=>void }) {
  const [key, setKey] = useState('');
  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key') || '';
    setKey(saved); onChange(saved);
  }, [onChange]);
  function save(v:string) {
    setKey(v); onChange(v);
    if (v) localStorage.setItem('gemini_api_key', v);
    else localStorage.removeItem('gemini_api_key');
  }
  return <div className="card">
    <h3>1. Gemini API Key</h3>
    <p className="small">무료 배포를 위해 사용자의 개인 키를 브라우저 localStorage에만 저장합니다. 서버 DB에는 저장하지 않습니다.</p>
    <input className="input" value={key} onChange={e=>save(e.target.value)} placeholder="AIza..." type="password" />
  </div>;
}
