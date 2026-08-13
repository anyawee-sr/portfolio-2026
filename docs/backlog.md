# Backlog

รายการงานที่ตั้งใจ defer ไปหลัง deploy ครั้งแรก (ดูเหตุผลที่ [`adr/0004-hosting-on-vercel.md`](adr/0004-hosting-on-vercel.md))
และงานดีไซน์อื่นๆ ที่ยังไม่ได้ทำ

**ไฟล์นี้หดลงเรื่อยๆ** — ข้อไหนทำเสร็จให้ลบทิ้งทั้งบรรทัด/section ไม่ต้องเก็บ `- [x]` ค้างไว้
git เก็บประวัติให้แล้ว พอไม่เหลือข้อไหนก็ลบไฟล์นี้ได้เลย

## เมื่อ custom domain พร้อม — ทำทั้งก้อน ห้ามทำทีละข้อ

- [ ] เอา `robots: { index: false, follow: false }` ออกจาก `src/app/layout.tsx:14`
- [ ] เปลี่ยน `siteUrl` ใน `src/data/site.ts` เป็นโดเมนจริง (ตอนนี้ชี้
      `https://portfolio-2026-tau-three.vercel.app` — `metadataBase` ใน `layout.tsx` +
      `og:image` URL อ่านจากค่านี้จุดเดียว แก้ที่นี่ที่เดียวพอ)
- [ ] เพิ่ม `src/app/sitemap.ts` — ครอบ `/` + `/work/<slug>` ทุกตัวจาก `src/data/caseStudies.ts`
      import `siteUrl` จาก `src/data/site.ts` มาต่อ absolute URL (Next ไม่ให้ sitemap.ts
      อ่าน `metadataBase` เอง ต้องประกอบ URL มือ)
- [ ] ตั้ง redirect `*.vercel.app` → โดเมนจริง ใน Vercel dashboard (กัน duplicate content)

ทำไมต้องทำพร้อมกันทั้งก้อน: ถ้าเอา noindex ออกโดยไม่ใส่ `sitemap.ts` ไปด้วย จะได้เว็บที่ Google
เข้ามาเก็บแล้วแต่ไม่มี sitemap ให้ไล่ ซึ่งแย่กว่าตอนที่ยัง noindex อยู่

## ก่อนส่งลิงก์ให้ recruiter

- [ ] `src/app/not-found.tsx` ธีมแบรนด์ — ตอนนี้ `/work/<slug ผิด>` ได้ 404 ขาวดำของ Next
      คั่นกลางระหว่าง Header กับ Footer
- [ ] เขียน README ใหม่ — ตอนนี้เป็น boilerplate ที่พูดถึง `pages/index.tsx` ซึ่งไม่มีอยู่จริง

## ทำเมื่อไหร่ก็ได้ — ไม่มี trigger ผูก

**ระบบ / infra**

- [ ] pin Node — เช็คเวอร์ชันปัจจุบันที่ Vercel dashboard → Settings → Build & Deployment →
      Node.js Version ก่อน (เช็คล่าสุด 2026-08-13 พบว่าเป็น **24.x** ไม่ใช่ 22.x ที่เคยคาดไว้ตอน
      เขียนแผน — Vercel ขยับ default เองได้เรื่อยๆ อย่า hardcode เลขจากที่นี่ ให้เช็คของจริงหน้า
      dashboard ทุกครั้งก่อนตั้ง `engines`) แล้วอัปเกรด local ให้ตรง + ใส่
      `"engines": { "node": "<เวอร์ชันที่เช็คได้>" }` ใน `package.json` (ดู ADR-0004)
- [ ] Vercel Analytics + Speed Insights
- [ ] CI บน PR: `npm run build` + `npm run lint` + `npm run format:check`
      ⚠️ `npm test` เป็น vitest browser mode ผ่าน Playwright — runner ต้อง
      `npx playwright install chromium` ก่อน ไม่ใช่ node test ธรรมดา
      ⚠️ ห้ามใช้ `tsc --noEmit` เดี่ยวๆ ใน CI — `PageProps<>` ถูก generate ตอน `next build`
- [ ] ทบทวน `allowedDevOrigins: ["192.168.1.34"]` ใน `next.config.ts:6` — ผูกกับ IP ของเน็ตบ้าน
      ย้ายเน็ต/เปลี่ยน router เมื่อไหร่ dev-on-phone พังเงียบ (หน้าโหลดได้แต่ไม่ hydrate)
- [ ] แก้ trailing space ท้าย title ของ `buildings-refuse-to-fade` ใน
      `src/data/caseStudies.ts` — `"When Buildings Refuse to Fade "` มีช่องว่างเกินมา 1 ตัว
      หลุดไปโผล่ใน `<title>` และ `og:title` เป็นช่องว่างซ้อนก่อนคำว่า "— Anyawee Sr."
- [ ] พิจารณาทำ script generate `src/app/favicon.ico` จาก `src/app/icon.svg` อัตโนมัติ (เช่น
      npm script ที่รันก่อน `next build`) — ตอนนี้ `favicon.ico` เป็น multi-size ICO (16/32/48px)
      ที่ pack มือจาก `icon.svg` เวอร์ชันปัจจุบันครั้งเดียว **ไม่ sync กันอัตโนมัติ** ถ้าแก้
      `icon.svg` ทีหลังแล้วลืม regenerate `favicon.ico` ตาม จะได้ไอคอนคนละแบบระหว่าง Chrome/Edge
      (ใช้ `icon.svg` เพราะ `sizes="any"` ชนะ) กับ Safari (ไม่รองรับ SVG favicon เลย fallback ไป
      `.ico` เสมอ)

**ดีไซน์ / UI**

- [ ] ออกแบบหน้า `loading` กับ `error` — `src/app/loading.tsx` + `src/app/error.tsx`
      (ทำคู่กับ `not-found.tsx` ในกลุ่มข้างบนได้ ใช้ภาษาทางสายตาชุดเดียวกัน)
      ⚠️ `error.tsx` **ต้องเป็น client component** (`"use client"`) เสมอ ตามข้อกำหนดของ Next
      — เป็นข้อยกเว้นของกติกา server-component-by-default ใน repo นี้ และรับ prop
      `{ error, reset }` ถ้าอยากกันพังทั้ง root layout ด้วยต้องมี `global-error.tsx` แยกอีกตัว
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
- [ ] เปลี่ยน `src/components/ui/Eye.tsx` ไปใช้รูปจริง (ตอนนี้เป็น CSS gradient ล้วน มี
      `NOTE: will replace with eyes image later` ค้างที่บรรทัด 27 — ลบ NOTE ด้วยตอนทำเสร็จ)
      asset ไป `public/images/eye/` ตามกติกา CLAUDE.md (ชื่อไฟล์ไม่ซ้ำคำกับชื่อโฟลเดอร์)

      **สถาปัตยกรรมที่ล็อกแล้ว:**
      - **ความกลม: บังคับด้วย CSS clip เสมอ** (`overflow-hidden rounded-full` ที่ wrapper +
        `<Image>` ลูก `object-cover`) ไม่พึ่งว่ารูปต้นทางกลมมาแต่แรก — ผลคือ**ไม่ต้องมี QA
        เช็คความกลมของแต่ละไฟล์เลย** ศิลปินแค่วางองค์ประกอบกลางภาพสี่เหลี่ยมพอสมควร แนวทางนี้
        แลกกับการไม่รองรับอาร์ตขอบไม่เรียบ (wobbly sticker) — ถ้าอยากได้ทรงหยักในอนาคตต้อง
        มาคุยใหม่ตอนนั้น
      - **สลับทีเดียวทั้ง 12 จุด แบบ `PaperTear.tsx` ไม่ใช่แบบ `ImagePlaceholder`/`WorkImage`**
        — **ไม่มี prop `src` ให้เลือก** เพราะ googly eye ทุกจุดในหน้าเดียวกันเป็น asset ชิ้น
        เดียวกันเสมอ ไม่ใช่ของที่ทยอยเข้าทีละจุดแบบรูป case study ดังนั้น**ไม่ต้องมี fallback
        prop / placeholder state ค้างอยู่ใน component เลย** — วันที่อาร์ตพร้อม แก้ทีเดียวจบ

      **เรื่อง fallback ที่ยังต้องมี — คนละความหมายกับข้างบน อย่าสับสน:** element ที่ถือ
      `data-pupil` **ต้องยังกิน `--pupil-x`/`--pupil-y`** ผ่าน `translate:` ที่มาจาก
      `@utility surface-pupil` (`globals.css:269`) ซึ่งมี fallback `0 0.25rem` = ท่ามองลงตอนพัก
      — fallback ตัวนี้**ไม่เกี่ยวกับเรื่องรูปเลย** เป็นกลไกตอบตำแหน่งตอน SSR/no-JS/reduced-motion
      ต้องอยู่ตลอดไปไม่ว่า pupil จะ render เป็น gradient หรือ `<Image>` ก็ตาม — ถ้าลืมพา utility
      นี้ติดไปด้วยตอนสลับเป็นรูปจริง จะได้ตาที่**ไม่ขยับเลย และเสียท่าพักพร้อมกันทีเดียว**

      **ข่าวดี:** `EyeTracker` เตรียมรับไว้แล้ว — doc comment ที่ `EyeTracker.tsx:78-81` ระบุว่า
      จงใจอ่านขนาด eye/pupil จาก DOM ทุกครั้งแทน hardcode ratio "so it keeps working even if
      `Eye` is ever rebuilt with two separately-sized images (iris + white) instead of nested divs"

      **สัญญาอื่นที่ห้ามพัง** (ถ้าพังจะเงียบ ไม่มี type error ไม่มี test จับ ต้องเปิดดูด้วยตา):
      - `[data-eye]` ต้องอยู่ที่ root, `[data-pupil]` ต้องเป็น descendant — `EyeTracker.tsx:104`
        ใช้ `querySelector` จึงซ้อนกี่ชั้นก็ได้ (ต่างจากที่ doc comment ใน `Eye.tsx` เขียนว่า
        "direct child" — โค้ดจริงหลวมกว่า)
      - `EyeTracker.tsx:151-153` คำนวณ `maxOffset = (eyeRect.width - pupilWidth) / 2 - 3px`
        โดยสมมติว่า bounding box ของ pupil เท่ากับลูกตาดำที่เห็น — ตราบใดที่ยัง clip ด้วย
        `rounded-full` ตามที่ล็อกไว้ข้างบน bounding box จะตรงกับที่เห็นเสมอ จุดนี้จึงปลอดภัย
        โดยอัตโนมัติจากการตัดสินใจเรื่องความกลม ไม่ต้องเช็คแยก
      - คง `aria-hidden="true"` + `pointer-events-none` ไว้
      - ไม่ต้องมี error handling ตอนโหลดรูปพัง (`onError` ฯลฯ) — asset เป็นไฟล์ local ใน
        `public/` ที่ bundle ตอน build ถ้า path ผิดจะเห็นตอน dev/QA ทันที ไม่ใช่ risk ที่เกิด
        กับผู้ใช้จริงแบบรูป remote ที่ 404 ตอน runtime ได้ — เพิ่ม `onError` จะบังคับให้ไฟล์นี้
        กลายเป็น client component โดยไม่จำเป็น ขัดกับเหตุผลทั้งหมดใน ADR-0003

      **ผลพวงที่ต้องเก็บกวาดตาม:** ถ้าเลิกใช้ gradient แล้ว `@utility surface-eye` /
      `surface-pupil` / `surface-eye-glint` กับ primitive `--eye-shadow-inset-tint` /
      `--eye-highlight-tint` / `--eye-glint-tint` ใน `globals.css` จะกลายเป็น token ตายค้างไฟล์

      **เรื่องน้ำหนักไฟล์:** หน้าเดียวมี `Eye` 12 ตัว (ADR-0003: Hero 6 + Footer 4 +
      WorkDetailHero 2 — mobile กับ desktop อยู่ใน DOM พร้อมกัน สลับด้วย `hidden`/`md:hidden`)
      และขนาดไล่ตั้งแต่ `size-8` (32px) ถึง `md:size-30` (120px) → SVG เหมาะกว่า raster มาก
      ถ้าเป็น raster ต้องคมที่ 120px × DPR 3 = 360px และโดน 12 request

- [ ] เพิ่ม motion บนมือถือให้ `EyeTracker.tsx` ตาม TODO ที่ค้างอยู่แล้วที่บรรทัด 6-9 ของไฟล์
      ("mobile has no mouse pointer to track, so on mobile the pupils should jiggle based on
      device tilt/shake (`devicemotion`) instead") — งานนี้แก้ `EyeTracker.tsx` (ตรรกะการอ่าน
      sensor) **ไม่ใช่ `Eye.tsx`** (การ render) จึงเป็นคนละงานกับข้อสลับรูปข้างบน แม้จะอยู่ eye
      เดียวกัน

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
