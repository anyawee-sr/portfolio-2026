/**
 * Canonical origin ของเว็บ — จุดเดียวที่รู้ว่าเว็บนี้อยู่ URL ไหน
 *
 * แก้ค่านี้ที่เดียว แล้ว metadataBase (layout.tsx) + og:image URL +
 * sitemap.ts + robots.ts ตามไปเองทั้งหมด
 *
 * ห้าม inline URL นี้ที่อื่น — sitemap.ts / robots.ts ของ Next ไม่อ่าน
 * metadataBase ต้องใส่ absolute URL เอง ถ้าไม่รวมไว้ที่นี่จะกลายเป็นหลายที่
 * ที่ต้อง sync มือ
 *
 * ไม่มี trailing slash — path ที่ต่อท้ายเป็นคนกำหนด slash เอง (ดู sitemap.ts)
 */
export const siteUrl = "https://anyawee-sr.com";
