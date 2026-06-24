import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SNS Emoticon Maker',
  description: 'Bring your own Gemini API key and create SNS stickers from uploaded images.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
