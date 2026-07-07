"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useReveal } from "@/hooks/useReveal";

interface WorkCardProps {
  gradient: string;
  tall?: boolean;
  title: string;
  subtitle: string;
  tagline: string;
  year: string;
  delay?: number;
  href?: string;
  password?: string;
  image?: string;
  bg?: string;
  screen?: string;
  keywords?: string[];
}

function CursorChip({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springConfig = { stiffness: 350, damping: 28, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-[200] pointer-events-none flex items-center gap-2 text-white rounded-md px-4 py-2.5 select-none overflow-hidden"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            fontFamily: "var(--font-geist-pixel), 'Doto', monospace",
            fontSize: "1rem",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0, 0, 0, 0.75)", mixBlendMode: "multiply" }}
          />
          <span className="relative flex items-center gap-2">
            view case study
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function WorkCard({
  gradient,
  tall,
  title,
  subtitle,
  tagline,
  year,
  delay = 0,
  href,
  password,
  image,
  bg,
  screen,
  keywords,
}: WorkCardProps) {
  const { ref, visible } = useReveal();
  const router = useRouter();
  const [scrollActive, setScrollActive] = useState(false);
  const [chipVisible, setChipVisible] = useState(false);
  const isHoverable = href !== undefined;

  // On touch/no-hover devices, activate overlay when card scrolls into view
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const el = ref.current as Element | null;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrollActive(entry.isIntersecting),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  const isPop = Boolean(bg && screen);
  const cardStyle = isPop
    ? { transitionDelay: `${delay}s` }
    : { background: gradient, transitionDelay: `${delay}s` };
  const wrapperClassName = `reveal flex flex-col ${tall ? "row-span-2" : ""} ${visible ? "visible" : ""}`;
  const className = `group work-card-hover relative rounded-[4px] overflow-hidden flex flex-col justify-end ${
    isPop ? "" : "noise-overlay"
  } ${tall ? "min-h-[748px]" : "min-h-[364px]"}`;
  const taglineEl = (
    <p
      className="mt-1 italic text-p-ink"
      style={{ fontFamily: "var(--font-instrument-serif), Georgia, serif", fontSize: "20px" }}
    >
      {tagline}
    </p>
  );

  const inner = (
    <>
      {isPop ? (
        <>
          {/* Pop layout: the background is a bottom-anchored mask — on hover its top edge
              drops 20%, cropping the image without squishing it, while the screen rises */}
          <div className="absolute inset-0 z-[1] rounded-[4px] overflow-hidden transition-[top] duration-300 ease-out group-hover:top-[43%]">
            <div
              className="noise-overlay absolute inset-x-0 bottom-0"
              style={{
                height: tall ? 748 : 364,
                backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
          {/* Keyword marquee — fades in behind the lifted screen on hover */}
          {keywords && keywords.length > 0 && (
            <div
              className="absolute bottom-[calc(57%+6px)] left-0 right-0 z-[1] overflow-hidden pointer-events-none opacity-0 transition-opacity duration-300 delay-150 group-hover:opacity-100"
              style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
              aria-hidden="true"
            >
              <div className="marquee-track flex w-max gap-14 pr-14">
                {[...keywords, ...keywords].map((k, i) => (
                  <span key={i} className="whitespace-nowrap text-[clamp(18px,2.2vw,34px)] text-[#c8c8c4]">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${screen}`}
            alt={title}
            className="absolute top-[18%] left-1/2 -translate-x-1/2 z-[2] w-[60%] max-w-none h-auto rounded-[4px] border border-[#d6d6d2] origin-top transition-transform duration-300 ease-out group-hover:-translate-y-12 group-hover:scale-[1.25]"
          />
        </>
      ) : (
        <>
          {/* Card image / placeholder */}
          <div className="absolute inset-0 z-[2]">
            {image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${image}`}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-white/10" />
            )}
          </div>

          {/* Inset border on hover */}
          <div className="card-inset-border absolute inset-0 rounded-[4px] border border-transparent pointer-events-none z-[4]" />
        </>
      )}

      {/* Mobile-only overlay (no hover chip on touch devices) */}
      <div
        className="relative z-[3] px-6 pb-5 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between gap-4 opacity-0 transition-opacity duration-300"
        style={scrollActive ? { opacity: 1 } : undefined}
      >
        <div>
          <div
            className="text-base font-[400] text-white/90 leading-[1.3]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            {title}
          </div>
          <div
            className="text-xs text-white/45 mt-[0.15rem]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            {subtitle}
          </div>
        </div>
        <div
          className="text-xs text-white/40 flex-shrink-0"
          style={{ fontFamily: "var(--font-geist-pixel), 'Doto', monospace" }}
        >
          {year}
        </div>
      </div>

      {/* Cursor chip */}
      {isHoverable && <CursorChip visible={chipVisible} />}
    </>
  );

  const hoverProps = isHoverable ? {
    onMouseEnter: () => setChipVisible(true),
    onMouseLeave: () => setChipVisible(false),
    style: { ...cardStyle, cursor: chipVisible ? "none" : undefined },
  } : { style: cardStyle };

  // Protected card
  if (href && password) {
    const storageKey = `unlocked-${href.split("/").filter(Boolean).pop()}`;
    function handleClick(e: React.MouseEvent) {
      e.preventDefault();
      if (sessionStorage.getItem(storageKey) === "1") { router.push(href!); return; }
      const input = window.prompt("This case study is password-protected. Enter password:");
      if (input === password) { sessionStorage.setItem(storageKey, "1"); router.push(href!); }
    }
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={wrapperClassName}>
        <div className={className} onClick={handleClick} {...hoverProps}>
          {inner}
        </div>
        {taglineEl}
      </div>
    );
  }

  // Regular linked card
  if (href) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={wrapperClassName}>
        <Link href={href} className={className} {...hoverProps}>
          {inner}
        </Link>
        {taglineEl}
      </div>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={wrapperClassName}>
      <div className={className} style={cardStyle}>
        {inner}
      </div>
      {taglineEl}
    </div>
  );
}
