"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Switch } from "@/components/ui/switch";

const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";

// Pixel-art flags — emoji flags render inconsistently across platforms
function PixelFlag({ country }: { country: "br" | "us" }) {
  return country === "br" ? (
    <svg width="16" height="12" viewBox="0 0 15 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="15" height="11" fill="#3f8449" />
      <rect x="6" y="2" width="3" height="1" fill="#f2d94e" />
      <rect x="4" y="3" width="7" height="1" fill="#f2d94e" />
      <rect x="3" y="4" width="9" height="3" fill="#f2d94e" />
      <rect x="4" y="7" width="7" height="1" fill="#f2d94e" />
      <rect x="6" y="8" width="3" height="1" fill="#f2d94e" />
      <rect x="6" y="4" width="3" height="3" fill="#2b3260" />
    </svg>
  ) : (
    <svg width="16" height="12" viewBox="0 0 15 11" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="15" height="11" fill="#ffffff" />
      <rect y="0" width="15" height="1" fill="#c94a4a" />
      <rect y="2" width="15" height="1" fill="#c94a4a" />
      <rect y="4" width="15" height="1" fill="#c94a4a" />
      <rect y="6" width="15" height="1" fill="#c94a4a" />
      <rect y="8" width="15" height="1" fill="#c94a4a" />
      <rect y="10" width="15" height="1" fill="#c94a4a" />
      <rect width="7" height="5" fill="#2b3260" />
      <rect x="1" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="3" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="5" y="1" width="1" height="1" fill="#ffffff" />
      <rect x="2" y="3" width="1" height="1" fill="#ffffff" />
      <rect x="4" y="3" width="1" height="1" fill="#ffffff" />
    </svg>
  );
}

/** Pixel-flag PT/EN language switch used in both the homepage and case-study navs. */
export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 cursor-pointer select-none"
      style={{ fontFamily: pixelFont }}
      aria-label="Toggle language"
    >
      <span className={`text-sm flex items-center gap-1.5 transition-opacity duration-150 ${lang === "pt" ? "opacity-100" : "opacity-40"}`}>
        <PixelFlag country="br" /> <span>PT</span>
      </span>
      <Switch checked={lang === "pt"} className="lang-switch pointer-events-none" />
      <span className={`text-sm flex items-center gap-1.5 transition-opacity duration-150 ${lang === "en" ? "opacity-100" : "opacity-40"}`}>
        <span>EN</span> <PixelFlag country="us" />
      </span>
    </button>
  );
}
