import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Messages",
  description: "Private conversations on Got Your Six.",
  path: "/messages",
  noIndex: true,
});

const MessagesPageContent = nextDynamic(
  () =>
    import("@/components/messages/messages-page-content").then(
      (mod) => mod.MessagesPageContent
    ),
  { ssr: false }
);

export default function MessagesPage() {
  return <MessagesPageContent />;
}
