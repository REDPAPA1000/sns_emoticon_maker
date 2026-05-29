'use client';
/* eslint-disable @next/next/no-img-element */

import { STYLES, StickerStyle } from '@/data/styles';

type StyleGridProps = {
  selected: string;
  onSelect: (style: StickerStyle) => void;
  disabled?: boolean;
};

export default function StyleGrid({ selected, onSelect, disabled = false }: StyleGridProps) {
  return (
    <div className="style-grid" aria-disabled={disabled}>
      {STYLES.map((style) => (
        <button
          key={style.id}
          className={`style-card ${selected === style.id ? 'active' : ''}`}
          onClick={() => onSelect(style)}
          title={`${style.description} / ${style.bestFor}`}
          type="button"
          disabled={disabled}
        >
          <span className="style-preview">
            <img src={style.sampleImage} alt={`${style.name} 샘플`} />
          </span>
          <span className="style-name">{style.name}</span>
          <span className="style-meta">{style.bestFor}</span>
        </button>
      ))}
    </div>
  );
}
