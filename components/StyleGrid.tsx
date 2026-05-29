'use client';
/* eslint-disable @next/next/no-img-element */
import { STYLES, StickerStyle } from '@/data/styles';

export default function StyleGrid({ selected, onSelect }: { selected: string; onSelect: (s:StickerStyle)=>void }) {
  return (
    <div className="grid grid-3">
      {STYLES.map((style) => (
        <button
          key={style.id}
          className={`style-card ${selected === style.id ? 'active' : ''}`}
          onClick={() => onSelect(style)}
          type="button"
        >
          <span className="style-preview">
            <img src={style.sampleImage} alt={`${style.name} sample`} />
          </span>
          <span className="style-meta">
            <strong>{style.name}</strong>
            <span className="small">{style.description}</span>
            <span className="style-footer">
              <span className="kbd">{style.group}</span>
              <span className="small">{style.bestFor}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
