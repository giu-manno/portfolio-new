"use client";

import CaseStudyLayout from "@/components/CaseStudyLayout";
import { palettes } from "@/content/palettes";
import {
  SectionHeader,
  BodyText,
  QuoteBlock,
  InsightCard,
  ProcessStep,
  OutcomeCell,
  ImgPlaceholder,
  RevealSection,
} from "@/components/case-study/primitives";
import { CaseStudyImage } from "@/components/case-study/CaseStudyImage";
import { useLightbox } from "@/components/case-study/LightboxContext";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image, { type StaticImageData } from "next/image";
import adesWireframes from "@/public/ades-casestudy-images/ades-wireframes.webp";
import adesShowcase from "@/public/ades-casestudy-images/ades-showcase.webp";
import adesHomepageCard from "@/public/ades-casestudy-images/ades-homepage-card.webp";
import adesOverviewNew from "@/public/ades-casestudy-images/ades-overview-new.webp";
import adesUsertest1 from "@/public/ades-casestudy-images/ades-usertest-1.webp";
import adesUsertest2 from "@/public/ades-casestudy-images/ades-usertest-2.webp";
import adesUsertest3 from "@/public/ades-casestudy-images/ades-usertest-3.webp";

function BentoCell({
  src, alt, caption, className, onOpen,
}: {
  src: StaticImageData; alt: string; caption?: string; className: string; onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-[4px] cursor-zoom-in ${className}`} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }} onClick={onOpen}>
      <motion.div style={{ y, position: "absolute", top: -18, bottom: -18, left: 0, right: 0 }}>
        <Image src={src} alt={alt} fill placeholder="blur" className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw" />
      </motion.div>
    </div>
  );
}

function UserTestingBento() {
  const { register, open } = useLightbox();
  const indices = useRef<number[]>([]);
  useEffect(() => {
    indices.current = [
      register({ src: adesUsertest1, alt: "User testing session — think-aloud with paper prototypes", caption: "User testing session — think-aloud method with paper prototypes" }),
      register({ src: adesUsertest2, alt: "Participant annotating the prototype", caption: "Participant annotating the prototype during the focal group session" }),
      register({ src: adesUsertest3, alt: "Facilitator observing user flow navigation", caption: "Facilitator observing user flow navigation and collecting feedback" }),
    ];
  }, []);
  return (
    <div className="grid grid-cols-3 gap-3 my-6">
      <BentoCell src={adesUsertest1} alt="User testing session" className="col-span-2 h-[260px]" onOpen={() => open(indices.current[0])} />
      <BentoCell src={adesUsertest2} alt="Participant annotating prototype" className="col-span-1 h-[260px]" onOpen={() => open(indices.current[1])} />
      <BentoCell src={adesUsertest3} alt="Facilitator observing navigation" className="col-span-3 h-[200px]" onOpen={() => open(indices.current[2])} />
    </div>
  );
}

const SECTIONS = [
  { id: "s-context",  num: "01", label: "Context" },
  { id: "s-problem",  num: "02", label: "Problem" },
  { id: "s-research", num: "03", label: "Research" },
  { id: "s-process",  num: "04", label: "Process" },
  { id: "s-outcomes", num: "05", label: "Outcomes" },
];

const META = [
  { label: "Role",         value: "Product Designer\nLead Researcher" },
  { label: "Timeline",     value: "Jul — Dec 2023" },
  { label: "Deliverables", value: "Research · Pattern Library · Interactive Prototype" },
];

export default function AdesCaseStudy() {
  const { from, to, accent } = palettes.ades;
  return (
    <CaseStudyLayout
      heroGradient={`linear-gradient(135deg, ${from} 0%, ${to} 100%)`}
      heroImage={adesHomepageCard}
      accentColor={accent}
      eyebrow="Case Study · LabSEC / UFSC"
      title="Ades"
      tagline="Designing a public digital signature platform from research to prototype — built to be free, accessible, and genuinely easier to use than anything else on the market."
      meta={META}
      sections={SECTIONS}
      nextProject={{ title: "Suite 4 Energy — Norus", href: "/work/suite4energy" }}
    >
      {/* 01 Context */}
      <RevealSection id="s-context">
        <SectionHeader num="01" title="Context" />
        <BodyText>
          LabSEC is a security and cryptography lab at the Federal University of
          Santa Catarina (UFSC), with deep expertise in digital certificate
          infrastructure. Their client had a clear technical vision for a new
          digital signature platform —{" "}
          <strong className="font-[400] text-p-ink">Ades</strong> — but no
          validated understanding of what users actually needed from it.
        </BodyText>
        <BodyText>
          The product would enter a market dominated by large B2B players and
          government-owned platforms. The opportunity was specific: create a{" "}
          <strong className="font-[400] text-p-ink">free, public alternative</strong>{" "}
          that matched enterprise-level functionality without the bureaucracy that
          made existing tools so frustrating to use.
        </BodyText>
      </RevealSection>

      {/* 02 Problem */}
      <RevealSection id="s-problem">
        <SectionHeader num="02" title="The Problem" />
        <BodyText>
          The client understood their technology deeply but had significant blind
          spots around the user experience landscape — what competitors actually
          felt like to use, and what pain points were driving users away from
          existing platforms.
        </BodyText>
        <BodyText>
          Rather than designing on assumptions, we made the case for a structured
          research phase first. The core question:{" "}
          <strong className="font-[400] text-p-ink">
            what makes people abandon digital signature tools, and what would make
            them stay?
          </strong>
        </BodyText>
        <QuoteBlock
          quote={`"I don't want to go through an extensive process every time I need to sign something. It shouldn't be this hard."`}
          cite="— Survey respondent"
        />
        <QuoteBlock
          quote={`"The authentication steps are too bureaucratic. By the time I'm done setting up, I've lost patience entirely."`}
          cite="— Survey respondent"
        />
        <QuoteBlock
          quote={`"There are too many features I don't understand and will never use. It's overwhelming from the start."`}
          cite="— Survey respondent"
        />
      </RevealSection>

      {/* 03 Research */}
      <RevealSection id="s-research">
        <SectionHeader num="03" title="Research & Discovery" />
        <BodyText>
          I designed and fielded a quantitative survey targeting people who had
          previously used digital signature tools. With over{" "}
          <strong className="font-[400] text-p-ink">200 responses</strong>, it
          gave us statistically meaningful signal on platform adoption, task
          completion frustrations, and the specific moments where users dropped
          off.
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
        <CaseStudyImage
          src={adesWireframes}
          alt="Early wireframe screens — document list, upload flow, and co-signing configuration"
          caption="Early prototype screens — document list, upload flow, and co-signing configuration"
        />
      </RevealSection>

      {/* 04 Design Process */}
      <RevealSection id="s-process">
        <SectionHeader num="04" title="Design Process" />
        <BodyText>
          With research synthesis done, I moved into information architecture and
          low-fidelity wireframes covering three distinct user journeys: signing
          only, preparing and signing, and preparing a document for third-party
          signature. Each route had different complexity requirements and needed
          to feel equally approachable from the same entry point.
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
          <UserTestingBento />
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
        <CaseStudyImage
          src={adesOverviewNew}
          alt="High-fidelity screens — authentication, document review, sharing options, and dashboard views"
          caption="High-fidelity screens — authentication, document review, sharing options, and dashboard views"
        />
      </RevealSection>

      {/* 05 Outcomes */}
      <RevealSection id="s-outcomes">
        <SectionHeader num="05" title="Outcomes" />
        <CaseStudyImage
          src={adesShowcase}
          alt="High-fidelity screens — authentication, document review, sharing options, and dashboard views"
        />
        <div
          className="grid my-6 border border-[var(--p-border)] rounded-[4px] overflow-hidden"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--p-border)" }}
        >
          <OutcomeCell num="200+" label="Survey responses informing design decisions" />
          <OutcomeCell num="3"    label="Complete user flows, fully prototyped and validated" />
          <OutcomeCell num="1"    label="Bootstrap pattern library delivered as dev handoff" />
        </div>
        <BodyText>
          The prototype served a dual purpose: a validated design deliverable for
          the client, and living documentation for the development team ahead of
          the platform's planned public launch. Every interaction decision was
          traceable back to a specific research finding — which made stakeholder
          alignment significantly easier.
        </BodyText>
        <BodyText>
          The two most impactful structural changes — collapsing the
          route-selection screen and rethinking the dashboard — both emerged from
          a single usability session. It reinforced something I carry into every
          project:{" "}
          <strong className="font-[400] text-p-ink">
            testing early with low fidelity surfaces the issues that matter most,
            before they're expensive to fix.
          </strong>
        </BodyText>
      </RevealSection>
    </CaseStudyLayout>
  );
}
