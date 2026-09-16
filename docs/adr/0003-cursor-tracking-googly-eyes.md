# 0003. Cursor-Tracking Googly Eyes

## Status

Accepted

## Context

`Eye` (`src/components/ui/Eye.tsx`) render อยู่ 12 จุดในหน้าเดียวกัน — Hero 6 ตัว (mobile 3 +
desktop 3, ทั้งคู่อยู่ใน DOM จริงพร้อมกัน สลับด้วย `hidden`/`md:hidden`), Footer 4 ตัว
(mobile 2 + desktop 2), WorkDetailHero 2 ตัว ต้นแบบทางสายตา
(`design-ref/landing-page.dc.html`) ให้ตาดำ (`data-pupil`) ขยับตามตำแหน่งเมาส์ — ฟีเจอร์นี้ถูกเว้น
ไว้ตอนสร้าง `Eye` ครั้งแรก (คอมเมนต์เดิมในไฟล์ระบุว่า "deferred") และเตรียม `data-pupil` รอไว้แล้ว

โจทย์คือ: ต้องขยับตาดำทั้ง 12 ตัวพร้อมกันตามพิกัดเมาส์ทุกเฟรม (60fps-scale) ขณะที่ทั้ง repo ยึด
Server Component เป็นค่าเริ่มต้นเคร่งครัด — `"use client"` มีอยู่แค่ 2 ไฟล์คือ `Header.tsx`
(hamburger menu state) กับ `BackToTop.tsx` (IntersectionObserver) ที่เหลือทั้งหมดเป็น
Server Component ล้วน

### ทางเลือกที่ 1: `Eye` เป็น Client Component เอง

แต่ละ `Eye` ผูก `useEffect` ของตัวเอง ฟัง `pointermove` ที่ `window` แล้วคำนวณตำแหน่งตาดำตัวเอง

**ปัญหา:** 12 instance = 12 event listener + 12 `requestAnimationFrame` loop ทำงานซ้ำซ้อนกันทุก
เฟรมโดยไม่มีเหตุผล และที่หนักกว่านั้นคือ `Eye` ต้องประกาศ `"use client"` — ซึ่งลาก `Hero.tsx`,
`Footer.tsx`, `WorkDetailHero.tsx` (ทุกจุดที่ import `Eye`) เข้าใกล้ client boundary ไปด้วยความหมาย
ทั้งที่ทั้ง 3 ไฟล์นี้ไม่มี state หรือ interactivity อะไรของตัวเองเลย จะโดนดึงเข้า client bundle
เพียงเพราะ import component ตกแต่งตัวหนึ่งที่ `aria-hidden="true"` อยู่แล้ว

### ทางเลือกที่ 2: Context เก็บพิกัดเมาส์

Provider ตัวเดียวเก็บ `{ x, y }` เป็น React state แต่ละ `Eye` `useContext` แล้วคำนวณตำแหน่งตาดำเอง

**ปัญหา:** `setState` ทุก `pointermove` (ที่ throttle ดีที่สุดก็ยังเท่าอัตรา refresh จอ) แปลว่า
provider กับ consumer ทั้ง 12 ตัว re-render ทุกเฟรม — React reconciliation ถูกออกแบบมาให้จัดการ
การเปลี่ยนแปลงของ **แอปพลิเคชัน** ไม่ใช่มาบังคับให้ diff component tree 60 ครั้ง/วินาทีเพื่อขยับ
ของตกแต่งที่ screen reader ไม่มีวันอ่านอยู่แล้ว

### ทางเลือกที่ 3: controller เดี่ยวเขียน DOM ตรง (ที่เลือก)

`EyeTracker` — client component ตัวเดียว mount ที่ `src/app/layout.tsx` — ฟัง `pointermove`
ที่ `window` ครั้งเดียว, `querySelectorAll("[data-eye]")` หาตาทุกตัวบนหน้าปัจจุบัน, แล้วเขียน
`--pupil-x`/`--pupil-y` เป็น CSS custom property ตรงบน `[data-pupil]` ของแต่ละตา ผ่าน
`element.style.setProperty()` ไม่ผ่าน React state เลย

### ข้อโต้แย้งมาตรฐานที่มักใช้ค้าน pattern นี้

`querySelectorAll` แล้วเขียน `style` เข้า DOM ตรงๆ คือสิ่งที่เอกสาร React เองเตือนไว้ชัดเจนว่าเป็น
anti-pattern — "หลีกเลี่ยงการแก้ DOM ด้วยมือ ปล่อยให้ React จัดการ"

**ข้อโต้แย้งนี้ใช้ไม่ได้เต็มที่กับเคสนี้** เพราะสิ่งที่เขียนไม่ใช่ application state (ข้อมูลที่ผู้ใช้
เห็นความหมาย, ที่ persist, ที่ต้อง sync กับ UI ส่วนอื่น) แต่เป็น **pointer state ต่อเฟรม** — ตัวเลข
ที่มีความหมายแค่ "ตอนนี้เมาส์อยู่ตรงไหน" และหายไปทันทีที่เฟรมถัดไปมาถึง ไม่มีใครอ่านค่านี้จาก React
tree, ไม่มี component ไหนต้อง re-render ตามมันเลยนอกจากตัวมันเอง (การหมุนของลูกตา) React ไม่ได้
ถูกออกแบบมาให้ reconcile ที่ความถี่ระดับนี้เพื่อ element ที่ `aria-hidden="true"` และ
`pointer-events-none` อยู่แล้ว

ประเด็นที่หนักแน่นกว่านั้นคือ **การเก็บ state นี้ไว้นอก React คือสิ่งเดียวที่ทำให้ `Eye`
ยังเป็น Server Component ต่อได้** — เข้าเงื่อนไขเดียวกับที่ ADR-0001 ใช้เถียงเรื่อง client bundle
ของ body registry: โค้ดของ Server Component ไม่เคยถูกส่งไปที่ browser เป็น JavaScript อยู่แล้ว
สิ่งที่ browser ได้รับคือ RSC payload ที่ render เสร็จแล้ว ดังนั้นต่อให้ `Eye` render อยู่ 12 จุด
JavaScript ที่เพิ่มขึ้นจากตัว markup ของมันคือ **ศูนย์** — `EyeTracker` เป็นไฟล์เดียวที่ต้องส่งไป
client ไม่ว่าจะมี `Eye` กี่ตัวบนหน้าก็ตาม

### ข้อโต้แย้งที่สอง: "ใช้ไลบรารีสำเร็จรูปสิ (framer-motion ฯลฯ)"

ทั้งโปรเจกต์มี dependency การรันไทม์แค่ `clsx`, `next`, `react`/`react-dom` (ดู `package.json`)
งานนี้คือ "อ่านตำแหน่งเมาส์ แปลงเป็นเวกเตอร์ที่ clamp ระยะ แล้วเขียน custom property" — ราว 60
บรรทัด ไม่มีเหตุผลเพียงพอที่จะเพิ่ม dependency ใหม่เพื่อทำสิ่งที่ `requestAnimationFrame` เปล่าๆ
ทำได้ตรงไปตรงมากว่า

### สัญญา CSS var ระหว่าง JS กับ `globals.css`

ทาง CLAUDE.md ยึด `globals.css` เป็น source of truth ของ style เพียงที่เดียว — คำถามคือ `EyeTracker`
ควรเขียน `transform`/`translate` ใส่ pupil ตรงๆ หรือเขียนแค่ตัวแปร แล้วให้ CSS เป็นคนประกาศ
`translate` จริง

ถ้า `EyeTracker` เขียน `translate` เองทั้งก้อน ตำแหน่งพัก (resting position, ค่าเดิมคือ
`translate-y-1` ที่เคยอยู่ใน class ของ pupil) ต้องกลายเป็นค่าคงที่ซ้ำอยู่ใน JS ด้วย — ทั้งตอน
mount ครั้งแรกก่อนมีตำแหน่งเมาส์ และตอน reset เมื่อเมาส์ออกนอกจอ กลายเป็น magic number คนละที่กับ
`globals.css` และผิดหลัก single source of truth ทันที

เลือกให้ `EyeTracker` เขียนแค่ `--pupil-x`/`--pupil-y` ส่วน `@utility surface-pupil` เป็นคนประกาศ
`translate: var(--pupil-x, 0) var(--pupil-y, 0.25rem)` — ค่า fallback ในตัวแปรเองคือตำแหน่งพัก
ผลคือ: SSR, JS ปิด, และตอนที่ `EyeTracker` ยังไม่ทันเขียนค่า (ก่อน mount, หรือหลัง reset ด้วย
`removeProperty()`) ทุกกรณี "ตกกลับ" มาที่ตำแหน่งพักเดียวกันโดยอัตโนมัติ ไม่ต้องมี JS
รู้ค่านี้เลยด้วยซ้ำ

### a11y: block `prefers-reduced-motion` ใน `globals.css` ช่วยไม่ได้ในเคสนี้

`globals.css` มี block สากลอยู่แล้ว (`@media (prefers-reduced-motion: reduce) { *, *::before,
*::after { animation-duration: 0.01ms !important; ... } }`) ที่บังคับทุก animation/transition
ให้จบทันที — ดูเผินๆ เหมือนครอบคลุมเคสนี้ไปแล้ว

**แต่ block นี้คุมได้แค่ `animation-duration` กับ `transition-duration`** มันหยุด "การเคลื่อนจาก
A ไป B แบบนุ่มนวล" ไม่ได้หยุด "การเขียนค่า A หรือ B" — ถ้า `EyeTracker` ยังคง `pointermove` แล้ว
เขียน `--pupil-x`/`--pupil-y` อยู่ ตาดำก็ยังกระโดดตามเมาส์ทันทีแบบไม่มี transition (settle ทันที
แทนที่จะเคลื่อนนุ่มๆ) ซึ่งยังคือ motion ที่ `prefers-reduced-motion: reduce` ต้องการให้ปิดไปเลย
ไม่ใช่แค่ทำให้ทื่อขึ้น จึงต้องเช็ค `matchMedia("(prefers-reduced-motion: reduce)")` ใน JS เอง
แล้วไม่ attach listener อะไรทั้งสิ้นเมื่อ true — มี precedent เดียวกันอยู่แล้วใน
`src/lib/smoothScrollTo.ts`

## Decision

`EyeTracker` (`src/components/EyeTracker.tsx`) เป็น client component ตัวเดียว mount ที่
`src/app/layout.tsx` ครอบทุก route — `Eye` (`src/components/ui/Eye.tsx`) ยังเป็น
Server Component ต่อไป ผูกกันด้วยสัญญา attribute ล้วนๆ ไม่ใช่ props หรือ context:

```tsx
// Eye.tsx — ฝั่งประกาศสัญญา
<div data-eye aria-hidden="true" className="surface-eye ...">
  <div data-pupil className="surface-pupil ..." />
  <div className="surface-eye-glint ..." />
</div>
```

(อัปเดตหลัง `Eye` เปลี่ยนมาใช้รูปภาพจริงแทน CSS gradient — `surface-eye-glint` ย้ายออกมาเป็น
sibling ของ `data-pupil` แทนที่จะเป็น child ตั้งใจให้ตำแหน่งเงาสะท้อนคงที่บนตาขาว ไม่เคลื่อนตาม
`data-pupil` ที่ขยับด้วย `--pupil-x`/`--pupil-y` — `eye.querySelector("[data-pupil]")` ใน
`EyeTracker` หา descendant ไม่ใช่แค่ direct child อยู่แล้ว จึงไม่กระทบ query เดิม)

`EyeTracker` `querySelectorAll("[data-eye]")` ใหม่ทุกครั้งที่ `usePathname()` เปลี่ยน (client-side
navigation เปลี่ยนชุดตาบนหน้า — เช่นจากหน้าแรกไป `/work/[slug]`) เขียนแค่ตัวแปร CSS สองตัวต่อเฟรม
ผ่าน `element.style.setProperty()`, throttle ด้วย `requestAnimationFrame` ตัวเดียว, และ gate ทั้ง
`prefers-reduced-motion: reduce` กับ `event.pointerType !== "mouse"` ก่อนจะ attach listener ใดๆ

> ข้อสรุปนี้ยังไม่ถูกยกเป็นกฎทั่วไปสำหรับ decorative motion ทุกตัวในโปรเจกต์ — ตอนนี้มีตัวอย่างเดียว
> (n=1) ถ้าในอนาคตมี motion ที่ขับด้วย JS ตัวอื่น (เช่น เขย่ามือถือให้ตาสั่นตาม `devicemotion`,
> หรือ hover wobble ของ element อื่น) ให้ลอง reuse แพทเทิร์นนี้ก่อน (controller เดี่ยว + CSS var
> + gate ใน JS) แล้วค่อยพิจารณาว่าจะสรุปเป็น ADR ทั่วไปหรือไม่ — เหมือนที่ ADR-0001 เตือนไว้เรื่อง
> premature abstraction ที่ n น้อยเกินไป

## Consequences

- (+) `Eye` ไม่ต้องเป็น Client Component เพื่อ motion ที่ตัวเองไม่ได้ควบคุม — client bundle ไม่โต
  ขึ้นเลยไม่ว่าจะมี `Eye` กี่ตัวบนหน้า, ต้นทุน JS ที่เพิ่มมาทั้งหมดผูกอยู่กับไฟล์เดียวคือ
  `EyeTracker.tsx`
- (+) เขียน/อ่านผ่าน DOM ตรง ไม่ผ่าน React reconciliation เลยสำหรับ state ที่เปลี่ยนทุกเฟรม —
  ไม่มี re-render ของ component ใดๆ จากการขยับเมาส์
- (+) resting position เป็น single source of truth เดียวที่ `globals.css` (`surface-pupil`
  fallback) — SSR, ปิด JS, และช่วง reset ทั้งหมดตกลงที่ค่าเดียวกันโดยไม่ต้องมี JS ไหนรู้ค่านั้น
- (-) สัญญาระหว่าง `Eye` กับ `EyeTracker` คือ DOM attribute (`data-eye`/`data-pupil`) ไม่ใช่ type
  ที่ TypeScript ตรวจได้ — ถ้าใครแก้ `Eye.tsx` แล้วเผลอลบ `data-eye` หรือย้าย `data-pupil` ไปไม่ใช่
  ลูกโดยตรง จะไม่มี compile error เตือน ตาที่โดนแก้จะแค่ "หยุดตามเมาส์" เงียบๆ โดยไม่มี error ให้เห็น
- (-) การ debug ต้องดูสองที่พร้อมกันเสมอ — logic อยู่ที่ `EyeTracker.tsx`, ตำแหน่งพัก/transition
  อยู่ที่ `globals.css`'s `surface-pupil` — ต่างจาก component ทั่วไปในโปรเจกต์นี้ที่ logic กับ style
  อยู่ใกล้กันในไฟล์เดียว
- (-) ถ้าวันหนึ่ง `Eye` ต้องมี state หรือ interactivity ของตัวเองจริงๆ (ไม่เกี่ยวกับ cursor
  tracking) แล้วต้องกลายเป็น Client Component อยู่ดี เหตุผลเรื่อง "bundle ไม่โต" ของ ADR นี้จะไม่
  เปลี่ยนแปลง (ยังคง 0 เพิ่มจาก markup ของ `Eye` เอง) แต่ก็ควรทบทวนว่าตอนนั้นยังคุ้มที่จะแยก tracking
  ออกจาก component เองหรือไม่
