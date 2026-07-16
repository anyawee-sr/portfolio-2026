# CLAUDE.md — Anyawee Sr. Portfolio

กติกาของโปรเจกต์นี้ อ่านก่อนเขียนโค้ดทุกครั้ง

---

## Source of truth

| สิ่งที่ต้องรู้            | อยู่ที่ไหน                                     |
| ------------------------- | ---------------------------------------------- |
| Design token ทั้งหมด      | `src/app/globals.css` ← **ที่เดียวเท่านั้น**   |
| ต้นแบบทางสายตา (อ้างอิง)  | `design-ref/` ← **อ่านอย่างเดียว ห้าม import** |

**ถ้าไม่มี token ที่ต้องการ → ไปเพิ่มใน `globals.css` ห้าม hardcode ในไฟล์อื่น**

**Hex color เขียนเป็น uppercase 6 หลักเสมอ** (เช่น `#B51D00` ไม่ใช่ `#b51d00` หรือย่อเป็น `#B10`) —
ใช้ตอนเพิ่ม primitive สีใหม่ใน `globals.css` เพื่อให้ทั้งไฟล์มีมาตรฐานเดียวกัน

---

## กฎเหล็ก 5 ข้อ

### 1. ห้าม arbitrary value เด็ดขาด

```jsx
// ❌ ห้าม
<div className="text-[32px] bg-[#B51D00] p-[14px] tracking-[.1em]">

// ✅ ถูก
<div className="type-h2 bg-brand p-4 tracking-wide">
```

### 2. ห้ามเขียน font-size / font-weight / line-height ใน component

typography มาจาก `type-*` utility เท่านั้น ถ้าไม่มีขนาดที่ต้องการ = ระบบยังไม่ครบ → ไปเพิ่มใน `globals.css`

```jsx
// ❌ ห้าม
<h2 className="text-3xl font-bold leading-tight">

// ✅ ถูก
<h2 className="type-h2">
```

**type scale ที่มี:**

| Utility        | ขนาด    | น้ำหนัก | ใช้ที่                 |
| -------------- | ------- | ------- | ---------------------- |
| `type-display` | 48→96px | 500     | hero `<h1>` (จุดเดียว) |
| `type-h1`      | 40→54px | 800     | footer wordmark        |
| `type-h2`      | 34px    | 800     | section title          |
| `type-h3`      | 24px    | 800     | process step 01–04     |
| `type-h4`      | 13→17px | 700     | หัวข้อย่อย             |
| `type-body-l`  | 17px    | 400     | เนื้อหาหลัก            |
| `type-body-m`  | 15px    | 400     | เนื้อหารอง             |
| `type-body-s`  | 10px    | 600     | eyebrow                |
| `type-label`   | 12px    | 700     | label (tracking กว้าง) |
| `type-caption` | 11px    | 700     | คำบรรยาย               |

ขนาดที่เป็นช่วง (`48→96px` ฯลฯ) คือ `clamp()` ที่ฝังอยู่ **ในตัว utility เอง** — ไล่ตามความกว้างจอลื่นๆ อัตโนมัติ ไม่ต้องเติม `md:` ที่ component ทุกจุด ยังมี `text-wrap: balance` ผูกอยู่แล้วด้วย (ดูกฎข้อ 4)

ค่า px ในตารางคือ**ขนาดอ้างอิงตามดีไซน์** — โค้ดจริงใน `globals.css` เขียนเป็น **rem ทั้งหมด** (16px = 1rem)
เพื่อให้ยืดตามการตั้งค่า "ขยายตัวอักษร" ของเบราว์เซอร์ (a11y) `clamp()` ของ `type-display`/`type-h1`/`type-h4`
อิงช่วง viewport **320px → 1240px** (320 = ค่ามาตรฐาน a11y ขั้นต่ำ, 1240 = ความกว้าง container จริงของดีไซน์)

### 3. Token ≠ Tag

**สำคัญมาก** — `type-h1` ไม่ได้แปลว่าต้องใช้กับ `<h1>`

ในโปรเจกต์นี้:

- `<h1>` (hero) ใช้ `type-display`
- `type-h1` ใช้กับ `<div>` (footer wordmark)

**เลือก tag จาก semantic เลือก token จากขนาดที่ต้องการ — คนละเรื่องกัน**

### 4. ห้าม `<br>` ในหัวข้อ

`text-wrap: balance` ถูกใส่ไว้ใน `type-display` ถึง `type-h4` แล้ว (รวม hero headline ด้วย) —
**`<br>` จะทำให้มันไร้ผลทันที** และพังตอน responsive

```jsx
// ❌ ห้าม
<h3 className="type-h3">FILL OUT<br />THE FORM 01.</h3>

// ✅ ถูก — ปล่อยให้ balance จัดการ คุมความกว้างด้วย ch
<h3 className="type-h3 max-w-[14ch]">FILL OUT THE FORM 01.</h3>
```

### 5. ห้ามแตะ `design-ref/`

อ่านเป็นต้นแบบได้ **ห้าม import ห้าม copy โค้ดตรง ๆ** เขียนใหม่ตาม convention ของ repo เสมอ

---

## Semantic HTML

โค้ดต้นแบบใน `design-ref/` เป็น div soup (div 60 / span 30) **ห้ามลอกโครงนั้นมา** ต้องแก้ตามนี้:

### Landmark

```jsx
<header>…</header>
<main>                                    {/* ← ต้องมี ต้นแบบไม่มี */}
  <section aria-labelledby="work-title">
    <h2 id="work-title" className="type-h2">FLUID DYNAMICS</h2>
  </section>
</main>
<footer className="on-brand">…</footer>   {/* ← on-brand: กลับสี focus ring */}
```

- **ต้องมี `<main>`** ครอบเนื้อหาหลัก
- `<section>` ทุกอันต้องมีชื่อ (`aria-labelledby` ชี้ไปที่ heading)
- **ลบ `data-screen-label` ทิ้งทุกตัว** (attribute ภายในของ Claude Design ไม่มีความหมาย)

### Heading hierarchy

```
h1  Anyawee Sr. / Frontend Engineer     [type-display]
├── h2  FLUID DYNAMICS                  [type-h2]
├── h2  (section title ของ process)     [type-h2]
│   ├── h3  FILL OUT THE FORM 01.       [type-h3]
│   ├── h3  YOU ARE BEING CONTACTED 02. [type-h3]
│   ├── h3  FIRST MEETING 03.           [type-h3]
│   └── h3  YOU RECEIVE QUALITY SVC 04. [type-h3]
└── footer
    ├── h3  NAVIGATION                  [type-caption]
    ├── h3  LEGAL                       [type-caption]
    └── h3  SOCIAL                      [type-caption]
```

**ห้ามข้ามขั้น** (h1 → h3 โดยไม่มี h2)

### Hero markup

```jsx
<h1 className="type-display text-text-primary">
  Anyawee Sr.
  <span className="block type-h2 text-brand">Frontend Engineer</span>
</h1>
```

### ตารางแปลง tag

| ต้นแบบ                              | ต้องเปลี่ยนเป็น                 |
| ----------------------------------- | ------------------------------- |
| `<span>` FLUID DYNAMICS             | `<h2>`                          |
| `<div>` NAVIGATION / LEGAL / SOCIAL | `<h3>`                          |
| ลิงก์เมนู + ลิงก์ฟุตเตอร์ (ลอย ๆ)   | `<ul><li><a>`                   |
| ไม่มี `<main>`                      | เพิ่ม `<main>`                  |
| `<canvas>` (พื้นกราฟ)               | CSS `repeating-linear-gradient` |
| `<helmet>` ใน body                  | ย้ายไป `<head>` / metadata API  |
| `<br>` ในหัวข้อ                     | ลบทิ้ง ใช้ `max-w-[Nch]`        |

### ลิงก์กับปุ่ม

- **ไปหน้าอื่น** → `<a href="/work">`
- **ทำอะไรในหน้านี้** (modal, carousel, toggle) → `<button type="button">`
- **`href="#"` ทุกตัวในต้นแบบเป็น placeholder** — ต้องใส่ปลายทางจริง
- ลิงก์ external → `rel="noopener noreferrer"`

### ไอคอนกับลูกศร

ลูกศร `⟶ ↗` เป็น **ของตกแต่ง** — screen reader ต้องไม่อ่าน

```jsx
// ✅ ตกแต่ง อยู่ในลิงก์ที่มีข้อความอยู่แล้ว
<a href="/work" className="type-label">
  VIEW ALL <span aria-hidden="true">⟶</span>
</a>

// ✅ ถ้าเปลี่ยนเป็น SVG
<svg aria-hidden="true" focusable="false" className="w-icon-md h-icon-md">…</svg>
```

**ห้ามทำ `<a href="#">⟶</a>`** — ลิงก์ที่ไม่มีชื่อ

`svg { fill: currentColor }` ตั้งไว้แล้ว → ไอคอนรับสีจาก parent อัตโนมัติ ไม่ต้องกำหนดสีแยก

### รูปภาพ

ต้นแบบ**ไม่มีรูปจริงเลย** (เป็น placeholder จาก `image-slot.js`) ตอนสร้างจริง:

- `<img>` ทุกตัวต้องมี `alt` ที่บรรยายงานจริง (ไม่ใช่ `alt="project image"`)
- ใส่ `width` + `height` กัน layout shift
- `loading="lazy"` สำหรับรูปที่อยู่ใต้ fold
- รูปตกแต่งล้วน → `alt=""`

---

## Responsive

**Mobile-first เสมอ** — เขียน mobile เป็นฐาน (class เปล่า) แล้วขยายขึ้นด้วย `md:` `lg:`
ห้าม desktop-first (`max-md:`) เพราะฝืนธรรมชาติ Tailwind และมักได้ "desktop ย่อส่วน"

```jsx
// ✅ mobile-first
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// ❌ desktop-first
<div className="grid grid-cols-3 max-md:grid-cols-1">
```

breakpoint ใช้ default ของ Tailwind (`sm:640 md:768 lg:1024`) — ไม่ต้องตั้งเอง
เส้นแบ่ง desktop/mobile หลักคือ `md` (768px)

### กติกาต่อ section บนมือถือ

ต้นแบบมือถืออยู่ที่ `design-ref/mobile/` (จาก Claude Design) — อ่านเป็นภาพ ไม่ลอกโค้ด

**Header**

- desktop: nav เป็นชื่อเมนูเรียงนอน + ปุ่ม LET'S CHAT
- mobile: **hamburger** — เมนูทั้งหมด group อยู่ข้างใน, **ซ่อนปุ่ม LET'S CHAT**
- mobile เมนูเปิด (สถานะกางออก) — **ดีไซน์เฉพาะ ห้ามทำเป็น drawer ทึบทั่วไป:**
  - พื้นหลัง **transparent** ไม่เทสีทับ (เห็น hero ด้านหลัง)
  - แต่ละเมนู (WORK, STORY, ...) เป็น **sticker/badge ห้อยลงมาจาก hamburger**
    วางเอียงเป็นลูกเล่น (ใช้ค่า rotate ที่มีในระบบ เช่น ±3–5deg)
  - แต่ละ badge ยังต้อง ≥ 44px สูง (touch target) แม้จะเอียง
- hamburger เป็น component ใหม่ (ต้นแบบ desktop ไม่มี) — ดูเช็คลิสต์ accessibility ด้านล่าง
- ⚠️ พื้นหลัง transparent + ตัวหนังสือ badge ต้องผ่าน contrast **บนพื้น hero จริง**
  (ไม่ใช่บนพื้นขาว) — เช็คว่าอ่านออกทุก badge ไม่งั้นเอียงสวยแต่อ่านไม่ได้

**Hero**

- **desktop: คง element ตกแต่งครบทุกชิ้น** (พื้นกราฟ + ของตกแต่งทั้งหมด)
- **mobile: คงไว้แค่ googly eyes** — ตัดของตกแต่งอื่นออก (ลดความรกบนจอแคบ)
  ทำผ่าน responsive visibility: ของตกแต่งอื่น `hidden md:block`, googly eyes แสดงทั้งสองจอ
- `type-display` มี `clamp()` ย่อเองได้ ✅ แต่ `type-h2` (บรรทัด "Frontend Engineer")
  เป็น 34px คงที่ — **ต้องเปิดมือถือดูจริง** ว่าคู่กับ display ที่ย่อแล้วสมส่วนไหม
- googly eyes ต้อง `aria-hidden="true"` + เคารพ `prefers-reduced-motion` ถ้า animate

**Section "from my work logs"**

- desktop: การ์ดวางซ้อน/เอียง (absolute/transform)
- mobile: **ไม่ unstack เป็นเต็มจอ** — แต่คงคาแรกเตอร์ desktop ไว้:
  - ใช้การ์ด **ratio เดิม** (ลดขนาดลงให้พอดีจอได้ แต่คงอัตราส่วน)
  - **วางสลับซ้าย-ขวา** เช่น 01 ชิดซ้าย, 02 ชิดขวา, 03 ชิดซ้าย...
  - แต่ละการ์ด**เอียง**เป็นลูกเล่น (rotate ±3–5deg ตามที่มีในระบบ)
  - เรียงบนลงล่างในแนว flow (ไม่ absolute ซ้อนกันแบบ desktop)
- ⚠️ การ์ดเอียง + สลับข้าง ระวังขอบยื่นออกนอกจอ → `overflow-x-hidden` ที่ parent
- ⚠️ ยังต้องล็อก `aspect-[..]` + `object-cover` กันรูปดันเลย์เอาต์ (รูปยังไม่มีจริง)

**Footer**

- **คง googly eyes** ทั้งสองจอ — แต่ต้อง `aria-hidden="true"` (ของตกแต่ง)
  และถ้า animate ต้องเคารพ `prefers-reduced-motion` (ดูด้านล่าง)

### ซ่อน element บนมือถือ (ไม่ใช่ลบ)

`from my work logs ↗` และ social links (github/gitlab/linkedin):
**ซ่อนบนมือถือ แสดงบน desktop** — เนื้อหายังอยู่ใน DOM เสมอ

```jsx
<a className="hidden md:inline-flex" href="...">from my work logs <span aria-hidden="true">↗</span></a>

<ul className="hidden md:flex" aria-label="Social links">
  <li><a href="https://github.com/..." rel="noopener noreferrer">GitHub</a></li>
  ...
</ul>
```

`hidden md:...` = มือถือซ่อนทั้งตาและ screen reader, desktop แสดง
(ไม่ใช้ `sr-only` เพราะ desktop ต้องเห็นจริง)

### Touch target

ทุก interactive element บนมือถือ **อย่างน้อย 44×44px** (WCAG 2.5.5 / Apple HIG)

ลิงก์ nav ที่ desktop เป็น `type-label` 12px — บนมือถือพื้นที่กดต้องใหญ่กว่าตัวอักษร
ใส่ padding รอบให้ครบ ไม่ใช่พึ่งขนาด font

```jsx
<a className="type-label inline-flex items-center min-h-11 px-4">WORK</a>
```

(`min-h-11` = 44px)

### Hamburger — เช็คลิสต์ (ห้ามข้าม)

component นี้คนมักทำ "กดได้แต่ screen reader ใช้ไม่ได้" — ต้องครบทุกข้อ:

- [ ] ปุ่มเป็น `<button type="button">` ไม่ใช่ `<div>`
- [ ] มี `aria-label="เปิดเมนู"` / `"ปิดเมนู"` (ไอคอนเปล่าไม่มีชื่อ)
- [ ] มี `aria-expanded={isOpen}` บอกสถานะ
- [ ] มี `aria-controls` ชี้ไป id ของเมนู
- [ ] ตัวปุ่ม ≥ 44×44px
- [ ] เปิดแล้วกด **Esc** ปิดได้
- [ ] เปิดแล้วโฟกัสไม่หลุดไปหลังเมนู (focus trap) และปิดแล้วโฟกัสกลับที่ปุ่ม
- [ ] ทุกลิงก์ในเมนู ≥ 44px สูง

### Reduced motion — quality floor

มี animation ที่ไหน (googly eyes, พื้นกราฟ, hover) ต้องเคารพคนที่ปิด motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### ห้าม horizontal scroll

ไม่มี element ไหนล้นจอแนวนอนที่ 320px — เช็คด้วย `overflow-x-hidden` ที่ระดับ layout
และระวัง element `absolute`/`transform` ที่ยื่นออกนอก viewport

---

## Accessibility floor

ทุก component ต้องผ่านก่อน merge:

- [ ] Tab เข้าถึงได้ทุก interactive element
- [ ] focus ring **มองเห็นชัด** (บนพื้นแบรนด์ต้องมี class `on-brand` บน parent)
- [ ] contrast ≥ 4.5:1 (ข้อความปกติ) / ≥ 3:1 (ข้อความใหญ่ + UI component)
- [ ] heading ไม่ข้ามขั้น
- [ ] รูปมี `alt` / ไอคอนตกแต่งมี `aria-hidden="true"`
- [ ] responsive ถึง 320px — ไม่มี horizontal scroll
- [ ] touch target ≥ 44×44px ทุกจุดบนมือถือ
- [ ] hamburger ครบเช็คลิสต์ (aria-expanded, Esc, focus trap)
- [ ] `prefers-reduced-motion` เคารพทุก animation

---

## Stack

- **Tailwind v4** (`@theme` / `@utility` ไม่ใช่ `tailwind.config.js`)
- **ฟอนต์: โหลดผ่าน `next/font/google`** (Montserrat + Bai Jamjuree) — self-host จริงตอน build
  (ไฟล์ฟอนต์ถูก host จาก domain เราเอง ไม่มี request ไป Google ตอน runtime) `next/font` จัดการ
  `size-adjust` fallback ให้อัตโนมัติ ไม่ต้องเขียน `@font-face` เอง
- ภาษา: **อังกฤษเท่านั้น** ตอนนี้ — ภาษาไทยตามมาทีหลัง (Bai Jamjuree โหลด `thai` subset ไว้รอใน
  `layout.tsx` แล้ว แต่ยังไม่มี THAI MIGRATION LEDGER อย่างเป็นทางการ — เพิ่มใน `globals.css`
  เมื่อเริ่ม migration จริง)

### หมายเหตุ Tailwind v4

`type-*` (`@utility` ใน `globals.css`) มัด size + weight + line-height + tracking +
`text-wrap: balance` ไว้ในคลาสเดียวอยู่แล้ว — **ใช้ `type-*` เป็นค่าเริ่มต้นเสมอสำหรับ typography**
utility เดิมของ Tailwind (`font-bold`, `leading-tight`, `tracking-wide` ฯลฯ) **ยังใช้ได้ปกติ**
เป็น escape hatch สำหรับกรณีที่ `type-*` ไม่ครอบคลุม — ไม่ต้องสร้างชุด utility คู่ขนานเอง
ถ้าเจอ pattern ที่ใช้ซ้ำบ่อยจนควรมี token เฉพาะ ให้ไปเพิ่มใน `globals.css` แทนการ hand-roll

---

## ลำดับการทำงาน

1. token → `src/app/globals.css` ✅ (เสร็จแล้ว)
2. asset → `public/`
3. component ทีละตัว **สร้าง mobile-first + desktop พร้อมกันในตัวเดียว**
   (ไม่ใช่ทำ desktop ก่อนแล้วเติม breakpoint ทีหลัง):
   Hero → Header/Nav+Hamburger → PaperWall → Process → Exhibition → Footer
4. ตรวจทีละตัวก่อนขึ้นตัวถัดไป — เปิดดูทั้ง 375px และ desktop
5. ครบแล้ว → เก็บ `design-ref/` ไว้เป็น **read-only reference** ต่อ
   (โดยเฉพาะ `design-tokens-spec.dc.html` = ต้นทาง SSoT ของ token) —
   ค่อยตัดสินใจเรื่องลบทีหลัง ไม่ใช่ลบทันทีที่ component ครบ

ต้นแบบทางสายตา:

- desktop: `design-ref/landing-page.dc.html`
- mobile: `design-ref/mobile/landing-page-mobile.dc.html` (จาก Claude Design รอบมือถือ)
