<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## TODO

- **Smooth scrolling**: Lenis was removed (commit history) because it conflicted with framer-motion's `useScroll` on case study pages — scroll would snap back near parallax images in production. We currently rely on native scroll + CSS `scroll-behavior: smooth` (see [app/globals.css](app/globals.css)). If we want JS-driven smoothing back, the proper fix is to switch to `lenis-react`'s `<ReactLenis root>` and sync it with framer-motion via a `MotionValue` driven by `lenis.on('scroll', ...)`. Don't reintroduce the manual `useEffect` setup — that's what broke before.
