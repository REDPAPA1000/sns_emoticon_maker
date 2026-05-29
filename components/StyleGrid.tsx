'use client';

import { STYLES, StickerStyle } from '@/data/styles';

type StyleGridProps = {
  selected: string;
  onSelect: (style: StickerStyle) => void;
};

type PreviewProps = {
  id: string;
  name: string;
};

function StylePreview({ id, name }: PreviewProps) {
  switch (id) {
    case 'chibi':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#ffe7f0"/><circle cx="60" cy="48" r="30" fill="#ff8ab8"/><rect x="43" y="76" width="34" height="22" rx="11" fill="#ff8ab8"/><circle cx="49" cy="45" r="4" fill="#fff"/><circle cx="71" cy="45" r="4" fill="#fff"/><path d="M51 58 Q60 66 69 58" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round"/><text x="60" y="108" fontSize="13" fontWeight="800" textAnchor="middle" fill="#d6336c">CHIBI</text></svg>;
    case 'korean-messenger':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff2c9"/><rect x="25" y="30" width="70" height="52" rx="23" fill="#ffd43b"/><circle cx="48" cy="52" r="4" fill="#222"/><circle cx="72" cy="52" r="4" fill="#222"/><path d="M48 66 H72" stroke="#222" strokeWidth="4" strokeLinecap="round"/><path d="M34 82 L25 96 L48 84" fill="#ffd43b"/><text x="60" y="108" fontSize="13" fontWeight="800" textAnchor="middle" fill="#222">톡!</text></svg>;
    case 'line-mascot':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#eaffea"/><circle cx="60" cy="56" r="34" fill="#5ad66f" stroke="#111" strokeWidth="5"/><circle cx="49" cy="51" r="4" fill="#111"/><circle cx="71" cy="51" r="4" fill="#111"/><ellipse cx="60" cy="67" rx="14" ry="7" fill="#fff" stroke="#111" strokeWidth="3"/><text x="60" y="107" fontSize="12" fontWeight="900" textAnchor="middle" fill="#111">POP</text></svg>;
    case 'webtoon':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#f2e5ff"/><path d="M22 22 H84 Q96 22 96 34 V64 Q96 76 84 76 H51 L34 93 L39 76 H22 Q10 76 10 64 V34 Q10 22 22 22Z" fill="#fff" stroke="#111" strokeWidth="4"/><circle cx="51" cy="51" r="24" fill="#b197fc"/><path d="M40 45 L51 50 L40 55" stroke="#111" strokeWidth="4" fill="none"/><path d="M72 45 L61 50 L72 55" stroke="#111" strokeWidth="4" fill="none"/><text x="60" y="109" fontSize="13" fontWeight="900" textAnchor="middle" fill="#6741d9">헉!</text></svg>;
    case 'toy-3d':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><defs><radialGradient id="g3d" cx="35%" cy="30%"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#4dabf7"/></radialGradient></defs><rect width="120" height="120" rx="22" fill="#e7f6ff"/><circle cx="60" cy="54" r="34" fill="url(#g3d)"/><ellipse cx="60" cy="90" rx="28" ry="8" fill="#74c0fc" opacity=".45"/><circle cx="49" cy="52" r="5" fill="#1c7ed6"/><circle cx="71" cy="52" r="5" fill="#1c7ed6"/><text x="60" y="107" fontSize="13" fontWeight="900" textAnchor="middle" fill="#1864ab">3D</text></svg>;
    case 'meme-reaction':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff0e6"/><path d="M25 52 Q60 10 96 52 Q84 94 60 94 Q36 94 25 52Z" fill="#ff922b" stroke="#111" strokeWidth="4"/><circle cx="47" cy="52" r="8" fill="#fff" stroke="#111" strokeWidth="3"/><circle cx="73" cy="52" r="8" fill="#fff" stroke="#111" strokeWidth="3"/><ellipse cx="60" cy="75" rx="19" ry="10" fill="#111"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#e8590c">실화냐</text></svg>;
    case 'pet-kawaii':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#f8efe5"/><path d="M33 39 L26 20 L48 31 Z" fill="#c08457"/><path d="M87 39 L94 20 L72 31 Z" fill="#c08457"/><circle cx="60" cy="58" r="34" fill="#d4a373"/><circle cx="48" cy="55" r="4" fill="#fff"/><circle cx="72" cy="55" r="4" fill="#fff"/><path d="M56 67 Q60 71 64 67" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#7f4f24">멍냥</text></svg>;
    case 'japanese-kawaii':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#ffe3f3"/><circle cx="60" cy="58" r="32" fill="#ffadd6"/><circle cx="44" cy="41" r="10" fill="#ffadd6"/><circle cx="76" cy="41" r="10" fill="#ffadd6"/><path d="M46 57 Q51 51 56 57" stroke="#fff" strokeWidth="4" fill="none"/><path d="M64 57 Q69 51 74 57" stroke="#fff" strokeWidth="4" fill="none"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#c2255c">かわいい</text></svg>;
    case 'flat-emoji':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff6bf"/><circle cx="60" cy="57" r="35" fill="#ffd43b"/><circle cx="48" cy="50" r="5" fill="#212529"/><circle cx="72" cy="50" r="5" fill="#212529"/><path d="M43 67 Q60 83 77 67" stroke="#212529" strokeWidth="5" fill="none" strokeLinecap="round"/><text x="60" y="108" fontSize="13" fontWeight="900" textAnchor="middle" fill="#212529">☺</text></svg>;
    case 'kpop-fandom':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#f3e8ff"/><path d="M60 18 L67 42 L92 42 L71 57 L79 84 L60 68 L41 84 L49 57 L28 42 L53 42Z" fill="#c084fc"/><rect x="54" y="69" width="12" height="27" rx="6" fill="#7c3aed"/><circle cx="30" cy="28" r="4" fill="#fff"/><circle cx="91" cy="28" r="4" fill="#fff"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#6d28d9">응원!</text></svg>;
    case 'doodle':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff"/><path d="M35 39 Q60 22 83 43 Q95 65 72 82 Q49 99 29 75 Q18 54 35 39Z" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" strokeDasharray="7 5"/><circle cx="49" cy="55" r="3" fill="#111"/><circle cx="70" cy="53" r="3" fill="#111"/><path d="M45 71 Q61 62 75 72" stroke="#111" strokeWidth="3" fill="none"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#111">대충</text></svg>;
    case 'child-crayon':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff8e6"/><circle cx="60" cy="58" r="31" fill="#ff8787" stroke="#4dabf7" strokeWidth="5" strokeDasharray="8 4"/><rect x="38" y="78" width="44" height="13" rx="6" fill="#ffd43b"/><circle cx="48" cy="55" r="4" fill="#343a40"/><circle cx="72" cy="55" r="4" fill="#343a40"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#e03131">크레용</text></svg>;
    case 'stickman':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff"/><circle cx="60" cy="34" r="13" fill="none" stroke="#111" strokeWidth="4"/><path d="M60 47 V76 M60 56 L38 68 M60 56 L83 45 M60 76 L43 98 M60 76 L77 98" stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round"/><text x="60" y="112" fontSize="11" fontWeight="900" textAnchor="middle" fill="#111">stick</text></svg>;
    case 'ugly-cute':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#eaffea"/><path d="M29 41 Q58 15 88 40 Q101 76 72 93 Q37 98 24 68Z" fill="#a9e34b" stroke="#111" strokeWidth="4"/><circle cx="47" cy="52" r="8" fill="#fff"/><circle cx="73" cy="55" r="5" fill="#111"/><path d="M44 74 Q60 66 80 78" stroke="#111" strokeWidth="4" fill="none"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#2b8a3e">B급</text></svg>;
    case 'pixel':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name} shapeRendering="crispEdges"><rect width="120" height="120" rx="22" fill="#e7f0ff"/><rect x="32" y="28" width="56" height="56" fill="#4c6ef5"/><rect x="40" y="36" width="12" height="12" fill="#fff"/><rect x="68" y="36" width="12" height="12" fill="#fff"/><rect x="48" y="64" width="24" height="8" fill="#fff"/><rect x="40" y="84" width="40" height="8" fill="#748ffc"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#364fc7">8BIT</text></svg>;
    case 'paper-cutout':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff4e6"/><path d="M28 36 L73 24 L94 66 L47 91 Z" fill="#ffd8a8"/><path d="M36 42 L78 33 L86 65 L45 80 Z" fill="#ffa94d"/><circle cx="54" cy="55" r="4" fill="#fff"/><circle cx="72" cy="52" r="4" fill="#fff"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#d9480f">종이</text></svg>;
    case 'clay':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><defs><radialGradient id="clayg" cx="40%" cy="30%"><stop offset="0" stopColor="#f8d8c4"/><stop offset="1" stopColor="#c87955"/></radialGradient></defs><rect width="120" height="120" rx="22" fill="#f4eadf"/><ellipse cx="60" cy="58" rx="34" ry="31" fill="url(#clayg)"/><circle cx="49" cy="55" r="4" fill="#fff"/><circle cx="71" cy="55" r="4" fill="#fff"/><path d="M51 69 Q60 75 69 69" stroke="#fff" strokeWidth="4" fill="none"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#8f4b32">CLAY</text></svg>;
    case 'watercolor':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#edf8ff"/><circle cx="49" cy="53" r="29" fill="#91c8ff" opacity=".65"/><circle cx="69" cy="57" r="28" fill="#b197fc" opacity=".45"/><circle cx="58" cy="50" r="4" fill="#fff"/><circle cx="75" cy="53" r="4" fill="#fff"/><path d="M50 69 Q64 77 80 67" stroke="#fff" strokeWidth="4" fill="none"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#1c7ed6">수채</text></svg>;
    case 'glitch':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#111827"/><rect x="35" y="32" width="50" height="50" rx="10" fill="#06b6d4"/><rect x="41" y="38" width="50" height="50" rx="10" fill="#f43f5e" opacity=".7"/><rect x="31" y="48" width="58" height="7" fill="#fff"/><rect x="47" y="68" width="44" height="6" fill="#22c55e"/><text x="60" y="109" fontSize="11" fontWeight="900" textAnchor="middle" fill="#fff">GLITCH</text></svg>;
    case 'graffiti':
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#fff1f2"/><path d="M21 72 Q37 28 56 63 Q74 98 96 45" stroke="#fb7185" strokeWidth="12" fill="none" strokeLinecap="round"/><path d="M25 77 Q39 37 56 67 Q75 94 92 50" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="91" cy="31" r="5" fill="#111"/><text x="60" y="109" fontSize="12" fontWeight="900" textAnchor="middle" fill="#be123c">TAG</text></svg>;
    default:
      return <svg className="style-sample-svg" viewBox="0 0 120 120" role="img" aria-label={name}><rect width="120" height="120" rx="22" fill="#f7f4ef"/><circle cx="60" cy="58" r="32" fill="#111"/><circle cx="49" cy="54" r="4" fill="#fff"/><circle cx="71" cy="54" r="4" fill="#fff"/><text x="60" y="108" fontSize="12" fontWeight="900" textAnchor="middle" fill="#111">STYLE</text></svg>;
  }
}

export default function StyleGrid({ selected, onSelect }: StyleGridProps) {
  return (
    <div className="style-grid">
      {STYLES.map((style) => (
        <button
          key={style.id}
          type="button"
          className={`style-sample-card ${selected === style.id ? 'active' : ''}`}
          onClick={() => onSelect(style)}
          aria-label={`${style.name} 스타일 선택`}
        >
          <div className="style-sample">
            <StylePreview id={style.id} name={style.name} />
          </div>
          <strong>{style.name}</strong>
        </button>
      ))}
    </div>
  );
}
