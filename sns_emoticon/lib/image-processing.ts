export type ResizeOptions = {
  width: number;
  height: number;
  paddingRatio?: number;
};

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas를 사용할 수 없습니다.');
  return { canvas, context };
}

export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    image.src = dataUrl;
  });
}

export async function resizeStickerImage(dataUrl: string, options: ResizeOptions) {
  const image = await loadImage(dataUrl);
  const paddingRatio = options.paddingRatio ?? 0.88;
  const maxWidth = options.width * paddingRatio;
  const maxHeight = options.height * paddingRatio;
  const scale = Math.min(maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  const drawWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const drawHeight = Math.max(1, Math.round(image.naturalHeight * scale));
  const drawX = Math.round((options.width - drawWidth) / 2);
  const drawY = Math.round((options.height - drawHeight) / 2);

  const { canvas, context } = createCanvas(options.width, options.height);
  context.clearRect(0, 0, options.width, options.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  return canvas.toDataURL('image/png');
}

export async function removeLightBackground(dataUrl: string, threshold = 242) {
  const image = await loadImage(dataUrl);
  const { canvas, context } = createCanvas(image.naturalWidth, image.naturalHeight);
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];
    const isLight = red >= threshold && green >= threshold && blue >= threshold;
    const isLowSaturation = Math.max(red, green, blue) - Math.min(red, green, blue) < 18;

    if (alpha > 0 && isLight && isLowSaturation) {
      data[index + 3] = 0;
    }
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export async function prepareStickerForPlatform(dataUrl: string, options: ResizeOptions & { removeLightBg?: boolean }) {
  const cleaned = options.removeLightBg ? await removeLightBackground(dataUrl) : dataUrl;
  return resizeStickerImage(cleaned, options);
}
