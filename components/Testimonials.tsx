"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion, type PanInfo, type Transition } from "framer-motion";
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

// One stamp flower per testimonial, cycled by card index; `tint` fills the
// stamp's inner panel behind the flower
const STAMP_FLOWERS: { grid: readonly string[]; colors: Record<string, string>; tint: string }[] = [
  { grid: FLOWER_GRIDS.tulip, colors: { ...STEM, P: "#e5798f" }, tint: "#fbe3e8" },
  { grid: FLOWER_GRIDS.daisy, colors: { ...STEM, W: "#a5b8e8", Y: "#f2c94c" }, tint: "#e6ecfa" },
  { grid: FLOWER_GRIDS.sunflower, colors: { ...STEM, Y: "#f0c245", D: "#6b4a3a" }, tint: "#fbf0cf" },
  { grid: FLOWER_GRIDS.lavender, colors: { ...STEM, B: "#7d9bd9", b: "#a5b8e8" }, tint: "#e8e4f6" },
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

/* ── Pixel postage stamp ─────────────────────────────────────────────
   Drawn on the same cell grid as the flowers: warm stamp paper with a
   perforated edge (every other edge cell notched out), a tinted inner
   panel with the flower centered in it, and a one-cell drop shadow. */

const STAMP_W = 13; // cells; odd so the perforation starts and ends notched
const STAMP_H = 15;
const STAMP_PAPER = "#f1ece0";
const STAMP_SHADOW = "rgba(17, 17, 16, 0.14)";

function isStampPaper(x: number, y: number) {
  if (x < 0 || y < 0 || x >= STAMP_W || y >= STAMP_H) return false;
  const onEdgeX = x === 0 || x === STAMP_W - 1;
  const onEdgeY = y === 0 || y === STAMP_H - 1;
  if (onEdgeX && onEdgeY) return false; // corners are notched
  if (onEdgeY) return x % 2 === 1; // top/bottom perforation
  if (onEdgeX) return y % 2 === 1; // left/right perforation
  return true;
}

function PixelStamp({
  grid,
  colors,
  tint,
  cell,
}: {
  grid: readonly string[];
  colors: Record<string, string>;
  tint: string;
  cell: number;
}) {
  // Inner panel leaves a one-cell paper margin inside the perforation
  const panel = { x: 2, y: 2, w: STAMP_W - 4, h: STAMP_H - 4 };
  const fw = grid[0].length;
  const fh = grid.length;
  const ox = panel.x + Math.floor((panel.w - fw) / 2);
  const oy = panel.y + Math.ceil((panel.h - fh) / 2);

  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < STAMP_H; y++) for (let x = 0; x < STAMP_W; x++) if (isStampPaper(x, y)) cells.push({ x, y });

  return (
    <svg
      width={(STAMP_W + 1) * cell}
      height={(STAMP_H + 1) * cell}
      viewBox={`0 0 ${STAMP_W + 1} ${STAMP_H + 1}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {cells.map(({ x, y }) => (
        <rect key={`s${x}-${y}`} x={x + 1} y={y + 1} width={1} height={1} fill={STAMP_SHADOW} />
      ))}
      {cells.map(({ x, y }) => (
        <rect key={`p${x}-${y}`} x={x} y={y} width={1} height={1} fill={STAMP_PAPER} />
      ))}
      <rect x={panel.x} y={panel.y} width={panel.w} height={panel.h} fill={tint} />
      {grid.flatMap((row, y) =>
        [...row].map((ch, x) =>
          colors[ch] ? <rect key={`f${x}-${y}`} x={ox + x} y={oy + y} width={1} height={1} fill={colors[ch]} /> : null
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

/* ── Postcard pile ───────────────────────────────────────────────────
   Every testimonial is rendered as a postcard, all stacked in one grid
   cell so the pile is always as tall as the longest quote (no layout jump
   when paging). The top card sits straight (keeps the pixel stamp crisp);
   the ones behind are offset and tilted. "Next" shuffles the top card to the
   back: in one continuous arc it slides out left, tucks under the pile at
   the turnaround, and swings back in at the bottom. "Prev" is the reverse:
   the bottom card swings out from under the pile and is laid on top. On
   touch, the top card can be swiped (left = next, right = prev). Hovering
   the pile lifts the top card and spreads the rest. */

type Pose = { x: number; y: number; rotate: number };

// Resting pose by depth in the pile (0 = top), and the fanned hover pose.
// Cards deeper than the last entry sit exactly behind it, out of sight.
const PILE: Pose[] = [
  { x: 0, y: 0, rotate: 0 },
  { x: 6, y: 8, rotate: 2.5 },
  { x: -6, y: 14, rotate: -3 },
];
const PILE_HOVER: Pose[] = [
  { x: 0, y: -4, rotate: 0 },
  { x: 12, y: 8, rotate: 3.5 },
  { x: -12, y: 14, rotate: -4.5 },
];

// The shuffle arc's turnaround point: how far out (fraction of card width),
// how high it lifts, and how much it tilts there
const SHUFFLE_OUT = 0.62;
const SHUFFLE_LIFT = -12;
const SHUFFLE_TILT = -6;
const SWIPE_DISTANCE = 80; // px of drag, or…
const SWIPE_VELOCITY = 500; // …px/s of flick, to count as a swipe

// One tween for the whole shuffle. The turnaround sits at TURN of the way
// through: ease out into it, ease back in-out from it, so the card slows into
// the far point and swings straight back instead of stopping dead. The card
// swaps above/below the pile at the turnaround (`flipped`, set on a timer —
// framer ignores per-value keyframe timing for zIndex).
const SHUFFLE_DURATION = 0.65;
const TURN = 0.42;
const SHUFFLE_TRANSITION: Transition = {
  duration: SHUFFLE_DURATION,
  times: [0, TURN, 1],
  ease: [
    [0.3, 0.6, 0.4, 1],
    [0.45, 0, 0.2, 1],
  ],
};
const PILE_SPRING = { type: "spring", stiffness: 260, damping: 26 } as const;
const INSTANT = { duration: 0 } as const;

type Shuffle = { id: number; to: "back" | "top"; flipped: boolean };

// Swipe is touch-only: on desktop, dragging would fight text selection
const COARSE_POINTER = "(pointer: coarse)";
const isCoarsePointer = () => window.matchMedia(COARSE_POINTER).matches;
function subscribeCoarsePointer(onChange: () => void) {
  const mq = window.matchMedia(COARSE_POINTER);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function Postcard({ quote, name, role, stampIndex }: { quote: string; name: string; role: string; stampIndex: number }) {
  return (
    <div className="h-full border-2 border-p-ink bg-[#fffefb] pt-7 px-[30px] pb-6 flex flex-col justify-between gap-[26px]">
      <p className="m-0 text-[15px] leading-[1.55] text-p-ink">{quote}</p>
      <div className="flex items-center justify-between gap-[18px]">
        {/* Flower postage stamp — one flower per card */}
        <PixelStamp {...STAMP_FLOWERS[stampIndex % STAMP_FLOWERS.length]} cell={3} />
        <div className="text-right">
          <div className="italic text-[20px] text-p-ink" style={{ fontFamily: serifFont }}>
            {name}
          </div>
          <div
            className="text-xs text-p-muted mt-[0.15rem]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { lang } = useLanguage();
  const [index, setIndex] = useState(0);
  // The card currently shuffling to the back of the pile, or onto the top
  const [shuffle, setShuffle] = useState<Shuffle | null>(null);
  const [hovered, setHovered] = useState(false);
  const isTouch = useSyncExternalStore(subscribeCoarsePointer, isCoarsePointer, () => false);
  const [cardWidth, setCardWidth] = useState(560);
  const reduceMotion = useReducedMotion();
  const pileRef = useRef<HTMLDivElement>(null);

  const n = testimonials.length;
  const current = testimonials[index];

  useEffect(() => {
    const pile = pileRef.current;
    if (!pile) return;
    const ro = new ResizeObserver(() => setCardWidth(pile.offsetWidth));
    ro.observe(pile);
    return () => ro.disconnect();
  }, []);

  function next() {
    setShuffle({ id: index, to: "back", flipped: false });
    setIndex((index + 1) % n);
  }
  function prev() {
    const p = (index - 1 + n) % n;
    setShuffle({ id: p, to: "top", flipped: false });
    setIndex(p);
  }

  // Swap the shuffling card above/below the pile at the arc's turnaround
  const shuffleId = shuffle?.id;
  useEffect(() => {
    if (shuffleId === undefined) return;
    const timer = setTimeout(
      () => setShuffle((s) => (s && s.id === shuffleId ? { ...s, flipped: true } : s)),
      SHUFFLE_DURATION * TURN * 1000
    );
    return () => clearTimeout(timer);
  }, [shuffleId, shuffle?.to]); // restart for each new shuffle

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) next();
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) prev();
  }

  function poseFor(i: number) {
    const depth = (i - index + n) % n;
    const pile = hovered ? PILE_HOVER : PILE;
    const resting = pile[Math.min(depth, pile.length - 1)];

    if (shuffle?.id === i && !reduceMotion) {
      // Lands on the plain (non-hover) pose so a hover change mid-shuffle
      // doesn't restart the arc; it settles into the hover pose afterwards
      const end = PILE[Math.min(depth, PILE.length - 1)];
      const aboveFirst = shuffle.to === "back";
      return {
        animate: {
          // null = start from wherever the card is now (e.g. mid-swipe)
          x: [null, -cardWidth * SHUFFLE_OUT, end.x],
          y: [null, SHUFFLE_LIFT, end.y],
          rotate: [null, SHUFFLE_TILT, end.rotate],
        },
        transition: SHUFFLE_TRANSITION,
        z: aboveFirst !== shuffle.flipped ? n + 1 : 0,
      };
    }
    return { animate: resting, transition: reduceMotion ? INSTANT : PILE_SPRING, z: n - depth };
  }

  function handleAnimationComplete(i: number) {
    if (shuffle?.id === i) setShuffle(null);
  }

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

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label={t.testimonials.label[lang]}
          className="flex items-center justify-center gap-14 max-sm:gap-3"
        >
          <button
            onClick={prev}
            aria-label={t.testimonials.prev[lang]}
            className="relative z-10 bg-transparent border-none cursor-pointer p-2 text-p-ink transition-opacity duration-150 hover:opacity-60"
          >
            <PixelArrow direction="prev" />
          </button>

          {/* The pile is visual only; screen readers get the live region below */}
          <motion.div
            ref={pileRef}
            aria-hidden="true"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="grid w-[min(560px,70vw)]"
          >
            {testimonials.map((item, i) => {
              const { animate, transition, z } = poseFor(i);
              const isTop = i === index;
              return (
                <motion.div
                  key={item.name}
                  initial={false}
                  animate={animate}
                  transition={transition}
                  onAnimationComplete={() => handleAnimationComplete(i)}
                  drag={isTouch && isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={isTop ? handleDragEnd : undefined}
                  className="[grid-area:1/1]"
                  style={{ zIndex: z }}
                >
                  <Postcard quote={item.quote} name={item.name} role={item.role} stampIndex={i} />
                </motion.div>
              );
            })}
          </motion.div>

          <button
            onClick={next}
            aria-label={t.testimonials.next[lang]}
            className="relative z-10 bg-transparent border-none cursor-pointer p-2 text-p-ink transition-opacity duration-150 hover:opacity-60"
          >
            <PixelArrow direction="next" />
          </button>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {t.testimonials.position[lang].replace("{i}", String(index + 1)).replace("{n}", String(n))}:{" "}
          “{current.quote}” — {current.name}, {current.role}
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
