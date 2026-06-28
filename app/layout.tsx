import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 풀이 노트 | REDPAPA',
  description: '문제 사진을 올리면 AI가 단계별 풀이를 손글씨 노트로 정리합니다.',
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
