import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});

const geistPixel = localFont({
  src: "./fonts/GeistPixel-Variable.ttf",
  variable: "--font-geist-pixel",
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
    <html lang="en" className={`${GeistSans.variable} ${instrumentSerif.variable} ${geistPixel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          <div style={{ overflowX: "clip" }}>{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
