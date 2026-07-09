"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { projects } from "@/content/projects";
import WorkCard from "./WorkCard";

export default function Work() {
  const { lang } = useLanguage();

  return (
    <section id="work" className="py-16 max-sm:py-12">
      <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          className="text-base font-[400] tracking-[0.12em] lowercase text-[#333333] mb-8"
          style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
        >
          {t.work.label[lang]}
        </div>

        {/* Stacked full-width cards; side by side once there's room for two */}
        <div className="grid grid-cols-1 gap-16 min-[1200px]:grid-cols-2">
          {projects.map((p, i) => (
            <WorkCard
              key={p.href ?? p.title.en}
              gradient={p.gradient}
              title={p.title[lang]}
              subtitle={p.subtitle[lang]}
              tagline={p.tagline[lang]}
              year={p.year}
              href={p.href}
              ctaLabel={p.ctaLabel}
              password={p.password}
              image={p.image}
              bg={p.bg}
              screen={p.screen}
              screen2={p.screen2}
              keywords={p.keywords}
              delay={(i + 1) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
