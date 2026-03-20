import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const almarai = Almarai({
  variable: "--font-almarai",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Giulia Manno — Product Designer",
  description:
    "Product Designer based in Florianópolis, Brazil — 4+ years of experience in SaaS, B2B, design systems, and discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${almarai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
