"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { Switch } from "@/components/ui/switch";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";

// Pixel-art flags — emoji flags render inconsistently across platforms
function PixelFlag({ country }: { country: "br" | "us" }) {
  return country === "br" ? (
    <svg width="16" height="12" viewBox="0 0 15 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="15" height="11" fill="#3f8449" />
      <rect x="6" y="2" width="3" height="1" fill="#f2d94e" />
      <rect x="4" y="3" width="7" height="1" fill="#f2d94e" />
      <rect x="3" y="4" width="9" height="3" fill="#f2d94e" />
      <rect x="4" y="7" width="7" height="1" fill="#f2d94e" />
      <rect x="6" y="8" width="3" height="1" fill="#f2d94e" />
      <rect x="6" y="4" width="3" height="3" fill="#2b3260" />
    </svg>
  ) : (
    <svg width="16" height="12" viewBox="0 0 15 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="15" height="11" fill="#ffffff" />
      <rect y="0" width="15" height="1" fill="#c94a4a" />
      <rect y="2" width="15" height="1" fill="#c94a4a" />
      <rect y="4" width="15" height="1" fill="#c94a4a" />
      <rect y="6" width="15" height="1" fill="#c94a4a" />
      <rect y="8" width="15" height="1" fill="#c94a4a" />
      <rect y="10" width="15" height="1" fill="#c94a4a" />
      <rect width="7" height="5" fill="#2b3260" />
      <rect x="1" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="3" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="5" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="2" y="3" width="1" height="1" fill="#ffffff" />
      <rect x="4" y="3" width="1" height="1" fill="#ffffff" />
    </svg>
  );
}

export default function Nav() {
  const { lang, toggle } = useLanguage();
  return (
    <nav className="sticky top-0 z-50 bg-p-bg/[0.88] backdrop-blur-md border-b border-p-border">
      <div
        className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] max-sm:px-5 h-14 grid items-center"
        style={{ gridTemplateColumns: "1fr auto 1fr", fontFamily: pixelFont }}
      >
        <a
          href="#"
          className="flex items-center gap-2.5 text-[15px] text-p-ink no-underline justify-self-start"
        >
          <Image src={`${basePath}/pixel-icons/flower.svg`} alt="" width={22} height={22} priority />
          <span>giulia manno</span>
        </a>

        <div className="flex items-center gap-11">
          {[
            { href: "#work", icon: "arcade", label: t.nav.projects[lang] },
            { href: "#about", icon: "notepad", label: t.nav.aboutMe[lang] },
            { href: "#testimonials", icon: "tv", label: t.nav.testimonials[lang] },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="hidden min-[900px]:flex items-center gap-2.5 text-[15px] text-p-ink no-underline hover:underline underline-offset-4 decoration-2 decoration-[var(--p-accent)]"
            >
              <Image src={`${basePath}/pixel-icons/${icon}.svg`} alt="" width={22} height={22} priority />
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-2 cursor-pointer select-none"
            aria-label="Toggle language"
          >
            <span className={`text-sm flex items-center gap-1.5 transition-opacity duration-150 ${lang === "pt" ? "opacity-100" : "opacity-40"}`}>
              <PixelFlag country="br" /> <span>PT</span>
            </span>
            <Switch checked={lang === "pt"} className="pointer-events-none" />
            <span className={`text-sm flex items-center gap-1.5 transition-opacity duration-150 ${lang === "en" ? "opacity-100" : "opacity-40"}`}>
              <span>EN</span> <PixelFlag country="us" />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
