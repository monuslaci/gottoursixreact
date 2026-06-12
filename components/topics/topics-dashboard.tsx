"use client";

import type { TopicListItem } from "@/lib/community";
import { Button, Card, CardBody, Chip, Input, Textarea } from "@heroui/react";
import { Hash, Plus, Sparkles, MessageSquareText } from "lucide-react";
import { useState, type FormEvent } from "react";

type TopicsDashboardProps = {
  initialTopics: TopicListItem[];
};

export function TopicsDashboard({ initialTopics }: TopicsDashboardProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          tags,
        }),
      });

      const payload = (await response.json()) as
        | { topic: TopicListItem }
        | { error: string };

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Unable to create topic.");
      }

      if ("topic" in payload) {
        setTopics((current) => [payload.topic, ...current]);
      }

      setTitle("");
      setDescription("");
      setTags("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create topic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
        <CardBody className="gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Chip color="primary" variant="flat">
              Topics
            </Chip>
            <Chip color="secondary" variant="flat">
              Public discussion
            </Chip>
            <Chip className="bg-brotherhood-forest/16 text-brotherhood-forest" variant="flat">
              Seeded demo data
            </Chip>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Browse the first community spaces and start new ones.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
              This page is wired to the new topic API and seeded with sample
              spaces so you can see real records in the database immediately.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Topics", `${topics.length} live spaces`],
              ["Posts", `${topics.reduce((sum, topic) => sum + topic.counts.posts, 0)} seeded posts`],
              ["Subscriptions", `${topics.reduce((sum, topic) => sum + topic.counts.subscriptions, 0)} demo follows`],
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

          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="grid gap-3">
              {topics.map((topic) => (
                <Card
                  key={topic.id}
                  className="border border-primary/10 bg-background/80 shadow-none"
                >
                  <CardBody className="gap-4 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="rounded-xl bg-secondary/12 p-2 text-secondary">
                            <Hash className="h-4 w-4" />
                          </div>
                          <div>
                            <h2 className="text-base font-semibold">
                              {topic.title}
                            </h2>
                            <p className="text-xs text-default-500">
                              /{topic.slug}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm leading-6 text-default-600">
                          {topic.description || "A discussion space ready for a focused conversation."}
                        </p>
                      </div>

                      <div className="rounded-xl bg-primary/10 px-3 py-2 text-right">
                        <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">
                          Activity
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {topic.counts.posts} posts
                        </p>
                      </div>
                    </div>

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

                    <div className="flex flex-wrap items-center gap-3 text-xs text-default-500">
                      <span>{topic.counts.subtopics} subtopics</span>
                      <span>{topic.counts.subscriptions} subscribers</span>
                      <span>Created {new Date(topic.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <Card className="border border-primary/12 bg-brotherhood-navy text-white shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.12)]">
              <CardBody className="gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-3 text-brotherhood-bronze">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Create a topic</p>
                    <p className="text-xs text-white/65">
                      Use comma-separated tags to organize the space.
                    </p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    isRequired
                    label="Topic title"
                    labelPlacement="outside"
                    placeholder="e.g. Career and purpose"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <Textarea
                    label="Description"
                    labelPlacement="outside"
                    minRows={4}
                    placeholder="A clear, supportive space for discussion."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  <Input
                    label="Tags"
                    labelPlacement="outside"
                    placeholder="growth, work, goals"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                  />

                  {error ? (
                    <p className="text-sm text-danger-300">{error}</p>
                  ) : null}

                  <Button
                    color="primary"
                    fullWidth
                    isLoading={isSubmitting}
                    startContent={<Sparkles size={16} />}
                    type="submit"
                  >
                    Create topic
                  </Button>
                </form>

                <div className="rounded-xl border border-white/10 bg-white/8 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <MessageSquareText className="h-4 w-4 text-brotherhood-bronze" />
                    Posts API ready
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/70">
                    The topic posts route is ready for thread creation and reply
                    workflows when you want to wire the next screen.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
