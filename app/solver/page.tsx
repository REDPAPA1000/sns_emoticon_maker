/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type Section = {
  title: string;
  lines: string[];
};

const SECTION_PREFIXES = ['📌', '✏️', '✅', '💡'];

function parseSolution(text: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    const isHeader = SECTION_PREFIXES.some((p) => line.startsWith(p));
    if (isHeader) {
      if (current) sections.push(current);
      current = { title: line, lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else {
      current = { title: '', lines: [line] };
    }
  }

  if (current) sections.push(current);
  return sections;
}

export default function SolverPage() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setSolution('');
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setImage('');
    setSolution('');
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const solve = async () => {
    setLoading(true);
    setError('');
    setSolution('');
    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, imageDataUrl: image })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '풀이 실패');
      setSolution(json.solution);
    } catch (e) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const sections = solution ? parseSolution(solution) : [];
  const canSolve = Boolean(apiKey && image && !loading);

  return (
    <main className="app-shell">
      {/* 인쇄 전용 헤더 — 화면에서는 숨김 */}
      <div className="print-header" aria-hidden>
        <span className="print-header-brand">AI 풀이 노트</span>
        <span className="print-header-sub">REDPAPA · 수학 풀이 노트</span>
      </div>

      <div className="workspace">
        <header className="topbar no-print">
          <div className="brand inline-brand">
            <span className="brand-dot solver-dot" />
            <span>AI 풀이 노트</span>
          </div>
          <Link href="/" className="btn secondary solver-back-btn">
            ← 이모티콘 메이커
          </Link>
        </header>

        <section className="page-title no-print">
          <span className="page-kicker">REDPAPA WEB APP</span>
          <h1>AI 손글씨 풀이 노트</h1>
          <p className="small" style={{ marginTop: 6 }}>
            문제 사진을 올리면 AI가 단계별 풀이를 손글씨 노트로 정리합니다
          </p>
        </section>

        <div className="solver-layout">
          {/* 왼쪽: 입력 패널 */}
          <div className="solver-left no-print">
            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="step-label">STEP 1</span>
                  <h2>Gemini API Key</h2>
                </div>
              </div>
              <label>
                <span className="input-label">API Key</span>
                <input
                  className="input"
                  type="password"
                  placeholder="AIza..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </label>
              <p className="small" style={{ marginTop: 8 }}>
                Google AI Studio(aistudio.google.com)에서 무료 발급
              </p>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="step-label">STEP 2</span>
                  <h2>문제 업로드</h2>
                </div>
                {image && (
                  <button className="ghost-button compact" onClick={reset}>
                    지우기
                  </button>
                )}
              </div>
              <div
                className="upload-drop"
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input ref={fileRef} type="file" accept="image/*" onChange={handleInput} />
                {image ? (
                  <img src={image} alt="업로드된 문제" />
                ) : (
                  <span>
                    <b>클릭 또는 드래그하여 업로드</b>
                    <small>교재 · 시험지 · 노트 사진 모두 가능</small>
                  </span>
                )}
              </div>
              <button
                className="btn full primary-action solver-btn"
                disabled={!canSolve}
                onClick={solve}
              >
                {loading ? '✏️ 풀이 중...' : '✏️ 풀이 시작'}
              </button>
              {error && <p className="small error-text">{error}</p>}
            </section>
          </div>

          {/* 오른쪽: 노트 */}
          <div className="solver-right">
            {/* 노트 툴바 */}
            <div className="notebook-toolbar no-print">
              <span className="notebook-label">풀이 노트</span>
              {solution && (
                <button className="btn secondary print-btn" onClick={handlePrint}>
                  📄 PDF 저장
                </button>
              )}
            </div>

            {/* 인쇄 영역 시작 */}
            <div id="print-area">
              {/* 문제 이미지 — 인쇄 시 노트 위에 표시 */}
              {image && solution && (
                <div className="print-problem-img">
                  <p className="print-img-label">[ 문 제 ]</p>
                  <img src={image} alt="문제" />
                </div>
              )}

              <div className="notebook-paper">
                <div className="notebook-content">
                  {solution ? (
                    sections.map((sec, i) => (
                      <div key={i} className="nb-section">
                        {sec.title && <div className="nb-title">{sec.title}</div>}
                        {sec.lines.map((line, j) => (
                          <div key={j} className="nb-line">{line}</div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="nb-placeholder">
                      {loading ? (
                        <>
                          <div className="nb-loading-dots">
                            <span /><span /><span />
                          </div>
                          <p>AI가 풀이를 작성하는 중입니다...</p>
                        </>
                      ) : (
                        <p>문제를 업로드하고 풀이 시작을 누르면<br />여기에 손글씨 노트로 나타납니다</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 인쇄 푸터 */}
              {solution && (
                <div className="print-footer" aria-hidden>
                  AI 풀이 노트 · REDPAPA
                </div>
              )}
            </div>
            {/* 인쇄 영역 끝 */}
          </div>
        </div>
      </div>
    </main>
  );
}
