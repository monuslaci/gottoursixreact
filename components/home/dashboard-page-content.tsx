"use client";

import { Button, Card, CardBody, Chip, Divider } from "@heroui/react";
import {
  ArrowRight,
  Hash,
  MessageSquareText,
  Shield,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { TopicSummaryCard } from "@/components/topics/topic-summary-card";
import type { TopicListItem } from "@/lib/community";

type DashboardPageContentProps = {
  topics: TopicListItem[];
};

function ShortcutCard({
  icon,
  title,
  text,
  href,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  href: string;
}) {
  return (
    <Card className="border border-primary/12 bg-content1 shadow-[0_14px_38px_rgb(var(--heroui-colors-primary-500)/0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgb(var(--heroui-colors-primary-500)/0.12)]">
      <CardBody className="gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-2xl bg-secondary/12 p-3 text-secondary">{icon}</div>
          <ArrowRight className="h-4 w-4 text-default-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm leading-6 text-default-600">{text}</p>
        </div>
        <Button as={Link} href={href} variant="flat" className="justify-start">
          Open
        </Button>
      </CardBody>
    </Card>
  );
}

export function DashboardPageContent({ topics }: DashboardPageContentProps) {
  const topTopics = topics.slice(0, 6);

  const totals = topics.reduce(
    (accumulator, topic) => ({
      topics: accumulator.topics + 1,
      subtopics: accumulator.subtopics + topic.counts.subtopics,
      posts: accumulator.posts + topic.counts.posts,
      members: accumulator.members + topic.counts.subscriptions,
    }),
    {
      topics: 0,
      subtopics: 0,
      posts: 0,
      members: 0,
    }
  );

  const dashboardStats = [
    {
      label: "Topics",
      value: `${totals.topics}`,
      helper: "Core spaces available now",
    },
    {
      label: "Subtopics",
      value: `${totals.subtopics}`,
      helper: "Focused areas for discussion",
    },
    {
      label: "Posts",
      value: `${totals.posts}`,
      helper: "Threads already in motion",
    },
    {
      label: "Members",
      value: `${totals.members}`,
      helper: "Subscriptions and active reach",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-[32px] border border-primary/12 bg-content1 shadow-[0_24px_70px_rgb(var(--heroui-colors-primary-500)/0.12)]">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-primary/15 bg-background shadow-sm sm:h-24 sm:w-24">
                <Image
                  src="/logo.png"
                  alt="Got Your Six logo"
                  fill
                  sizes="96px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div className="space-y-1">
                <Chip color="primary" variant="flat">
                  Dashboard
                </Chip>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">
                  Community control center
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Focused overview
              </Chip>
              <Chip color="secondary" variant="flat">
                <Shield className="mr-1 h-3.5 w-3.5" />
                Safety first
              </Chip>
              <Chip className="bg-brotherhood-forest/16 text-brotherhood-forest" variant="flat">
                <Users className="mr-1 h-3.5 w-3.5" />
                Brotherhood tools
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                A calm, professional dashboard for topics, messages, and member support.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Use this home view to jump into the most important parts of the app:
                browse topics, manage your profile, check messages, and keep an eye on
                the rules and admin surface.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                as={Link}
                href="/topics"
                color="primary"
                endContent={<ArrowRight size={16} />}
              >
                Browse topics
              </Button>
              <Button as={Link} href="/messages" variant="bordered">
                Open messages
              </Button>
              <Button
                as={Link}
                href="/profile"
                variant="bordered"
                className="border-brotherhood-steel/35 text-brotherhood-steel"
              >
                View profile
              </Button>
            </div>
          </div>

          <div className="border-t border-divider/70 bg-gradient-to-br from-brotherhood-navy via-brotherhood-navy to-brotherhood-forest p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                  Today&apos;s snapshot
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Everything in one place.
                </h2>
                <p className="text-sm leading-6 text-white/75">
                  A compact view of the core surfaces that matter most in the app.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {dashboardStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/12 bg-white/8 p-4 shadow-[0_14px_34px_rgb(0_0_0/0.12)] backdrop-blur"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-sm leading-5 text-white/72">{item.helper}</p>
                  </div>
                ))}
              </div>

              <Divider className="bg-white/12" />

              <div className="space-y-3">
                {[
                  ["Topics", "Discussion spaces with subtopics and posts."],
                  ["Messages", "Private conversations for member support."],
                  ["Rules", "Clear standards for safe participation."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/6 p-4"
                  >
                    <Hash className="mt-0.5 h-4 w-4 shrink-0 text-brotherhood-bronze" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm leading-5 text-white/72">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ShortcutCard
          icon={<Hash className="h-5 w-5" />}
          title="Topics"
          text="Open the topic library, search spaces, and browse the full list."
          href="/topics"
        />
        <ShortcutCard
          icon={<MessageSquareText className="h-5 w-5" />}
          title="Messages"
          text="Jump into direct conversations and check your inbox."
          href="/messages"
        />
        <ShortcutCard
          icon={<UserRound className="h-5 w-5" />}
          title="Profile"
          text="Update your username, basic details, and subscriptions."
          href="/profile"
        />
        <ShortcutCard
          icon={<Shield className="h-5 w-5" />}
          title="Rules"
          text="Review the community standards before posting or messaging."
          href="/rules"
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <Chip color="secondary" variant="flat">
              Active topics
            </Chip>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              A snapshot of the spaces people are using now.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-default-600">
              These cards come from the live topic data, so the dashboard always
              reflects what is actually available in the app.
            </p>
          </div>

          <Button
            as={Link}
            href="/topics"
            variant="flat"
            endContent={<ArrowRight className="h-4 w-4" />}
          >
            View all topics
          </Button>
        </div>

        {topTopics.length > 0 ? (
          <section className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {topTopics.map((topic) => (
              <TopicSummaryCard
                key={topic.id}
                topic={topic}
                href={`/topics/${topic.id}`}
              />
            ))}
          </section>
        ) : (
          <Card className="border border-divider bg-content1 shadow-sm">
            <CardBody className="p-5">
              <p className="text-sm text-default-600">
                No topics exist yet. Use the admin dashboard to create the first spaces.
              </p>
            </CardBody>
          </Card>
        )}
      </section>
    </div>
  );
}
