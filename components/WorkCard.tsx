"use client";

import Link from "next/link";
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
}: WorkCardProps) {
  const { ref, visible } = useReveal();
  const router = useRouter();

  const className = `reveal work-card-hover noise-overlay relative rounded-[14px] overflow-hidden flex flex-col justify-end ${tall ? "row-span-2 min-h-[576px]" : "min-h-[280px]"} ${visible ? "visible" : ""}`;
  const style = { background: gradient, transitionDelay: `${delay}s` };

  const inner = (
    <>
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
      // Wrong or cancelled — do nothing, user stays on the page
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
