import type { Metadata } from "next";
import { Noto_Sans_Lao } from "next/font/google";
import "./globals.css";

const notoSansLao = Noto_Sans_Lao({
  subsets: ["lao"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-lao",
});

export const metadata: Metadata = {
  title: "Fitness Management System",
  description: "Micro Fitness POS & Member Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lo" className={`${notoSansLao.variable}`}>
      <body className="font-sans antialiased bg-[#09090B] text-zinc-100">
        {children}
      </body>
    </html>
  );
}