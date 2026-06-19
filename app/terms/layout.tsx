import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Read the Got Your Six terms for account use, community participation, moderation, and platform limitations.",
  path: "/terms",
  keywords: ["terms of service", "community terms", "account terms"],
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
