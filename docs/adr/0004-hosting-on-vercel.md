# 0004. Hosting on Vercel

## Status

Accepted

## Context

โปรเจกต์นี้ยังไม่เคยถูก deploy เลยตั้งแต่เริ่มเขียน — ไม่มี `vercel.json`, ไม่มี
`.github/workflows/`, ไม่มี CI ใดๆ component ครบตามลำดับที่ CLAUDE.md วางไว้แล้ว
(Hero → Header/Nav+Hamburger → PaperWall → Process → Exhibition → Footer) จึงถึงจุดที่ควรมี
URL จริงให้เปิดบนมือถือและเน็ตจริง แทนการเทสต์ผ่าน `next dev` บน LAN IP อย่างเดียว

โปรเจกต์นี้ไม่มี environment variable, ไม่มี API route/route handler/`middleware.ts`/server
action เลยสักจุด — `src/app/page.tsx` เป็น static server component ล้วน และ
`src/app/work/[slug]/page.tsx` มี `generateStaticParams()` ที่ prerender ทุกหน้าตอน build
เป็น SSG เต็มตัว

### ทำไมเลือก Vercel ไม่ใช่ static export ไป GitHub Pages

แม้วันนี้ทุกหน้าจะ prerender ได้หมดเป็น static HTML แล้วก็ตาม แต่ `next.config.ts:8` ตั้ง
`unoptimized: isDev` ซึ่งหมายความว่าบน production (`isDev` เป็น `false`) `next/image`
optimizer ยังทำงานอยู่ — resize/แปลง format รูปให้อัตโนมัติตาม device ที่ขอ ฟีเจอร์นี้ static
export (`output: "export"`) ทำไม่ได้เอง ต้องปิด optimizer ทิ้งหรือหา image loader ภายนอกมาแทน
Vercel รองรับทั้ง SSG และ image optimizer โดยไม่ต้องแลกอะไรเลย จึงเป็นตัวเลือกที่ตรงกับสถาปัตยกรรม
ปัจจุบันที่สุดโดยไม่ต้องเปลี่ยนโค้ดเพื่อรองรับ hosting

### ทำไม noindex ตั้งแต่รอบแรก

`src/app/layout.tsx:14` ตั้ง `robots: { index: false, follow: false }` ตั้งแต่ deploy ครั้งแรก
— ถ้าปล่อยให้ Google เก็บ `*.vercel.app` เข้า index วันที่ย้ายไป custom domain ทีหลังจะเหลือ
โดเมนชั่วคราวติดอันดับค้างอยู่ แข่งกับโดเมนจริง (duplicate content) และมีความเสี่ยงที่ recruiter
จะเจอเวอร์ชันที่ยังขัดไม่เสร็จผ่านการค้นหาโดยไม่ตั้งใจ ก่อนที่จะได้เห็นเวอร์ชันที่พร้อมส่งจริง

### ทำไมยังไม่ pin Node version

เครื่อง dev รัน Node v20.19.5 (EOL เมษายน 2026) ส่วน Vercel ใช้ default 22.x — `package.json`
ไม่มีทั้ง `engines` และ `packageManager` field เลือกรับความเสี่ยงนี้ไว้ตรงๆ เพราะ build เป็น
static ล้วน ไม่มี server runtime ที่พฤติกรรมต่างกันระหว่างเวอร์ชัน Node จะกระทบผู้ใช้จริง เป็นหนี้
ที่ตั้งใจก่อ ไม่ใช่ความประมาท

**Update (2026-08-13):** Node 20 EOL ผ่านมาแล้วจริง — Vercel เตือนว่า project ที่ใช้ Node 20
หรือเก่ากว่า build จะเริ่ม fail ตั้งแต่ 1 ต.ค. 2026 เช็คแล้ว `portfolio-2026` ไม่ติดกลุ่มนั้น
(Node.js Version ในหน้า Settings ขึ้น **24.x** ไปแล้ว ไม่ใช่ 22.x ที่เดาไว้ตอนเขียน ADR) ปิดหนี้
นี้แล้ว: pin `engines` + `@types/node` เป็น 24.x ใน `package.json` ให้ตรงกับ local และ Vercel

### ทำไมเก็บ Vercel project เดิมไว้ ไม่ทับ

`src/components/work-detail/bodies/EditingTaughtMeTiming.tsx:14` มีลิงก์ไป
`https://portfolio-rho-ten-15.vercel.app/` เป็น archive item ชื่อ "Web portfolio" ของพอร์ต
เวอร์ชันก่อนหน้า — ถ้าทับ project เดิมด้วยการ deploy ใหม่ ลิงก์ archive นี้จะกลายเป็นลิงก์วนกลับมา
หาเว็บตัวเองแทนที่จะเป็นของเก่าตามที่ตั้งใจ จึงสร้าง Vercel project ใหม่แยกจาก repo
`anyawee-sr/portfolio-2026` แล้วเก็บ project เดิมไว้เฉยๆ

### ทำไมไม่มี `vercel.json`

ทุกค่าที่ต้องการ (build command, install command, Next.js preset) เป็น default ของ Vercel
เมื่อ detect Next.js อยู่แล้ว ไม่มีค่าไหนต้อง override เพิ่มไฟล์เปล่าๆ ที่ไม่มีเนื้อหาจะกลายเป็น
config ที่ไม่มีใครรู้ว่าทำไมถึงมี — เพิ่มเมื่อมีเหตุผลจริงที่ต้อง override ค่า default เท่านั้น

## Decision

Deploy ผ่าน Vercel โดย import repo `anyawee-sr/portfolio-2026` เป็น project ใหม่ ไม่แก้ค่า
config ใดๆ ในหน้า import (ปล่อยให้ Vercel ใช้ Next.js preset ทั้งหมด), branch `main` map ตรงกับ
production ตาม default ของ Vercel, ตั้ง `robots: { index: false, follow: false }` ไว้จนกว่าจะมี
custom domain, และไม่ pin Node version ในรอบนี้

งานที่ตั้งใจ defer ไปหลัง deploy ครั้งแรก (custom domain, OG image, README, 404/loading/error
ธีมแบรนด์, pin Node, CI ฯลฯ) ไม่ได้บันทึกในไฟล์นี้ — ดูรายการทั้งหมดที่ [`../backlog.md`](../backlog.md)
ซึ่งเป็นเอกสารที่หดลงเรื่อยๆ ตามงานที่ทำเสร็จ ต่างจาก ADR ฉบับนี้ที่บันทึกเหตุผลไว้นิ่งๆ

## Consequences

- (+) ไม่ต้องเปลี่ยนสถาปัตยกรรมโค้ดเลยเพื่อ deploy — SSG + `next/image` optimizer ทำงานได้ตรงๆ
  บน Vercel โดยไม่ต้องปิดฟีเจอร์ไหนทิ้งเหมือนถ้าเลือก static export
- (+) `*.vercel.app` ที่ deploy รอบแรกจะไม่ถูก search engine เก็บไว้แข่งกับโดเมนจริงในอนาคต
- (+) ลิงก์ archive เก่าใน `EditingTaughtMeTiming.tsx` ยังใช้งานได้ตามเดิม ไม่กลายเป็นลิงก์วนเข้าตัวเอง
- (-) ~~build บน Vercel รันด้วย Node เวอร์ชันที่ไม่ตรงกับเครื่อง dev เสมอไป (22.x vs 20.19.5
  ในเครื่อง)~~ **แก้แล้ว 2026-08-13** — local อัปเป็น 24.x + ตั้ง `engines` ตรงกับ Vercel แล้ว
  (ดู Update ด้านบน)
- (-) ต้องมาเอา noindex ออกเองตอนมี custom domain พร้อม (จดไว้ใน `../backlog.md` แล้ว) ถ้าลืม
  เว็บจะไม่ถูก Google เก็บต่อไปเรื่อยๆ ทั้งที่พร้อมส่งให้คนอื่นดูแล้ว
