'use client';
import { useCallback, useMemo, useState } from 'react';
import ApiKeyBox from '@/components/ApiKeyBox';
import ImageUploader from '@/components/ImageUploader';
import StyleGrid from '@/components/StyleGrid';
import PlatformGrid from '@/components/PlatformGrid';
import { STYLES, StickerStyle } from '@/data/styles';

const PHRASES = ['좋아!', '고마워', 'ㅋㅋㅋ', '화이팅', '미안', '대박', '잘자', '인정'];

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StickerStyle>(STYLES[0]);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const canGenerate = useMemo(() => Boolean(apiKey && image && selectedStyle), [apiKey, image, selectedStyle]);

  const generate = useCallback(async () => {
    setError(''); setLoading(true); setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, imageDataUrl: image, stylePrompt: selectedStyle.prompt, phrase })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || '생성 실패');
      setResult(json.image);
    } catch (e:any) {
      setError(e.message || '오류가 발생했습니다.');
    } finally { setLoading(false); }
  }, [apiKey, image, selectedStyle, phrase]);

  return <main className="container">
    <section className="hero">
      <span className="badge">무료 BYOK · SNS Sticker Generator</span>
      <h1>SNS 이모티콘 메이커</h1>
      <p>사용자가 자신의 Gemini API 키를 넣고, 이미지를 업로드한 뒤 원하는 스타일을 선택해 카톡·텔레그램·왓츠앱·디스코드·LINE·인스타그램용 스티커를 제작하는 무료 웹앱입니다.</p>
    </section>

    <section className="section grid grid-2">
      <ApiKeyBox onChange={setApiKey} />
      <ImageUploader onImage={setImage} />
    </section>

    <section className="section grid grid-2">
      <div className="card">
        <h3>3. 원본 / 결과 미리보기</h3>
        <div className="preview-box">
          {result ? <img src={result} alt="generated sticker" /> : image ? <img src={image} alt="uploaded image" /> : <p className="small">이미지를 업로드하면 여기에 표시됩니다.</p>}
        </div>
        {result && <a className="btn" style={{display:'inline-block', marginTop:12, textDecoration:'none'}} href={result} download={`sns-sticker-${selectedStyle.id}.png`}>PNG 다운로드</a>}
      </div>
      <div className="card">
        <h3>4. 대표 이모티콘 생성</h3>
        <p className="small">처음에는 선택한 스타일 1개만 생성합니다. 전체 24종/32종 세트 생성은 다음 단계에서 추가합니다.</p>
        <select className="input" value={phrase} onChange={e=>setPhrase(e.target.value)}>
          {PHRASES.map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="btn" style={{marginTop:12}} disabled={!canGenerate || loading} onClick={generate}>{loading ? '생성 중...' : `${selectedStyle.name} 스타일로 생성`}</button>
        {error && <p className="small" style={{color:'#b00020'}}>{error}</p>}
      </div>
    </section>

    <section className="section">
      <h2>스타일 라이브러리</h2>
      <StyleGrid selected={selectedStyle.id} onSelect={setSelectedStyle} />
    </section>

    <section className="section">
      <h2>플랫폼 내보내기 목표</h2>
      <PlatformGrid />
    </section>
  </main>;
}
