import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aprillivels — Official Fanbase of Bong Aprilli Paskah",
  description:
    "Aprillivels adalah fanbase resmi Bong Aprilli Paskah (Rilly), anggota JKT48 Generasi 13. Temukan jadwal teater, galeri, dan panduan hashtag komunitas.",
  keywords: ["Rilly JKT48", "Bong Aprilli Paskah", "JKT48 Gen 13", "Aprillivels fanbase"],
  openGraph: {
    title: "Aprillivels — Official Fanbase of Bong Aprilli Paskah",
    description: "Rumah dukungan untuk Rilly JKT48. Mari bersama mendukung perjalanan Bong Aprilli di JKT48.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
