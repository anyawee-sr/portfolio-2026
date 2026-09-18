# Backlog

รายการงานที่ตั้งใจ defer ไปหลัง deploy ครั้งแรก (ดูเหตุผลที่ [`adr/0004-hosting-on-vercel.md`](adr/0004-hosting-on-vercel.md))
และงานดีไซน์อื่นๆ ที่ยังไม่ได้ทำ

**ไฟล์นี้หดลงเรื่อยๆ** — ข้อไหนทำเสร็จให้ลบทิ้งทั้งบรรทัด/section ไม่ต้องเก็บ `- [x]` ค้างไว้
git เก็บประวัติให้แล้ว พอไม่เหลือข้อไหนก็ลบไฟล์นี้ได้เลย

## ทำเมื่อไหร่ก็ได้ — ไม่มี trigger ผูก

**ระบบ / infra**

- [ ] cleanup hashed asset เก่าที่ไม่มี build ไหนอ้างถึงแล้วใน `_next/static/` บน S3 — deploy
      pipeline (ดู `docs/adr/0006-cloudfront-cdn-in-front-of-s3.md`) ตั้งใจไม่ลบอัตโนมัติกัน race
      กับ HTML เก่าที่ยัง cache ค้างอยู่ ปล่อยสะสมไปก่อนได้เพราะ cost ต่ำมากที่สเกลนี้ ถ้าจะทำจริง
      **ห้ามใช้ S3 Lifecycle rule แบบ age-based** (ไฟล์ที่เนื้อหาไม่เปลี่ยนนานจะมี `LastModified`
      เก่าทั้งที่ยัง live จริงอยู่ — ลบตาม age เฉย ๆ จะพังเว็บแบบไม่มีสัญญาณเตือน) ต้องเทียบกับ
      manifest ของ build ปัจจุบันแทน
- [ ] CSP / Permissions-Policy header ที่ CloudFront — เจตนาแยกออกจาก security headers ชุดแรก (ดู
      `docs/adr/0006-cloudfront-cdn-in-front-of-s3.md`) เพราะ CSP ต้องจูนกับ Next.js inline
      style/RSC ก่อน ใส่ตรง ๆ จะพังหน้าเว็บ
- [ ] เปิด branch protection บน `main` (require CI status check ก่อน merge) — `.github/workflows/ci.yml`
      รัน `npm run lint` + `npm run format:check` + `npm run build` บน `pull_request` แล้ว
      (2026-09-15) แต่**เปิด required status check ไม่ได้ตอนนี้** เพราะ repo เป็น private บน
      GitHub free plan — ทั้ง classic branch protection API และ rulesets API ขึ้น 403
      `"Upgrade to GitHub Pro or make this repository public to enable this feature"`
      รอ user ตัดสินใจ upgrade plan หรือเปลี่ยน repo เป็น public ก่อน แล้วค่อยเปิดผ่าน
      `gh api repos/anyawee-sr/portfolio-2026/branches/main/protection` — ก่อนหน้านั้น CI รัน
      แต่ไม่ block การ merge จริง (ใครก็ merge ทับได้แม้ check แดง)
      ⚠️ `npm test` (vitest browser mode ผ่าน Playwright) **ยังไม่อยู่ใน CI** ตอนนี้ (ตัดสินใจ
      2026-09-15 ให้ตรง scope เดิม) — ถ้าจะเพิ่มทีหลังต้อง `npx playwright install chromium`
      ก่อนรัน ไม่ใช่ node test ธรรมดา
- [ ] ทบทวน `allowedDevOrigins: ["192.168.1.34"]` ใน `next.config.ts:6` — ผูกกับ IP ของเน็ตบ้าน
      ย้ายเน็ต/เปลี่ยน router เมื่อไหร่ dev-on-phone พังเงียบ (หน้าโหลดได้แต่ไม่ hydrate)

**ดีไซน์ / UI**

- [ ] ออกแบบหน้า `loading` กับ `error` — `src/app/loading.tsx` + `src/app/error.tsx`
      (ใช้ภาษาทางสายตาชุดเดียวกับ `src/app/not-found.tsx` ที่ทำเสร็จแล้ว — การ์ดกระดาษฉีก
      แปะเทป + `font-handwriting` + `type-scrawl`/`type-scribble`)
      ⚠️ `error.tsx` **ต้องเป็น client component** (`"use client"`) เสมอ ตามข้อกำหนดของ Next
      — เป็นข้อยกเว้นของกติกา server-component-by-default ใน repo นี้ และรับ prop
      `{ error, reset }` ถ้าอยากกันพังทั้ง root layout ด้วยต้องมี `global-error.tsx` แยกอีกตัว
      ⚠️ `loading.tsx`/`error.tsx` จะ render เป็นลูกของ root layout เดียวกับที่ `not-found.tsx`
      ใช้ (Header/Footer อยู่ที่ root layout จุดเดียว ไม่มี route group แยก) จึงได้ Footer
      พร้อม `BackToTop` ติดมาด้วยเสมอ — ถ้าอยากปิด `BackToTop` แบบหน้า 404 ต้องใส่
      `data-notfound` ให้ `<main>` ของหน้านั้นด้วย (ดู rule ใน `globals.css` ที่คุม
      `[data-back-to-top]`) แต่ปกติหน้าพวกนี้ยัง scroll ได้จริง ไม่น่าต้องปิด
      ⚠️ `loading.tsx` จะแทบไม่โผล่ เพราะทุกหน้าเป็น SSG ที่ prerender ไว้หมดแล้ว
      (`generateStaticParams()`) — เห็นได้แค่ตอน client-side navigation ที่เน็ตช้า
      อย่าลงแรงกับหน้านี้เท่ากับ 404 ที่คนเจอจริงบ่อยกว่ามาก
- [ ] เพิ่ม element ใน section skills หน้า landing — `src/components/Skills.tsx`
      (asset ปัจจุบันมีแค่ `public/images/skills/background.webp`)
- [ ] ปรับปรุงกรอบรูปใน `src/components/work-detail/WorkImage.tsx:23` — ตอนนี้เป็น
      `-rotate-1 bg-surface-card p-2 shadow-xl` เอียงคงที่ทุกใบเท่ากันหมด
      ⚠️ ถ้าจะเปลี่ยนค่า rotate/padding/shadow ต้องใช้ token ที่มีใน `globals.css` เท่านั้น
      ห้าม arbitrary value ตามกฎข้อ 1 ของ CLAUDE.md
      ⚠️ กรอบนี้ครอบ `ImagePlaceholder` ที่ยังเป็นกล่อง placeholder อยู่ (prop `src` เป็น
      optional) — ควรตัดสินก่อนว่าจะปรับกรอบตอนยังไม่มีรูปจริง หรือรอใส่รูปก่อนแล้วค่อยจูน
- [ ] เพิ่ม motion บนมือถือให้ `EyeTracker.tsx` ตาม TODO ที่ค้างอยู่แล้วที่บรรทัด 6-9 ของไฟล์
      ("mobile has no mouse pointer to track, so on mobile the pupils should jiggle based on
      device tilt/shake (`devicemotion`) instead") — งานนี้แก้ `EyeTracker.tsx` (ตรรกะการอ่าน
      sensor) **ไม่ใช่ `Eye.tsx`** (การ render)

      **ตัดสินใจแล้ว: ไม่ขอ permission บน iOS เลย** — iOS Safari 13+ บังคับให้
      `DeviceMotionEvent.requestPermission()` ต้องถูกเรียกจาก user gesture เท่านั้น (attach
      listener ตอน mount แบบที่ `pointermove` ทำไม่ได้) และหน้านี้ไม่มีปุ่มขอ permission อยู่ใน
      ดีไซน์ — เลือกยอมให้ **iOS ไม่มีเอฟเฟกต์สั่นเลย** (ตกลงไปอยู่ในท่าพักเหมือนเดิม) แทนที่จะ
      เพิ่มปุ่มใหม่ที่ไม่มีในต้นแบบทางสายตา ผลคือต้องเช็ค `typeof DeviceMotionEvent.requestPermission
      === "function"` แล้วข้ามไปเลยถ้ามี (คือ iOS) — เบราว์เซอร์อื่น (Android Chrome ฯลฯ) ไม่ต้อง
      ขอ permission จึงยัง attach listener ได้ทันที

      **ต้องพกมาจากเวอร์ชัน pointer เดิมด้วย:**
      - เคารพ `prefers-reduced-motion` เหมือนกับที่ `pointermove` ทำอยู่แล้ว (ดู
        `subscribeToReducedMotion`/`getReducedMotionSnapshot` ที่มีอยู่แล้ว — ใช้ค่าเดียวกันได้)
      - ทุกวันนี้ `handlePointerMove` กรอง `event.pointerType !== "mouse"` ทิ้ง (`EyeTracker.tsx:170`)
        แปลว่า**ตอนนี้ touch device ได้ตาพักนิ่งอยู่แล้ว ไม่ใช่ตาที่พังหรือกระตุก** — เพิ่ม
        devicemotion คือการเติมลูกเล่นให้ device ที่รองรับ ไม่ใช่การแก้บั๊ก
      - threshold/dead-band กันสั่นไหวจาก noise ของ sensor (ต่างจาก mouse ที่นิ่งกว่ามาก) —
        รายละเอียด tuning ไว้ตอนลงมือทำจริง ไม่ใช่ตัดสินใจตอนนี้

## เจอหลัง deploy จริง

<!-- เติมระหว่างไล่เช็ค verification หลัง deploy — Lighthouse, ขนาดรูป, ปัญหาบนมือถือจริง -->
