"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { projects } from "@/content/projects";
import WorkCard from "./WorkCard";

/** Split an array into chunks of size n. */
function chunk<T>(arr: T[], n: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += n) result.push(arr.slice(i, i + n));
  return result;
}

export default function Work() {
  const { lang } = useLanguage();
  const labelRef = useRef<HTMLDivElement>(null);
  const lineRef  = useRef<HTMLSpanElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLineVisible(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const groups = chunk(projects, 3);

  return (
    <section id="work" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          ref={labelRef}
          className="flex items-center gap-[0.6rem] text-xs font-[400] tracking-[0.12em] uppercase text-p-muted mb-8"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          <span ref={lineRef} className={`section-label-line${lineVisible ? " visible" : ""}`} />
          {t.work.label[lang]}
        </div>

        {/* Repeating grid — groups of 3: [tall, short, short] */}
        <div className="flex flex-col gap-4">
          {groups.map((group, gi) => {
            const baseDelay = gi * 3;

            // ── Full group of 3: tall left + 2 stacked right ──
            if (group.length === 3) {
              return (
                <div key={gi} className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                  <WorkCard
                    gradient={group[0].gradient}
                    tall
                    title={group[0].title[lang]}
                    subtitle={group[0].subtitle[lang]}
                    year={group[0].year}
                    href={group[0].href}
                    password={group[0].password}
                    image={group[0].image}
                    chipColor={group[0].chipColor}
                    delay={(baseDelay + 1) * 0.1}
                  />
                  <div className="flex flex-col gap-4">
                    <WorkCard
                      gradient={group[1].gradient}
                      title={group[1].title[lang]}
                      subtitle={group[1].subtitle[lang]}
                      year={group[1].year}
                      href={group[1].href}
                      password={group[1].password}
                      image={group[1].image}
                      chipColor={group[1].chipColor}
                      delay={(baseDelay + 2) * 0.1}
                    />
                    <WorkCard
                      gradient={group[2].gradient}
                      title={group[2].title[lang]}
                      subtitle={group[2].subtitle[lang]}
                      year={group[2].year}
                      href={group[2].href}
                      password={group[2].password}
                      image={group[2].image}
                      chipColor={group[2].chipColor}
                      delay={(baseDelay + 3) * 0.1}
                    />
                  </div>
                </div>
              );
            }

            // ── Remainder of 2: equal side by side ──
            if (group.length === 2) {
              return (
                <div key={gi} className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                  {group.map((p, i) => (
                    <WorkCard
                      key={p.href}
                      gradient={p.gradient}
                      title={p.title[lang]}
                      subtitle={p.subtitle[lang]}
                      year={p.year}
                      href={p.href}
                      password={p.password}
                      image={p.image}
                      chipColor={p.chipColor}
                      delay={(baseDelay + i + 1) * 0.1}
                    />
                  ))}
                </div>
              );
            }

            // ── Remainder of 1: full width ──
            return (
              <WorkCard
                key={group[0].href}
                gradient={group[0].gradient}
                title={group[0].title[lang]}
                subtitle={group[0].subtitle[lang]}
                year={group[0].year}
                href={group[0].href}
                password={group[0].password}
                image={group[0].image}
                chipColor={group[0].chipColor}
                delay={(baseDelay + 1) * 0.1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
