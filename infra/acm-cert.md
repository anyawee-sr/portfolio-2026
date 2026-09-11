# ACM certificate

ใบรับรอง TLS ที่ CloudFront ใช้เสิร์ฟ `anyawee-sr.com` — สร้าง **มือ** ผ่าน ACM console
ไม่มี IaC ไม่มีอะไร apply ไฟล์นี้อัตโนมัติ (เก็บไว้กัน drift เหมือนไฟล์อื่นใน `infra/`)

| | |
| --- | --- |
| ARN | `arn:aws:acm:us-east-1:891376940165:certificate/1eae3a17-ec16-4763-9f9e-779b329875f7` |
| Region | **`us-east-1`** — บังคับ, CloudFront อ่าน cert จาก region นี้ที่เดียว (bucket จริงอยู่ `ap-southeast-1` คนละเรื่อง) |
| Domains (SAN) | `anyawee-sr.com`, `www.anyawee-sr.com` |
| Validation | DNS |
| Key algorithm | RSA-2048 |
| Issued | 2026-09-10 |
| Expires | 2027-03-27 (auto-renew ก่อนหมดอายุ ถ้า validation CNAME ยังอยู่ครบ) |
| In use by | `arn:aws:cloudfront::891376940165:distribution/E3GWIH89OUPTH2` |

## Validation CNAME — ต้องอยู่ใน Cloudflare DNS **ตลอดไป**

ACM เช็ค record พวกนี้ซ้ำทุกครั้งที่ auto-renew (ทุก ~13 เดือน) — **ลบไม่ได้แม้ cert จะ `ISSUED` แล้ว**
ลบเมื่อไหร่ครั้งต่ออายุถัดไปจะค้าง

| Domain | Name (CNAME) | Value |
| --- | --- | --- |
| `anyawee-sr.com` | `_5c7981d59ec315a3d2196ec55b2c98f4.anyawee-sr.com` | `_f11723377d406b92646b82dc17708478.jkddzztszm.acm-validations.aws` |
| `www.anyawee-sr.com` | `_c07d284cf40dde9478ce3abf6243425b.www.anyawee-sr.com` | `_9115b9928f8af6e253479247c510e9b1.jkddzztszm.acm-validations.aws` |

ทั้งสอง record ตั้งเป็น **DNS only (เทา)** ที่ Cloudflare — ไม่ proxy (ไม่มีเหตุผลต้อง proxy record
validation) คนละ record กับ apex CNAME ที่ชี้ CloudFront (`docs/adr/0006-cloudfront-cdn-in-front-of-s3.md`)

## หมายเหตุ

- `www.anyawee-sr.com` อยู่ใน SAN แล้วแต่**ยังไม่มี DNS record ชี้ไปไหน + distribution ยังไม่มี
  alternate domain name นี้** — เข้าเว็บผ่าน `www.` ไม่ได้ตอนนี้ (ไม่เคยได้อยู่แล้วตั้งแต่ก่อน
  ย้าย CloudFront) ใส่ SAN ไว้ล่วงหน้าฟรีเผื่อทำ `www` → apex redirect ทีหลัง (backlog)
- ต่ออายุอัตโนมัติ ไม่ต้องทำอะไรเอง ตราบใดที่ validation CNAME ทั้งสองยังอยู่และ cert ยังผูกอยู่กับ
  distribution ที่ใช้งานจริง (`InUseBy`) — เช็คสถานะซ้ำได้ด้วย:

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:891376940165:certificate/1eae3a17-ec16-4763-9f9e-779b329875f7 \
  --region us-east-1 \
  --query 'Certificate.{Status:Status,NotAfter:NotAfter,RenewalEligibility:RenewalEligibility}'
```

เหตุผลเชิงสถาปัตยกรรม (ทำไม CloudFront + ACM แทน Cloudflare proxy เดิม):
`docs/adr/0006-cloudfront-cdn-in-front-of-s3.md`
