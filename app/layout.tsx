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

const SITE_URL = "https://giu-manno.github.io/portfolio-new";
const DESCRIPTION =
  "Product Designer based in Florianópolis, Brazil — 4+ years of experience in SaaS, Enterprise/B2B, design systems, and product discovery. Case studies: Suite 4 Energy (enterprise ETRM platform) and Ades (digital signature app).";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Giulia Manno — Product Designer",
    template: "%s — Giulia Manno",
  },
  description: DESCRIPTION,
  keywords: [
    "Giulia Manno",
    "Product Designer",
    "UX Designer",
    "Design Systems",
    "Product Discovery",
    "User Research",
    "SaaS",
    "B2B",
    "Florianópolis",
    "Brazil",
    "portfolio",
  ],
  authors: [{ name: "Giulia Manno" }],
  creator: "Giulia Manno",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Giulia Manno — Product Designer",
    title: "Giulia Manno — Product Designer",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Giulia Manno — Product Designer",
    description: DESCRIPTION,
  },
};

// Person schema — lets AI assistants extract who Giulia is and what she does
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Giulia Manno",
  jobTitle: "Product Designer",
  description: DESCRIPTION,
  url: SITE_URL,
  email: "mannogiu@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Florianópolis",
    addressCountry: "Brazil",
  },
  sameAs: ["https://www.linkedin.com/in/giulia-manno-88681a144/"],
  knowsAbout: [
    "Product Design",
    "Design Systems",
    "Product Discovery",
    "User Research",
    "Accessibility",
    "WCAG 2.1",
    "Figma",
    "SaaS",
    "Enterprise/B2B",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${instrumentSerif.variable} ${geistPixel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LanguageProvider>
          <div style={{ overflowX: "clip" }}>{children}</div>
        </LanguageProvider>
      </body>
    </html>
  );
}
