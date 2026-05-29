'use client';
/* eslint-disable @next/next/no-img-element */
import { STYLES, StickerStyle } from '@/data/styles';

export default function StyleGrid({ selected, onSelect }: { selected: string; onSelect: (s:StickerStyle)=>void }) {
  return (
    <div className="style-grid">
      {STYLES.map((style) => (
        <button
          key={style.id}
          className={`style-card ${selected === style.id ? 'active' : ''}`}
          onClick={() => onSelect(style)}
          title={`${style.description} / ${style.bestFor}`}
          type="button"
        >
          <span className="style-preview">
            <img src={style.sampleImage} alt={`${style.name} sample`} />
          </span>
          <span className="style-name">{style.name}</span>
        </button>
      ))}
    </div>
  );
}
