'use client';
export default function ImageUploader({ onImage }: { onImage: (dataUrl:string)=>void }) {
  function handle(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImage(String(reader.result));
    reader.readAsDataURL(file);
  }
  return <div className="card">
    <h3>2. 이미지 업로드</h3>
    <input className="input" type="file" accept="image/*" onChange={e=>handle(e.target.files?.[0])} />
    <p className="small">인물, 반려동물, 캐릭터 이미지 모두 가능. 저작권 있는 캐릭터는 업로드하지 않는 것을 권장합니다.</p>
  </div>;
}
