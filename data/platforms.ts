export type PlatformPreset = {
  id: string;
  name: string;
  width: number;
  height: number;
  size: string;
  export: string;
  note: string;
};

export const PLATFORMS: PlatformPreset[] = [
  { id: 'kakao', name: 'KakaoTalk', width: 360, height: 360, size: '360 x 360', export: 'PNG ZIP', note: 'Kakao emoticon submission prep size. Final submission rules should be checked separately.' },
  { id: 'telegram', name: 'Telegram', width: 512, height: 512, size: '512 x 512', export: 'PNG ZIP', note: 'General Telegram sticker pack preparation size.' },
  { id: 'whatsapp', name: 'WhatsApp', width: 512, height: 512, size: '512 x 512', export: 'PNG ZIP', note: 'Convenient export size for WhatsApp sticker conversion workflows.' },
  { id: 'discord', name: 'Discord', width: 320, height: 320, size: '320 x 320', export: 'PNG ZIP', note: 'Useful size for Discord server emoji and sticker preparation.' },
  { id: 'line', name: 'LINE', width: 370, height: 320, size: '370 x 320', export: 'PNG ZIP', note: 'LINE Creators Market preparation size.' },
  { id: 'instagram', name: 'Instagram', width: 512, height: 512, size: '512 x 512', export: 'PNG ZIP', note: 'Reusable reaction image size for stories, reels, and posts.' }
];
