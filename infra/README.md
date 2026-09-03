# infra/

Snapshot ของ AWS IAM ที่ตั้งด้วยมือให้ `.github/workflows/deploy.yml` push static export
ขึ้น S3 ได้ผ่าน GitHub OIDC — **ไม่ใช่ IaC** ไม่มีอะไร apply ไฟล์พวกนี้อัตโนมัติ

เก็บไว้ใน repo เป็นบันทึกว่า role บน AWS ตั้งค่าไว้ยังไง กัน drift — แก้ฝั่ง AWS แล้วมาแก้ไฟล์
ให้ตรง, แก้ไฟล์แล้ว apply เอง (คำสั่งข้างล่าง)

| ไฟล์ | policy อะไรของ role `GitHubActionsS3Role` (account `891376940165`) |
| --- | --- |
| `trust-policy.json` | **ใครมีสิทธิ์ assume role** — GitHub OIDC provider, จำกัด `sub` ไว้ที่ repo `anyawee-sr/portfolio-2026` branch `main` |
| `s3-policy.json` | **role ทำอะไรได้** — `PutObject` / `GetObject` / `ListBucket` / `DeleteObject` เฉพาะ bucket `anyawee-sr.com` |

## apply กลับขึ้น AWS

```bash
aws iam update-assume-role-policy \
  --role-name GitHubActionsS3Role \
  --policy-document file://infra/trust-policy.json

aws iam put-role-policy \
  --role-name GitHubActionsS3Role \
  --policy-name <ชื่อ inline policy> \
  --policy-document file://infra/s3-policy.json
```

## หมายเหตุ

- `sub` ใน `trust-policy.json` เป็นรูป `repo:OWNER@<owner_id>/REPO@<repo_id>:ref:...` — เป็น
  **immutable subject claim** ที่ GitHub เปลี่ยนมาใช้ตั้งแต่ 2026-07-15 (ฝัง numeric id ที่
  recycle ไม่ได้ กัน repo/org ชื่อซ้ำถูกยึดแล้ว inherit trust เดิม) **จงใจ ไม่ใช่ typo —
  ห้ามแก้ให้สั้น**
- ยังไม่ได้ verify ว่า repo id `1301710327` / owner id `119733686` ตรงกับ repo จริงที่ workflow
  รัน — เช็ค: `aws iam get-role --role-name GitHubActionsS3Role --query 'Role.AssumeRolePolicyDocument'`

เหตุผลเชิงสถาปัตยกรรมของการ deploy แบบนี้: `docs/adr/0005-hosting-on-s3.md`
