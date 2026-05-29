import { PLATFORMS } from '@/data/platforms';
export default function PlatformGrid() {
  return <div className="grid grid-3">
    {PLATFORMS.map(p => <div className="card" key={p.id}>
      <h3>{p.name}</h3>
      <p><b>{p.size}</b> · {p.export}</p>
      <p className="small">{p.note}</p>
    </div>)}
  </div>;
}
