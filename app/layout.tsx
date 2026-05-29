import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNS Emoticon Maker',
  description: 'Free BYOK SNS sticker and emoticon maker for KakaoTalk, Telegram, WhatsApp, Discord, LINE, and Instagram.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
