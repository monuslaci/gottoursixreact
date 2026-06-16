import { DashboardPageContent } from "@/components/home/dashboard-page-content";
import { PublicLanding } from "@/components/home/public-landing";
import { listRecentCommunityPosts, listTopics } from "@/lib/community";
import { buildMetadata } from "@/lib/seo";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  description:
    "Join a support community for men built around honest conversation, practical topics, and trusted private connection.",
  keywords: [
    "mens support",
    "mens community",
    "peer support",
    "discussion topics",
    "private messaging",
  ],
});

export default async function HomePage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return <PublicLanding />;
  }

  const [topics, recentPosts] = await Promise.all([
    listTopics(),
    listRecentCommunityPosts(4),
  ]);

  return <DashboardPageContent topics={topics} recentPosts={recentPosts} />;
}
