import { Montserrat, Bai_Jamjuree } from "next/font/google";

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

// className list that defines both --font-* custom properties. layout.tsx
// attaches this to <html>; the Storybook decorator attaches it to <body>
// instead, since Storybook's iframe doesn't render through the root layout.
export const fontVariables = `${montserrat.variable} ${baiJamjuree.variable}`;
