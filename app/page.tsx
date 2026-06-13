import { DashboardPageContent } from "@/components/home/dashboard-page-content";
import { PublicLanding } from "@/components/home/public-landing";
import { listTopics } from "@/lib/community";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return <PublicLanding />;
  }

  const topics = await listTopics();

  return <DashboardPageContent topics={topics} />;
}
