"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";

export default function Footer() {
  const { lang } = useLanguage();
  return (
    <footer className="bg-p-ink border-t border-white/[0.08]">
      <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] py-5 flex justify-between items-center max-sm:flex-col max-sm:gap-[0.4rem] max-sm:text-center max-sm:px-5 max-sm:py-4">
      <p
        className="text-xs text-white/30"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {t.footer.copy[lang]}
      </p>
      <p
        className="text-xs text-white/30"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        <a
          href="https://www.streamlinehq.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline text-white/30 hover:text-white/60 hover:underline underline-offset-4 transition-colors duration-150"
        >
          {t.footer.credit[lang]}
        </a>
      </p>
      <p
        className="text-xs text-white/30"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {t.footer.tagline[lang]}
      </p>
      </div>
    </footer>
  );
}
