"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import { ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { TopicListItem } from "@/lib/community";

type TopicSummaryCardProps = {
  topic: TopicListItem;
  href?: string;
  footer?: ReactNode;
  mode?: "public" | "admin";
};

export function TopicSummaryCard({
  topic,
  href,
  footer,
  mode = "public",
}: TopicSummaryCardProps) {
  const isPublic = mode === "public";
  const cardHeightClass = isPublic ? "h-[360px]" : "h-[432px]";
  const visibleTags = topic.tags.slice(0, 3);
  const content = (
    <Card
      isPressable={Boolean(href)}
      className={`${cardHeightClass} overflow-hidden rounded-[28px] border border-divider/70 bg-content1 shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_24px_52px_rgba(15,23,42,0.12)]`}
    >
      <CardBody className="flex h-full flex-col p-0">
        <div className="h-1.5 bg-gradient-to-r from-primary/70 via-secondary/70 to-brotherhood-bronze/70" />

        <div className="flex h-full flex-col gap-5 p-6">
          <div className="flex min-h-[72px] items-start justify-between gap-3">
            <div className="min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-secondary/12 p-3 text-secondary">
                  <Hash className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold tracking-[0.01em] text-foreground">
                    {topic.title}
                  </h2>
                  <p className="truncate text-xs uppercase tracking-[0.16em] text-default-500">
                    /{topic.slug}
                  </p>
                </div>
              </div>
            </div>

            {isPublic ? (
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-default-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            ) : null}
          </div>

          <p className="h-[72px] text-sm leading-6 text-default-600">
            <span className="line-clamp-3">
              {topic.description || "A discussion space ready for conversation."}
            </span>
          </p>

          <div className="grid h-[72px] grid-cols-2 gap-2 overflow-hidden">
            {topic.tags.length > 0 ? (
              visibleTags.map((tag) => (
                <Chip
                  key={`${topic.id}-${tag}`}
                  size="sm"
                  variant="flat"
                  className="max-w-full overflow-hidden"
                  classNames={{
                    content:
                      "block max-w-full overflow-hidden text-ellipsis whitespace-nowrap",
                  }}
                >
                  {tag}
                </Chip>
              ))
            ) : (
              <Chip
                size="sm"
                variant="flat"
                className="max-w-full overflow-hidden"
              >
                No tags
              </Chip>
            )}
            {topic.tags.length > 3 ? (
              <Chip
                size="sm"
                variant="flat"
                className="max-w-full overflow-hidden"
              >
                +{topic.tags.length - 3}
              </Chip>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-background/70 p-3 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {topic.counts.subtopics}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-default-500">
                Subtopics
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {topic.counts.posts}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-default-500">
                Posts
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {topic.counts.subscriptions}
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-default-500">
                Members
              </p>
            </div>
          </div>

          {footer ? (
            <div className="mt-auto border-t border-divider/70 pt-4">{footer}</div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      aria-label={`Open topic ${topic.title}`}
      className="group block h-full outline-none"
      href={href}
    >
      {content}
    </Link>
  );
}
