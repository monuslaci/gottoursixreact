import { DashboardPageContent } from "@/components/home/dashboard-page-content";
import { PublicLanding } from "@/components/home/public-landing";
import { listRecentCommunityPosts, listTopics } from "@/lib/community";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

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
