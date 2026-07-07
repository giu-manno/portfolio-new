"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

export default function About() {
  const { lang } = useLanguage();
  const ab = t.about;

  return (
    <section id="about" className="py-16 max-sm:py-12">
      <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          className="text-base font-[400] tracking-[0.12em] lowercase text-[#333333] mb-8"
          style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
        >
          {ab.label[lang]}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-16 max-sm:grid-cols-1 max-sm:gap-10">
          {/* Text + chips */}
          <div>
            <p
              className="text-body-lg leading-[1.8] text-[#555550] mb-4"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {ab.p1[lang]}
            </p>
            <p
              className="text-body-lg leading-[1.8] text-[#555550]"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {ab.p2[lang]}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {ab.chips.map((chip) => (
                <span
                  key={chip}
                  className="text-sm font-[400] text-p-ink bg-p-soft rounded-md px-3 py-[0.35rem] transition-all duration-200 hover:bg-p-border hover:-translate-y-0.5 cursor-default"
                  style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Side: education + also */}
          <div className="flex flex-col gap-8">
            {/* Education */}
            <div>
              <h4
                className="text-xs font-[400] tracking-[0.1em] uppercase text-p-muted mb-3"
                style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                {ab.eduTitle[lang]}
              </h4>
              {ab.edu.map((item, i) => (
                <div key={i} className="py-[0.9rem] border-b border-p-border first:border-t first:border-p-border">
                  <div
                    className="text-base font-[400] text-p-ink"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.name[lang]}
                  </div>
                  <div
                    className="flex justify-between text-sm text-p-muted mt-[0.2rem]"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    <span>{item.sub[lang]}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Also */}
            <div>
              <h4
                className="text-xs font-[400] tracking-[0.1em] uppercase text-p-muted mb-3"
                style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                {ab.alsoTitle[lang]}
              </h4>
              {ab.also.map((item, i) => (
                <div key={i} className="py-[0.9rem] border-b border-p-border first:border-t first:border-p-border">
                  <div
                    className="text-base font-[400] text-p-ink"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.name[lang]}
                  </div>
                  <div
                    className="flex justify-between text-sm text-p-muted mt-[0.2rem]"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    <span>{item.sub[lang]}</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
