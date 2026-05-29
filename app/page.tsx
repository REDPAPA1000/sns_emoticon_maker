/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useMemo, useState } from 'react';
import ApiKeyBox, { ApiKeyStatus } from '@/components/ApiKeyBox';
import ImageUploader from '@/components/ImageUploader';
import StyleGrid from '@/components/StyleGrid';
import { STYLES, StickerStyle } from '@/data/styles';
import { PLATFORMS } from '@/data/platforms';
import { prepareStickerForPlatform, removeLightBackground } from '@/lib/image-processing';
import { downloadStickerZip, safeFileName, StickerFile } from '@/lib/zip';

const PHRASES = ['좋아', '감사', '헉', '미안', '축하', '확인', '화이팅', '대박'];

type GeneratedSticker = {
  phrase: string;
  image: string;
};

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>('idle');
  const [image, setImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>(STYLES[0]);
  const [selectedPlatformId, setSelectedPlatformId] = useState(PLATFORMS[0].id);
  const [setResults, setSetResults] = useState<GeneratedSticker[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [removeLightBg, setRemoveLightBg] = useState(true);
  const [batchProgress, setBatchProgress] = useState('');
  const [error, setError] = useState('');

  const selectedPlatform = useMemo(
    () => PLATFORMS.find((platform) => platform.id === selectedPlatformId) ?? PLATFORMS[0],
    [selectedPlatformId]
  );

  const canGenerate = Boolean(apiKey && apiKeyStatus === 'valid' && image && selectedStyle && !batchLoading);
  const progressPercent = setResults.length === 0 ? 0 : Math.round((setResults.length / PHRASES.length) * 100);

  const requestSticker = useCallback(async (targetPhrase: string) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        imageDataUrl: image,
        stylePrompt: selectedStyle.prompt,
        phrase: targetPhrase
      })
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error || '이미지 생성에 실패했습니다.');
    }

    if (!json.image) {
      throw new Error('Gemini 응답에 이미지가 없습니다.');
    }

    const generatedImage = String(json.image);
    return removeLightBg ? removeLightBackground(generatedImage) : generatedImage;
  }, [apiKey, image, selectedStyle, removeLightBg]);

  const generateSet = useCallback(async () => {
    setError('');
    setBatchLoading(true);
    setSetResults([]);
    setBatchProgress(`0 / ${PHRASES.length} 생성 준비 중`);

    const nextResults: GeneratedSticker[] = [];

    try {
      for (let index = 0; index < PHRASES.length; index += 1) {
        const currentPhrase = PHRASES[index];
        setBatchProgress(`${index + 1} / ${PHRASES.length} 생성 중: ${currentPhrase}`);
        const generated = await requestSticker(currentPhrase);
        nextResults.push({ phrase: currentPhrase, image: generated });
        setSetResults([...nextResults]);
      }

      setBatchProgress(`${PHRASES.length} / ${PHRASES.length} 생성 완료`);
    } catch (event: unknown) {
      const message = event instanceof Error ? event.message : '세트 생성 중 오류가 발생했습니다.';
      setError(message);
      setBatchProgress('생성 실패');
    } finally {
      setBatchLoading(false);
    }
  }, [requestSticker]);

  const downloadPlatformSet = useCallback(async () => {
    setError('');
    setExportLoading(true);

    try {
      const files: StickerFile[] = [];

      for (let index = 0; index < setResults.length; index += 1) {
        const item = setResults[index];
        const resized = await prepareStickerForPlatform(item.image, {
          width: selectedPlatform.width,
          height: selectedPlatform.height,
          removeLightBg,
          paddingRatio: 0.88
        });

        files.push({
          fileName: `${String(index + 1).padStart(2, '0')}_${selectedPlatform.id}_${selectedStyle.id}_${safeFileName(item.phrase)}.png`,
          dataUrl: resized
        });
      }

      await downloadStickerZip(files, `${selectedPlatform.id}-${selectedStyle.id}-${selectedPlatform.width}x${selectedPlatform.height}-8set.zip`);
    } catch (event: unknown) {
      const message = event instanceof Error ? event.message : '선택한 규격으로 ZIP을 만드는 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setExportLoading(false);
    }
  }, [removeLightBg, selectedPlatform, selectedStyle.id, setResults]);

  const readiness = [
    { label: 'API Key', value: apiKeyStatus === 'valid' ? '유효' : '검증 필요', ready: apiKeyStatus === 'valid' },
    { label: '이미지', value: image ? '업로드 완료' : '대기', ready: Boolean(image) },
    { label: '스타일', value: selectedStyle.name, ready: Boolean(selectedStyle) }
  ];

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div className="brand inline-brand">
            <span className="brand-dot" />
            <span>SNS Emoticon Maker</span>
          </div>
          <span className={`status-badge ${apiKeyStatus}`}>
            API Key {apiKeyStatus === 'valid' ? '유효' : apiKeyStatus === 'invalid' ? '실패' : apiKeyStatus === 'checking' ? '검증 중' : '대기'}
          </span>
        </header>

        <section className="page-title">
          <span className="page-kicker">REDPAPA WEB APP</span>
          <h1>사진 한 장으로 SNS 이모티콘 8종 만들기</h1>
        </section>

        <div id="key">
          <ApiKeyBox onChange={setApiKey} onStatusChange={setApiKeyStatus} />
        </div>

        <div id="source">
          <ImageUploader image={image} onImage={setImage} />
        </div>

        <section id="style" className={`panel ${image ? '' : 'panel-disabled'}`}>
          <div className="panel-header">
            <div>
              <span className="step-label">STEP 3</span>
              <h2>스타일 선택</h2>
            </div>
            <span className="small">12개 스타일</span>
          </div>
          <StyleGrid selected={selectedStyle.id} onSelect={setSelectedStyle} disabled={!image} />
          <p className="small style-note">
            실제 메신저에서 쓰기 좋은 캐릭터, 반응, 문구형 스타일만 남겼습니다.
          </p>
        </section>

        <section className="panel action-panel">
          <div className="panel-header">
            <div>
              <span className="step-label">STEP 4</span>
              <h2>8종 자동 생성</h2>
            </div>
          </div>
          <div className="summary-list compact-summary">
            {readiness.map((item) => (
              <span className={item.ready ? 'ready' : ''} key={item.label}>
                <b>{item.label}</b>
                <em>{item.value}</em>
              </span>
            ))}
          </div>
          <label className="check-row">
            <input type="checkbox" checked={removeLightBg} onChange={(event) => setRemoveLightBg(event.target.checked)} />
            <span>밝은 배경 자동 투명 처리</span>
          </label>
          <button className="btn full primary-action" disabled={!canGenerate} onClick={generateSet}>
            {batchLoading ? '생성 중...' : '8종 생성'}
          </button>
          {batchProgress && (
            <div className="progress-block">
              <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
              <p className="small">{batchProgress}</p>
            </div>
          )}
          {error && <p className="small error-text">{error}</p>}
        </section>

        <section id="result" className="panel results-panel">
          <div className="panel-header result-tools">
            <div>
              <span className="step-label">RESULT</span>
              <h2>생성 결과</h2>
            </div>
            <span className="small">{setResults.length} / {PHRASES.length}</span>
          </div>
          <div className="result-grid">
            {setResults.length > 0 ? setResults.map((item, index) => (
              <article className="result-card" key={`${item.phrase}-${index}`}>
                <div className="thumb-box">
                  <img src={item.image} alt={`${item.phrase} 이모티콘`} />
                </div>
                <strong>{item.phrase}</strong>
                <a href={item.image} download={`${String(index + 1).padStart(2, '0')}_${selectedStyle.id}_${safeFileName(item.phrase)}.png`}>
                  PNG 저장
                </a>
              </article>
            )) : (
              <div className="empty-results">
                <b>아직 생성된 이모티콘이 없습니다.</b>
                <span>API Key 검증, 이미지 업로드, 스타일 선택 후 8종 생성을 누르세요.</span>
              </div>
            )}
          </div>
        </section>

        <section id="export" className="panel export-panel">
          <div className="panel-header">
            <div>
              <span className="step-label">STEP 5</span>
              <h2>SNS 규격 저장</h2>
            </div>
          </div>
          <div className="export-controls">
            <label>
              <span className="input-label">저장 규격</span>
              <select
                className="input"
                value={selectedPlatformId}
                onChange={(event) => setSelectedPlatformId(event.target.value)}
              >
                {PLATFORMS.map((platform) => (
                  <option key={platform.id} value={platform.id}>{platform.name} · {platform.size}</option>
                ))}
              </select>
            </label>
            <button className="btn full" disabled={setResults.length === 0 || batchLoading || exportLoading} onClick={downloadPlatformSet}>
              {exportLoading ? 'ZIP 생성 중...' : `${selectedPlatform.name} ZIP 다운로드`}
            </button>
          </div>
          <p className="small platform-note">{selectedPlatform.note}</p>
        </section>
      </section>
    </main>
  );
}
