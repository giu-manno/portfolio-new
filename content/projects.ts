import { palettes } from "./palettes";

export interface Project {
  title:     { en: string; pt: string };
  subtitle:  { en: string; pt: string };
  tagline:   { en: string; pt: string };
  year:      string;
  href:      string;
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
];
