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
  year: string;
  delay?: number;
  href?: string;
  password?: string;
  image?: string;
  chipColor?: string;
}

function CursorChip({ title, year, visible, color }: { title: string; year: string; visible: boolean; color?: string }) {
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
          className="fixed z-[200] pointer-events-none flex items-center gap-2 text-white rounded-full px-4 py-2.5 select-none"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            background: color ?? "var(--p-ink)",
            fontFamily: "var(--font-almarai), system-ui, sans-serif",
            fontSize: "1rem",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {title}, {year}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
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
  year,
  delay = 0,
  href,
  password,
  image,
  chipColor,
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

  const cardStyle = { background: gradient, transitionDelay: `${delay}s` };
  const className = `group reveal work-card-hover noise-overlay relative rounded-[14px] overflow-hidden flex flex-col justify-end ${tall ? "row-span-2 min-h-[748px]" : "min-h-[364px]"} ${visible ? "visible" : ""}`;

  const inner = (
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
      <div className="card-inset-border absolute inset-0 rounded-[14px] border border-transparent pointer-events-none z-[4]" />

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
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {year}
        </div>
      </div>

      {/* Cursor chip */}
      {isHoverable && <CursorChip title={title} year={year} visible={chipVisible} color={chipColor} />}
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
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className} onClick={handleClick} {...hoverProps}>
        {inner}
      </div>
    );
  }

  // Regular linked card
  if (href) {
    return (
      <Link href={href} ref={ref as React.RefObject<HTMLAnchorElement>} className={className} {...hoverProps}>
        {inner}
      </Link>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={cardStyle}>
      {inner}
    </div>
  );
}
