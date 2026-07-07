"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLightbox } from "./LightboxContext";

export function CaseStudyImage({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  caption?: string;
  priority?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<number>(-1);
  const { register, open } = useLightbox();

  useEffect(() => {
    indexRef.current = register({ src, alt, caption });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  const aspectRatio = `${src.width} / ${src.height}`;

  return (
    <div className="my-10 relative" ref={containerRef}>
      <div
        className="w-full rounded-[4px] overflow-hidden relative cursor-zoom-in"
        style={{ aspectRatio, boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }}
        onClick={() => open(indexRef.current)}
      >
        <motion.div
          style={{ y, position: "absolute", top: -24, bottom: -24, left: 0, right: 0 }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            placeholder="blur"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
          />
        </motion.div>
      </div>

      {caption && (
        <p
          className="text-xs text-[var(--p-muted)] text-center mt-3 tracking-[0.04em]"
          style={{ fontFamily: "var(--font-almarai), system-ui, sans-serif" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
