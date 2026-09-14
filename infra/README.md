# infra/

Snapshot ของสิ่งที่ตั้งด้วยมือบน AWS ให้เว็บทำงาน — IAM (push static export ขึ้น S3 ผ่าน GitHub
OIDC) + CDN (CloudFront คั่นหน้า S3, ทำ TLS + cache + routing) — **ไม่ใช่ IaC** ไม่มีอะไร apply
ไฟล์พวกนี้อัตโนมัติ

เก็บไว้ใน repo เป็นบันทึกว่า resource บน AWS ตั้งค่าไว้ยังไง กัน drift — แก้ฝั่ง AWS แล้วมาแก้ไฟล์
ให้ตรง, แก้ไฟล์แล้ว apply เอง (คำสั่งข้างล่าง) ทุกไฟล์ตัด field ที่เป็น concurrency token
(`ETag`) ออก เพราะเปลี่ยนทุกครั้งที่ update — เก็บไว้จะกลายเป็นข้อมูลเท็จทันที ต้อง fetch สดก่อน
apply เสมอ

## IAM — role `GitHubActionsS3Role` (account `891376940165`)

| ไฟล์ | policy อะไร |
| --- | --- |
| `trust-policy.json` | **ใครมีสิทธิ์ assume role** — GitHub OIDC provider, จำกัด `sub` ไว้ที่ repo `anyawee-sr/portfolio-2026` branch `main` |
| `s3-policy.json` | **role ทำอะไรได้** — `PutObject`/`GetObject`/`ListBucket`/`DeleteObject` บน bucket `anyawee-sr.com` + `cloudfront:CreateInvalidation` scope เฉพาะ distribution `E3GWIH89OUPTH2` |

```bash
aws iam update-assume-role-policy \
  --role-name GitHubActionsS3Role \
  --policy-document file://infra/trust-policy.json

aws iam put-role-policy \
  --role-name GitHubActionsS3Role \
  --policy-name S3AccessPolicy \
  --policy-document file://infra/s3-policy.json
```

## S3 — bucket `anyawee-sr.com` (`ap-southeast-1`)

| ไฟล์ | คืออะไร |
| --- | --- |
| `bucket-policy.json` | policy ปัจจุบัน — เหลือแค่ `AllowCloudFrontServicePrincipal` เข้าได้ทาง CloudFront/OAC เท่านั้น bucket ปิดสนิทแล้ว (ตัด `PublicReadOnly` ออกแล้วหลัง soak ผ่าน) |
| `s3-website-config.json` | static website hosting config **เดิม** (ปิดไปแล้ว) — เก็บไว้เป็นสูตร rollback เท่านั้น |

```bash
aws s3api put-bucket-policy --bucket anyawee-sr.com --policy file://infra/bucket-policy.json

# ใช้เฉพาะตอน rollback (คืน S3 website hosting กลับมา):
aws s3api put-bucket-website --bucket anyawee-sr.com --website-configuration file://infra/s3-website-config.json
```

## CloudFront — distribution `E3GWIH89OUPTH2`

| ไฟล์ | คืออะไร |
| --- | --- |
| `cloudfront-distribution.json` | `DistributionConfig` เต็ม — origin (REST endpoint + OAC), function association, custom error 403/404, response headers policy (`Managed-SecurityHeadersPolicy`), WAF (`WebACLId`, Free-plan bundled) |
| `cloudfront-oac.json` | `OriginAccessControlConfig` ของ OAC `E3K2202W1OHZX0` (`portfolio-2026-oac`) |
| `cloudfront-function.js` | source ของ CloudFront Function `portfolio-2026-rewrite` (stage `LIVE`) — encode `trailingSlash: true` ของ `next.config.ts` |

```bash
# แก้ distribution — ต้อง get-distribution-config เอา ETag สดก่อนเสมอ
aws cloudfront get-distribution-config --id E3GWIH89OUPTH2 --query ETag --output text
aws cloudfront update-distribution --id E3GWIH89OUPTH2 \
  --if-match <ETag ที่ได้> \
  --distribution-config file://infra/cloudfront-distribution.json

# แก้ OAC
aws cloudfront get-origin-access-control-config --id E3K2202W1OHZX0 --query ETag --output text
aws cloudfront update-origin-access-control --id E3K2202W1OHZX0 \
  --if-match <ETag ที่ได้> \
  --origin-access-control-config file://infra/cloudfront-oac.json

# แก้ function — update แล้วต้อง publish แยกอีกสเต็ปเสมอ (ไม่งั้นค้าง DEVELOPMENT stage ไม่ live)
aws cloudfront get-function --name portfolio-2026-rewrite --stage DEVELOPMENT --query ETag --output text /dev/null
aws cloudfront update-function --name portfolio-2026-rewrite \
  --if-match <ETag ที่ได้> \
  --function-config Comment="",Runtime=cloudfront-js-2.0 \
  --function-code fileb://infra/cloudfront-function.js
aws cloudfront publish-function --name portfolio-2026-rewrite --if-match <ETag จาก update-function>
```

## ACM

| ไฟล์ | คืออะไร |
| --- | --- |
| `acm-cert.md` | cert ARN, SAN, validation CNAME (ต้องอยู่ใน Cloudflare DNS ตลอดไปกันต่ออายุพัง) — reference เท่านั้น cert สร้างซ้ำให้ตรง ARN เดิมไม่ได้ |

## หมายเหตุ

- `sub` ใน `trust-policy.json` เป็นรูป `repo:OWNER@<owner_id>/REPO@<repo_id>:ref:...` — เป็น
  **immutable subject claim** ที่ GitHub เปลี่ยนมาใช้ตั้งแต่ 2026-07-15 (ฝัง numeric id ที่
  recycle ไม่ได้ กัน repo/org ชื่อซ้ำถูกยึดแล้ว inherit trust เดิม) **จงใจ ไม่ใช่ typo —
  ห้ามแก้ให้สั้น**
- ยังไม่ได้ verify ว่า repo id `1301710327` / owner id `119733686` ตรงกับ repo จริงที่ workflow
  รัน — เช็ค: `aws iam get-role --role-name GitHubActionsS3Role --query 'Role.AssumeRolePolicyDocument'`
- `cloudfront-distribution.json`/`cloudfront-oac.json` เก็บ `CallerReference`/`Name` ไว้ตามที่ AWS
  กำหนด แต่**ใช้สร้าง resource ใหม่ให้ id ตรงเดิมไม่ได้** — `update-*` เท่านั้นที่ apply ไฟล์พวกนี้ได้
  จะสร้างใหม่ (เช่น ถ้า distribution ต้องรื้อสร้างเพราะ Free plan ล็อกอะไรเพิ่ม) ต้องเขียน config เอง
  ผ่าน `create-distribution`/`create-origin-access-control` แล้ว snapshot ไฟล์นี้ใหม่

เหตุผลเชิงสถาปัตยกรรม: S3 hosting → `docs/adr/0005-hosting-on-s3.md`, CloudFront CDN →
`docs/adr/0006-cloudfront-cdn-in-front-of-s3.md`
