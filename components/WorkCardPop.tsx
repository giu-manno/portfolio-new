/**
 * Pop-out media for a WorkCard: a mask-cropped pixel background, a screen
 * cutout that rises and grows on hover, and a keyword marquee that fades in
 * behind it.
 *
 * Must be rendered inside a `group` element (the WorkCard root) — all hover
 * states key off `group-hover`. The parent also provides the clipping bounds
 * via `overflow-hidden`.
 *
 * Tuning knobs live in the constants below.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// On hover the mask slides down 43% while the background inside counter-slides
// up by the same amount — the cut line moves but the image stays put. Both are
// pure transforms (GPU-composited); animating `top` here caused layout+repaint
// of the heavy SVG backgrounds on every frame. The marquee bottom-aligns 6px
// above the cut line.
const MASK_SHIFT = "group-hover:translate-y-[43%]";
const MASK_COUNTER_SHIFT = "group-hover:-translate-y-[43%]";
const MARQUEE_BOTTOM = "bottom-[calc(57%+6px)]";

// Screen resting position and hover pop. Scaling from `origin-top` grows the
// screen downward/outward so the 48px rise never crops at the card top.
const SCREEN_REST_TOP = "top-[18%]";
const SCREEN_HOVER = "group-hover:-translate-y-12 group-hover:scale-[1.25]";

// Dual-screen (phone) layout: two staggered portrait cutouts. The corner
// radius is set per-axis in % so it tracks the phones' baked-in 32/360 radius
// at any rendered size.
const PHONE_RADIUS = "8.9% / 4.24%";
// On hover the phones also nudge apart horizontally (the 1.12 growth would
// otherwise close the gap between them): x-translate shifts from the -50%
// centering baseline.
const PHONE_1 =
  "left-[38%] top-[10%] w-[24%] group-hover:-translate-x-[57%] group-hover:-translate-y-8 group-hover:scale-[1.12]";
const PHONE_2 =
  "left-[63%] top-[30%] w-[21%] delay-75 group-hover:-translate-x-[43%] group-hover:-translate-y-6 group-hover:scale-[1.12]";

interface WorkCardPopProps {
  /** Pixel gradient background, full-bleed behind the screen. */
  bg: string;
  /** Screen cutout, cropped tight to the mockup edge. */
  screen: string;
  /** Second screen — switches to the staggered dual-phone layout. */
  screen2?: string;
  /** Alt text for the screen image (project title). */
  alt: string;
  /** Matches the WorkCard tall variant so the mask layer covers the card. */
  tall?: boolean;
  /** Marquee words shown behind the lifted screen on hover. */
  keywords?: string[];
}

export default function WorkCardPop({ bg, screen, screen2, alt, tall, keywords }: WorkCardPopProps) {
  return (
    <>
      {/* Background mask — the image inside is bottom-anchored at the card's
          full height; the mask and image counter-translate so the cut line
          moves while the image stays visually fixed */}
      <div
        className={`absolute inset-0 z-[1] rounded-[4px] overflow-hidden will-change-transform transition-transform duration-300 ease-out ${MASK_SHIFT}`}
      >
        <div
          className={`noise-overlay absolute inset-x-0 bottom-0 will-change-transform transition-transform duration-300 ease-out ${MASK_COUNTER_SHIFT}`}
          style={{
            height: tall ? 748 : 364,
            backgroundImage: `url(${basePath}${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* Keyword marquee — fades in behind the lifted screen on hover */}
      {keywords && keywords.length > 0 && (
        <div
          className={`absolute ${MARQUEE_BOTTOM} left-0 right-0 z-[1] overflow-hidden pointer-events-none opacity-0 transition-opacity duration-300 delay-150 group-hover:opacity-100`}
          style={{
            fontFamily: "var(--font-geist-pixel), 'Doto', monospace",
            // Fade the words in/out at the edges instead of hard-cropping them
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
          aria-hidden="true"
        >
          {/* Content duplicated once so the -50% marqueeScroll loop is seamless */}
          <div className="marquee-track flex w-max gap-14 pr-14">
            {[...keywords, ...keywords].map((k, i) => (
              <span key={i} className="whitespace-nowrap text-[clamp(18px,2.2vw,34px)] text-[#c8c8c4]">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Screen cutout(s) */}
      {screen2 ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}${screen}`}
            alt={alt}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: PHONE_RADIUS }}
            className={`absolute -translate-x-1/2 z-[2] max-w-none h-auto border border-[#ecece8] origin-top will-change-transform transition-transform duration-300 ease-out ${PHONE_1}`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}${screen2}`}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ borderRadius: PHONE_RADIUS }}
            className={`absolute -translate-x-1/2 z-[2] max-w-none h-auto border border-[#ecece8] origin-top will-change-transform transition-transform duration-300 ease-out ${PHONE_2}`}
          />
        </>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`${basePath}${screen}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`absolute ${SCREEN_REST_TOP} left-1/2 -translate-x-1/2 z-[2] w-[60%] max-w-none h-auto rounded-[4px] border border-[#ecece8] origin-top will-change-transform transition-transform duration-300 ease-out ${SCREEN_HOVER}`}
        />
      )}
    </>
  );
}
