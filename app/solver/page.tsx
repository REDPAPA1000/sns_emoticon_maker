/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';

type Section = {
  title: string;
  lines: string[];
};

const SECTION_PREFIXES = ['📌', '✏️', '✅', '💡'];

type SectionStyle = {
  pillBg: string;
  pillBorder: string;
  pillText: string;
  bodyColor: string;
  isAnswer?: boolean;
};

const SECTION_STYLES: Record<string, SectionStyle> = {
  '📌': { pillBg: '#dbeafe', pillBorder: '#93c5fd', pillText: '#1d4ed8', bodyColor: '#1e3a8a' },
  '✏️': { pillBg: '#fefce8', pillBorder: '#fcd34d', pillText: '#92400e', bodyColor: '#78350f' },
  '✅': { pillBg: '#fef9c3', pillBorder: '#fbbf24', pillText: '#92400e', bodyColor: '#7c2d12', isAnswer: true },
  '💡': { pillBg: '#d1fae5', pillBorder: '#6ee7b7', pillText: '#065f46', bodyColor: '#064e3b' },
};

const STEP_COLORS = ['#ef4444', '#22c55e', '#8b5cf6', '#f97316', '#06b6d4', '#ec4899'];

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

function getPrefix(title: string): string {
  return SECTION_PREFIXES.find((p) => title.startsWith(p)) ?? '';
}

function NoteSection({ sec }: { sec: Section }) {
  const prefix = getPrefix(sec.title);
  const style = SECTION_STYLES[prefix];

  if (!style) {
    return (
      <div className="nb-section">
        {sec.title && <div className="nb-line" style={{ color: '#334155' }}>{sec.title}</div>}
        {sec.lines.map((line, j) => (
          <div key={j} className="nb-line">{line}</div>
        ))}
      </div>
    );
  }

  if (style.isAnswer) {
    return (
      <div className="nb-section">
        <div
          className="nb-answer-box"
          style={{ background: style.pillBg, border: `2px solid ${style.pillBorder}` }}
        >
          <div className="nb-answer-label" style={{ color: style.pillText }}>{sec.title}</div>
          {sec.lines.map((line, j) => (
            <div key={j} className="nb-answer-line" style={{ color: style.bodyColor }}>{line}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="nb-section">
      <div
        className="nb-pill"
        style={{
          background: style.pillBg,
          border: `1.5px solid ${style.pillBorder}`,
          color: style.pillText,
        }}
      >
        {sec.title}
      </div>
      {sec.lines.map((line, j) => {
        const stepMatch = line.match(/^(\d+)단계[.·\s](.*)/);
        if (stepMatch) {
          const num = parseInt(stepMatch[1]);
          const badgeColor = STEP_COLORS[(num - 1) % STEP_COLORS.length];
          return (
            <div key={j} className="nb-step-row">
              <span className="nb-step-badge" style={{ background: badgeColor }}>{num}</span>
              <span className="nb-step-text" style={{ color: badgeColor }}>
                {stepMatch[2]}
              </span>
            </div>
          );
        }
        return (
          <div key={j} className="nb-line" style={{ color: style.bodyColor }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

export default function SolverPage() {
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
        body: JSON.stringify({ imageDataUrl: image })
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
  const canSolve = Boolean(image && !loading);

  return (
    <main className="app-shell">
      <div className="workspace">
        <header className="topbar no-print">
          <div className="brand inline-brand">
            <span className="brand-dot solver-dot" />
            <span>AI 풀이 노트</span>
          </div>
          <span className="small" style={{ color: '#94a3b8' }}>REDPAPA</span>
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
            <div className="claude-badge">
              <span className="claude-dot" />
              <div>
                <span className="claude-badge-title">Claude Code 연동됨</span>
                <span className="claude-badge-sub">API Key 없이 유료 구독으로 무료 사용</span>
              </div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <span className="step-label">STEP 1</span>
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
            <div className="notebook-toolbar no-print">
              <span className="notebook-label">풀이 노트</span>
              {solution && (
                <button className="btn secondary print-btn" onClick={handlePrint}>
                  📄 PDF 저장
                </button>
              )}
            </div>

            <div id="print-area">
              <div className="notebook-paper">
                {/* 노트 상단: 손글씨처럼 자연스러운 타이틀 */}
                <div className="nb-page-header">
                  <span className="nb-page-title-text">AI 풀이 노트</span>
                  <span className="nb-page-brand">REDPAPA</span>
                </div>
                <div className="nb-page-rule" />

                <div className="notebook-content">
                  {solution ? (
                    sections.map((sec, i) => (
                      <NoteSection key={i} sec={sec} />
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

                {solution && (
                  <div className="nb-page-footer">AI 풀이 노트 · REDPAPA</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
