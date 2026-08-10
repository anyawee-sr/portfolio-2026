import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { EyeTracker } from "@/components/EyeTracker";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anyawee Sr. — Frontend Engineer",
  description: "Portfolio of Anyawee Sr., a frontend engineer.",
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
