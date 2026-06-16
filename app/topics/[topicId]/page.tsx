import type { Metadata } from "next";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { getTopicById, listTopicPosts } from "@/lib/community";
import { buildMetadata } from "@/lib/seo";
import { getCurrentSessionUser } from "@/lib/session";

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

export async function generateMetadata({
  params,
}: TopicDetailPageProps): Promise<Metadata> {
  const topic = await getTopicById(params.topicId);

  if (!topic) {
    return buildMetadata({
      title: "Topic not found",
      description: "This topic could not be found.",
      path: `/topics/${params.topicId}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: topic.title,
    description:
      topic.description ||
      `Join the ${topic.title} discussion on Got Your Six and follow practical conversations from the community.`,
    path: `/topics/${params.topicId}`,
    keywords: [...topic.tags, "topic discussion", "community support"],
  });
}

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const currentUser = await getCurrentSessionUser();
  const topic = await getTopicById(params.topicId);

  if (!topic) {
    notFound();
  }

  const posts = await listTopicPosts(params.topicId, currentUser?.id);

  return <TopicDetailPageContent topic={topic} posts={posts} />;
}
