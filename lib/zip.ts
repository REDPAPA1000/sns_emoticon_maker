import JSZip from 'jszip';

export type StickerFile = {
  fileName: string;
  dataUrl: string;
};

function dataUrlToBase64(dataUrl: string) {
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) {
    throw new Error('Invalid image data URL');
  }
  return dataUrl.slice(commaIndex + 1);
}

export function safeFileName(input: string) {
  return input
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 32);
}

export async function downloadStickerZip(files: StickerFile[], zipName = 'sns-emoticon-set.zip') {
  if (files.length === 0) {
    throw new Error('ZIP으로 묶을 이미지가 없습니다.');
  }

  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.fileName, dataUrlToBase64(file.dataUrl), { base64: true });
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = zipName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
