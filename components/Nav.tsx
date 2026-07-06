"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { Switch } from "@/components/ui/switch";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";

export default function Nav() {
  const { lang, toggle } = useLanguage();
  return (
    <nav className="sticky top-0 z-50 bg-p-bg/[0.88] backdrop-blur-md border-b border-p-border">
      <div
        className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 h-14 grid items-center"
        style={{ gridTemplateColumns: "1fr auto 1fr", fontFamily: pixelFont }}
      >
        <a
          href="#"
          className="flex items-center gap-2.5 text-[15px] text-p-ink no-underline justify-self-start"
        >
          <Image src={`${basePath}/pixel-icons/flower.svg`} alt="" width={22} height={22} priority />
          <span>giulia manno</span>
        </a>

        <div className="flex items-center gap-11 max-[900px]:gap-6">
          {[
            { href: "#work", icon: "arcade", label: t.nav.projects[lang] },
            { href: "#about", icon: "notepad", label: t.nav.aboutMe[lang] },
            { href: "#testimonials", icon: "tv", label: t.nav.testimonials[lang] },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="hidden sm:flex items-center gap-2.5 text-[15px] text-p-ink no-underline transition-opacity duration-150 hover:opacity-60"
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
            <span className={`text-sm flex items-center gap-1 transition-opacity duration-150 ${lang === "pt" ? "opacity-100" : "opacity-40"}`}>
              🇧🇷 <span>PT</span>
            </span>
            <Switch checked={lang === "pt"} className="pointer-events-none" />
            <span className={`text-sm flex items-center gap-1 transition-opacity duration-150 ${lang === "en" ? "opacity-100" : "opacity-40"}`}>
              <span>EN</span> 🇺🇸
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
