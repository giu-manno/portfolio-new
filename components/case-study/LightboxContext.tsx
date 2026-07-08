"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { StaticImageData } from "next/image";

interface ImageItem {
  src: StaticImageData;
  alt: string;
  caption?: string;
}

interface LightboxContextValue {
  register: (item: ImageItem) => number;
  open: (index: number) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used inside LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: React.ReactNode }) {
  // keyed by src path to prevent double-registration in React Strict Mode
  const registry = useRef<Map<string, number>>(new Map());
  const images = useRef<ImageItem[]>([]);
  const [state, setState] = useState<{ open: boolean; index: number; zoomed: boolean }>({
    open: false,
    index: 0,
    zoomed: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const register = useCallback((item: ImageItem) => {
    const key = item.src.src;
    if (registry.current.has(key)) return registry.current.get(key)!;
    const idx = images.current.length;
    images.current.push(item);
    registry.current.set(key, idx);
    return idx;
  }, []);

  const open = useCallback((index: number) => {
    setState({ open: true, index, zoomed: false });
  }, []);

  const close = () => setState((s) => ({ ...s, open: false, zoomed: false }));
  const prev = () => setState((s) => ({ ...s, index: (s.index - 1 + images.current.length) % images.current.length, zoomed: false }));
  const next = () => setState((s) => ({ ...s, index: (s.index + 1) % images.current.length, zoomed: false }));
  const toggleZoom = () => setState((s) => ({ ...s, zoomed: !s.zoomed }));

  // Keyboard navigation
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.open]);

  const current = images.current[state.index];
  const total = images.current.length;

  return (
    <LightboxContext.Provider value={{ register, open }}>
      {children}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {state.open && current && (
              <motion.div
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
                style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}
              >
                {/* Counter */}
                {total > 1 && (
                  <p
                    className="absolute top-5 left-0 right-0 text-center text-xs tracking-[0.14em] uppercase text-white/30"
                    style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                  >
                    {state.index + 1} / {total}
                  </p>
                )}

                {/* Close */}
                <button
                  className="absolute top-4 right-6 text-white/40 hover:text-white transition-colors text-3xl leading-none"
                  onClick={(e) => { e.stopPropagation(); close(); }}
                  aria-label="Close"
                >
                  ×
                </button>

                {/* Image */}
                <motion.div
                  key={state.index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="flex flex-col items-center gap-4 max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    src={current.src.src}
                    alt={current.alt}
                    animate={{ scale: state.zoomed ? 1.75 : 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="max-w-[90vw] max-h-[75vh] rounded-[4px] object-contain block select-none"
                    style={{ cursor: state.zoomed ? "zoom-out" : "zoom-in" }}
                    onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                    draggable={false}
                  />

                  {/* Caption */}
                  {current.caption && (
                    <p
                      className="text-sm text-white/50 text-center tracking-[0.04em] max-w-[560px] leading-[1.6]"
                      style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
                    >
                      {current.caption}
                    </p>
                  )}
                </motion.div>

                {/* Prev / Next */}
                {total > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-3xl leading-none px-3 py-2"
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-3xl leading-none px-3 py-2"
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {total > 1 && (
                  <div className="absolute bottom-6 flex gap-1.5">
                    {Array.from({ length: total }).map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setState((s) => ({ ...s, index: i, zoomed: false })); }}
                        className="transition-all rounded-full"
                        style={{
                          width: i === state.index ? 18 : 6,
                          height: 6,
                          background: i === state.index ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                        }}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </LightboxContext.Provider>
  );
}
