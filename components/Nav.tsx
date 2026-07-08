"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import LanguageToggle from "@/components/LanguageToggle";
import TulipMark from "@/components/TulipMark";

const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";

export default function Nav() {
  const { lang } = useLanguage();
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
          <TulipMark />
          <span>giulia manno</span>
        </a>

        <div className="flex items-center gap-11 max-sm:gap-6">
          {[
            { href: "#work", label: t.nav.projects[lang] },
            { href: "#about", label: t.nav.aboutMe[lang] },
            { href: "#testimonials", label: t.nav.testimonials[lang] },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hidden min-[700px]:inline-block text-[15px] text-p-ink no-underline hover:underline underline-offset-4 decoration-2 decoration-[var(--p-accent)]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3">
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
