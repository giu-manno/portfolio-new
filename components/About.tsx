"use client";

import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

export default function About() {
  const { lang } = useLanguage();
  const ab = t.about;
  const { ref: labelRef, visible: labelVis } = useReveal();
  const { ref: textRef, visible: textVis } = useReveal();
  const { ref: sideRef, visible: sideVis } = useReveal();

  return (
    <section id="about" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          ref={labelRef as React.RefObject<HTMLDivElement>}
          className="flex items-center gap-[0.6rem] text-[0.72rem] font-[400] tracking-[0.12em] uppercase text-p-muted mb-8"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          <span className={`section-label-line${labelVis ? " visible" : ""}`} />
          {ab.label[lang]}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-16 max-sm:grid-cols-1 max-sm:gap-10">
          {/* Text + chips */}
          <div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className={`reveal ${textVis ? "visible" : ""}`}
          >
            <p
              className="text-[0.97rem] leading-[1.8] text-[#555550] mb-4"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {ab.p1[lang]}
            </p>
            <p
              className="text-[0.97rem] leading-[1.8] text-[#555550]"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {ab.p2[lang]}
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {ab.chips.map((chip) => (
                <span
                  key={chip}
                  className="text-[0.78rem] font-[400] text-p-ink bg-p-soft rounded-full px-3 py-[0.35rem] border border-p-border transition-all duration-200 hover:bg-p-border hover:-translate-y-0.5 cursor-default"
                  style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Side: education + also */}
          <div
            ref={sideRef as React.RefObject<HTMLDivElement>}
            className={`reveal flex flex-col gap-8 ${sideVis ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            {/* Education */}
            <div>
              <h4
                className="text-[0.72rem] font-[400] tracking-[0.1em] uppercase text-p-muted mb-3"
                style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                {ab.eduTitle[lang]}
              </h4>
              {ab.edu.map((item, i) => (
                <div key={i} className="py-[0.9rem] border-b border-p-border first:border-t first:border-p-border">
                  <div
                    className="text-[0.88rem] font-[400] text-p-ink"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.name[lang]}
                  </div>
                  <div
                    className="flex justify-between text-[0.78rem] text-p-muted mt-[0.2rem]"
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
                className="text-[0.72rem] font-[400] tracking-[0.1em] uppercase text-p-muted mb-3"
                style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                {ab.alsoTitle[lang]}
              </h4>
              {ab.also.map((item, i) => (
                <div key={i} className="py-[0.9rem] border-b border-p-border first:border-t first:border-p-border">
                  <div
                    className="text-[0.88rem] font-[400] text-p-ink"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.name[lang]}
                  </div>
                  <div
                    className="flex justify-between text-[0.78rem] text-p-muted mt-[0.2rem]"
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
