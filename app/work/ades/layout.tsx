import type { Metadata } from "next";

const DESCRIPTION =
  "Case study: designing Ades, a free public digital signature platform, from research to high-fidelity prototype — accessible, easy to use, and built at LabSEC/UFSC. Included user research, usability testing, navigation redesign, and a pattern library. Role: Product Designer & Lead Researcher (Jul–Dec 2023).";

export const metadata: Metadata = {
  title: "Ades — Digital Signature Platform Case Study",
  description: DESCRIPTION,
  alternates: { canonical: "/work/ades" },
  openGraph: {
    type: "article",
    url: "/work/ades",
    title: "Ades — Case Study",
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Ades — Digital Signature Platform",
  headline: "Ades — Digital Signature Platform Case Study",
  description: DESCRIPTION,
  url: "https://giu-manno.github.io/portfolio-new/work/ades",
  author: { "@type": "Person", name: "Giulia Manno" },
  creator: { "@type": "Person", name: "Giulia Manno" },
  about: ["Product Design", "User Research", "Usability Testing", "Mobile App Design", "Digital Signatures", "Accessibility"],
  keywords: "product design, user research, usability testing, mobile app, digital signatures, prototyping, accessibility",
  dateCreated: "2023",
};

export default function AdesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
