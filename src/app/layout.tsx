import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { EyeTracker } from "@/components/EyeTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anyawee Sr. — Frontend Engineer",
  description: "Portfolio of Anyawee Sr., a frontend engineer.",
  // ยังไม่ให้ search engine เก็บ *.vercel.app — กันไม่ให้โดเมนชั่วคราวติดอันดับ
  // แล้วแข่งกับ custom domain ทีหลัง (ดู docs/adr/0004-hosting-on-vercel.md)
  // เอาออกเมื่อ domain จริงพร้อม (ดู docs/backlog.md)
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
