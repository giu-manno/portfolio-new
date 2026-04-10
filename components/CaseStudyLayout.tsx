"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Switch } from "@/components/ui/switch";
import CtaFooter from "@/components/CtaFooter";
import Footer from "@/components/Footer";
import PasswordGate from "@/components/PasswordGate";
import { LightboxProvider } from "@/components/case-study/LightboxContext";

export interface CaseStudySection {
  id: string;
  num: string;
  label: string;
}

export interface CaseStudyMeta {
  label: string;
  value: string;
}

export interface NextProject {
  title: string;
  href: string;
}

interface CaseStudyLayoutProps {
  heroGradient: string;
  accentColor?: string;
  eyebrow: string;
  title: string;
  tagline: string;
  meta: CaseStudyMeta[];
  sections: CaseStudySection[];
  nextProject?: NextProject;
  password?: string;
  slug?: string;
  children: React.ReactNode;
}

function ConditionalGate({
  password,
  slug,
  children,
}: {
  password?: string;
  slug?: string;
  children: React.ReactNode;
}) {
  if (password && slug) {
    return <PasswordGate password={password} slug={slug}>{children}</PasswordGate>;
  }
  return <>{children}</>;
}

export default function CaseStudyLayout({
  heroGradient,
  accentColor,
  eyebrow,
  title,
  tagline,
  meta,
  sections,
  nextProject,
  password,
  slug,
  children,
}: CaseStudyLayoutProps) {
  const { lang, toggle } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { threshold: 0.25 }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [sections]);

  const cssVars = accentColor
    ? ({ "--p-accent": accentColor } as React.CSSProperties)
    : undefined;

  return (
    <LightboxProvider>
    <div style={cssVars}>
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-p-bg/[0.88] backdrop-blur-md border-b border-p-border">
        <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-base tracking-[-0.02em] text-p-ink no-underline font-[400]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            giulia manno
          </Link>
          <button
            onClick={toggle}
            className="flex items-center gap-2 cursor-pointer select-none"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            aria-label="Toggle language"
          >
            <span className={`text-sm flex items-center gap-1 transition-opacity duration-150 ${lang === "pt" ? "opacity-100" : "opacity-40"}`}>
              🇧🇷 <span>PT</span>
            </span>
            <Switch checked={lang === "pt"} className="pointer-events-none" />
            <span className={`text-sm flex items-center gap-1 transition-opacity duration-150 ${lang === "en" ? "opacity-100" : "opacity-40"}`}>
              <span>EN</span> 🇺🇸
            </span>
          </button>
        </div>
      </nav>

      {/* ── Everything below the nav is optionally gated ── */}
      <ConditionalGate password={password} slug={slug}>

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden noise-overlay"
          style={{ background: heroGradient, paddingTop: "4rem", paddingBottom: "5rem" }}
        >
          <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 relative z-10">
            <Link
              href="/#work"
              className="inline-flex items-center gap-1.5 text-sm no-underline transition-opacity duration-200 hover:opacity-100 mb-8"
              style={{ color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              ← All work
            </Link>
            <p
              className="text-xs tracking-[0.15em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {eyebrow}
            </p>
            <h1
              className="font-[400] tracking-[-0.04em] leading-[0.95] text-white mb-6 hero-item hero-item-1"
              style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {title}
            </h1>
            <p
              className="text-body-lg leading-[1.75] font-[300] max-w-[520px] hero-item hero-item-2"
              style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              {tagline}
            </p>

            {/* Meta strip */}
            <div
              className="grid mt-16 hero-item hero-item-3"
              style={{ gridTemplateColumns: `repeat(${meta.length}, 1fr)`, borderTop: "1px solid rgba(255,255,255,0.1)" }}
            >
              {meta.map((item, i) => (
                <div
                  key={item.label}
                  className="py-6"
                  style={{
                    borderRight: i < meta.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                    paddingLeft: i > 0 ? "1rem" : undefined,
                    paddingRight: i < meta.length - 1 ? "1rem" : undefined,
                  }}
                >
                  <div
                    className="text-xs tracking-[0.14em] uppercase mb-1.5"
                    style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-sm font-[400] leading-[1.5]"
                    style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-almarai), system-ui, sans-serif", whiteSpace: "pre-line" }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content + Sidebar ── */}
        <div className="max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 py-24 max-sm:py-14 grid gap-20 items-start min-[900px]:[grid-template-columns:1fr_200px]">
          <main>{children}</main>

          <aside className="hidden min-[900px]:flex flex-col gap-0 sticky top-20" aria-label="Page sections">
            <div
              className="text-xs tracking-[0.14em] uppercase text-[var(--p-muted)] mb-4 pb-3 border-b border-[var(--p-border)]"
              style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
            >
              On this page
            </div>
            {sections.map(({ id, num, label }) => {
              const active = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className="flex items-center gap-2.5 text-sm py-2 border-b border-[var(--p-border)] no-underline transition-colors duration-200 relative pl-4"
                  style={{
                    color: active ? "var(--p-ink)" : "var(--p-muted)",
                    fontWeight: active ? 400 : 300,
                    fontFamily: "var(--font-almarai), system-ui, sans-serif",
                  }}
                >
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-sm bg-[var(--p-accent)] transition-all duration-[250ms]"
                    style={{ height: active ? "16px" : "0px" }}
                  />
                  <span className="text-xs opacity-50" style={{ color: "var(--p-muted)" }}>
                    {num}
                  </span>
                  {label}
                </a>
              );
            })}
          </aside>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[var(--p-border)]" />

        {/* ── Next project ── */}
        {nextProject && (
          <div className="w-full max-w-[1440px] mx-auto px-10 min-[900px]:px-[88px] max-sm:px-5 py-8 flex items-center justify-end gap-8">
            <div className="text-right">
              <div
                className="text-xs tracking-[0.14em] uppercase text-[var(--p-muted)] mb-2"
                style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                Next case study
              </div>
              <div
                className="font-[400] tracking-[-0.03em] text-[var(--p-ink)]"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
              >
                {nextProject.title}
              </div>
            </div>
            <Link
              href={nextProject.href}
              className="text-[2rem] text-[var(--p-muted)] no-underline shrink-0 transition-[transform,color] duration-[250ms] hover:text-[var(--p-ink)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "translateX(6px)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "")}
            >
              →
            </Link>
          </div>
        )}

        <CtaFooter />
        <Footer />

      </ConditionalGate>
    </div>
    </LightboxProvider>
  );
}
