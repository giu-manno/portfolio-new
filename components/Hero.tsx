"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { getSprites, periodForHour, PALETTES, type Period } from "@/lib/pixelSprites";

/* ── Bee cursor (clock hover easter egg) ────────────────────────────── */

const BEE_GRID = [
  "....WW......",
  "...WWWW.....",
  "....WW......",
  "..KYYKYYK...",
  ".KYYKYYKYKK.",
  "KKYYKYYKYKEK",
  ".KYYKYYKYKK.",
  "..KYYKYYK...",
  "...K...K....",
];
const BEE_COLORS: Record<string, string> = {
  K: "#2b2b28",
  Y: "#f2c94c",
  W: "#dfe9f7",
  E: "#ffffff",
};
const BEE_CELL = 2;

function PixelBee({ flip }: { flip: boolean }) {
  const h = BEE_GRID.length;
  const w = BEE_GRID[0].length;
  return (
    <svg
      width={w * BEE_CELL}
      height={h * BEE_CELL}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {BEE_GRID.flatMap((row, y) =>
        [...row].map((ch, x) =>
          BEE_COLORS[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={BEE_COLORS[ch]} /> : null
        )
      )}
    </svg>
  );
}

function BeeCursor({ active }: { active: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [flip, setFlip] = useState(false);
  const [trail, setTrail] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastDot = useRef({ x: -100, y: -100 });
  const dotId = useRef(0);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { stiffness: 500, damping: 32, mass: 0.4 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (e.movementX !== 0) setFlip(e.movementX < 0);
      // Drop a trail pixel every ~12px of travel
      const d = Math.hypot(e.clientX - lastDot.current.x, e.clientY - lastDot.current.y);
      if (d > 12) {
        lastDot.current = { x: e.clientX, y: e.clientY };
        const id = ++dotId.current;
        setTrail((ts) => [...ts.slice(-14), { id, x: e.clientX, y: e.clientY }]);
        timers.push(setTimeout(() => setTrail((ts) => ts.filter((t2) => t2.id !== id)), 650));
      }
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      timers.forEach(clearTimeout);
      setTrail([]);
    };
  }, [active, cursorX, cursorY]);

  if (!mounted || !active) return null;

  return createPortal(
    <>
      {trail.map((t2) => (
        <div key={t2.id} className="bee-trail fixed z-[199] pointer-events-none" style={{ left: t2.x, top: t2.y }} />
      ))}
      <motion.div
        className="fixed z-[200] pointer-events-none"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      >
        <PixelBee flip={flip} />
      </motion.div>
    </>,
    document.body
  );
}

// Twinkling star dots, same style as the CTA footer's star field
const SPARKLES = [
  { left: "4%", top: "12%", size: 3, dur: "2.6s", delay: "0s" },
  { left: "13%", top: "48%", size: 2, dur: "3.4s", delay: "-1.2s" },
  { left: "22%", top: "8%", size: 2, dur: "2.2s", delay: "-0.7s" },
  { left: "31%", top: "34%", size: 3, dur: "3.8s", delay: "-2.1s" },
  { left: "42%", top: "16%", size: 2, dur: "2.9s", delay: "-0.4s" },
  { left: "51%", top: "56%", size: 2, dur: "2.4s", delay: "-1.7s" },
  { left: "60%", top: "28%", size: 3, dur: "3.1s", delay: "-2.6s" },
  { left: "71%", top: "10%", size: 2, dur: "2.7s", delay: "-1.0s" },
  { left: "81%", top: "42%", size: 3, dur: "3.5s", delay: "-2.3s" },
  { left: "92%", top: "20%", size: 2, dur: "2.5s", delay: "-1.5s" },
];

// Static tone-on-tone squares scattered in the sky for pixel-texture depth
const SKY_TEX = [
  { left: "9%", top: "30%", size: 12, light: true },
  { left: "18%", top: "62%", size: 10, light: false },
  { left: "28%", top: "18%", size: 13, light: false },
  { left: "39%", top: "44%", size: 10, light: true },
  { left: "49%", top: "9%", size: 12, light: false },
  { left: "58%", top: "38%", size: 11, light: true },
  { left: "69%", top: "58%", size: 10, light: false },
  { left: "78%", top: "24%", size: 13, light: true },
  { left: "88%", top: "50%", size: 10, light: false },
];

// w/h in px, matching each cloud grid's pixel aspect ratio (a: 24x10, b: 14x6, c: 30x7)
const CLOUDS = [
  { top: "28%", dur: 60, delay: -24, sprite: "a", w: 190, h: 79 },
  { top: "46%", dur: 76, delay: -48, sprite: "c", w: 230, h: 54 },
  { top: "62%", dur: 68, delay: -28, sprite: "b", w: 92, h: 39 },
  { top: "6%", dur: 88, delay: -68, sprite: "b", w: 76, h: 33 },
  { top: "38%", dur: 104, delay: -80, sprite: "a", w: 120, h: 50 },
] as const;

const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";
const serifFont = "var(--font-instrument-serif), Georgia, serif";

interface HeroProps {
  timeOfDay?: "auto" | Period;
  showSeconds?: boolean;
}

export default function Hero({ timeOfDay = "auto", showSeconds = false }: HeroProps) {
  const { lang } = useLanguage();
  const [now, setNow] = useState<Date | null>(null);
  const [beeActive, setBeeActive] = useState(false);

  const activateBee = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setBeeActive(true);
  };

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mounted = now !== null;
  let hh = "12";
  let mm = "00";
  let ss = "00";
  if (now) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
    hh = get("hour") === "24" ? "00" : get("hour");
    mm = get("minute");
    ss = get("second");
  }

  const period: Period = timeOfDay !== "auto" ? timeOfDay : periodForHour(parseInt(hh, 10) % 24);
  const palette = PALETTES[period];
  const sprites = mounted ? getSprites(period) : null;

  // Page-wide accent follows the sky's time of day (selection, hover underlines)
  useEffect(() => {
    document.documentElement.style.setProperty("--p-accent", palette.accent);
  }, [palette.accent]);

  return (
    <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] pt-6 pb-12 max-sm:px-5 max-sm:pt-3 max-sm:pb-8">
      {/* ─── Sky panel ─── */}
      <div
        className="hero-item hero-item-1 relative overflow-hidden rounded-[4px]"
        style={{
          height: 380,
          background: `linear-gradient(to bottom, ${palette.skyBands[0]} 0%, ${palette.skyBands[0]} 30%, ${palette.skyBands[1]} 30%, ${palette.skyBands[1]} 55%, ${palette.skyBands[2]} 55%, ${palette.skyBands[2]} 78%, ${palette.skyBands[3]} 78%, ${palette.skyBands[3]} 100%)`,
          cursor: beeActive ? "none" : undefined,
        }}
        onMouseEnter={activateBee}
        onMouseLeave={() => setBeeActive(false)}
      >
        {/* Dithered sky bands — canvas sprite over the CSS-gradient fallback */}
        {sprites && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${sprites.sky})`,
              backgroundSize: "20px 380px",
              backgroundRepeat: "repeat-x",
              imageRendering: "pixelated",
            }}
          />
        )}

        {/* Sky texture squares */}
        {SKY_TEX.map((q, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: q.left,
              top: q.top,
              width: q.size,
              height: q.size,
              background: q.light ? "rgba(255,255,255,0.10)" : "rgba(10,15,40,0.07)",
            }}
          />
        ))}

        {/* Twinkling star dots */}
        {SPARKLES.map((s, i) => (
          <div
            key={i}
            className="pixel-sky-anim absolute"
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              background: palette.sparkle,
              opacity: 0.5,
              animation: `pixelTwinkle ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}

        {sprites && (
          <>
            {/* sun / moon */}
            <div
              className="absolute"
              style={{
                left: "7%",
                top: 26,
                width: 78,
                height: 78,
                backgroundImage: `url(${sprites.sun})`,
                backgroundSize: "100% 100%",
                imageRendering: "pixelated",
              }}
            />

            {CLOUDS.map((c, i) => (
              <div
                key={i}
                className="pixel-sky-anim absolute left-0 will-change-transform"
                style={{ top: c.top, animation: `pixelDrift ${c.dur}s linear ${c.delay}s infinite` }}
              >
                <div
                  style={{
                    width: c.w,
                    height: c.h,
                    backgroundImage: `url(${sprites[c.sprite]})`,
                    backgroundSize: "100% 100%",
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            ))}

            {/* grass strip — two frames; the sway frame flashes in on a gust once in a while */}
            {[sprites.grass, sprites.grassSway].map((src, i) => (
              <div
                key={i}
                className="pixel-sky-anim absolute left-0 bottom-0 w-full"
                style={{
                  height: 110,
                  backgroundImage: `url(${src})`,
                  backgroundSize: "auto 110px",
                  backgroundPosition: "left bottom",
                  backgroundRepeat: "repeat-x",
                  imageRendering: "pixelated",
                  opacity: i === 0 ? 1 : 0,
                  animation: `${i === 0 ? "grassGustA" : "grassGustB"} 6s steps(1, end) infinite`,
                }}
              />
            ))}
          </>
        )}

        {/* clock */}
        <div
          className="pixel-hero-clock absolute right-[4%] top-[44%] -translate-y-1/2 flex flex-col items-end gap-2 opacity-85 z-[5]"
          style={{ color: palette.skyText, mixBlendMode: "luminosity", fontFamily: pixelFont }}
        >
          <div className="font-bold text-[17px] tracking-[1px] opacity-85">(GMT-3)</div>
          <div
            className="flex items-baseline font-medium leading-[0.9] tracking-[2px]"
            style={{ fontSize: "clamp(64px, 12vw, 96px)" }}
          >
            {mounted ? (
              <>
                <span>{hh}</span>
                <span>:</span>
                <span>{mm}</span>
                {showSeconds && (
                  <>
                    <span>:</span>
                    <span>{ss}</span>
                  </>
                )}
              </>
            ) : (
              <span style={{ visibility: "hidden" }}>00:00</span>
            )}
          </div>
          {timeOfDay === "auto" && mounted && (
            <div className="font-bold text-[14px] tracking-[1px] opacity-80">
              {t.hero.clock[period][lang]}
            </div>
          )}
        </div>
      </div>

      {/* Bee cursor while hovering the clock */}
      <BeeCursor active={beeActive} />

      {/* ─── Name + bio ───
          Mobile: name / chips / bio stacked.
          Intermediate (sm–lg): name + bio share the top row, chips below.
          Desktop (lg+): name above chips on the left, bio on the right. */}
      <div className="pt-11 grid grid-cols-1 items-start gap-x-10 gap-y-[18px] sm:grid-cols-[auto_minmax(0,420px)] sm:justify-between">
        <h1
          className="hero-item hero-item-2 m-0 font-normal leading-none tracking-[-0.01em] text-p-ink sm:col-start-1 sm:row-start-1"
          style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5.5vw, 72px)" }}
        >
          Giulia Manno
        </h1>
        <p className="hero-item hero-item-3 order-3 sm:order-none m-0 sm:mt-1.5 max-w-[420px] text-base leading-normal text-[#555550] sm:col-start-2 sm:row-start-1 lg:row-span-2">
          {t.hero.desc[lang]}
        </p>
        <div className="hero-item hero-item-2 order-2 sm:order-none flex gap-2 flex-wrap sm:col-span-2 sm:row-start-2 lg:col-span-1 lg:col-start-1">
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/Giulia Manno Lima - 2026 CV.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-chip"
          >
            <span className="text-[14px] leading-none">&#8595;</span>
            <span>{t.experience.downloadCV[lang].toLowerCase()}</span>
          </a>
          <a href="mailto:mannogiu@gmail.com" className="pixel-chip">
            <span>{t.hero.contact[lang].toLowerCase()}</span>
          </a>
          <a
            href="https://www.linkedin.com/in/giulia-manno-88681a144/"
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-chip"
          >
            <span>linkedin</span>
            <span className="text-[14px] leading-none">&#8599;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
