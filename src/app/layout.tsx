import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { siteUrl } from "@/data/site";
import { EyeTracker } from "@/components/EyeTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const title = "Anyawee Sr. — Frontend Engineer";
const description = "Portfolio of Anyawee Sr., a frontend engineer.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    // ใส่ template ไว้ที่นี่ที่เดียว — หน้าลูก (เช่น work/[slug]) แค่ส่ง
    // ชื่อหน้าเปล่าๆ มา ไม่ต้องต่อ "— Anyawee Sr." เอง
    template: "%s — Anyawee Sr.",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Anyawee Sr.",
    title,
    description,
    locale: "en_US",
  },
  // ยังไม่ให้ search engine เก็บ *.vercel.app — กันไม่ให้โดเมนชั่วคราวติดอันดับ
  // แล้วแข่งกับ custom domain ทีหลัง (ดู docs/adr/0004-hosting-on-vercel.md)
  // เอาออกเมื่อ domain จริงพร้อม (ดู docs/backlog.md) — ไม่กระทบการ์ดแชร์
  // LinkedIn/LINE เพราะ crawler พวกนั้นอ่านแค่ og: tag ไม่สน robots meta
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <EyeTracker />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
