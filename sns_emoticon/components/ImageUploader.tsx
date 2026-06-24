'use client';
/* eslint-disable @next/next/no-img-element */

type ImageUploaderProps = {
  image: string;
  onImage: (dataUrl: string) => void;
};

export default function ImageUploader({ image, onImage }: ImageUploaderProps) {
  function handle(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <section className="panel upload-panel">
      <div className="panel-header">
        <div>
          <span className="step-label">STEP 2</span>
          <h2>이미지 업로드</h2>
        </div>
        <span className={`mini-status ${image ? 'ready' : ''}`}>{image ? '미리보기 표시 중' : '대기'}</span>
      </div>
      <label className="upload-drop">
        <input type="file" accept="image/*" onChange={(event) => handle(event.target.files?.[0])} />
        {image ? (
          <img src={image} alt="업로드한 원본 이미지 미리보기" />
        ) : (
          <span>
            <b>원본 이미지를 선택하세요</b>
            <small>인물, 반려동물, 캐릭터 이미지에 잘 맞습니다.</small>
          </span>
        )}
      </label>
    </section>
  );
}
