'use client';

import { STYLES, StickerStyle } from '@/data/styles';

type StyleGridProps = {
  selected: string;
  onSelect: (style: StickerStyle) => void;
};

const previewMap: Record<string, { bg: string; fg: string; accent: string; label: string }> = {
  chibi: { bg: '#ffe9f1', fg: '#ff7aae', accent: '#ffffff', label: '치비' },
  'korean-messenger': { bg: '#fff0c7', fg: '#ffd75e', accent: '#2b2b2b', label: '톡' },
  'line-mascot': { bg: '#e8ffe8', fg: '#54d16a', accent: '#111111', label: 'POP' },
  webtoon: { bg: '#f3e7ff', fg: '#9b5cff', accent: '#ffea00', label: '웹툰' },
  'toy-3d': { bg: '#e7f6ff', fg: '#73c7ff', accent: '#ffffff', label: '3D' },
  'meme-reaction': { bg: '#fff2e8', fg: '#ff8f4f', accent: '#111111', label: '밈!' },
  'pet-kawaii': { bg: '#f5eee6', fg: '#c58b5f', accent: '#ffffff', label: '멍냥' },
  'japanese-kawaii': { bg: '#ffeaf8', fg: '#ff9bd5', accent: '#ffffff', label: 'かわ' },
  'flat-emoji': { bg: '#fff6c7', fg: '#ffcf3d', accent: '#111111', label: '☺' },
  'kpop-fandom': { bg: '#f2e7ff', fg: '#b66dff', accent: '#ffffff', label: '팬덤' },
  doodle: { bg: '#ffffff', fg: '#111111', accent: '#f4f4f4', label: '낙서' },
  'child-crayon': { bg: '#fff7e6', fg: '#ff6b6b', accent: '#4dabf7', label: '크레용' },
  stickman: { bg: '#ffffff', fg: '#111111', accent: '#ffffff', label: 'Stick' },
  'ugly-cute': { bg: '#ecffe8', fg: '#8bd450', accent: '#111111', label: 'B급' },
  pixel: { bg: '#e8f0ff', fg: '#456dff', accent: '#ffffff', label: '8BIT' },
  'paper-cutout': { bg: '#fff5e9', fg: '#f0a35e', accent: '#ffffff', label: '종이' },
  clay: { bg: '#f3eadf', fg: '#d28b67', accent: '#ffffff', label: 'CLAY' },
  watercolor: { bg: '#edf7ff', fg: '#91c8ff', accent: '#ffffff', label: '수채' },
  glitch: { bg: '#111827', fg: '#06b6d4', accent: '#f43f5e', label: 'GLITCH' },
  graffiti: { bg: '#fff1f2', fg: '#fb7185', accent: '#111111', label: 'TAG' }
};

export default function StyleGrid({ selected, onSelect }: StyleGridProps) {
  return (
    <div className="style-grid">
      {STYLES.map((style) => {
        const preview = previewMap[style.id] ?? { bg: '#f7f4ef', fg: '#111111', accent: '#ffffff', label: style.name };
        return (
          <button
            key={style.id}
            type="button"
            className={`style-sample-card ${selected === style.id ? 'active' : ''}`}
            onClick={() => onSelect(style)}
            aria-label={`${style.name} 스타일 선택`}
          >
            <div className="style-sample" style={{ background: preview.bg }}>
              <div className="sample-head" style={{ background: preview.fg }}>
                <span className="sample-eye left" style={{ background: preview.accent }} />
                <span className="sample-eye right" style={{ background: preview.accent }} />
                <span className="sample-mouth" style={{ background: preview.accent }} />
              </div>
              <span className="sample-label" style={{ color: preview.accent === '#111111' ? '#111111' : preview.fg }}>{preview.label}</span>
            </div>
            <strong>{style.name}</strong>
          </button>
        );
      })}
    </div>
  );
}
