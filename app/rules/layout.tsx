import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Community Rules",
  description:
    "Read the Got Your Six community standards covering respect, privacy, moderation, and safe participation.",
  path: "/rules",
  keywords: ["community rules", "moderation policy", "safe discussion guidelines"],
});

export default function RulesLayout({ children }: { children: ReactNode }) {
  return children;
}
