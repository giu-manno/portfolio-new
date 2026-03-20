"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

interface WorkCardProps {
  gradient: string;
  tall?: boolean;
  title: string;
  subtitle: string;
  year: string;
  delay?: number;
  href?: string;
}

export default function WorkCard({
  gradient,
  tall,
  title,
  subtitle,
  year,
  delay = 0,
  href,
}: WorkCardProps) {
  const { ref, visible } = useReveal();

  const Wrapper = href ? Link : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal work-card-hover noise-overlay relative rounded-[14px] overflow-hidden flex flex-col justify-end ${tall ? "row-span-2 min-h-[576px]" : "min-h-[280px]"} ${visible ? "visible" : ""}${href ? " cursor-pointer" : ""}`}
      style={{ background: gradient, transitionDelay: `${delay}s` }}
    >
      {/* Image placeholder — replace with <Image> once assets are ready */}
      <div className="absolute inset-0 z-[2] p-6 pb-16 flex items-center justify-center">
        <div className="w-full h-full rounded-lg bg-white/10" />
      </div>

      {/* Inset border on hover */}
      <div className="card-inset-border absolute inset-0 rounded-[14px] border border-transparent pointer-events-none z-[4]" />

      {/* Card info */}
      <div className="relative z-[3] px-6 py-5 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between gap-4">
        <div>
          <div
            className="text-[0.88rem] font-[400] text-white/90 leading-[1.3]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            {title}
          </div>
          <div
            className="text-[0.72rem] text-white/45 mt-[0.15rem]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            {subtitle}
          </div>
        </div>
        <div
          className="text-[0.72rem] text-white/40 flex-shrink-0"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {year}
        </div>
      </div>
    </Wrapper>
  );
}
