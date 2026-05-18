import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
const pixelFont = localFont({
  src: [
    { path: "../public/font/Pixel Digivolve.otf", weight: "400" },
    { path: "../public/font/Pixel Digivolve Italic.otf", weight: "400", style: "italic" },
  ],
  variable: "--font-pixel",
});
const PressStartFont = localFont({
  src: [{ path: "../public/font/PressStart2P.ttf", weight: "400" }],
  variable: "--font-press-start",
});
const UpheavalFont = localFont({
  src: [{ path: "../public/font/upheavtt.ttf", weight: "400" },],
  variable: "--font-upheaval",
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
      <head>
        <link rel="preload" href="/iconfont/iconfont.js" as="script" />
      </head>
      <body className={`${pixelFont.variable} ${PressStartFont.variable} ${UpheavalFont.variable}`}>
        <Providers>
          {children}
        </Providers>
        <Script src="/iconfont/iconfont.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
