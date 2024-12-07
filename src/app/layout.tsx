import type { Metadata } from "next";
import "./globals.css";
import texts from "@/data/metadata.json";

export const metadata: Metadata = {
  title: texts.title,
  description: texts.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  );
}
