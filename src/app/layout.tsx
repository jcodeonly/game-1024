import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1024 Special Challenge | 최소 이동 회전 퍼즐",
  description: "점수가 아닌 최소 이동 횟수로 1024를 달성하는 전략 퍼즐 게임. 100회 이동마다 보드가 90도 회전합니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * 루트 레이아웃 (서버 컴포넌트)
 * 전역 메타데이터 및 다크 테마 배경을 서버 사이드에서 렌더링합니다.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
