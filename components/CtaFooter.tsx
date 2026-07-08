"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

// Sparse pixel star field for the CTA — echoes the hero's pixel sky at night
const STARS = [
  { left: "6%", top: "18%", size: 3, dur: "3.2s", delay: "0s" },
  { left: "13%", top: "62%", size: 2, dur: "2.5s", delay: "-1.1s" },
  { left: "22%", top: "34%", size: 3, dur: "3.8s", delay: "-2.2s" },
  { left: "31%", top: "78%", size: 2, dur: "2.9s", delay: "-0.6s" },
  { left: "43%", top: "12%", size: 2, dur: "3.5s", delay: "-1.8s" },
  { left: "57%", top: "24%", size: 3, dur: "2.7s", delay: "-0.3s" },
  { left: "66%", top: "70%", size: 2, dur: "3.1s", delay: "-2.6s" },
  { left: "74%", top: "40%", size: 3, dur: "2.4s", delay: "-1.4s" },
  { left: "85%", top: "16%", size: 2, dur: "3.6s", delay: "-0.9s" },
  { left: "92%", top: "58%", size: 3, dur: "2.8s", delay: "-2.0s" },
];

// Resting colors set per chip; hover falls through to the default accent fill
const chipEmailStyle = {
  "--chip-bg": "#ffffff",
  "--chip-ink": "var(--p-ink)",
  "--chip-border": "#ffffff",
} as React.CSSProperties;

const chipLinkedinStyle = {
  "--chip-bg": "transparent",
  "--chip-ink": "rgba(255,255,255,0.75)",
  "--chip-border": "rgba(255,255,255,0.2)",
} as React.CSSProperties;

export default function CtaFooter() {
  const { lang } = useLanguage();

  return (
    <div id="contact" className="bg-p-ink relative overflow-hidden">
      {/* Pixel stars */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className="pixel-sky-anim absolute pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: "#ece4bc",
            opacity: 0.5,
            animation: `pixelTwinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      <div className="relative z-[1] max-w-[1440px] mx-auto py-24 px-10 min-[1920px]:px-[88px] text-center flex flex-col items-center gap-6 max-sm:py-16 max-sm:px-6">
      <h2
        className="m-0 text-white max-w-[480px] font-normal italic leading-none"
        style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: "clamp(36px, 4.5vw, 56px)" }}
      >
        {t.cta.headline[lang]}
      </h2>

      <p
        className="text-body-lg text-white/45 max-w-[340px] leading-[1.7]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {t.cta.sub[lang]}
      </p>

      <div className="flex gap-3 mt-2 flex-wrap justify-center">
        <motion.a
          href="mailto:mannogiu@gmail.com"
          className="pixel-chip pixel-chip-lg"
          style={chipEmailStyle}
          whileHover={{ rotate: -3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          mannogiu@gmail.com
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/giulia-manno-88681a144/"
          target="_blank"
          rel="noopener noreferrer"
          className="pixel-chip pixel-chip-lg"
          style={chipLinkedinStyle}
          whileHover={{ rotate: -3, scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          LinkedIn
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </motion.a>
      </div>
      </div>
    </div>
  );
}
