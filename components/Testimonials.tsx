"use client";

import { useState } from "react";
import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { testimonials } from "@/content/testimonials";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";
const serifFont = "var(--font-instrument-serif), Georgia, serif";

function PixelArrow({ direction }: { direction: "prev" | "next" }) {
  // Pixel-art chevrons from the design file, drawn as SVG rects
  return direction === "prev" ? (
    <svg width="22" height="30" viewBox="0 0 11 15" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="7" y="0" width="2" height="15" /><rect x="9" y="1" width="1" height="1" /><rect x="9" y="13" width="1" height="1" />
      <rect x="5" y="2" width="2" height="2" /><rect x="3" y="4" width="2" height="2" /><rect x="1" y="6" width="2" height="3" /><rect x="3" y="9" width="2" height="2" /><rect x="5" y="11" width="2" height="2" />
    </svg>
  ) : (
    <svg width="22" height="30" viewBox="0 0 11 15" fill="currentColor" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="0" width="2" height="15" /><rect x="1" y="1" width="1" height="1" /><rect x="1" y="13" width="1" height="1" />
      <rect x="4" y="2" width="2" height="2" /><rect x="6" y="4" width="2" height="2" /><rect x="8" y="6" width="2" height="3" /><rect x="6" y="9" width="2" height="2" /><rect x="4" y="11" width="2" height="2" />
    </svg>
  );
}

export default function Testimonials() {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  const { ref: bodyRef, visible: bodyVis } = useReveal();

  const n = testimonials.length;
  const current = testimonials[index];

  return (
    <section id="testimonials" className="py-20 border-t border-p-border max-sm:py-14">
      <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          className="text-center text-xs font-[400] tracking-[0.12em] lowercase text-[#333333] mb-8"
          style={{ fontFamily: pixelFont }}
        >
          {t.testimonials.label[lang]}
        </div>

        <h2
          className="m-0 mb-14 text-center font-normal italic leading-none text-p-ink"
          style={{ fontFamily: serifFont, fontSize: "clamp(36px, 4.5vw, 56px)" }}
        >
          {t.testimonials.headline[lang]}
        </h2>

        <div
          ref={bodyRef as React.RefObject<HTMLDivElement>}
          className={`reveal flex items-center justify-center gap-14 max-sm:gap-3 ${bodyVis ? "visible" : ""}`}
        >
          <button
            onClick={() => setIndex((index - 1 + n) % n)}
            aria-label={t.testimonials.prev[lang]}
            className="bg-transparent border-none cursor-pointer p-2 text-p-ink transition-opacity duration-150 hover:opacity-60"
          >
            <PixelArrow direction="prev" />
          </button>

          <div className="w-[min(560px,70vw)] border border-p-ink rounded-[14px] pt-7 px-[30px] pb-6 flex flex-col gap-[26px]">
            <p className="m-0 text-[15px] leading-[1.55] text-p-ink">{current.quote}</p>
            <div className="flex items-center gap-[18px]">
              <Image src={`${basePath}/pixel-icons/stamp.svg`} alt="" width={30} height={30} />
              <div className="flex-1 h-px bg-p-ink" />
              <div className="italic text-[20px] text-p-ink" style={{ fontFamily: serifFont }}>
                {current.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIndex((index + 1) % n)}
            aria-label={t.testimonials.next[lang]}
            className="bg-transparent border-none cursor-pointer p-2 text-p-ink transition-opacity duration-150 hover:opacity-60"
          >
            <PixelArrow direction="next" />
          </button>
        </div>
      </div>
    </section>
  );
}
