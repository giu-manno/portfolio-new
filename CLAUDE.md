@AGENTS.md

## Image loading rules

Always use `next/image` (`<Image>`). Never use `<img>`.

**Every `<Image>` must have a `sizes` prop** unless it is a small fixed-size icon. Pick the right breakpoint values based on how wide the image actually renders.

**Above-the-fold images must have `priority`** — this preloads the image and sets `loading="eager"`, which is required for good LCP. Examples: hero images, avatars in the header, the first image on a case study page.

**Below-the-fold images must NOT have `priority`** — `next/image` lazy-loads by default, which is correct. Do not add `priority` speculatively.

**Static images should use `placeholder="blur"`** — import the image as a static asset so Next.js generates the blur data URL automatically.

Quick reference:
| Location | `priority` | `sizes` | `placeholder` |
|---|---|---|---|
| Hero / navbar | yes | set appropriately | if static import |
| First image on a page (LCP) | yes | set appropriately | if static import |
| Work cards (grid, below fold) | no | set appropriately | — |
| Case study hero image (30vh zone, LCP) | yes | `100vw` | if static import |
| Case study images (below fold) | no | already set in component | blur |
