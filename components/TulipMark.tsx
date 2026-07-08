const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The nav logo tulip, tinted with the live --p-accent (time-of-day) color.
 * Uses CSS mask so the single-color pixel silhouette takes the accent fill;
 * the URL is basePath-prefixed here in JS (CSS url() wouldn't get basePath).
 */
export default function TulipMark({ size = 22 }: { size?: number }) {
  const url = `url(${basePath}/pixel-icons/flower.svg)`;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: "var(--p-accent)",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        transition: "background-color 0.7s ease",
      }}
    />
  );
}
