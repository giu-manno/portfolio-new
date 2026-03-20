"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

// ── Sidebar section links ──────────────────────────────────────────────────
const SECTIONS = [
  { id: "s-context",  num: "01", label: "Context" },
  { id: "s-problem",  num: "02", label: "Problem" },
  { id: "s-research", num: "03", label: "Research" },
  { id: "s-process",  num: "04", label: "Process" },
  { id: "s-outcomes", num: "05", label: "Outcomes" },
];

// ── Small reusable pieces ──────────────────────────────────────────────────
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="text-[0.72rem] tracking-[0.1em] text-[var(--p-accent)] shrink-0">
        [ {num} ]
      </span>
      <h2
        className="text-[clamp(1.4rem,2.5vw,1.9rem)] font-[400] tracking-[-0.02em] leading-tight"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[0.97rem] leading-[1.85] text-[#555550] mb-5 last:mb-0"
      style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
    >
      {children}
    </p>
  );
}

function QuoteBlock({ quote, cite }: { quote: string; cite: string }) {
  return (
    <blockquote
      className="border-l-2 border-[var(--p-accent)] pl-6 py-3 my-6 rounded-r-md"
      style={{ background: "rgba(124,92,252,0.04)" }}
    >
      <p
        className="text-[0.92rem] leading-[1.75] text-[#555550] italic"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {quote}
      </p>
      <cite
        className="block mt-2 text-[0.72rem] tracking-[0.08em] uppercase text-[var(--p-muted)] not-italic"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {cite}
      </cite>
    </blockquote>
  );
}

function InsightCard({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-[var(--p-soft)] border border-[var(--p-border)] rounded-[10px] p-5">
      <div
        className="text-[0.65rem] tracking-[0.14em] uppercase text-[var(--p-muted)] mb-2"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {label}
      </div>
      <p
        className="text-[0.85rem] leading-[1.65] text-[var(--p-ink)]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {text}
      </p>
    </div>
  );
}

function ProcessStep({
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
        className="text-[0.72rem] text-[var(--p-accent)] font-[400] tracking-[0.06em] mt-0.5"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {num}
      </span>
      <div>
        <h4
          className="text-[0.92rem] font-[400] text-[var(--p-ink)] mb-1"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {title}
        </h4>
        <p
          className="text-[0.82rem] text-[var(--p-muted)] leading-[1.65]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function OutcomeCell({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-[var(--p-bg)] p-6">
      <div
        className="text-[2rem] font-[400] tracking-[-0.04em] leading-none text-[var(--p-ink)]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {num}
      </div>
      <div
        className="text-[0.78rem] text-[var(--p-muted)] mt-1.5 leading-[1.5]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

function ImgPlaceholder({ caption }: { caption: string }) {
  return (
    <div className="my-10">
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: "#1a1a2e", aspectRatio: "16/7" }}
      />
      <p
        className="text-[0.72rem] text-[var(--p-muted)] text-center mt-3 tracking-[0.04em]"
        style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
      >
        {caption}
      </p>
    </div>
  );
}

// ── Revealed section wrapper ──────────────────────────────────────────────
function RevealSection({
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
      // @ts-expect-error — useReveal ref types HTMLElement; section accepts it at runtime
      ref={ref}
      className={`mb-20 reveal ${visible ? "visible" : ""}`}
    >
      {children}
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdesCaseStudy() {
  const [activeSection, setActiveSection] = useState<string>("s-context");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { threshold: 0.25 }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-p-bg/[0.88] backdrop-blur-md border-b border-p-border">
        <div className="max-w-[1100px] mx-auto px-10 max-sm:px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-[0.9rem] tracking-[-0.02em] text-p-ink no-underline font-[400]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            giulia manno
          </Link>
          <Link
            href="/#work"
            className="flex items-center gap-1.5 text-[0.8rem] text-p-muted no-underline transition-colors duration-200 hover:text-p-ink"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            ← All work
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden noise-overlay"
        style={{
          background:
            "linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243e 100%)",
          padding: "6rem 2.5rem 5rem",
        }}
      >
        <div className="max-w-[860px] mx-auto relative z-10">
          <p
            className="text-[0.72rem] tracking-[0.15em] uppercase mb-6"
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "var(--font-almarai), system-ui, sans-serif",
            }}
          >
            Case Study · LabSEC / UFSC
          </p>
          <h1
            className="font-[400] tracking-[-0.04em] leading-[0.95] text-white mb-6 hero-item hero-item-1"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontFamily: "var(--font-almarai), system-ui, sans-serif",
            }}
          >
            Ades
          </h1>
          <p
            className="text-[1.05rem] leading-[1.75] font-[300] max-w-[520px] hero-item hero-item-2"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "var(--font-almarai), system-ui, sans-serif",
            }}
          >
            Designing a public digital signature platform from research to
            prototype — built to be free, accessible, and genuinely easier to
            use than anything else on the market.
          </p>

          {/* Meta strip */}
          <div
            className="grid mt-16 hero-item hero-item-3"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              { label: "Role",        value: "Product Designer\nLead Researcher" },
              { label: "Timeline",    value: "Jul — Dec 2023" },
              { label: "Deliverables", value: "Research · Pattern Library · Interactive Prototype" },
              { label: "Tools",       value: "Figma · Bootstrap" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="py-6"
                style={{
                  borderRight:
                    i < 3 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                  paddingLeft: i > 0 ? "2rem" : undefined,
                }}
              >
                <div
                  className="text-[0.68rem] tracking-[0.14em] uppercase mb-1.5"
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-almarai), system-ui, sans-serif",
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="text-[0.88rem] font-[400] leading-[1.5]"
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontFamily: "var(--font-almarai), system-ui, sans-serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page layout: content + sidebar ── */}
      <div
        className="max-w-[1100px] mx-auto px-10 max-sm:px-6 py-24 max-sm:py-14 grid gap-20 items-start"
        style={
          { gridTemplateColumns: "1fr 200px" } as React.CSSProperties
        }
      >
        {/* Content */}
        <main>

          {/* 01 Context */}
          <RevealSection id="s-context">
            <SectionHeader num="01" title="Context" />
            <BodyText>
              LabSEC is a security and cryptography lab at the Federal University
              of Santa Catarina (UFSC), with deep expertise in digital certificate
              infrastructure. Their client had a clear technical vision for a new
              digital signature platform —{" "}
              <strong className="font-[400] text-p-ink">Ades</strong> — but no
              validated understanding of what users actually needed from it.
            </BodyText>
            <BodyText>
              The product would enter a market dominated by large B2B players and
              government-owned platforms. The opportunity was specific: create a{" "}
              <strong className="font-[400] text-p-ink">
                free, public alternative
              </strong>{" "}
              that matched enterprise-level functionality without the bureaucracy
              that made existing tools so frustrating to use.
            </BodyText>
          </RevealSection>

          {/* 02 Problem */}
          <RevealSection id="s-problem">
            <SectionHeader num="02" title="The Problem" />
            <BodyText>
              The client understood their technology deeply but had significant
              blind spots around the user experience landscape — what competitors
              actually felt like to use, and what pain points were driving users
              away from existing platforms.
            </BodyText>
            <BodyText>
              Rather than designing on assumptions, we made the case for a
              structured research phase first. The core question:{" "}
              <strong className="font-[400] text-p-ink">
                what makes people abandon digital signature tools, and what would
                make them stay?
              </strong>
            </BodyText>
            <QuoteBlock
              quote='"I don\u2019t want to go through an extensive process every time I need to sign something. It shouldn\u2019t be this hard."'
              cite="— Survey respondent"
            />
            <QuoteBlock
              quote='"The authentication steps are too bureaucratic. By the time I\u2019m done setting up, I\u2019ve lost patience entirely."'
              cite="— Survey respondent"
            />
            <QuoteBlock
              quote='"There are too many features I don\u2019t understand and will never use. It\u2019s overwhelming from the start."'
              cite="— Survey respondent"
            />
          </RevealSection>

          {/* 03 Research */}
          <RevealSection id="s-research">
            <SectionHeader num="03" title="Research & Discovery" />
            <BodyText>
              I designed and fielded a quantitative survey targeting people who
              had previously used digital signature tools. With over{" "}
              <strong className="font-[400] text-p-ink">200 responses</strong>,
              it gave us statistically meaningful signal on platform adoption,
              task completion frustrations, and the specific moments where users
              dropped off.
            </BodyText>
            <BodyText>
              The data pointed to a consistent pattern: the most capable platforms
              were too complex for casual users, while simpler alternatives lacked
              critical features like co-signing. We mapped the competitive landscape
              with this lens — rating each platform against both functional
              completeness and usability friction.
            </BodyText>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 my-6">
              <InsightCard
                label="Key finding"
                text="Most high-functionality platforms were gated behind B2B pricing or government bureaucracy — no viable free option existed with co-signing support."
              />
              <InsightCard
                label="Key finding"
                text="Users consistently cited onboarding complexity as the primary reason for abandonment — not lack of features."
              />
              <InsightCard
                label="Design opportunity"
                text="A streamlined, opinionated flow that surfaces only what the user needs at each step — with progressive disclosure for advanced options."
              />
              <InsightCard
                label="Design opportunity"
                text="A clear, minimal entry point that doesn't force users to understand the full feature set before completing their first task."
              />
            </div>
            <ImgPlaceholder caption="Early prototype screens — document list, upload flow, and co-signing configuration" />
          </RevealSection>

          {/* 04 Design Process */}
          <RevealSection id="s-process">
            <SectionHeader num="04" title="Design Process" />
            <BodyText>
              With research synthesis done, I moved into information architecture
              and low-fidelity wireframes covering three distinct user journeys:
              signing only, preparing and signing, and preparing a document for
              third-party signature. Each route had different complexity
              requirements and needed to feel equally approachable from the same
              entry point.
            </BodyText>
            <div className="my-6">
              <ProcessStep
                first
                num="01"
                title="Wireframes & flow definition"
                body="Low-fidelity wireframes for all three signing routes, with particular attention to the decision point where users choose their path — a recurring source of confusion in competitive products."
              />
              <ProcessStep
                num="02"
                title="Usability testing (think-aloud)"
                body="Facilitated a focal group session using the think-aloud method. Participants received pen and paper to annotate their experience while navigating paper prototypes. Focused on comprehension, not task completion speed."
              />
              <ProcessStep
                num="03"
                title="Iteration on navigation structure"
                body="Test feedback surfaced a key structural issue: the three-route selection screen added cognitive load without adding clarity. I collapsed it into a contextual dropdown, reducing steps and eliminating the moment of uncertainty."
              />
              <ProcessStep
                num="04"
                title="Dashboard rethink"
                body="The document dashboard originally previewed file thumbnails — users found it visually noisy and spatially wasteful. I redesigned it around a scannable list/grid toggle, which tested significantly better for comprehension and speed."
              />
              <ProcessStep
                num="05"
                title="High-fidelity prototype + pattern library"
                body="Built the final interactive prototype and a Bootstrap-based pattern library documenting components, states, and interaction rules — structured as handoff documentation for the development team."
              />
            </div>
            <ImgPlaceholder caption="High-fidelity screens — authentication, document review, sharing options, and dashboard views" />
          </RevealSection>

          {/* 05 Outcomes */}
          <RevealSection id="s-outcomes">
            <SectionHeader num="05" title="Outcomes" />
            <div
              className="grid my-6 border border-[var(--p-border)] rounded-[10px] overflow-hidden"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1px",
                background: "var(--p-border)",
              }}
            >
              <OutcomeCell
                num="200+"
                label="Survey responses informing design decisions"
              />
              <OutcomeCell
                num="3"
                label="Complete user flows, fully prototyped and validated"
              />
              <OutcomeCell
                num="1"
                label="Bootstrap pattern library delivered as dev handoff"
              />
            </div>
            <BodyText>
              The prototype served a dual purpose: a validated design deliverable
              for the client, and living documentation for the development team
              ahead of the platform's planned public launch. Every interaction
              decision was traceable back to a specific research finding — which
              made stakeholder alignment significantly easier.
            </BodyText>
            <BodyText>
              The two most impactful structural changes — collapsing the
              route-selection screen and rethinking the dashboard — both emerged
              from a single usability session. It reinforced something I carry
              into every project:{" "}
              <strong className="font-[400] text-p-ink">
                testing early with low fidelity surfaces the issues that matter
                most, before they're expensive to fix.
              </strong>
            </BodyText>
          </RevealSection>

        </main>

        {/* Sticky sidebar */}
        <aside
          className="hidden min-[900px]:flex flex-col gap-0 sticky top-20"
          aria-label="Page sections"
        >
          <div
            className="text-[0.65rem] tracking-[0.14em] uppercase text-[var(--p-muted)] mb-4 pb-3 border-b border-[var(--p-border)]"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            On this page
          </div>
          {SECTIONS.map(({ id, num, label }) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2.5 text-[0.78rem] py-2 border-b border-[var(--p-border)] no-underline transition-colors duration-200 relative pl-4"
                style={{
                  color: active ? "var(--p-ink)" : "var(--p-muted)",
                  fontWeight: active ? 400 : 300,
                  fontFamily: "var(--font-almarai), system-ui, sans-serif",
                }}
              >
                {/* Active accent bar */}
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-sm bg-[var(--p-accent)] transition-all duration-[250ms]"
                  style={{ height: active ? "16px" : "0px" }}
                />
                <span
                  className="text-[0.65rem] opacity-50"
                  style={{ color: "var(--p-muted)" }}
                >
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
      <div className="max-w-[1100px] mx-auto px-10 max-sm:px-6 py-16 flex items-center justify-between gap-8 max-sm:flex-col max-sm:items-start">
        <div>
          <div
            className="text-[0.72rem] tracking-[0.14em] uppercase text-[var(--p-muted)] mb-2"
            style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
          >
            Next case study
          </div>
          <div
            className="font-[400] tracking-[-0.03em] text-[var(--p-ink)]"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
              fontFamily: "var(--font-almarai), system-ui, sans-serif",
            }}
          >
            Norus — Design System
          </div>
        </div>
        <Link
          href="#"
          className="text-[2rem] text-[var(--p-muted)] no-underline shrink-0 transition-[transform,color] duration-[250ms] hover:text-[var(--p-ink)]"
          style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "translateX(6px)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.transform = "")
          }
        >
          →
        </Link>
      </div>
    </>
  );
}
