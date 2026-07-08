import type { MetadataRoute } from "next";

const SITE_URL = "https://giu-manno.github.io/portfolio-new";

// Static export requires this route to be non-dynamic.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/work/suite4energy", "/work/ades"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
