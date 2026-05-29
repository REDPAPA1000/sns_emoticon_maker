import { PLATFORMS } from '@/data/platforms';

export default function PlatformGrid() {
  return <div className="grid grid-3">
    {PLATFORMS.map((platform) => <div className="card" key={platform.id}>
      <h3>{platform.name}</h3>
      <p><b>{platform.size}</b> · {platform.export}</p>
      <p className="small">{platform.note}</p>
    </div>)}
  </div>;
}
