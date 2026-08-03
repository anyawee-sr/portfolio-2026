import {
  Montserrat,
  Bai_Jamjuree,
  Covered_By_Your_Grace,
  Special_Elite,
} from "next/font/google";

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const baiJamjuree = Bai_Jamjuree({
  variable: "--font-bai-jamjuree",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const coveredByYourGrace = Covered_By_Your_Grace({
  variable: "--font-covered-by-your-grace",
  subsets: ["latin"],
  weight: ["400"],
});

export const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: ["400"],
});

// className list that defines both --font-* custom properties. layout.tsx
// attaches this to <html>; the Storybook decorator attaches it to <body>
// instead, since Storybook's iframe doesn't render through the root layout.
export const fontVariables = `${montserrat.variable} ${baiJamjuree.variable} ${coveredByYourGrace.variable} ${specialElite.variable}`;
