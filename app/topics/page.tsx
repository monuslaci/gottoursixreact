import nextDynamic from "next/dynamic";

import { listTopics } from "@/lib/community";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Topics",
  description:
    "Browse community topics, discover practical conversations, and follow the discussions that matter most to you.",
  path: "/topics",
  keywords: ["community topics", "support discussions", "men's forum topics"],
});

const TopicsPageContent = nextDynamic(
  () =>
    import("@/components/topics/topics-page-content").then(
      (mod) => mod.TopicsPageContent
    ),
  { ssr: false }
);

export default async function TopicsPage() {
  const topics = await listTopics();

  return <TopicsPageContent topics={topics} />;
}
