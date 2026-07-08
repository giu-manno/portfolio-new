import type { Metadata } from "next";

const DESCRIPTION =
  "Case study: unifying Norus's fragmented suite of enterprise energy (ETRM) products into a single coherent platform — information architecture, a nested navigation system, wireframes, and an MUI-based design system. Role: Product Designer & UI Lead (2024–2025).";

export const metadata: Metadata = {
  title: "Suite 4 Energy — Enterprise Energy Platform Case Study",
  description: DESCRIPTION,
  alternates: { canonical: "/work/suite4energy" },
  openGraph: {
    type: "article",
    url: "/work/suite4energy",
    title: "Suite 4 Energy — Case Study",
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Suite 4 Energy",
  headline: "Suite 4 Energy — Enterprise Energy Platform Case Study",
  description: DESCRIPTION,
  url: "https://giu-manno.github.io/portfolio-new/work/suite4energy",
  author: { "@type": "Person", name: "Giulia Manno" },
  creator: { "@type": "Person", name: "Giulia Manno" },
  about: ["Product Design", "Information Architecture", "Design Systems", "Enterprise Software", "Energy Trading"],
  keywords: "product design, information architecture, navigation system, design system, MUI, ETRM, enterprise SaaS",
  dateCreated: "2024",
};

export default function Suite4EnergyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
