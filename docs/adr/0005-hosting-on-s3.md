# 0005. Hosting on S3

## Status

Accepted

Supersedes [ADR-0004](0004-hosting-on-vercel.md).

## Context

ADR-0004 เลือก Vercel เพราะ deploy ได้โดยไม่ต้องแตะ config เลย และเก็บ `next/image` optimizer
ไว้ใช้บน production ตั้งแต่ตอนนั้นเว็บถูก deploy จริง component ครบทุกตัว และเพิ่งได้ custom domain
`anyawee-sr.com` มา (ดู `src/data/site.ts`) — ถึงจุดที่ต้องตัดสินใจเรื่อง hosting ระยะยาว

### ทำไมย้ายออกจาก Vercel

เหตุผลไม่ใช่ข้อเสียเชิงเทคนิคของ Vercel — Vercel ทำงานได้ตามที่ ADR-0004 คาดไว้ทุกอย่าง แต่มัน
**ซ่อนขั้นตอน deploy ทั้งหมดไว้หลัง dashboard** push แล้วเว็บขึ้นเอง โดยไม่ต้องรู้ว่าระหว่างนั้น
เกิดอะไรบ้าง

เจ้าของโปรเจกต์ตั้งใจใช้พอร์ตตัวนี้เป็นแบบฝึกหัด:

- อยากทวนความรู้ AWS ที่มีอยู่แล้วให้กลับมาใช้งานได้จริง — S3, IAM, OIDC federation, CloudFront
- อยากเห็น deploy pipeline ครบทุก step ตั้งแต่ `next build` → auth เข้า cloud → อัปไฟล์ขึ้น
  storage → invalidate cache แทนที่จะเป็นกล่องดำที่ "ได้ผลลัพธ์แต่ไม่รู้กลไก"
- มี AWS account ใช้อยู่แล้ว — วาง hosting ไว้ที่เดียวกัน ลด vendor ที่ต้องดูแล

แลกมากับการเสียความสะดวกแบบ zero-config ของ Vercel ในบริบทของโปรเจกต์นี้ (พอร์ตส่วนตัว ไม่ใช่งาน
ที่ต้อง ship เร็ว) เป็นการแลกที่คุ้ม — process ที่ช้าลงแต่เห็นทุกขั้นคือ **สิ่งที่ตั้งใจจะได้** ไม่ใช่
ต้นทุนที่ต้องทน

### ทำไม static export ถึงไม่เจ็บอย่างที่ ADR-0004 กลัว

ADR-0004 ไม่เลือก static export เพราะจะเสีย `next/image` optimizer (resize/แปลง format ตาม device
อัตโนมัติ) แต่พอถึงเวลาจริง:

- ทุก route เป็น SSG เต็มตัวอยู่แล้ว — `src/app/page.tsx` เป็น static server component และ
  `src/app/work/[slug]/page.tsx` มี `generateStaticParams()` ที่ prerender ทุกหน้า ไม่มี route
  ไหนต้องการ server runtime เลย (ยืนยันเดิมจาก ADR-0004)
- รูปในเว็บยังมีน้อย และหลายจุดเป็น decoration ที่คุมขนาดจาก CSS อยู่แล้ว — การเสีย optimizer แปลว่า
  รูปถูกเสิร์ฟตามไฟล์ต้นฉบับเป๊ะ ๆ ยอมรับได้ในสเกลนี้

`next.config.ts` จึงตั้ง `output: "export"` + `images.unoptimized: true` + `trailingSlash: true`
(2026-08-28) — `next build` คาย `out/` ที่เป็น static HTML ล้วน อัปขึ้น S3 ได้ตรง ๆ

## Decision

Deploy static export ขึ้น S3 ผ่าน GitHub Actions

**Build** — `next build` ด้วย `output: "export"` → `out/` (static HTML + asset ทั้งหมด)

**Pipeline** — `.github/workflows/deploy.yml` trigger ที่ `push` เข้า `main`:

1. `actions/setup-node` (อ่าน Node version จาก `engines` ใน `package.json` จุดเดียว) → `npm ci` →
   `npm run build`
2. `aws-actions/configure-aws-credentials` แลก GitHub OIDC token เป็น session ชั่วคราวของ role
   `arn:aws:iam::891376940165:role/GitHubActionsS3Role` — **ไม่มี AWS access key ค้างใน repo
   secret** workflow ขอสิทธิ์ `id-token: write` เท่านั้น
3. `aws s3 sync ./out s3://anyawee-sr.com --delete` (region `ap-southeast-1`, bucket ตั้งชื่อ
   ตรงกับโดเมน เปลี่ยนจากชื่อ generated เดิมเมื่อ 2026-09-01) — `Cache-Control:
   max-age=300, must-revalidate` เท่ากันทุกไฟล์

purge CDN cache หลัง deploy ยังทำมือที่ Cloudflare (ดู `docs/backlog.md`) — ไม่ทำใน workflow
เพราะ CDN เป็นของชั่วคราว จะทำ invalidation อัตโนมัติตอนย้าย CloudFront

**IAM** — 2 ไฟล์นิยาม policy ตอนนี้ยังลอยอยู่ที่ root ของ repo ยังไม่ commit เข้าที่อยู่ถาวร เป็น
snapshot ของสิ่งที่ตั้งด้วยมือบน AWS ไม่ใช่ IaC ที่ apply อัตโนมัติ:

- `s3-policy.json` — `PutObject`/`GetObject`/`ListBucket`/`DeleteObject` เฉพาะ bucket `anyawee-sr.com`
- `trust-policy.json` — trust `token.actions.githubusercontent.com` (OIDC) จำกัดให้ assume role
  ได้เฉพาะจาก repo นี้ branch `main`

**TLS + CDN** — โดเมน `anyawee-sr.com` เสิร์ฟผ่าน HTTPS ซึ่ง S3 website endpoint ทำเองไม่ได้ (HTTP
อย่างเดียว) จึงต้องมี CDN คั่นหน้า bucket ทำ TLS + edge cache

แผนเดิมคือ CloudFront แต่ตอนนี้ยังเปิดใช้ไม่ได้ — ติดขั้นตอน account verify ของ AWS เปิด case ให้
ฝ่าย support แล้ว อยู่ระหว่างรอดำเนินการ **ระหว่างรอใช้ Cloudflare คั่นหน้า S3 แทน** (Cloudflare
proxy ทำ TLS ที่ edge, origin ชี้กลับมาที่ bucket) พอ account verify ผ่านค่อยย้ายมา CloudFront ตาม
แผนเดิม — config ของทั้ง Cloudflare ตอนนี้และ CloudFront ในอนาคต **ยังไม่ถูกบันทึกใน repo**

## Consequences

- (+) deploy path มองเห็นครบทุก step — build, auth, upload อยู่ใน `deploy.yml` ทั้งหมด ไม่มีอะไร
  ซ่อนหลัง dashboard ตรงกับเป้าหมายการเรียนรู้ที่เป็นเหตุผลของการย้าย
- (+) ไม่มี long-lived cloud credential ในระบบ — GitHub OIDC ออก token อายุสั้นต่อ run สิทธิ์ผูก
  กับ repo+branch ผ่าน trust policy
- (+) hosting อยู่บน AWS account เดิมที่มีอยู่แล้ว — vendor เดียว
- (+) ปัญหา `*.vercel.app` preview domain แข่ง SEO กับโดเมนจริง (ADR-0004) หายไปเมื่อปิด Vercel
  project (ยังเป็น backlog item — ดู `docs/backlog.md`)
- (+) `deploy.yml` เรียบ — pin Node ผ่าน `node-version-file` + ตั้ง `Cache-Control` ตอน sync
  นอกนั้นเป็น `s3 sync --delete` ตรง ๆ
- (-) เสีย `next/image` optimizer — รูปทุกใบเสิร์ฟตามขนาด/format ต้นฉบับ (`unoptimized: true`)
  รับได้ตอนนี้เพราะรูปน้อย ถ้า section งานโตจนรูปหนักต้องกลับมาคิด (image CDN หรือ resize ตอน build)
- (-) ของที่ต้องดูแลด้วยมือเพิ่มขึ้น — bucket policy, IAM role + trust, CDN, DNS ยังไม่มีอันไหน
  เป็น code (`s3-policy.json`/`trust-policy.json` เป็น draft ลอย ๆ)
- (-) ชั้น CDN เป็นของชั่วคราว — Cloudflare คั่นหน้า S3 ระหว่างรอ AWS เคลียร์ account verify เพื่อ
  เปิด CloudFront ต้องย้ายอีกรอบเมื่อ support ปิด case (จดไว้ใน `docs/backlog.md`)
- (-) `deploy.yml` ไม่ purge CDN ให้ — หลัง deploy ที่แตะ asset ไม่ hash-named (favicon, og-image,
  `/images/*`, sitemap, robots) ต้อง purge Cloudflare มือ (จดไว้ใน `docs/backlog.md`) จะทำอัตโนมัติ
  ตอนย้าย CloudFront
- (-) ฟีเจอร์ Next ที่ต้อง server (ISR, on-demand revalidation, route handler, middleware) ตัดออก
  หมด — รับได้เพราะเว็บไม่มีสักอย่าง และ ADR-0004 ยืนยันไว้แล้วว่าเป็น SSG ล้วน
