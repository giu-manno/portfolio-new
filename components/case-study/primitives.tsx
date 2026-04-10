"use client";

import { useReveal } from "@/hooks/useReveal";

export function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="text-xs tracking-[0.1em] text-[var(--p-accent)] shrink-0">
        [ {num} ]
      </span>
      <h2
        className="text-heading font-[400] tracking-[-0.02em] leading-tight"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

export function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-base leading-[1.85] text-[#555550] mb-5 last:mb-0"
      style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
    >
      {children}
    </p>
  );
}

export function QuoteBlock({ quote, cite }: { quote: string; cite?: string }) {
  return (
    <blockquote
      className="border-l-2 border-[var(--p-accent)] pl-6 py-3 my-6 rounded-r-md"
      style={{ background: "color-mix(in srgb, var(--p-accent) 6%, transparent)" }}
    >
      <p
        className="text-base leading-[1.75] text-[#555550] italic"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {quote}
      </p>
      {cite && (
        <cite
          className="block mt-2 text-xs tracking-[0.08em] uppercase text-[var(--p-muted)] not-italic"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {cite}
        </cite>
      )}
    </blockquote>
  );
}

export function NdaBanner() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-[8px] px-5 py-3 mb-12"
      style={{
        background: "rgba(250,176,5,0.07)",
        border: "1px solid rgba(250,176,5,0.2)",
        fontFamily: "var(--font-almarai), system-ui, sans-serif",
      }}
    >
      <span className="text-sm mt-[1px] shrink-0">⚠</span>
      <p className="text-sm leading-[1.6] text-[var(--p-muted)]">
        Some visuals in this case study have been adapted to comply with NDA restrictions.
      </p>
    </div>
  );
}

export function HmwCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-10 py-8 px-6 text-center">
      <p
        className="text-heading font-[400] tracking-[-0.02em] leading-[1.5] text-[var(--p-ink)] italic max-w-[640px] mx-auto"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {children}
      </p>
    </div>
  );
}

export function InsightCard({ label, text }: { label: string; text: string }) {
  const isOpportunity = label.toLowerCase().includes("opportunit");
  return (
    <div
      className="rounded-[10px] p-5"
      style={isOpportunity ? {
        background: "color-mix(in srgb, var(--p-accent) 9%, transparent)",
        border: "1px solid color-mix(in srgb, var(--p-accent) 28%, transparent)",
      } : {
        background: "var(--p-soft)",
        border: "1px solid var(--p-border)",
      }}
    >
      <div
        className="text-xs tracking-[0.14em] uppercase mb-2"
        style={{
          fontFamily: "var(--font-almarai), system-ui, sans-serif",
          color: isOpportunity ? "color-mix(in srgb, var(--p-accent) 80%, #333)" : "var(--p-muted)",
        }}
      >
        {label}
      </div>
      <p
        className="text-sm leading-[1.65] text-[var(--p-ink)]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {text}
      </p>
    </div>
  );
}

export function ProcessStep({
  num,
  title,
  body,
  first,
}: {
  num: string;
  title: string;
  body: string;
  first?: boolean;
}) {
  return (
    <div
      className={`grid gap-4 py-5 border-b border-[var(--p-border)]${first ? " border-t" : ""}`}
      style={{ gridTemplateColumns: "2.5rem 1fr" }}
    >
      <span
        className="text-xs text-[var(--p-accent)] font-[400] tracking-[0.06em] mt-0.5"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {num}
      </span>
      <div>
        <h4
          className="text-base font-[400] text-[var(--p-ink)] mb-1"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {title}
        </h4>
        <p
          className="text-sm text-[var(--p-muted)] leading-[1.65]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

export function OutcomeCell({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-[var(--p-bg)] p-6">
      <div
        className="text-[2rem] font-[400] tracking-[-0.04em] leading-none text-[var(--p-ink)]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {num}
      </div>
      <div
        className="text-sm text-[var(--p-muted)] mt-1.5 leading-[1.5]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

export function ImgPlaceholder({ caption }: { caption: string }) {
  return (
    <div className="my-10">
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: "#1a1a2e", aspectRatio: "16/7" }}
      />
      <p
        className="text-xs text-[var(--p-muted)] text-center mt-3 tracking-[0.04em]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {caption}
      </p>
    </div>
  );
}

export function RevealSection({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { ref, visible } = useReveal();
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`mb-20 reveal ${visible ? "visible" : ""}`}
    >
      {children}
    </section>
  );
}
