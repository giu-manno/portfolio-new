/**
 * extract-palette.mjs
 *
 * Extracts a vibrant color palette from case study images, runs WCAG
 * contrast checks, and writes the result to content/palettes.ts.
 *
 * Usage:
 *   node scripts/extract-palette.mjs
 *
 * Add new case studies to the CASE_STUDIES map below, then re-run.
 */

import { Vibrant } from "node-vibrant/node";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Config ────────────────────────────────────────────────────────────────────
const CASE_STUDIES = {
  ades: [
    "public/ades-casestudy-images/Frame 4 4.png",
    "public/ades-casestudy-images/Group 85.png",
  ],
};

// ── Filtering thresholds ──────────────────────────────────────────────────────
const MIN_SATURATION = 0.20; // reject grays
const MIN_LIGHTNESS  = 0.12; // reject near-black
const MAX_LIGHTNESS  = 0.88; // reject near-white

// ── Contrast targets (WCAG) ───────────────────────────────────────────────────
const HERO_BG          = "#111110"; // approximate mid of gradient — we check `from` vs white
const CONTENT_BG       = "#FAFAF9"; // --p-bg, where accent is used as text/border
const HERO_TEXT        = "#FFFFFF";
const MIN_CONTRAST_HERO   = 3.0;    // AA Large (big display heading on dark bg)
const MIN_CONTRAST_ACCENT = 4.5;    // AA Normal (small text / UI elements on light bg)

// ── Color math ────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r, g, b) {
  return `#${Math.round(r).toString(16).padStart(2, "0")}${Math.round(g).toString(16).padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
}

/** sRGB channel → linear light */
function linearize(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/** WCAG relative luminance of a hex color */
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/** WCAG contrast ratio between two hex colors */
function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const light = Math.max(l1, l2);
  const dark  = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

/** Convert RGB (0–255) to HSL (0–1) */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6;
  }
  return [h, s, l];
}

function hslToHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Adjust a color's lightness until it achieves `minRatio` contrast against
 * `bgHex`. Pass direction = "darken" when the color is on a light bg,
 * "lighten" when it's on a dark bg.
 */
function ensureContrast(hex, bgHex, minRatio, direction = "darken") {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex));
  const step = 0.01;
  let current = l;
  let adjusted = hex;
  const maxIter = 90;

  for (let i = 0; i < maxIter; i++) {
    if (contrastRatio(adjusted, bgHex) >= minRatio) break;
    current = direction === "darken"
      ? Math.max(0, current - step)
      : Math.min(1, current + step);
    adjusted = hslToHex(h, s, current);
  }

  return adjusted;
}

function darkenHsl(h, s, l, amount = 0.22) {
  return hslToHex(h, s, Math.max(0.06, l - amount));
}

// ── Swatch helpers ────────────────────────────────────────────────────────────

function allSwatches(palette) {
  return Object.values(palette).filter(Boolean);
}

function score(swatch) {
  const [, s, l] = rgbToHsl(...swatch.rgb);
  const proximityToMid = 1 - Math.abs(l - 0.45);
  return s * 0.6 + proximityToMid * 0.2 + (swatch.population / 10000) * 0.2;
}

function filterVibrant(swatches) {
  return swatches.filter((sw) => {
    const [, s, l] = rgbToHsl(...sw.rgb);
    return s >= MIN_SATURATION && l >= MIN_LIGHTNESS && l <= MAX_LIGHTNESS;
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function extractForSlug(slug, imagePaths) {
  const allCandidates = [];

  for (const rel of imagePaths) {
    const abs = resolve(root, rel);
    try {
      const palette = await Vibrant.from(abs).getPalette();
      allCandidates.push(...filterVibrant(allSwatches(palette)));
    } catch (e) {
      console.warn(`  ⚠️  Could not read ${rel}: ${e.message}`);
    }
  }

  if (allCandidates.length === 0) {
    console.warn(`  ⚠️  No vibrant colors found for "${slug}", using fallback.`);
    return { from: "#1a1a2e", to: "#0f0f1a", accent: "#888884" };
  }

  allCandidates.sort((a, b) => score(b) - score(a));
  const primary = allCandidates[0];
  const [h, s, l] = rgbToHsl(...primary.rgb);

  // ── Gradient ────────────────────────────────────────────────────────────────
  // Ensure white text has ≥ 3:1 contrast on the hero `from` color.
  // If the extracted color is too light, darken it until it passes.
  let from = rgbToHex(...primary.rgb);
  const contrastBefore = contrastRatio(from, HERO_TEXT);
  if (contrastBefore < MIN_CONTRAST_HERO) {
    from = ensureContrast(from, HERO_TEXT, MIN_CONTRAST_HERO, "darken");
    console.log(`  ↓ darkened "from" for contrast (was ${contrastBefore.toFixed(2)}:1 → now ${contrastRatio(from, HERO_TEXT).toFixed(2)}:1)`);
  }

  const [fh, fs, fl] = rgbToHsl(...hexToRgb(from));
  const to = darkenHsl(fh, fs, fl, 0.22);

  // ── Accent ──────────────────────────────────────────────────────────────────
  // Stay in the same hue family as the primary — pick the most saturated
  // candidate within ±0.12 hue of the primary, then contrast-adjust.
  let accent = (() => {
    const sameFamily = allCandidates.filter((sw) => {
      const [sh] = rgbToHsl(...sw.rgb);
      return Math.abs(sh - h) <= 0.12;
    });
    const best = sameFamily.sort((a, b) => {
      const [, sa] = rgbToHsl(...a.rgb);
      const [, sb] = rgbToHsl(...b.rgb);
      return sb - sa;
    })[0];
    return best ? rgbToHex(...best.rgb) : rgbToHex(...primary.rgb);
  })();

  const accentContrastBefore = contrastRatio(accent, CONTENT_BG);
  if (accentContrastBefore < MIN_CONTRAST_ACCENT) {
    accent = ensureContrast(accent, CONTENT_BG, MIN_CONTRAST_ACCENT, "darken");
    console.log(`  ↓ darkened accent for contrast (was ${accentContrastBefore.toFixed(2)}:1 → now ${contrastRatio(accent, CONTENT_BG).toFixed(2)}:1)`);
  }

  console.log(`  ✓ from=${from} (${contrastRatio(from, HERO_TEXT).toFixed(1)}:1 on white)  to=${to}  accent=${accent} (${contrastRatio(accent, CONTENT_BG).toFixed(1)}:1 on bg)`);
  return { from, to, accent };
}

async function main() {
  console.log("Extracting palettes…\n");
  const results = {};

  for (const [slug, paths] of Object.entries(CASE_STUDIES)) {
    console.log(`→ ${slug}`);
    results[slug] = await extractForSlug(slug, paths);
  }

  const content = [
    "// Auto-generated by scripts/extract-palette.mjs — do not edit manually.",
    "// Re-run `node scripts/extract-palette.mjs` after adding or changing images.",
    "",
    "export interface CaseStudyPalette {",
    "  from:   string; // gradient start",
    "  to:     string; // gradient end",
    "  accent: string; // accent color (≥ 4.5:1 on --p-bg)",
    "}",
    "",
    "export const palettes: Record<string, CaseStudyPalette> = {",
    ...Object.entries(results).map(
      ([slug, { from, to, accent }]) =>
        `  ${slug}: { from: "${from}", to: "${to}", accent: "${accent}" },`
    ),
    "};",
    "",
  ].join("\n");

  writeFileSync(resolve(root, "content/palettes.ts"), content, "utf8");
  console.log(`\n✅  Written to content/palettes.ts`);
}

main().catch((e) => { console.error(e); process.exit(1); });
