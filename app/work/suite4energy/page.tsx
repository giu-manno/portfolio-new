"use client";

import CaseStudyLayout from "@/components/CaseStudyLayout";
import { CaseStudyImage } from "@/components/case-study/CaseStudyImage";
import s4eCloseup       from "@/public/s4e-casestudy-images/s4e-closeup.webp";
import s4eSitemap       from "@/public/s4e-casestudy-images/s4e-sitemap.webp";
import s4eWireframes    from "@/public/s4e-casestudy-images/s4e-wireframes.jpg";
import s4eMediumfi      from "@/public/s4e-casestudy-images/s4e-mediumfi.webp";
import s4eScreens       from "@/public/s4e-casestudy-images/s4e-screens.webp";
import {
  SectionHeader,
  BodyText,
  QuoteBlock,
  InsightCard,
  ProcessStep,
  OutcomeCell,
  RevealSection,
  NdaBanner,
  HmwCallout,
} from "@/components/case-study/primitives";

// Palette manually set — run `node scripts/extract-palette.mjs` once images are added.
const HERO_GRADIENT = "linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)";
const ACCENT_COLOR  = "#1e6bb8"; // ~5:1 on --p-bg

const SECTIONS = [
  { id: "s-context",      num: "01", label: "Context" },
  { id: "s-challenge",    num: "02", label: "Challenge" },
  { id: "s-discovery",    num: "03", label: "Discovery & IA" },
  { id: "s-wireframes",   num: "04", label: "Wireframes" },
  { id: "s-navigation",   num: "05", label: "Navigation" },
  { id: "s-design-system",num: "06", label: "Design System" },
  { id: "s-outcomes",     num: "07", label: "Outcomes" },
];

const META = [
  { label: "Role",        value: "Product Designer · UI Lead" },
  { label: "Timeline",    value: "March 2024 — February 2025" },
  { label: "Deliverables",value: "IA · Wireframes · Mid-fidelity Prototype" },
];

export default function Suite4EnergyCaseStudy() {
  return (
    <CaseStudyLayout
      heroGradient={HERO_GRADIENT}
      heroImage={s4eCloseup}
      accentColor={ACCENT_COLOR}
      eyebrow="Case Study · Norus"
      title="Suite 4 Energy"
      tagline="Unifying a fragmented suite of enterprise energy products into a single, coherent platform — from information architecture to navigation system."
      meta={META}
      sections={SECTIONS}
      nextProject={{ title: "Ades — Digital Signature Platform", href: "/work/ades" }}
      // TODO: re-enable when password gate is ready: password="key" slug="suite4energy"
    >
      <NdaBanner />

      {/* 01 Context */}
      <RevealSection id="s-context">
        <SectionHeader num="01" title="Context" />
        <BodyText>
          Norus provides a portfolio of products covering front, back, and
          middle-office operations for Brazil's free energy market — a sector
          where consumers can actively choose their energy suppliers. The products
          ranged from trading dashboards to contract management tools, each
          launched at different points in time, each with its own visual language
          and interaction logic.
        </BodyText>
        <BodyText>
          The ask was ambitious: consolidate everything into a unified suite —
          Suite 4 Energy — with a shared identity, a single login, and a
          cross-product database, without stripping each tool of its functional
          depth or individual character.
        </BodyText>
        <QuoteBlock
          quote='"We wish to develop a suite that unifies all of our products, with a consistent visual identity and ease-of-use even with complex functionalities."'
          cite="— Client stakeholder"
        />
      </RevealSection>

      {/* 02 Challenge */}
      <RevealSection id="s-challenge">
        <SectionHeader num="02" title="The Challenge" />
        <BodyText>
          The products were built across a five-year span, with distinct
          codebases, visual styles, and navigation patterns. Bringing them
          together meant solving a structural problem first: how do you give
          users a single front door to multiple complex applications, without
          flattening what makes each one work?
        </BodyText>
        <BodyText>
          The suite model introduced a new set of product-level requirements —
          unified authentication, an admin layer, cross-app data relationships,
          and a navigation system flexible enough to serve very different tools
          from the same shell.
        </BodyText>
        <HmwCallout>
          How might we connect many different products in one singular interface?
        </HmwCallout>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 my-6">
          <InsightCard
            label="Constraint"
            text="Products launched 1–5 years apart with inconsistent visual languages and navigation structures."
          />
          <InsightCard
            label="Constraint"
            text="Each app had deep, intricate navigation trees that couldn't be collapsed without losing core functionality."
          />
          <InsightCard
            label="Opportunity"
            text="A shared shell layer — login, settings, admin, app switcher — that sits above the individual products."
          />
          <InsightCard
            label="Opportunity"
            text="A color-coded identity system giving each app its own personality within a unified frame."
          />
        </div>
      </RevealSection>

      {/* 03 Discovery & IA */}
      <RevealSection id="s-discovery">
        <SectionHeader num="03" title="Discovery & IA" />
        <BodyText>
          Before any UI decisions, I mapped the information architecture of each
          existing product — cataloguing navigation levels, surfacing core flows,
          and identifying what was app-specific versus what could belong to a
          shared layer. This was materialized through sitemaps and user flow
          diagrams for each product, then a unified flow for suite-level
          interactions: login, authentication, admin routes, and the
          app-switching experience.
        </BodyText>
        <BodyText>
          This phase was critical for scoping. It made visible just how much
          complexity we were working with — and where the real design problem
          lived. The challenge wasn't styling; it was structural.
        </BodyText>
        <CaseStudyImage
          src={s4eSitemap}
          alt="Information architecture mapping across all suite products"
          caption="Information architecture mapping across all suite products — surfacing shared flows and app-specific navigation trees"
        />
      </RevealSection>

      {/* 04 Wireframes */}
      <RevealSection id="s-wireframes">
        <SectionHeader num="04" title="Wireframes" />
        <BodyText>
          With the architecture clear, I designed a set of reusable layout
          templates to cover the recurring interface patterns across the suite:
          data tables, dashboards, list views, and detail screens. These formed
          a shared foundation each app could build on, rather than designing
          every screen from scratch.
        </BodyText>
        <BodyText>
          Alongside these, I designed the suite-level screens — home, settings,
          app list, and onboarding — that would exist above and between the
          individual products.
        </BodyText>
        <div className="my-6">
          <ProcessStep
            first
            num="01"
            title="Layout inventory"
            body="Identified the 6–8 core layout types shared across all apps: table, dashboard, list, form, detail, and empty state."
          />
          <ProcessStep
            num="02"
            title="Suite-level screens"
            body="Designed the outer shell: home, app switcher, settings, and authentication flows."
          />
          <ProcessStep
            num="03"
            title="Navigation exploration"
            body="Explored how to surface both app-level and suite-level navigation simultaneously without overwhelming the user."
          />
          <ProcessStep
            num="04"
            title="Concept validation"
            body="Tested layouts internally and with stakeholders before moving to mid-fidelity."
          />
        </div>
        <CaseStudyImage
          src={s4eWireframes}
          alt="Wireframe explorations — reusable layout templates and suite navigation concepts"
          caption="Wireframe explorations — reusable layout templates and suite navigation concepts"
        />
      </RevealSection>

      {/* 05 Navigation System */}
      <RevealSection id="s-navigation">
        <SectionHeader num="05" title="The Navigation System" />
        <BodyText>
          The thorniest problem was navigation. Each app had its own multi-level
          information tree. The suite added another layer on top. Surfacing both
          simultaneously — without one swallowing the other — required real
          structural thinking.
        </BodyText>
        <BodyText>
          The solution was a nested sidebar system: a primary sidebar for
          suite-level navigation, and a secondary sidebar that appeared
          contextually when an app was active, overlaying the primary. Each app
          was assigned its own color scheme, making context switches visually
          immediate. Suite-level navigation remained accessible even from deep
          within an app.
        </BodyText>
        <BodyText>
          It sounds complex on paper. In practice, it reduced cognitive overhead
          significantly — users always knew where they were, and always had a
          clear path out.
        </BodyText>
        <QuoteBlock quote='"The secondary sidebar appeared the moment an app was accessed — overlaying the suite sidebar, preserving access to both layers simultaneously."' />
        <CaseStudyImage
          src={s4eMediumfi}
          alt="Mid-fidelity screens — nested sidebar with per-app color schemes and dual-layer navigation"
          caption="Mid-fidelity screens — nested sidebar with per-app color schemes and dual-layer navigation"
        />
      </RevealSection>

      {/* 06 Design System */}
      <RevealSection id="s-design-system">
        <SectionHeader num="06" title="Design System" />
        <BodyText>
          Alongside the navigation and layout work, I established the visual and
          component foundations for the suite using Material UI (MUI) as the
          underlying system. MUI's component library provided a robust,
          accessible baseline — allowing the team to move faster without
          sacrificing consistency or engineering quality.
        </BodyText>
        <BodyText>
          On top of MUI, I defined a token layer specific to Suite 4 Energy:
          color schemes per app, typography scale, spacing rules, and component
          overrides that gave the suite its own identity while remaining fully
          compatible with the underlying MUI architecture. This meant the design
          system was both immediately usable by developers and extensible as the
          product scaled.
        </BodyText>
        <BodyText>
          The decision to build on MUI was deliberate: it reduced the surface
          area of custom component work, kept accessibility standards built in
          by default, and ensured that the handoff between design and engineering
          was grounded in a shared, well-documented language.
        </BodyText>
        <QuoteBlock quote='"Building on MUI meant developers and designers were working from the same mental model — which made every conversation about components faster and every handoff more precise."' />
      </RevealSection>

      {/* 07 Outcomes */}
      <RevealSection id="s-outcomes">
        <SectionHeader num="07" title="Outcomes" />
        <CaseStudyImage
          src={s4eScreens}
          alt="Final mid-fidelity screens across the Suite 4 Energy platform"
          caption="Final mid-fidelity screens across the Suite 4 Energy platform"
        />
        <div
          className="grid my-6 border border-[var(--p-border)] rounded-[4px] overflow-hidden"
          style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--p-border)" }}
        >
          <OutcomeCell num="5+"  label="Existing products unified under a single navigation shell" />
          <OutcomeCell num="8"   label="Reusable layout templates covering the full range of enterprise UI patterns" />
          <OutcomeCell num="1"   label="MUI-based design system establishing visual and component rules for future expansion" />
        </div>
        <BodyText>
          The mid-fidelity prototype served as a proof-of-concept for the nested
          navigation approach — validating the structural model before committing
          to high-fidelity execution. It gave developers, PMs, and stakeholders
          a shared reference point for what "unified" actually meant in practice.
        </BodyText>
        <BodyText>
          The deeper impact was organizational: by establishing a shared layout
          language, navigation model, and MUI-grounded component system, the
          project created a foundation that individual app teams could build on
          independently — without diverging visually or structurally.{" "}
          <strong className="font-[400] text-p-ink">
            The design system work wasn't just aesthetic; it was the connective
            tissue that made a fragmented product portfolio feel like a single
            product.
          </strong>
        </BodyText>
      </RevealSection>
    </CaseStudyLayout>
  );
}
