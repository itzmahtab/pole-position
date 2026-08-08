import type { MetadataRoute } from "next";
import { appBaseUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const base = appBaseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dev/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
