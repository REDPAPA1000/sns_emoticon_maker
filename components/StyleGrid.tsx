'use client';

import { STYLES, StickerStyle } from '@/data/styles';

type StyleGridProps = {
  selected: string;
  onSelect: (style: StickerStyle) => void;
  previews?: Record<string, string>;
  loadingIds?: string[];
};

export default function StyleGrid({ selected, onSelect, previews = {}, loadingIds = [] }: StyleGridProps) {
  return (
    <div className="style-grid">
      {STYLES.map((style) => {
        const preview = previews[style.id];
        const isLoading = loadingIds.includes(style.id);

        return (
          <button
            key={style.id}
            type="button"
            className={`style-sample-card ${selected === style.id ? 'active' : ''}`}
            onClick={() => onSelect(style)}
            aria-label={`${style.name} 스타일 선택`}
          >
            <div className="style-sample real-preview-box">
              {preview ? (
                <img src={preview} alt={`${style.name} 스타일 미리보기`} />
              ) : isLoading ? (
                <div className="preview-placeholder loading-preview">생성 중...</div>
              ) : (
                <div className="preview-placeholder">내 이미지로<br />미리보기 필요</div>
              )}
            </div>
            <strong>{style.name}</strong>
          </button>
        );
      })}
    </div>
  );
}
