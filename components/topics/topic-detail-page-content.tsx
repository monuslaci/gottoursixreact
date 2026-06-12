"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowLeft, Hash, MessageSquareText, Users } from "lucide-react";
import Link from "next/link";

import type { TopicDetailItem, TopicPostItem } from "@/lib/community";

type TopicDetailPageContentProps = {
  topic: TopicDetailItem;
  posts: TopicPostItem[];
};

export function TopicDetailPageContent({
  topic,
  posts,
}: TopicDetailPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button as={Link} href="/topics" variant="flat" startContent={<ArrowLeft size={16} />}>
          Back to topics
        </Button>
        <Chip color="primary" variant="flat">
          Topic detail
        </Chip>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary/12 p-3 text-secondary">
                <Hash className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                  /{topic.slug}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {topic.title}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
              {topic.description || "A discussion space ready for the next conversation."}
            </p>

            <div className="flex flex-wrap gap-2">
              {topic.tags.length > 0 ? (
                topic.tags.map((tag) => (
                  <Chip key={`${topic.id}-${tag}`} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))
              ) : (
                <Chip size="sm" variant="flat">
                  No tags yet
                </Chip>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Subtopics", `${topic.counts.subtopics}`],
                ["Posts", `${topic.counts.posts}`],
                ["Subscribers", `${topic.counts.subscriptions}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border border-divider bg-background/80 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold">Subtopics</h2>
            </div>

            <div className="grid gap-2">
              {topic.subtopics.length > 0 ? (
                topic.subtopics.map((subtopic) => (
                  <div
                    key={subtopic.id}
                    className="rounded-xl border border-divider bg-background/80 p-3"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {subtopic.title}
                    </p>
                    <p className="mt-1 text-xs text-default-500">/{subtopic.slug}</p>
                    <p className="mt-2 text-sm text-default-600">
                      {subtopic.description || "No description provided."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-default-600">No subtopics yet.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent posts</h2>
          <p className="text-sm text-default-500">{posts.length} posts</p>
        </div>

        <div className="grid gap-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                className="border border-divider bg-content1 shadow-sm"
              >
                <CardBody className="gap-3 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                    <span className="font-medium text-foreground">
                      {post.author?.name || "Unknown member"}
                    </span>
                    {post.subtopic ? (
                      <Chip size="sm" variant="flat">
                        {post.subtopic.title}
                      </Chip>
                    ) : null}
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm leading-6 text-default-700">{post.body}</p>

                  <div className="flex items-center gap-2 text-xs text-default-500">
                    <MessageSquareText className="h-4 w-4" />
                    <span>{post.replyCount} replies</span>
                  </div>
                </CardBody>
              </Card>
            ))
          ) : (
            <Card className="border border-divider bg-content1 shadow-sm">
              <CardBody className="p-4">
                <p className="text-sm text-default-600">No posts yet.</p>
              </CardBody>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
