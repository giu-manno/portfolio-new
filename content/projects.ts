import { palettes } from "./palettes";

export interface Project {
  title:     { en: string; pt: string };
  subtitle:  { en: string; pt: string };
  tagline:   { en: string; pt: string };
  year:      string;
  /** Internal route (e.g. "/work/ades") or absolute external URL (e.g. "https://…"). Omit for a non-linked placeholder card. */
  href?:     string;
  /** Cursor-chip label on hover. Defaults to "view case study"; use "view site" for external live sites. */
  ctaLabel?: string;
  gradient:  string;
  password?: string;
  image?:    string;
  /** Pop-out hover pair: pixel background + screen cutout. Overrides `image` when both set. */
  bg?:       string;
  screen?:   string;
  /** Second screen cutout — renders the staggered dual-phone pop layout. */
  screen2?:  string;
  /** Keywords for the hover marquee behind the lifted screen (pop cards only). */
  keywords?: string[];
}

// Add new case studies here. Order = display order on the homepage.
export const projects: Project[] = [
  {
    title:    { en: "Suite 4 Energy",             pt: "Suite 4 Energy" },
    subtitle: { en: "B2B SaaS · Product Designer", pt: "B2B SaaS · Product Designer" },
    tagline:  { en: "Creating an ETRM suite for the free energy market.", pt: "Criando uma suite de ETRM para o mercado livre de energia." },
    year:     "2024–25",
    href:     "/work/suite4energy",
    // Manually set — run `node scripts/extract-palette.mjs` once images are added
    gradient:  "linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)",
    image:     "/s4e-casestudy-images/s4e-homepage-cover.webp",
    bg:        "/homepages4e/s4e-pop-bg.svg",
    screen:    "/homepages4e/s4e-pop-screen.svg",
    keywords:  ["SaaS", "Product Design", "Design Systems", "B2B", "Energy Trading", "Data-heavy UI"],
    // password: "key",  // TODO: re-enable when password gate is ready
  },
  {
    title:    { en: "Ades",                              pt: "Ades" },
    subtitle: { en: "Research Lab · Product Designer",   pt: "Lab de Pesquisa · Product Designer" },
    tagline:  { en: "A new way of signing digital documents.", pt: "Uma nova forma de assinar documentos digitais." },
    year:     "2023",
    href:     "/work/ades",
    gradient:  `linear-gradient(135deg, ${palettes.ades.from} 0%, ${palettes.ades.to} 100%)`,
    image:     "/ades-casestudy-images/ades-homepage-card.webp",
    bg:        "/homepageades/ades-pop-bg.svg",
    screen:    "/homepageades/ades-pop-screen-1.svg",
    screen2:   "/homepageades/ades-pop-screen-2.svg",
    keywords:  ["Mobile App", "Product Design", "User Research", "Digital Signatures", "Prototyping"],
  },
  {
    title:    { en: "BAITA/CAFe 2.0",               pt: "BAITA/CAFe 2.0" },
    subtitle: { en: "Academic Federation · Product Designer", pt: "Federação Acadêmica · Product Designer" },
    tagline:  { en: "Remaking CAFe: the largest academic federation in LATAM.", pt: "Recriando o CAFe: a maior federação acadêmica da América Latina." },
    year:     "2025–2026",
    href:     "https://gt-baita.ifrs.edu.br/",
    ctaLabel: "view site",
    gradient:  "linear-gradient(135deg, #e5798f 0%, #b8536a 100%)",
    bg:        "/homepagenewprojects/pixel-gradient-pink.svg",
    screen:    "/homepagenewprojects/baita.svg",
    keywords:  ["WIP", "WIP", "WIP", "WIP", "WIP", "WIP"],
  },
  {
    title:    { en: "Spheric AI",                   pt: "Spheric AI" },
    subtitle: { en: "AI ATS · Product Designer",    pt: "ATS com IA · Product Designer" },
    tagline:  { en: "Refining the recruiter experience on an AI-powered ATS.", pt: "Refinando a experiência do recrutador em um ATS com IA." },
    year:     "2026",
    // Under NDA — no case study page. Hover pops the screen with an "under NDA"
    // marquee; the chip reads "contact me" and clicking opens mail, same as the
    // contact buttons.
    href:     "mailto:mannogiu@gmail.com",
    ctaLabel: "contact me to know more",
    gradient:  "linear-gradient(135deg, #b195d6 0%, #7a5ba8 100%)",
    bg:        "/homepagenewprojects/pixel-gradient-purple.svg",
    screen:    "/homepagenewprojects/spheric.svg",
    keywords:  ["under NDA", "under NDA", "under NDA", "under NDA", "under NDA", "under NDA"],
  },
];
