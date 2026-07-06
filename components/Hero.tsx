"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations as t } from "@/lib/translations";
import { getSprites, periodForHour, PALETTES, type Period } from "@/lib/pixelSprites";

const SPARKLES = [
  { left: "46%", top: "10%", dur: "2.6s", delay: "0s" },
  { left: "36%", top: "30%", dur: "3.4s", delay: "-1.2s" },
  { left: "58%", top: "14%", dur: "2.2s", delay: "-0.7s" },
  { left: "16%", top: "52%", dur: "3.8s", delay: "-2.1s" },
  { left: "8%", top: "22%", dur: "2.9s", delay: "-0.4s" },
  { left: "27%", top: "66%", dur: "2.4s", delay: "-1.7s" },
  { left: "65%", top: "8%", dur: "3.1s", delay: "-2.6s" },
];

// w/h in px, matching each cloud grid's pixel aspect ratio (a: 24x10, b: 14x6, c: 30x7)
const CLOUDS = [
  { top: "28%", dur: 150, delay: -60, sprite: "a", w: 190, h: 79 },
  { top: "46%", dur: 190, delay: -120, sprite: "c", w: 230, h: 54 },
  { top: "62%", dur: 170, delay: -70, sprite: "b", w: 92, h: 39 },
  { top: "6%", dur: 220, delay: -170, sprite: "b", w: 76, h: 33 },
  { top: "38%", dur: 260, delay: -200, sprite: "a", w: 120, h: 50 },
] as const;

type Bird = { id: number; top: string; dur: string; size: number };

const pixelFont = "var(--font-geist-pixel), 'Doto', monospace";
const serifFont = "var(--font-instrument-serif), Georgia, serif";

interface HeroProps {
  timeOfDay?: "auto" | Period;
  showSeconds?: boolean;
}

export default function Hero({ timeOfDay = "auto", showSeconds = false }: HeroProps) {
  const { lang } = useLanguage();
  const [now, setNow] = useState<Date | null>(null);
  const [birds, setBirds] = useState<Bird[]>([]);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let id = 0;
    let spawnTimer: ReturnType<typeof setTimeout>;
    const despawnTimers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (wait: number) => {
      spawnTimer = setTimeout(() => {
        const birdId = ++id;
        const dur = 9 + Math.random() * 6;
        const size = Math.random() < 0.5 ? 22 : 30;
        setBirds((bs) => [
          ...bs,
          { id: birdId, top: (6 + Math.random() * 44).toFixed(1) + "%", dur: dur.toFixed(1) + "s", size },
        ]);
        despawnTimers.push(
          setTimeout(() => setBirds((bs) => bs.filter((b) => b.id !== birdId)), dur * 1000 + 600)
        );
        schedule(5000 + Math.random() * 12000);
      }, wait);
    };
    schedule(2500);
    return () => {
      clearTimeout(spawnTimer);
      despawnTimers.forEach(clearTimeout);
    };
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

  return (
    <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] pt-6 pb-20 max-sm:px-5 max-sm:pt-3 max-sm:pb-12">
      {/* ─── Sky panel ─── */}
      <div
        className="hero-item hero-item-1 relative overflow-hidden rounded-[14px] transition-colors duration-700"
        style={{ height: 380, background: palette.sky }}
      >
        {SPARKLES.map((s, i) => (
          <div
            key={i}
            className="pixel-sky-anim absolute"
            style={{
              left: s.left,
              top: s.top,
              width: 13,
              height: 13,
              background: palette.sparkle,
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

            {/* birds */}
            {birds.map((b) => (
              <div
                key={b.id}
                className="pixel-sky-anim absolute left-0 overflow-hidden will-change-transform z-[3]"
                style={{
                  top: b.top,
                  width: b.size,
                  height: Math.round((b.size * 4) / 7),
                  animation: `pixelDrift ${b.dur} linear forwards`,
                }}
              >
                <div
                  className="pixel-sky-anim h-full"
                  style={{
                    width: "200%",
                    backgroundImage: `url(${sprites.bird})`,
                    backgroundSize: "100% 100%",
                    imageRendering: "pixelated",
                    animation: "pixelFlap 0.45s steps(1) infinite",
                  }}
                />
              </div>
            ))}

            {/* grass strip */}
            <div
              className="absolute left-0 bottom-0 w-full"
              style={{
                height: 110,
                backgroundImage: `url(${sprites.grass})`,
                backgroundSize: "auto 110px",
                backgroundPosition: "left bottom",
                backgroundRepeat: "repeat-x",
                imageRendering: "pixelated",
              }}
            />
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
