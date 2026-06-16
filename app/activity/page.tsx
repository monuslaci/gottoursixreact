import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "My Activity",
  description: "Review your recent posts and replies.",
  path: "/activity",
  noIndex: true,
});

const ActivityPageContent = nextDynamic(
  () =>
    import("@/components/activity/activity-page-content").then(
      (mod) => mod.ActivityPageContent
    ),
  { ssr: false }
);

export default function ActivityPage() {
  return <ActivityPageContent />;
}
