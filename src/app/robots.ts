import type { MetadataRoute } from "next";

import { siteUrl } from "@/data/site";

// `output: "export"` บังคับให้ metadata route ประกาศตัวเป็น static (ดู sitemap.ts)
export const dynamic = "force-static";

/**
 * `robots.txt` / `sitemap.xml` เป็น metadata route แบบมีนามสกุลไฟล์ —
 * `trailingSlash: true` ไม่ applies ปล่อยให้เป็น `/sitemap.xml` ตรง ๆ
 *
 * `sitemap` ต้องเป็น absolute URL — ต่อจาก `siteUrl` (SSoT) เหมือน sitemap.ts
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
