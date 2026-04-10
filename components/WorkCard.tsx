"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
}: WorkCardProps) {
  const { ref, visible } = useReveal();
  const router = useRouter();
  const [scrollActive, setScrollActive] = useState(false);

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

  const className = `group reveal work-card-hover noise-overlay relative rounded-[14px] overflow-hidden flex flex-col justify-end ${tall ? "row-span-2 min-h-[748px]" : "min-h-[364px]"} ${visible ? "visible" : ""}`;
  const style = { background: gradient, transitionDelay: `${delay}s` };

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
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
      </div>

      {/* Inset border on hover */}
      <div className="card-inset-border absolute inset-0 rounded-[14px] border border-transparent pointer-events-none z-[4]" />

      {/* Card info — fades in on hover (desktop) or scroll-into-view (mobile) */}
      <div
        className="relative z-[3] px-6 pb-5 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
    </>
  );

  // Protected card — intercept click, prompt on the homepage
  if (href && password) {
    const storageKey = `unlocked-${href.split("/").filter(Boolean).pop()}`;

    function handleClick(e: React.MouseEvent) {
      e.preventDefault();
      if (sessionStorage.getItem(storageKey) === "1") {
        router.push(href!);
        return;
      }
      const input = window.prompt("This case study is password-protected. Enter password:");
      if (input === password) {
        sessionStorage.setItem(storageKey, "1");
        router.push(href!);
      }
    }

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`${className} cursor-pointer`}
        style={style}
        onClick={handleClick}
      >
        {inner}
      </div>
    );
  }

  // Regular linked card
  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
        className={`${className} cursor-pointer`}
        style={style}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {inner}
    </div>
  );
}
