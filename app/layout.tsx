import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

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
    <html lang="en" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
