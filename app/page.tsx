/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useMemo, useState } from 'react';
import ApiKeyBox from '@/components/ApiKeyBox';
import ImageUploader from '@/components/ImageUploader';
import StyleGrid from '@/components/StyleGrid';
import PlatformGrid from '@/components/PlatformGrid';
import { STYLES, StickerStyle } from '@/data/styles';
import { PLATFORMS } from '@/data/platforms';
import { downloadStickerZip, safeFileName, StickerFile } from '@/lib/zip';
import { prepareStickerForPlatform, removeLightBackground } from '@/lib/image-processing';

const PHRASES = ['좋아!', '고마워', 'ㅋㅋㅋ', '화이팅', '미안', '대박', '잘자', '인정'];
const PREVIEW_STYLE_IDS = ['chibi', 'korean-messenger', 'webtoon', 'toy-3d', 'doodle', 'meme-reaction'];

type GeneratedSticker = { phrase: string; image: string; };

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>(STYLES[0]);
  const [selectedPlatformId, setSelectedPlatformId] = useState(PLATFORMS[0].id);
  const [result, setResult] = useState('');
  const [setResults, setSetResults] = useState<GeneratedSticker[]>([]);
  const [stylePreviews, setStylePreviews] = useState<Record<string, string>>({});
  const [previewLoadingIds, setPreviewLoadingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [removeLightBg, setRemoveLightBg] = useState(true);
  const [batchProgress, setBatchProgress] = useState('');
  const [error, setError] = useState('');

  const selectedPlatform = useMemo(() => PLATFORMS.find((platform) => platform.id === selectedPlatformId) ?? PLATFORMS[0], [selectedPlatformId]);
  const canGenerate = useMemo(() => Boolean(apiKey && image && selectedStyle), [apiKey, image, selectedStyle]);

  const requestStickerForStyle = useCallback(async (style: StickerStyle, targetPhrase: string) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, imageDataUrl: image, stylePrompt: style.prompt, phrase: targetPhrase })
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || '생성 실패');
    if (!json.image) throw new Error('이미지 응답이 없습니다.');
    const generatedImage = String(json.image);
    return removeLightBg ? removeLightBackground(generatedImage) : generatedImage;
  }, [apiKey, image, removeLightBg]);

  const requestSticker = useCallback((targetPhrase: string) => requestStickerForStyle(selectedStyle, targetPhrase), [requestStickerForStyle, selectedStyle]);

  const generateStylePreviews = useCallback(async () => {
    setError('');
    setPreviewLoading(true);
    setStylePreviews({});
    const previewStyles = STYLES.filter((style) => PREVIEW_STYLE_IDS.includes(style.id));
    setPreviewLoadingIds(previewStyles.map((style) => style.id));

    try {
      const nextPreviews: Record<string, string> = {};
      for (const style of previewStyles) {
        setPreviewLoadingIds((ids) => ids.includes(style.id) ? ids : [...ids, style.id]);
        const generated = await requestStickerForStyle(style, '');
        nextPreviews[style.id] = generated;
        setStylePreviews({ ...nextPreviews });
        setPreviewLoadingIds((ids) => ids.filter((id) => id !== style.id));
      }
      if (previewStyles[0]) setSelectedStyle(previewStyles[0]);
    } catch (event: unknown) {
      const message = event instanceof Error ? event.message : '스타일 미리보기 생성 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setPreviewLoading(false);
      setPreviewLoadingIds([]);
    }
  }, [requestStickerForStyle]);

  const generate = useCallback(async () => {
    setError(''); setLoading(true); setResult('');
    try {
      const generated = await requestSticker('');
      setResult(generated);
    } catch (event: unknown) {
      setError(event instanceof Error ? event.message : '오류가 발생했습니다.');
    } finally { setLoading(false); }
  }, [requestSticker]);

  const generateSet = useCallback(async () => {
    setError(''); setBatchLoading(true); setSetResults([]); setBatchProgress(`0 / ${PHRASES.length} 생성 준비 중`);
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
      setError(event instanceof Error ? event.message : '세트 생성 중 오류가 발생했습니다.');
      setBatchProgress('생성 실패');
    } finally { setBatchLoading(false); }
  }, [requestSticker]);

  const downloadOriginalSet = useCallback(async () => {
    try {
      const files: StickerFile[] = setResults.map((item, index) => ({ fileName: `${String(index + 1).padStart(2, '0')}_${selectedStyle.id}_${safeFileName(item.phrase)}.png`, dataUrl: item.image }));
      await downloadStickerZip(files, `sns-${selectedStyle.id}-original-8set.zip`);
    } catch (event: unknown) { setError(event instanceof Error ? event.message : 'ZIP 다운로드 중 오류가 발생했습니다.'); }
  }, [selectedStyle.id, setResults]);

  const downloadPlatformSet = useCallback(async () => {
    setError(''); setExportLoading(true);
    try {
      const files: StickerFile[] = [];
      for (let index = 0; index < setResults.length; index += 1) {
        const item = setResults[index];
        const resized = await prepareStickerForPlatform(item.image, { width: selectedPlatform.width, height: selectedPlatform.height, removeLightBg, paddingRatio: 0.88 });
        files.push({ fileName: `${String(index + 1).padStart(2, '0')}_${selectedPlatform.id}_${selectedStyle.id}_${safeFileName(item.phrase)}.png`, dataUrl: resized });
      }
      await downloadStickerZip(files, `${selectedPlatform.id}-${selectedStyle.id}-${selectedPlatform.width}x${selectedPlatform.height}-8set.zip`);
    } catch (event: unknown) { setError(event instanceof Error ? event.message : '플랫폼 ZIP 변환 중 오류가 발생했습니다.'); }
    finally { setExportLoading(false); }
  }, [removeLightBg, selectedPlatform, selectedStyle.id, setResults]);

  const downloadPlatformSingle = useCallback(async () => {
    if (!result) return;
    setError(''); setExportLoading(true);
    try {
      const resized = await prepareStickerForPlatform(result, { width: selectedPlatform.width, height: selectedPlatform.height, removeLightBg, paddingRatio: 0.88 });
      await downloadStickerZip([{ fileName: `single_${selectedPlatform.id}_${selectedStyle.id}.png`, dataUrl: resized }], `single-${selectedPlatform.id}-${selectedStyle.id}.zip`);
    } catch (event: unknown) { setError(event instanceof Error ? event.message : '대표 이미지 변환 중 오류가 발생했습니다.'); }
    finally { setExportLoading(false); }
  }, [removeLightBg, result, selectedPlatform, selectedStyle.id]);

  return (
    <main className="container">
      <section className="hero"><span className="badge">무료 BYOK · SNS Sticker Generator</span><h1>SNS 이모티콘 메이커</h1><p>이미지를 업로드하면 내 이미지가 여러 이모티콘 스타일로 실제 변환된 미리보기를 보고 선택할 수 있습니다.</p></section>

      <section className="section grid grid-2 fixed-grid"><ApiKeyBox onChange={setApiKey} /><ImageUploader onImage={setImage} /></section>

      <section className="section">
        <div className="style-toolbar">
          <div><h2>3. 내 이미지로 스타일 미리보기</h2><p className="small">먼저 대표 6개 스타일을 실제 AI로 변환해 보여줍니다. 마음에 드는 미리보기를 클릭하세요.</p></div>
          <div className="button-row"><button className="btn" disabled={!apiKey || !image || previewLoading || loading || batchLoading} onClick={generateStylePreviews}>{previewLoading ? '미리보기 생성 중...' : '대표 스타일 미리보기 생성'}</button><span className="badge">선택됨: {selectedStyle.name}</span></div>
        </div>
        <StyleGrid selected={selectedStyle.id} onSelect={setSelectedStyle} previews={stylePreviews} loadingIds={previewLoadingIds} />
      </section>

      <section className="section grid grid-2 fixed-grid">
        <div className="card"><h3>4. 원본 / 대표 결과 미리보기</h3><div className="preview-box">{result ? <img src={result} alt="generated sticker" /> : image ? <img src={image} alt="uploaded image" /> : <p className="small">이미지를 업로드하면 여기에 고정 크기로 표시됩니다.</p>}</div>{result && <div className="button-row"><a className="btn" href={result} download={`sns-sticker-${selectedStyle.id}.png`}>대표 PNG 다운로드</a><button className="btn secondary" disabled={exportLoading} onClick={downloadPlatformSingle}>대표 플랫폼 ZIP</button></div>}</div>
        <div className="card"><h3>5. 대표 이모티콘 / 8종 세트 생성</h3><p className="small">선택한 실제 미리보기 스타일로 대표 이미지 1장 또는 기본 문구 8종 세트를 자동 생성합니다.</p><label className="check-row"><input type="checkbox" checked={removeLightBg} onChange={(event) => setRemoveLightBg(event.target.checked)} /><span>밝은 배경 자동 투명 처리</span></label><div className="button-row"><button className="btn" disabled={!canGenerate || loading || batchLoading || previewLoading} onClick={generate}>{loading ? '생성 중...' : `${selectedStyle.name} 대표 1장 생성`}</button><button className="btn secondary" disabled={!canGenerate || loading || batchLoading || previewLoading} onClick={generateSet}>{batchLoading ? '8종 생성 중...' : '8종 세트 자동 생성'}</button></div>{batchProgress && <p className="small">{batchProgress}</p>}{error && <p className="small error-text">{error}</p>}</div>
      </section>

      <section className="section grid grid-2 fixed-grid"><div className="card"><h3>6. 플랫폼 내보내기</h3><p className="small">생성된 이미지를 선택한 플랫폼 규격으로 중앙 배치·리사이즈한 뒤 ZIP으로 저장합니다.</p><label className="label">플랫폼 선택</label><select className="input" value={selectedPlatformId} onChange={(event) => setSelectedPlatformId(event.target.value)}>{PLATFORMS.map((platform) => <option key={platform.id} value={platform.id}>{platform.name} · {platform.size}</option>)}</select><p className="small selected-platform">현재 선택: <b>{selectedPlatform.name}</b> · {selectedPlatform.width}×{selectedPlatform.height} PNG</p><div className="button-row"><button className="btn" disabled={setResults.length === 0 || batchLoading || exportLoading} onClick={downloadPlatformSet}>{exportLoading ? '변환 중...' : '8종 플랫폼 ZIP'}</button><button className="btn secondary" disabled={setResults.length === 0 || batchLoading || exportLoading} onClick={downloadOriginalSet}>원본 8종 ZIP</button></div></div><div className="card"><h3>현재 기능 상태</h3><ul className="small status-list"><li>업로드 이미지 기반 AI 스타일 미리보기: 구현</li><li>Gemini BYOK 방식: 구현</li><li>API Key 발급 안내/상태 표시: 구현</li><li>8종 문구 일괄 생성: 구현</li><li>ZIP 다운로드: 구현</li><li>플랫폼별 리사이즈: 구현</li><li>밝은 배경 투명 처리: 1차 구현</li></ul></div></section>

      {setResults.length > 0 && <section className="section"><h2>8종 생성 결과</h2><div className="grid grid-4 fixed-grid">{setResults.map((item, index) => <div className="card" key={`${item.phrase}-${index}`}><div className="thumb-box"><img src={item.image} alt={`${item.phrase} sticker`} /></div><strong>{index + 1}. {item.phrase}</strong><a className="small" href={item.image} download={`${String(index + 1).padStart(2, '0')}_${selectedStyle.id}_${safeFileName(item.phrase)}.png`}>개별 PNG 다운로드</a></div>)}</div></section>}

      <section className="section"><h2>플랫폼 내보내기 목표</h2><PlatformGrid /></section>
    </main>
  );
}
