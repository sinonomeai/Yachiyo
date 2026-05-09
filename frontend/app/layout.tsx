import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="zh-CN">
      <body
        className={`${pixelFont.variable} ${PressStartFont.variable} ${UpheavalFont.variable}`}>
        {children}
        <Script src="/iconfont/iconfont.js" />
      </body>
    </html>
  );
}
