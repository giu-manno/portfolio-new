"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

const WORD_KEYFRAMES = `
  @keyframes wordExit {
    0%   { opacity: 1; transform: translateY(0px);   filter: blur(0px); }
    100% { opacity: 0; transform: translateY(-14px); filter: blur(3px); }
  }
  @keyframes wordEnter {
    0%   { opacity: 0; transform: translateY(14px);  filter: blur(3px); }
    100% { opacity: 1; transform: translateY(0px);   filter: blur(0px); }
  }
`;

export default function CtaFooter() {
  const { lang } = useLanguage();
  const words = t.cta.words;
  const [index, setIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  const { ref: titleRef, visible: titleVis } = useReveal();
  const { ref: subRef, visible: subVis } = useReveal();
  const { ref: linksRef, visible: linksVis } = useReveal();

  // Inject keyframes via DOM — Tailwind v4 / Lightning CSS silently drops them from globals.css
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = WORD_KEYFRAMES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.en.length);
        setExiting(false);
      }, 340);
    }, 2200);
    return () => clearInterval(timer);
  }, [words.en.length]);

  return (
    <div id="contact" className="bg-p-ink">
      <div className="max-w-[1440px] mx-auto py-24 px-10 min-[900px]:px-[88px] text-center flex flex-col items-center gap-6 max-sm:py-16 max-sm:px-6">
      <p
        ref={titleRef as React.RefObject<HTMLParagraphElement>}
        className={`reveal text-white max-w-[480px] leading-[1.1] tracking-[-0.04em] ${titleVis ? "visible" : ""}`}
        style={{
          fontFamily: "var(--font-almarai), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
          fontWeight: 400,
        }}
      >
        {t.cta.pre[lang]}
        <br />
        <span
          key={index}
          style={{
            display: "inline-block",
            animation: exiting
              ? "wordExit 0.35s cubic-bezier(0.4,0,1,1) forwards"
              : "wordEnter 0.45s cubic-bezier(0,0,0.2,1) forwards",
          }}
        >
          {words[lang][index]}
        </span>
      </p>

      <p
        ref={subRef as React.RefObject<HTMLParagraphElement>}
        className={`reveal text-body-lg text-white/45 max-w-[340px] leading-[1.7] ${subVis ? "visible" : ""}`}
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif", transitionDelay: "0.1s" }}
      >
        {t.cta.sub[lang]}
      </p>

      <div
        ref={linksRef as React.RefObject<HTMLDivElement>}
        className={`reveal flex gap-3 mt-2 flex-wrap justify-center ${linksVis ? "visible" : ""}`}
        style={{ transitionDelay: "0.2s" }}
      >
        <motion.a
          href="mailto:mannogiu@gmail.com"
          className="inline-flex items-center gap-2 text-base font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-colors duration-150 bg-white text-p-ink border-white hover:bg-[#eee] hover:border-[#eee]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
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
          className="inline-flex items-center gap-2 text-base font-[400] px-[1.1rem] py-[0.6rem] rounded-full no-underline border-[1.5px] transition-colors duration-150 bg-transparent text-white/75 border-white/20 hover:bg-white/[0.08] hover:text-white hover:border-white/35"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
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
