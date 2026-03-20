"use client";

import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import WorkCard from "./WorkCard";

const gradients = [
  "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
  "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #11023d 100%)",
];

export default function Work() {
  const { lang } = useLanguage();
  const labelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
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

  const cards = t.work.cards;

  return (
    <section id="work" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          ref={labelRef}
          className="flex items-center gap-[0.6rem] text-[0.72rem] font-[400] tracking-[0.12em] uppercase text-p-muted mb-8"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          <span
            ref={lineRef}
            className={`section-label-line${lineVisible ? " visible" : ""}`}
          />
          {t.work.label[lang]}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          {/* Tall card — left */}
          <WorkCard
            gradient={gradients[0]}
            tall
            title={cards[0].title[lang]}
            subtitle={cards[0].subtitle[lang]}
            year={cards[0].year}
            delay={0.1}
          />

          {/* Right column — two stacked */}
          <div className="flex flex-col gap-4">
            <WorkCard
              gradient={gradients[1]}
              title={cards[1].title[lang]}
              subtitle={cards[1].subtitle[lang]}
              year={cards[1].year}
              delay={0.2}
            />
            <WorkCard
              gradient={gradients[2]}
              title={cards[2].title[lang]}
              subtitle={cards[2].subtitle[lang]}
              year={cards[2].year}
              delay={0.3}
              href="/work/ades"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
