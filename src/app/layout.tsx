import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import "./globals.css";
import { siteUrl } from "@/data/site";
import { EyeTracker } from "@/components/EyeTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import { GoogleAnalytics } from "@next/third-parties/google";

const title = "Anyawee Sr. — Frontend Engineer";
const description = "Portfolio of Anyawee Sr., a frontend engineer.";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

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
      {gaId ? (
        <>
          <GoogleAnalytics
            gaId={gaId}
            debugMode={process.env.NODE_ENV === "development"}
          />
          <AnalyticsListener />
        </>
      ) : null}
    </html>
  );
}
