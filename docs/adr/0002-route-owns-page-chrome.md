# 0002. Route Owns Page Chrome

## Status

Accepted

## Context

ADR-0001 ตัดสินใจให้แต่ละ case study มี body component ของตัวเอง คำถามต่อมาคือเส้นแบ่งระหว่าง
"สิ่งที่ route (`src/app/work/[slug]/page.tsx`) จัดการ" กับ "สิ่งที่ body component จัดการ" ควรอยู่
ตรงไหน — ทางเลือกหนึ่งที่พิจารณาคือให้ body component คุมทั้งหน้า ตั้งแต่ `<main>` ยันท้ายหน้า รวม
hero band, paper-tear divider, และ prev/next navigation เข้าไปด้วย

เทียบจากต้นแบบทางสายตา (`work-detail-page.webp`) ได้ตารางว่าส่วนไหนเหมือนกันทุก case study กับ
ส่วนไหนต่างกันจริง:

| ส่วน                                                             | เหมือนกันทุกหน้าไหม    |
| ----------------------------------------------------------------- | ---------------------- |
| แถบ hero พื้นกราฟ + `← Work` + chip + h1 + subtitle + googly eyes | เหมือน — ต่างแค่ค่า    |
| `PaperTear variant="header-detail"`                               | เหมือนเป๊ะ              |
| พื้น `surface-dotted` + คอลัมน์เนื้อหากลางจอ                       | เหมือนเป๊ะ              |
| Overview / Challenge / code / รูป / Variants                      | **ต่างกันจริง** ← body |
| เส้นคั่น + PREVIOUS / NEXT                                        | เหมือนเป๊ะ ต่างแค่ค่า   |

ถ้าปล่อยให้ body component render ทั้งหน้า markup ของแถวที่ 1, 2, 3, 5 (ทุกอย่างยกเว้นเนื้อหากลาง)
จะถูกคัดลอกไว้ 3 ไฟล์ ปัญหาไม่ใช่แค่โค้ดซ้ำ แต่คือ**งานที่จะเจ็บจริงในอนาคต**: เปลี่ยน `← Work` เป็น
breadcrumb, เพิ่มวันที่ใต้ subtitle, ขยับตำแหน่ง googly eyes บน mobile — งานพวกนี้ต้องไล่แก้ 3 ไฟล์
ทุกครั้ง และถ้าลืมไฟล์ใดไฟล์หนึ่ง หน้านั้นจะหน้าตาไม่เหมือนเพื่อนโดยไม่มี type หรือ test ตัวไหนจับได้
เลย เป็น bug ประเภทที่ต้องเปิดหน้าเว็บดูด้วยตาถึงจะเจอ

มีเหตุผลเชิงเทคนิคเพิ่มเติมที่ทำให้ทางเลือก "body คุมทั้งหน้า" มีปัญหาในทางปฏิบัติ: prev/next
navigation ต้องรู้ตำแหน่งของ case study ปัจจุบันในลำดับของ array `caseStudies` (ลำดับเดียวกับที่
`src/components/Work.tsx` ใช้ตอนวาดการ์ดบนหน้าแรก) body component ที่รู้จักแค่ตัวเองไม่มีทางคำนวณ
ลำดับนี้เองได้ ต้องรับเป็น props จาก route อยู่ดี ซึ่งขัดกับเหตุผลที่จะยกการควบคุม prev/next ทั้งหมด
ไปให้ body

แนวทางนี้ยังต่อยอด pattern ที่ repo ใช้อยู่แล้วพอดี — `src/app/page.tsx` (หน้าแรก) เป็น pure
composition ไม่มี layout class เลยสักตัว แต่ละ section เป็นสิ่งที่ page.tsx เรียงต่อกัน:

```tsx
<main className="flex-1">
  <Hero />
  <PaperTear variant="hero-skills" />
  <Skills />
  <PaperTear variant="skills-work" />
  <Work />
  <AboutMe />
</main>
```

## Decision

Route (`src/app/work/[slug]/page.tsx`) เป็นเจ้าของ chrome ทั้งหมด — hero band, `PaperTear`,
container พื้น `surface-dotted`, และ prev/next navigation body component ที่ registry ชี้ไป
(ดู ADR-0001) รับผิดชอบแค่เนื้อหาส่วนกลางของหน้า (Overview, Challenge, Approach & Build ฯลฯ):

```tsx
const Body = workDetailBodies[slug];

<main className="flex-1">
  <WorkDetailHero study={study} />
  <PaperTear variant="header-detail" />
  <div className="surface-dotted ...">
    <Body />
    <WorkDetailNav prev={prev} next={next} />
  </div>
</main>;
```

`caseStudies` ยังเป็น single source of truth ของ chrome เพราะ route ต้องใช้ข้อมูลนี้**ก่อน**ที่ body
จะถูก render:

| ต้องการ                  | ใช้จาก                    |
| ------------------------ | -------------------------- |
| `generateStaticParams()` | `caseStudies[].slug`       |
| `generateMetadata()`     | `title` + `subTitle`       |
| prev/next                | ลำดับใน array               |
| hero band                | `title`, `subTitle`, `type` |

## Consequences

- (+) chrome มีจุดแก้เดียว — เปลี่ยน `← Work`, เพิ่มวันที่, ปรับ googly eyes ฯลฯ แก้ที่
  `WorkDetailHero`/`WorkDetailNav` ที่เดียว ไม่ต้องไล่ 3 ไฟล์
- (+) prev/next คำนวณที่ route ได้ตรงไปตรงมา เพราะ route ถืออยู่แล้วทั้ง array และ index ปัจจุบัน
- (+) สอดคล้องกับ pattern composition เดิมของ `src/app/page.tsx`
- (-) body component ไม่มีอำนาจเหนือ layout ระดับหน้า ถ้าวันหนึ่งมี case study ที่อยากได้ hero
  รูปแบบต่างจากเพื่อน (เช่น ไม่มี chip, หรือ subtitle ยาวผิดปกติ) ต้องขยาย `WorkDetailHero` ให้รองรับ
  ผ่าน props ไม่ใช่ให้ body ไปแก้เอง
