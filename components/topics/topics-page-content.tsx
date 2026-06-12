"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { BookOpen, MessageSquare, Shield } from "lucide-react";

import type { TopicListItem } from "@/lib/community";
import { TopicsDashboard } from "@/components/topics/topics-dashboard";

type TopicsPageContentProps = {
  topics: TopicListItem[];
};

export function TopicsPageContent({ topics }: TopicsPageContentProps) {
  const totalPosts = topics.reduce((sum, topic) => sum + topic.counts.posts, 0);
  const totalSubscriptions = topics.reduce(
    (sum, topic) => sum + topic.counts.subscriptions,
    0
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Topics
              </Chip>
              <Chip color="secondary" variant="flat">
                Subtopics
              </Chip>
              <Chip className="bg-brotherhood-bronze/16 text-brotherhood-bronze" variant="flat">
                Posts API
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Community spaces for guidance, accountability, and honest talk.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Browse the seeded topics below, then add your own. The page is
                connected to Prisma-backed APIs, so new topics are stored in the
                same database you are inspecting in Studio.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: <Shield className="h-4 w-4" />,
                  label: "Safety",
                  text: "Ready for moderation flows",
                },
                {
                  icon: <BookOpen className="h-4 w-4" />,
                  label: "Structure",
                  text: "Topics and subtopics stay organized",
                },
                {
                  icon: <MessageSquare className="h-4 w-4" />,
                  label: "Discussion",
                  text: "Posts and replies are seeded too",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-divider bg-background/80 p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="rounded-lg bg-secondary/12 p-2 text-secondary">
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  <p className="mt-2 text-sm text-default-600">{item.text}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-primary/12 bg-brotherhood-forest text-white shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.12)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <div className="w-fit rounded-xl bg-white/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
              Ready now
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-semibold">Seed data is already loaded.</p>
              <p className="text-sm leading-6 text-white/72">
                You should see real topic, subscription, post, and conversation
                records in Prisma Studio after seeding runs.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ["Topics", `${topics.length} records`],
                ["Posts", `${totalPosts} records`],
                ["Subscriptions", `${totalSubscriptions} records`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/8 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <TopicsDashboard initialTopics={topics} />
    </div>
  );
}
