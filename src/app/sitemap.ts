import type { MetadataRoute } from "next";

import { caseStudies } from "@/data/caseStudies";
import { siteUrl } from "@/data/site";

// `output: "export"` ใน next.config.ts บังคับให้ metadata route ประกาศตัวเป็น
// static ตรง ๆ ไม่งั้น build ล้ม — route นี้ไม่มี dynamic data อยู่แล้ว
export const dynamic = "force-static";

/**
 * Next ไม่ inject `metadataBase` ให้ route นี้ — ต้องต่อ absolute URL เอง
 * จาก `siteUrl` (SSoT เดียวกับ `metadataBase` ใน `layout.tsx`)
 *
 * ใส่ trailing slash ให้ตรงกับ `trailingSlash: true` ใน `next.config.ts` —
 * โดเมนจริงเสิร์ฟ `/work/<slug>/` ถ้า sitemap ชี้ path ไม่มี slash crawler
 * จะโดน redirect 1 hop ทุก URL
 *
 * ไม่ใส่ `lastModified` — `caseStudies` ไม่มีวันที่จริงต่อรายการ การยัด
 * build-time `new Date()` จะหลอก crawler ว่าทุกหน้าเปลี่ยนทุกครั้งที่ deploy
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...caseStudies.map((study) => `/work/${study.slug}/`)];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).href,
  }));
}
