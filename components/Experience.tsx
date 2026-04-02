"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowDownToLine } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

function SectionLabel({ text }: { text: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center gap-[0.6rem] text-[0.72rem] font-[400] tracking-[0.12em] uppercase text-p-muted mb-8"
      style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
    >
      <span className={`section-label-line${visible ? " visible" : ""}`} />
      {text}
    </div>
  );
}

export default function Experience() {
  const { lang } = useLanguage();
  const exp = t.experience;
  const { ref: leftRef, visible: leftVis } = useReveal();
  const { ref: listRef, visible: listVis } = useReveal();

  return (
    <section id="experience" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5">
        <SectionLabel text={exp.label[lang]} />

        <div className="grid gap-16 max-sm:gap-8 max-sm:grid-cols-1 min-[640px]:[grid-template-columns:200px_1fr]">
          {/* Left */}
          <div
            ref={leftRef as React.RefObject<HTMLDivElement>}
            className={`reveal flex flex-col gap-4 max-sm:col-span-full ${leftVis ? "visible" : ""}`}
          >
            <p
              className="text-[0.85rem] text-p-muted leading-[1.7]"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {exp.blurb[lang]}
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Giulia Manno Lima - 2026 CV.pdf`}
              download
              className="self-start inline-flex items-center gap-2 text-[0.82rem] font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-all duration-150 bg-p-ink text-p-white border-p-ink hover:bg-[#333] hover:border-[#333]"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {exp.downloadCV[lang]}
              <ArrowDownToLine size={16} style={{ flexShrink: 0 }} />
            </a>
          </div>

          {/* Experience list */}
          <div
            ref={listRef as React.RefObject<HTMLDivElement>}
            className={`reveal flex flex-col ${listVis ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            {exp.items.map((item, i) => (
              <motion.div
                key={i}
                initial={false}
                whileHover="cardHover"
                className="exp-item relative grid gap-4 py-6 border-b border-p-border first:border-t first:border-p-border"
                style={{ gridTemplateColumns: "2.5rem 1fr auto" }}
              >
                {/* Accent bar */}
                <div className="exp-item-bar absolute left-[-1.5rem] top-0 bottom-0 w-[2px] bg-p-accent rounded-[2px]" />

                {/* Logo */}
                <motion.div
                  className="w-8 h-8 flex-shrink-0 mt-[0.1rem] overflow-hidden border border-p-border relative"
                  style={{ borderRadius: "8px", boxShadow: "0 1px 4px 0 rgba(0,0,0,0.07)" }}
                  variants={{ cardHover: { rotate: -6, y: -2 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${item.logoSrc}`} alt={item.company.en} fill className="object-cover" />
                </motion.div>

                {/* Body */}
                <div>
                  <div
                    className="text-[0.95rem] font-[400] tracking-[-0.01em] text-p-ink"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.company[lang]}
                  </div>
                  <div
                    className="text-[0.82rem] text-p-muted mt-[0.1rem]"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.role[lang]}
                  </div>
                  <p
                    className="text-[0.82rem] leading-[1.65] text-[#666662] mt-[0.6rem]"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.desc[lang]}
                  </p>
                </div>

                {/* Period */}
                <div
                  className="text-[0.75rem] text-p-muted whitespace-nowrap mt-[0.15rem] max-sm:hidden"
                  style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                >
                  {item.period[lang]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
