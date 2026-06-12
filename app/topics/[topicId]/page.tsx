import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { getTopicById, listTopicPosts } from "@/lib/community";

export const dynamic = "force-dynamic";

const TopicDetailPageContent = nextDynamic(
  () =>
    import("@/components/topics/topic-detail-page-content").then(
      (mod) => mod.TopicDetailPageContent
    ),
  { ssr: false }
);

type TopicDetailPageProps = {
  params: {
    topicId: string;
  };
};

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const topic = await getTopicById(params.topicId);

  if (!topic) {
    notFound();
  }

  const posts = await listTopicPosts(params.topicId);

  return <TopicDetailPageContent topic={topic} posts={posts} />;
}
