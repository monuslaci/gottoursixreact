import type { Metadata } from "next";
import type { ReactNode } from "react";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Demo",
  description: "Internal demo surface for future community operations.",
  path: "/demo",
  noIndex: true,
});

export default function DemoLayout({ children }: { children: ReactNode }) {
  return children;
}
