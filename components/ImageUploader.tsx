'use client';

export default function ImageUploader({ onImage }: { onImage: (dataUrl:string)=>void }) {
  function handle(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="card">
      <h3>2. 이미지 업로드</h3>
      <input className="input" type="file" accept="image/*" onChange={(event) => handle(event.target.files?.[0])} />
      <p className="small">
        인물, 반려동물, 캐릭터 이미지를 사용할 수 있습니다. 권리가 없는 이미지나 민감한 이미지는 업로드하지 마세요.
      </p>
    </div>
  );
}
