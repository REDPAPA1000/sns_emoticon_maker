'use client';
import { STYLES, StickerStyle } from '@/data/styles';
export default function StyleGrid({ selected, onSelect }: { selected: string; onSelect: (s:StickerStyle)=>void }) {
  return <div className="grid grid-3">
    {STYLES.map(style => <button key={style.id} className={`style-card ${selected===style.id?'active':''}`} onClick={()=>onSelect(style)}>
      <strong>{style.name}</strong>
      <p className="small">{style.description}</p>
      <span className="kbd">{style.group}</span>
    </button>)}
  </div>;
}
