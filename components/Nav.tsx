"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { Switch } from "@/components/ui/switch";

export default function Nav() {
  const { lang, toggle } = useLanguage();
  return (
    <nav className="sticky top-0 z-50 bg-p-bg/[0.88] backdrop-blur-md border-b border-p-border">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 h-14 grid items-center" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
        <a
          href="#"
          className="text-base tracking-[-0.02em] text-p-ink no-underline font-[400]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          giulia manno
        </a>

        <div className="flex items-center gap-1">
          {[
            { href: "#work",       label: t.nav.work[lang] },
            { href: "#experience", label: t.nav.experience[lang] },
            { href: "#about",      label: t.nav.about[lang] },
            { href: "#contact",    label: t.hero.contact[lang] },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hidden sm:block relative text-base text-p-muted px-3 py-[0.4rem] rounded-full transition-colors duration-200 hover:text-p-ink nav-link-underline"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-2 cursor-pointer select-none"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
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
