import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "UniHub — UNIOESTE",
  description:
    "Plataforma acadêmica centralizada para alunos da UNIOESTE. Notas, eventos, recursos e assistente de IA em um só lugar.",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} bg-background h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
