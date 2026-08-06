# 0001. Bespoke Body Component per Case Study

## Status

Accepted

## Context

หน้า `/work/[slug]` ต้องแสดงเนื้อหารายละเอียดของ case study 3 เรื่อง:

- `data-layer-new-entity` — การออกแบบ schema สำหรับ entity ใหม่
- `new-member-on-the-map` — interaction บนแผนที่
- `buildings-refuse-to-fade` — บั๊ก fade ของโมเดล 3D ที่ทำงานไม่สม่ำเสมอ

ทั้ง 3 เรื่องเป็น engineering war-story คนละแบบกันจริง

### ทางเลือกที่ 1: content model กลาง

ออกแบบ block schema กลางที่ทุก case study ต้องกรอกลงไปให้เข้ารูปเดียวกัน เช่น:

```ts
blocks: { heading: string; parts: (ProsePart | CodePart | ImagesPart)[] }[]
```

แล้วให้ component เดียวกันวน render ทุกหน้า

**ปัญหา:** ณ ตอนที่ยังไม่มีเนื้อหาจริง (ยังเป็น placeholder/Lorem ipsum) การออกแบบ schema กลางคือการ
ออกแบบให้ข้อมูลที่ยังไม่มีอยู่ พอเห็นเนื้อหาจริงของทั้ง 3 เรื่องแล้วชัดว่าแต่ละเรื่องเล่าคนละจังหวะ
คนละท่า การบีบทุกเรื่องลงโครงเดียวกันคือ premature abstraction ที่ n=3 — ตัวอย่างที่มีน้อยเกินกว่าจะ
สรุปแพทเทิร์นร่วมได้จริง และดันให้เนื้อหาต้องบิดตัวเข้าหา schema แทนที่ schema จะรับใช้เนื้อหา

### ทางเลือกที่ 2: bespoke body ต่อ case study (ที่เลือก)

แต่ละ case study มี body component ของตัวเอง แล้ว map ด้วย slug ผ่าน registry — object ที่ผูก slug
เข้ากับ component:

```ts
// src/components/work-detail/bodies/index.ts
import { BuildingsRefuseToFade } from "./BuildingsRefuseToFade";
import { DataLayerNewEntity } from "./DataLayerNewEntity";
import { NewMemberOnTheMap } from "./NewMemberOnTheMap";

export const workDetailBodies = {
  "data-layer-new-entity": DataLayerNewEntity,
  "new-member-on-the-map": NewMemberOnTheMap,
  "buildings-refuse-to-fade": BuildingsRefuseToFade,
};
```

ไฟล์เดียวนี้ **static import** ทุก body ตัว — เขียน `import` ตายตัวบนหัวไฟล์ ตรงข้ามกับ
`dynamic(() => import("./X"))` ที่โหลดตอน runtime

### ข้อโต้แย้งมาตรฐานที่มักใช้ค้าน registry แบบนี้

ไฟล์เดียว import ทั้ง 3 ตัว → bundler มองว่าถูกใช้ทั้งหมด → คนที่เข้าดูหน้าเดียวต้องโหลด JavaScript
ของอีก 2 หน้าติดมาด้วยโดยไม่จำเป็น → วิธีแก้มาตรฐานคือ `next/dynamic` หรือ `React.lazy` เพื่อบังคับ
code-split ต่อ route

**ข้อโต้แย้งนี้ใช้ไม่ได้กับโปรเจกต์นี้** เพราะ Next.js App Router ทำให้ทุก component เป็น
**Server Component** โดยปริยาย (เว้นแต่จะประกาศ `"use client"` เอง) โค้ดของ Server Component รันอยู่
บน server แล้วจบตรงนั้น สิ่งที่ถูกส่งไปยัง browser คือ RSC payload — คำบรรยายผลลัพธ์ที่ render เสร็จ
แล้ว **ไม่ใช่ตัวโค้ดของ component**

ดังนั้นโค้ดของ body ทั้ง 3 ไฟล์จึงไม่เคยเข้าไปอยู่ใน client bundle ตั้งแต่แรก จะ static import 3 ตัว
หรือ 30 ตัว ปริมาณ JavaScript ที่ browser ต้องดาวน์โหลดเพิ่มขึ้นก็คือศูนย์เท่ากัน ยืนยันได้จากสถานะ
ปัจจุบันของ repo เอง — ทั้งโปรเจกต์มี `"use client"` อยู่ไฟล์เดียวคือ `src/components/Header.tsx`
(เพราะมี hamburger menu state) ที่เหลือทั้งหมดเป็น Server Component ล้วน

> **เงื่อนไขที่จะทำให้เหตุผลนี้ใช้ไม่ได้อีกต่อไป:** ถ้าวันหนึ่ง body ตัวใดตัวหนึ่งต้องการ
> interactivity จริง (เช่น carousel, ปุ่ม copy ในตัวอย่างโค้ด, before/after slider) แล้วต้องประกาศ
> `"use client"` ตัวนั้น จะเริ่มส่ง JavaScript จริงไปยัง client ตอนนั้นค่อยพิจารณาใช้ `dynamic()`
> เฉพาะตัวที่กลายเป็น client component นั้นตัวเดียว ไม่ใช่ทำเผื่อไว้ล่วงหน้าตั้งแต่ตอนที่ยังไม่มี
> ความจำเป็น

### ประเด็นที่เกี่ยวเนื่อง: data กับ registry sync กันไม่ทัน

ถ้าเพิ่ม case study ใหม่ใน `caseStudies.ts` แล้วลืมเขียน body ให้ ควรรู้ตัวตั้งแต่ compile ไม่ใช่ไป
เจอตอน runtime ว่าหน้านั้น render ไม่ออก

## Decision

แต่ละ case study มี body component ของตัวเอง เขียนอิสระตามธรรมชาติของเนื้อหานั้นๆ ไม่มี content model
กลางบังคับโครง ผูกกับ route ด้วย registry (`Record<TCaseStudySlug, ComponentType>`) โดย
`TCaseStudySlug` derive มาจาก `caseStudies` ด้วย `as const satisfies`:

```ts
// src/data/caseStudies.ts
export const caseStudies = [
  /* … */
] as const satisfies readonly ICaseStudy[];

export type TCaseStudySlug = (typeof caseStudies)[number]["slug"];
```

`Record<TCaseStudySlug, ComponentType>` บังคับให้ registry ต้องมี key ครบทุก slug ที่มีอยู่จริง —
เพิ่ม case study ใหม่ในข้อมูลแล้วไม่เขียน body ให้ TypeScript จะฟ้อง (และ `npm run build` พัง) ทันที
โดยไม่ต้องมี test แยกต่างหาก

## Consequences

**ข้อดี**

- เนื้อหาแต่ละ case study เขียนได้อิสระเต็มที่ ไม่ต้องยัดใส่โครงที่ไม่เข้ากับเรื่องที่เล่า
- ไม่มีต้นทุนด้าน client bundle จากการ static import ทุก body เพราะทุกตัวเป็น Server Component
- เพิ่ม case study แล้วลืมเขียน body → compile time error ทันที ไม่ใช่ runtime surprise

**ข้อเสีย**

- ไม่มี schema กลางที่บังคับความสม่ำเสมอของโครงเนื้อหา — ความสม่ำเสมอทางสายตาต้องพึ่ง kit
  (`WorkSection`/`WorkText`/`WorkCode`/`WorkImage`, ดู ADR-0002) แทน ไม่ใช่พึ่ง type system
- ถ้าวันหนึ่ง body ต้องการ interactivity ต้องกลับมาพิจารณาเรื่อง `dynamic()` เฉพาะตัวใหม่ —
  ข้อสรุปเรื่อง "ไม่กระทบ bundle" ผูกอยู่กับสมมติฐานว่าทุก body เป็น Server Component
