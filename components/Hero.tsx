"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

export default function Hero() {
  const { lang } = useLanguage();

  return (
    <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] pt-24 pb-20 max-sm:px-5 max-sm:pt-14 max-sm:pb-12">
      {/* Headline — CSS fade-up on mount */}
      <div
        className="hero-item hero-item-1 text-p-ink flex flex-wrap items-center justify-center gap-[0.25em]"
        style={{
          fontFamily: "var(--font-almarai), system-ui, sans-serif",
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
        }}
      >
        <span>{t.hero.greeting[lang]}</span>

        {/* Avatar circle — Framer Motion hover only */}
        <motion.div
          className="inline-flex items-center justify-center overflow-hidden bg-p-soft border-2 border-p-border flex-shrink-0 relative"
          style={{
            width: "clamp(2.8rem, 5.5vw, 4.4rem)",
            height: "clamp(2.8rem, 5.5vw, 4.4rem)",
            top: "0.04em",
            borderRadius: "14px",
          }}
          whileHover={{ rotate: -6, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Profile Image Container.png`}
            alt="Giulia Manno"
            fill
            className="object-cover"
          />
        </motion.div>

        <span className="transition-colors duration-300 hover:text-[var(--p-accent)] cursor-default">Giulia.</span>
      </div>

      {/* Description */}
      <div className="hero-item hero-item-2 mt-8 flex justify-center">
        <p
          className="text-body-lg leading-[1.6] text-[#555550] max-w-[500px] font-[300] text-center"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {t.hero.desc[lang]}
        </p>
      </div>

      {/* CTAs */}
      <div className="hero-item hero-item-3 mt-10 flex gap-3 flex-wrap justify-center">
        <motion.a
          href="mailto:mannogiu@gmail.com"
          className="inline-flex items-center gap-2 text-base font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-colors duration-150 bg-p-ink text-p-white border-p-ink hover:bg-[#333] hover:border-[#333]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          whileHover={{ rotate: 3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {t.hero.contact[lang]}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/giulia-manno-88681a144/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-colors duration-150 bg-transparent text-p-ink border-p-border hover:bg-p-soft hover:border-p-soft"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          whileHover={{ rotate: 3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          LinkedIn
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </motion.a>
        <motion.a
          href="#work"
          className="inline-flex items-center gap-2 text-base font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-colors duration-150 bg-transparent text-p-ink border-p-border hover:bg-p-soft hover:border-p-soft"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          whileHover={{ rotate: 3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {t.hero.seeWork[lang]}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.a>
      </div>
    </div>
  );
}
