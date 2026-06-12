"use client";

import { Button, Card, CardBody, Chip, Pagination } from "@heroui/react";
import { ArrowRight, Hash, Search, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TopicListItem } from "@/lib/community";

const PAGE_SIZE = 6;
type TopicsPageContentProps = {
  topics: TopicListItem[];
};

type FloatingSearchFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
};

function FloatingSearchField({
  value,
  onValueChange,
}: FloatingSearchFieldProps) {
  return (
    <label className="group relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
      <input
        aria-label="Search topics"
        className="peer h-14 w-full rounded-xl border border-divider/70 bg-content1/90 pb-2 pl-11 pr-4 pt-6 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        Search topics
      </span>
    </label>
  );
}

function matchesQuery(topic: TopicListItem, query: string) {
  if (!query) {
    return true;
  }

  const searchable = [
    topic.title,
    topic.slug,
    topic.description ?? "",
    topic.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query.toLowerCase());
}

function TopicCard({ topic }: { topic: TopicListItem }) {
  return (
    <Link
      aria-label={`Open topic ${topic.title}`}
      className="group block outline-none"
      href={`/topics/${topic.id}`}
    >
      <Card
        isPressable
        className="h-full border border-divider/70 bg-content1 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
      >
        <CardBody className="gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-secondary/10 p-2 text-secondary">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {topic.title}
                  </h2>
                  <p className="text-xs text-default-500">/{topic.slug}</p>
                </div>
              </div>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 text-default-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          <p className="text-sm leading-5 text-default-600">
            {topic.description || "A discussion space ready for conversation."}
          </p>

          <div className="flex flex-wrap gap-2">
            {topic.tags.slice(0, 3).map((tag) => (
              <Chip key={`${topic.id}-${tag}`} size="sm" variant="flat">
                {tag}
              </Chip>
            ))}
            {topic.tags.length > 3 ? (
              <Chip size="sm" variant="flat">
                +{topic.tags.length - 3}
              </Chip>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-default-500">
            <span>{topic.counts.subtopics} subtopics</span>
            <span>{topic.counts.posts} posts</span>
            <span>{topic.counts.subscriptions} subscribers</span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export function TopicsPageContent({ topics: initialTopics }: TopicsPageContentProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredTopics = topics.filter((topic) => matchesQuery(topic, query.trim()));
  const totalPages = Math.max(1, Math.ceil(filteredTopics.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageTopics = filteredTopics.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  function handleSearchChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Chip color="primary" variant="flat">
              Topics
            </Chip>
            <Chip color="secondary" variant="flat">
              Search
            </Chip>
            <Chip
              className="bg-brotherhood-bronze/16 text-brotherhood-bronze"
              variant="flat"
            >
              Paging
            </Chip>
          </div>

          <Button
            as={Link}
            href="/admin"
            color="primary"
            variant="flat"
            startContent={<Shield className="h-4 w-4" />}
          >
            Admin
          </Button>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse topics
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-default-500">
            Search the spaces below, page through the list, and open a topic to
            view its detail page.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <FloatingSearchField
            value={query}
            onValueChange={handleSearchChange}
          />
          <div className="text-sm text-default-500 md:pb-1">
            {filteredTopics.length === 0
              ? "No topics match your search."
              : `Showing ${Math.min((safePage - 1) * PAGE_SIZE + 1, filteredTopics.length)}-${Math.min(
                  safePage * PAGE_SIZE,
                  filteredTopics.length
                )} of ${filteredTopics.length}`}
          </div>
        </div>
      </section>

      {filteredTopics.length > 0 ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {pageTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </section>

          {totalPages > 1 ? (
            <div className="flex justify-center">
              <Pagination
                page={safePage}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          ) : null}
        </>
      ) : (
        <Card className="border border-divider bg-content1 shadow-sm">
          <CardBody className="p-5">
            <p className="text-sm text-default-600">
              No topics match that search. Try a different term or clear the search
              box.
            </p>
          </CardBody>
        </Card>
      )}

    </div>
  );
}
