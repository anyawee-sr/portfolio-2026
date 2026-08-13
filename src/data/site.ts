/**
 * Canonical origin ของเว็บ — จุดเดียวที่รู้ว่าเว็บนี้อยู่ URL ไหน
 *
 * ตอนนี้ชี้ Vercel preview domain เพราะยังไม่มี custom domain (ดู
 * docs/adr/0004-hosting-on-vercel.md) วันที่โดเมนจริงพร้อม แก้ค่านี้ที่เดียว
 * แล้ว metadataBase + og:image URL + sitemap.ts (ยังไม่มี) ตามไปเองทั้งหมด
 *
 * ห้าม inline URL นี้ที่อื่น — sitemap.ts ของ Next ไม่อ่าน metadataBase
 * ต้องใส่ absolute URL เอง ถ้าไม่รวมไว้ที่นี่จะกลายเป็น 2 ที่ที่ต้อง sync มือ
 */
export const siteUrl = "https://portfolio-2026-tau-three.vercel.app";
