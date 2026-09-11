# 0006. CloudFront CDN in Front of S3

## Status

Accepted

Extends [ADR-0005](0005-hosting-on-s3.md) — ปิดงาน CloudFront ที่ 0005 เว้นไว้เพราะติด account
verification ไม่ supersede เพราะการตัดสินใจหลักของ 0005 (S3 + GitHub Actions + OIDC) ยังยืนอยู่
ทั้งหมด อันนี้เติมแค่ชั้น CDN ที่ 0005 ตั้งใจไว้แต่ทำไม่ได้ตอนนั้น

## Context

0005 ตั้งใจใช้ CloudFront ตั้งแต่แรก แต่ AWS account ติดขั้นตอน verification เปิด case ให้ support
ไว้ ระหว่างรอจึงใช้ **Cloudflare proxy คั่นหน้า S3 website endpoint ชั่วคราว** — TLS จบที่ Cloudflare,
ช่วง Cloudflare &rarr; S3 เป็น HTTP ล้วน, bucket ต้อง public เต็มที่ (website endpoint ไม่รองรับ OAC),
purge cache ต้องทำมือทุกครั้งที่ deploy แตะไฟล์ที่ไม่ hash ชื่อ (favicon, `/images/*`, sitemap,
robots)

Account verification ปลดแล้ว (2026-09) — กลับมาทำ CloudFront ตามแผนเดิมของ 0005 เจ้าของโปรเจกต์
ยังตั้งใจใช้พอร์ตนี้เป็นแบบฝึกหัด AWS ต่อ (เหตุผลเดียวกับ 0005) — อยากได้ประสบการณ์ตรงกับ OAC,
CloudFront Functions, cache invalidation ไม่ใช่แค่ปิดงานให้จบ

เก็บ baseline ก่อนย้าย (`aws`/`curl`/`openssl` ตรง ๆ ไม่เดาจาก backlog เดิม) เจอ 3 อย่างที่
Cloudflare ทำอยู่โดยไม่มีบันทึกไว้ในเรพอเลย: Browser Cache TTL 4 ชม. ทับ header จริงจาก S3
(`max-age=300`), Cache Rule "Cache Everything" (ignore `Cache-Control`, edge TTL 1 เดือน — เหตุผล
ตัวจริงที่ purge มือเป็นงานบังคับ ไม่ใช่เพราะ HTML ไม่ถูก edge-cache อย่างที่ backlog เขียนไว้ผิด),
ไม่มี security header สักตัว

## Decision

Distribution เดียวคั่นหน้า S3 bucket เดิมผ่าน Origin Access Control (OAC) แทน Cloudflare proxy

**Origin** — REST endpoint (`anyawee-sr.com.s3.ap-southeast-1.amazonaws.com`) ไม่ใช่ website
endpoint (กัน 307 ที่ website endpoint ส่งกลับตอนไม่มี trailing slash) อ่านผ่าน OAC (SigV4,
sign always) แทนที่จะพึ่ง public bucket policy อย่างเดียว

**Routing** — CloudFront Function (`portfolio-2026-rewrite`, runtime `cloudfront-js-2.0`,
event `viewer-request`) แทนพฤติกรรม index-document + trailing-slash redirect ที่ website endpoint
เคยทำให้ฟรี (REST endpoint ไม่ทำ): ยุบ `//` ซ้ำ, `/` &rarr; `/index.html`, ลงท้าย `/` &rarr; ต่อ
`index.html`, ไฟล์จริง (มีจุดใน segment สุดท้าย) ปล่อยผ่าน, ที่เหลือ (ไม่มี extension ไม่มี trailing
slash) &rarr; 301 เติม slash คงไว้ พร้อม query string (ตรงกับ `sitemap.xml`) — ผูกกับ
`trailingSlash: true` ใน `next.config.ts` โดยตรง

**Error handling** — custom error response ทั้ง `403` และ `404` map ไป `/404.html` @ HTTP `404`,
error caching min TTL 10s (OAC ไม่ให้ `s3:ListBucket` &rarr; key ที่หายตอบ `403` ไม่ใช่ `404` ต้อง
map ทั้งคู่ ไม่งั้นหน้า 404 ที่ดีไซน์ไว้จะไม่ขึ้นครึ่งหนึ่งของเคส)

**Cache** — `Managed-CachingOptimized` ที่ default behavior, compress อัตโนมัติ (gzip/brotli) —
`Cache-Control` จริงมาจาก deploy pipeline โดยตรง (ดูหัวข้อถัดไป) แทนที่จะให้ CDN ตัดสินใจ cache เอง
แบบที่ Cloudflare Cache Rule เคยทำ

**Security headers** — `Managed-SecurityHeadersPolicy` ของ AWS แทน custom policy ที่ตั้งใจไว้แต่แรก
(ดู "Free plan constraints" ด้านล่าง) ได้ `Strict-Transport-Security: max-age=31536000`,
`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
`Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block` — เพิ่มจาก
baseline ที่ไม่มีสักตัว CSP/Permissions-Policy แยกทำทีหลัง (ต้องจูนกับ Next.js inline
style/RSC)

**WAF** — เก็บ Core protections ที่ Free plan บันเดิลมาให้ **ฟรี** (ตัดสินใจแรกคือเอาออกเพราะคิดว่า
มีค่าใช้จ่าย ~$5&ndash;8/เดือน พอเจอว่าฟรีก็กลับคำ) ได้ป้องกัน common web vulnerability + scanner +
IP threat-intel ของ Amazon กลับมาบางส่วนแทนที่เสียไปตอนเลิกใช้ Cloudflare proxy ไม่เปิด "Layer 7
DDoS protection" (ต้อง Business plan, ไม่จำเป็นที่สเกลนี้ — Shield Standard คุม L3/4 ฟรีอยู่แล้ว)

**TLS** — ACM certificate ออกที่ `us-east-1` (บังคับ, CloudFront อ่าน cert จาก region นี้ที่เดียว
ไม่เกี่ยวกับ region ของ bucket) SAN ครอบทั้ง `anyawee-sr.com` และ `www.anyawee-sr.com` (ใส่ `www`
ไว้ล่วงหน้าฟรี ยังไม่ทำ redirect/DNS record — backlog) `sni-only`, min TLS `TLSv1.2_2021`

**Deploy pipeline** — `deploy.yml` แยก `aws s3 sync` เป็น 2 รอบ: hashed asset (`_next/static/**`)
ได้ `Cache-Control: public, max-age=31536000, immutable` อัปโหลด**ก่อน**, ที่เหลือได้
`public, max-age=300, must-revalidate` sync **ทีหลัง**พร้อม `--delete` (ลำดับนี้ตั้งใจ กัน race
2 ทาง: อัปโหลด HTML ก่อนจะทำให้ CloudFront เจอ HTML ที่ชี้ chunk ที่ยังไม่มีบน S3 แล้ว custom-error
403/404 จะเสิร์ฟหน้า 404 แทน chunk พังทั้งหน้า / ลบ chunk เก่าก่อนเวลาอันควรจะทำให้ HTML เก่าที่ยัง
ถูก cache อยู่ที่ไหนสักแห่งอ้างถึง chunk ที่ไม่มีแล้ว) ปิดท้ายด้วย
`aws cloudfront create-invalidation --paths "/*"` (นับ 1 path ในโควตาฟรี 1,000 path/เดือน ไม่ว่าจะ
match กี่ไฟล์) — เลิก "Purge Everything" มือที่ Cloudflare ไปเลย

**Free plan constraints (ยอมรับ)** — distribution ที่ใช้เป็นของเดิมที่เคย auto-create ไว้ตอน
พยายามเปิด CloudFront ครั้งก่อน (ADR-0005) ยังค้างอยู่บน CloudFront **Free plan**: แก้ price class
ไม่ได้ (ค้าง `PriceClass_All` — รวม Asia อยู่แล้ว, cost $0 ในกรอบ free tier 1TB/10M
request/2M function invocation ต่อเดือน), แก้ default root object ไม่ได้ (CloudFront Function
กฎ 2 ชดเชยแทน), แนบ custom response-headers/cache/origin-request policy ไม่ได้ (gate ที่ Business
plan — ใช้ managed policy แทนทั้งหมด), ไม่มี standard access log (Pro plan) — **function
association ใช้ได้ปกติบน Free plan** ซึ่งเป็นจุดตัดสินสำคัญที่ทำให้ยัง reuse distribution เดิมได้
โดยไม่ต้องรื้อสร้างใหม่ผ่าน CLI (ถ้า function ก็โดน gate ด้วยจะต้องรื้อสร้าง)

**Cutover** — DNS เดียวที่ Cloudflare: apex CNAME ชี้ไปที่ CloudFront distribution domain, proxy
**OFF (grey-cloud)**, TTL ลดเหลือ 60s ก่อน flip แล้วคืนเป็น 3600s หลัง soak ผ่าน — เป็น blue-green
cutover ผ่าน DNS record เดียว rollback คือ flip กลับ ไม่ใช่ rebuild อะไร S3 website hosting +
`PublicReadOnly` bucket policy statement เดิมเก็บไว้เป็น standby จนกว่าจะมั่นใจ (soak 24&ndash;48
ชม.) ค่อยรื้อทิ้งใน phase harden แยกต่างหาก

## Consequences

- (+) end-to-end HTTPS จบที่ CloudFront เอง ไม่ต้องพึ่ง third-party proxy ทำ TLS ให้อีกต่อไป
- (+) bucket ไม่ public เต็มที่แล้ว (dual-mode ระหว่าง soak, ปิดสนิทตอน harden)
- (+) เลิก "Purge Everything" มือถาวร — pipeline invalidate อัตโนมัติทุก deploy
- (+) cache model เปลี่ยนจาก "CDN ignore `Cache-Control`, cache ทุกอย่าง 1 เดือน + purge มือ" เป็น
  "เคารพ `Cache-Control` จริง — HTML/ไฟล์ไม่ hash 5 นาที, hashed asset immutable 1 ปี,
  auto-invalidate หลัง deploy"
- (+) http &rarr; https redirect อัตโนมัติจาก CloudFront (ของเดิม Cloudflare "Always Use HTTPS"
  ปิดอยู่)
- (+) WAF Core protections ฟรีจาก Free plan — ได้ layer ป้องกันคืนมาโดยไม่มีต้นทุนเพิ่ม
- (+) ได้ประสบการณ์ตรงกับ OAC, CloudFront Functions, custom error response, cache invalidation —
  ตรงเป้าหมายการเรียนรู้ที่ตั้งไว้ตั้งแต่ 0005
- (+) `infra/` ครอบ CDN config ครบแล้ว (ก่อนหน้ามีแค่ IAM)
- (-) ชิ้นส่วนที่ต้องดูแลด้วยมือเพิ่มขึ้น — function, OAC, distribution, response headers policy id
  ยังไม่ใช่ IaC ต้อง sync มือกับ AWS เหมือน IAM เดิม
- (-) CloudFront Function ผูกกับ `trailingSlash: true` ของ `next.config.ts` โดยตรง — เปลี่ยนค่านั้น
  ต้องแก้ function ตามมือ ไม่มี type check ข้ามภาษาระหว่าง TS config กับ JS ที่รันที่ edge
- (-) ติด CloudFront Free plan lock — แก้ price class/default-root-object/custom policy/access log
  ไม่ได้ (ยอมรับได้ที่สเกลนี้ อัปเกรด plan ได้ถ้าจำเป็นวันหน้า)
- (-) hashed asset เก่าสะสมใน bucket ตลอดไปโดยไม่มีการลบอัตโนมัติ (ตั้งใจ กันสอง race ที่อธิบายไว้ใน
  หัวข้อ deploy pipeline) — cost ต่ำมากที่สเกลนี้ ถ้าจะทำ cleanup ทีหลังต้องเทียบกับ manifest ของ
  build ปัจจุบัน ไม่ใช่ age-based (S3 Lifecycle rule ธรรมดาจะลบไฟล์ที่ยัง live อยู่โดยไม่รู้ตัว
  ถ้าเนื้อหามันบังเอิญไม่เปลี่ยนนาน)
- (-) ผูก HTTPS-only ทันทีผ่าน HSTS `max-age=31536000` (ยอมรับได้ เว็บ HTTPS-only อยู่แล้วตั้งแต่
  ก่อนย้าย)
- (-) CloudFront hit origin (S3) ถี่ขึ้นกว่าเดิม (ของเดิม cache 1 เดือน, ของใหม่ 5 นาทีสำหรับ
  HTML/ไฟล์ไม่ hash) — ถูกและรับได้ที่สเกลนี้ แลกกับ freshness ที่ควบคุมได้จริงแทนที่จะพึ่ง purge มือ
- (-) `www.anyawee-sr.com` ยังเข้าไม่ได้ (SAN มีแล้วแต่ไม่มี DNS record + distribution ยังไม่มี
  alternate domain name นี้) — deferred เป็น backlog ทำได้ทุกเมื่อไม่ผูกกับ phase ไหนของงานนี้
