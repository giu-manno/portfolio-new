import { palettes } from "./palettes";

export interface Project {
  title:     { en: string; pt: string };
  subtitle:  { en: string; pt: string };
  year:      string;
  href:      string;
  gradient:  string;
  password?: string;
  image?:    string;
  chipColor?: string;
}

// Add new case studies here. Order = display order on the homepage.
export const projects: Project[] = [
  {
    title:    { en: "Suite 4 Energy",             pt: "Suite 4 Energy" },
    subtitle: { en: "B2B SaaS · Product Designer", pt: "B2B SaaS · Product Designer" },
    year:     "2024–25",
    href:     "/work/suite4energy",
    // Manually set — run `node scripts/extract-palette.mjs` once images are added
    gradient:  "linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)",
    image:     "/s4e-casestudy-images/s4e-homepage-cover.webp",
    chipColor: "oklch(48.8% 0.243 264.376)",
    // password: "key",  // TODO: re-enable when password gate is ready
  },
  {
    title:    { en: "Ades",                              pt: "Ades" },
    subtitle: { en: "Research Lab · Product Designer",   pt: "Lab de Pesquisa · Product Designer" },
    year:     "2023",
    href:     "/work/ades",
    gradient:  `linear-gradient(135deg, ${palettes.ades.from} 0%, ${palettes.ades.to} 100%)`,
    image:     "/ades-casestudy-images/ades-homepage-card.webp",
    chipColor: "oklch(69.6% 0.17 162.48)",
  },
];
