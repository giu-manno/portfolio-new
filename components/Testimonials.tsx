"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { testimonials } from "@/content/testimonials";

const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";
const serifFont = "var(--font-instrument-serif), Georgia, serif";

/* ── Pixel flower garden ─────────────────────────────────────────────
   Decorative row below the testimonial card. Each flower is a tiny
   letter-grid rendered as SVG rects (crispEdges), like the nav flags. */

const STEM = { S: "#4e7d68", L: "#6fa083" };

const FLOWER_GRIDS = {
  tulip: [
    ".P.P.",
    "PPPPP",
    ".PPP.",
    "..S..",
    "..S.L",
    "L.SL.",
    "LLS..",
    "..S..",
  ],
  daisy: [
    "..W..",
    ".WYW.",
    "..W..",
    "..S..",
    "..SL.",
    ".LS..",
    "..S..",
  ],
  lavender: [
    ".B.",
    "BbB",
    "bBb",
    "BbB",
    ".b.",
    ".S.",
    "LS.",
    ".S.",
  ],
  sunflower: [
    ".YYY.",
    "YYDYY",
    ".YYY.",
    "..S..",
    "..S.L",
    ".LS..",
    "..S..",
  ],
  mini: [
    ".p.",
    "pcp",
    ".p.",
    ".S.",
    ".S.",
  ],
  bud: [
    ".B.",
    ".B.",
    ".S.",
    "LS.",
    ".S.",
  ],
} as const;

// The garden row: grid + petal colors + pixel cell size (px)
const GARDEN: { grid: readonly string[]; colors: Record<string, string>; cell: number }[] = [
  { grid: FLOWER_GRIDS.mini, colors: { ...STEM, p: "#d98ec4", c: "#f2c94c" }, cell: 5 },
  { grid: FLOWER_GRIDS.tulip, colors: { ...STEM, P: "#e5798f" }, cell: 6 },
  { grid: FLOWER_GRIDS.daisy, colors: { ...STEM, W: "#a5b8e8", Y: "#f2c94c" }, cell: 6 },
  { grid: FLOWER_GRIDS.bud, colors: { ...STEM, B: "#e0608a" }, cell: 5 },
  { grid: FLOWER_GRIDS.lavender, colors: { ...STEM, B: "#7d9bd9", b: "#a5b8e8" }, cell: 6 },
  { grid: FLOWER_GRIDS.sunflower, colors: { ...STEM, Y: "#f0c245", D: "#6b4a3a" }, cell: 6 },
  { grid: FLOWER_GRIDS.mini, colors: { ...STEM, p: "#f2a68c", c: "#e0608a" }, cell: 5 },
  { grid: FLOWER_GRIDS.tulip, colors: { ...STEM, P: "#b195d6" }, cell: 6 },
  { grid: FLOWER_GRIDS.daisy, colors: { ...STEM, W: "#f2b8c6", Y: "#f2c94c" }, cell: 6 },
  { grid: FLOWER_GRIDS.bud, colors: { ...STEM, B: "#7d9bd9" }, cell: 5 },
  { grid: FLOWER_GRIDS.mini, colors: { ...STEM, p: "#d98ec4", c: "#f2c94c" }, cell: 5 },
];

// One stamp flower per testimonial, cycled by card index
const STAMP_FLOWERS: { grid: readonly string[]; colors: Record<string, string> }[] = [
  { grid: FLOWER_GRIDS.tulip, colors: { ...STEM, P: "#e5798f" } },
  { grid: FLOWER_GRIDS.daisy, colors: { ...STEM, W: "#a5b8e8", Y: "#f2c94c" } },
  { grid: FLOWER_GRIDS.sunflower, colors: { ...STEM, Y: "#f0c245", D: "#6b4a3a" } },
  { grid: FLOWER_GRIDS.lavender, colors: { ...STEM, B: "#7d9bd9", b: "#a5b8e8" } },
];

function PixelFlower({
  grid,
  colors,
  cell,
  className,
}: {
  grid: readonly string[];
  colors: Record<string, string>;
  cell: number;
  className?: string;
}) {
  const h = grid.length;
  const w = grid[0].length;
  return (
    <svg
      width={w * cell}
      height={h * cell}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {grid.flatMap((row, y) =>
        [...row].map((ch, x) =>
          colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={colors[ch]} /> : null
        )
      )}
    </svg>
  );
}

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

  const n = testimonials.length;
  const current = testimonials[index];

  return (
    <section id="testimonials" className="py-16 max-sm:py-12">
      <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] max-sm:px-5">
        {/* Section label */}
        <div
          className="text-center text-base font-[400] tracking-[0.12em] lowercase text-[#333333] mb-8"
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

        <div className="flex items-center justify-center gap-14 max-sm:gap-3">
          <button
            onClick={() => setIndex((index - 1 + n) % n)}
            aria-label={t.testimonials.prev[lang]}
            className="bg-transparent border-none cursor-pointer p-2 text-p-ink transition-opacity duration-150 hover:opacity-60"
          >
            <PixelArrow direction="prev" />
          </button>

          <div className="relative w-[min(560px,70vw)] border-2 border-p-ink bg-[#fffefb] pt-7 px-[30px] pb-6 flex flex-col gap-[26px]">
            {/* Serrated stamp teeth on all four edges */}
            <div
              aria-hidden="true"
              className="absolute -top-[6px] left-0 right-0 h-[6px]"
              style={{ background: "repeating-linear-gradient(90deg, var(--p-ink) 0 6px, transparent 6px 14px)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-[6px] left-0 right-0 h-[6px]"
              style={{ background: "repeating-linear-gradient(90deg, var(--p-ink) 0 6px, transparent 6px 14px)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -left-[6px] top-0 bottom-0 w-[6px]"
              style={{ background: "repeating-linear-gradient(0deg, var(--p-ink) 0 6px, transparent 6px 14px)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -right-[6px] top-0 bottom-0 w-[6px]"
              style={{ background: "repeating-linear-gradient(0deg, var(--p-ink) 0 6px, transparent 6px 14px)" }}
            />

            <p className="m-0 text-[15px] leading-[1.55] text-p-ink">{current.quote}</p>
            <div className="flex items-center justify-between gap-[18px]">
              {/* Mini flower postage stamp — one flower per card */}
              <div aria-hidden="true" className="border border-dashed border-p-ink px-1.5 py-1">
                <PixelFlower {...STAMP_FLOWERS[index % STAMP_FLOWERS.length]} cell={3} />
              </div>
              <div className="text-right">
                <div className="italic text-[20px] text-p-ink" style={{ fontFamily: serifFont }}>
                  {current.name}
                </div>
                <div
                  className="text-xs text-p-muted mt-[0.15rem]"
                  style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                >
                  {current.role}
                </div>
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

        {/* Flower garden — each flower stretches up a little on hover */}
        <div className="mt-14 flex justify-center items-end gap-8 max-sm:gap-5 flex-wrap" aria-hidden="true">
          {GARDEN.map((f, i) => (
            <PixelFlower
              key={i}
              {...f}
              className="origin-bottom transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-y-[1.25]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
