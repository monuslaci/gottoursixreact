import nextDynamic from "next/dynamic";

import { listTopics } from "@/lib/community";

export const dynamic = "force-dynamic";

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
