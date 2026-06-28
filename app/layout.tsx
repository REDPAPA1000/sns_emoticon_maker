import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SNS Emoticon Maker',
  description: 'Bring your own Gemini API key and create SNS stickers from uploaded images.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
