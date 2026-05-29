import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SNS Emoticon Maker',
  description: '무료 BYOK 방식의 SNS 이모티콘/스티커 제작 도구',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
