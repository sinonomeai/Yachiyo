import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
const PressStartFont = localFont({
  src: [{ path: "../public/font/PressStart2P.ttf", weight: "400" }],
  variable: "--font-press-start",
});
export const metadata: Metadata = {
  title: "Yachiyo",
  description: "Yachiyo天下第一",
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${PressStartFont.variable}`}>
        <Providers>{children}</Providers>
        <Script
          src="/iconfont/iconfont.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
