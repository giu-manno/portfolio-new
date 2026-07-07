"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { projects } from "@/content/projects";
import WorkCard from "./WorkCard";

export default function Work() {
  const { lang } = useLanguage();

  return (
    <section id="work" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          className="text-base font-[400] tracking-[0.12em] lowercase text-[#333333] mb-8"
          style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
        >
          {t.work.label[lang]}
        </div>

        {/* Stacked full-width cards, one per project */}
        <div className="flex flex-col gap-10">
          {projects.map((p, i) => (
            <WorkCard
              key={p.href}
              gradient={p.gradient}
              title={p.title[lang]}
              subtitle={p.subtitle[lang]}
              tagline={p.tagline[lang]}
              year={p.year}
              href={p.href}
              password={p.password}
              image={p.image}
              bg={p.bg}
              screen={p.screen}
              keywords={p.keywords}
              delay={(i + 1) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
