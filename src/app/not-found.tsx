import type { Metadata } from "next";

import { NotFoundSection } from "@/components/NotFoundSection";
import { notFound } from "@/data/notFound";

// root layout's title.template appends "— Anyawee Sr." automatically
export const metadata: Metadata = { title: notFound.title };

/**
 * Single 404 boundary for the whole app — both a URL matching no route
 * at all (e.g. `/asdf`, or `/work`, which the Work section's "VIEW ALL"
 *
 * pill already links to per routes.ts) and `notFound()` thrown by a
 * matched route (e.g. a bad `/work/<slug>`) land here.
 *
 * Either way this renders as `children` of the single root layout (`src/app/layout.tsx`),
 * which already provides Header/Footer for every request — so this file owns only the content.
 */
export default function NotFound() {
  return <NotFoundSection />;
}
