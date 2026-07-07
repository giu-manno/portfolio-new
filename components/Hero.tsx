"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { getSprites, periodForHour, PALETTES, type Period } from "@/lib/pixelSprites";

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
    <div className="max-w-[1440px] mx-auto px-10 min-[1920px]:px-[88px] pt-6 pb-10 max-sm:px-5 max-sm:pt-3 max-sm:pb-8">
      {/* ─── Sky panel ─── */}
      <div
        className="hero-item hero-item-1 relative overflow-hidden rounded-[4px]"
        style={{
          height: 380,
          background: `linear-gradient(to bottom, ${palette.skyBands[0]} 0%, ${palette.skyBands[0]} 30%, ${palette.skyBands[1]} 30%, ${palette.skyBands[1]} 55%, ${palette.skyBands[2]} 55%, ${palette.skyBands[2]} 78%, ${palette.skyBands[3]} 78%, ${palette.skyBands[3]} 100%)`,
        }}
      >
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
          className="pixel-hero-clock absolute right-[4%] top-[44%] -translate-y-1/2 flex flex-col gap-2 opacity-75 z-[5]"
          style={{ color: palette.skyText, mixBlendMode: "luminosity", fontFamily: pixelFont }}
        >
          <div className="self-end font-bold text-[17px] tracking-[1px] opacity-85">(GMT-3)</div>
          <div
            className="flex items-baseline font-medium leading-[0.9] tracking-[2px]"
            style={{ fontSize: "clamp(56px, 7vw, 96px)" }}
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
            <div className="self-end font-bold text-[14px] tracking-[1px] opacity-80">
              {t.hero.clock[period][lang]}
            </div>
          )}
        </div>
      </div>

      {/* ─── Name + bio ─── */}
      <div className="flex justify-between items-start gap-10 flex-wrap pt-11">
        <div className="hero-item hero-item-2 flex flex-col gap-[18px]">
          <h1
            className="m-0 font-normal leading-none tracking-[-0.01em] text-p-ink"
            style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5.5vw, 72px)" }}
          >
            Giulia Manno
          </h1>
          <div className="flex gap-2 flex-wrap">
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
        <p className="hero-item hero-item-3 mt-1.5 mb-0 max-w-[420px] text-base leading-normal text-[#555550]">
          {t.hero.desc[lang]}
        </p>
      </div>
    </div>
  );
}
