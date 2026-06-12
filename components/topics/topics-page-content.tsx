"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Search, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { TopicListItem } from "@/lib/community";
import { TopicPaginationBar } from "@/components/topics/topic-pagination-bar";
import { TopicSummaryCard } from "@/components/topics/topic-summary-card";

const PAGE_SIZE = 9;
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

export function TopicsPageContent({ topics: initialTopics }: TopicsPageContentProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredTopics = initialTopics.filter((topic) =>
    matchesQuery(topic, query.trim())
  );
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
        </div>
      </section>

      {filteredTopics.length > 0 ? (
        <>
          <section className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {pageTopics.map((topic) => (
              <TopicSummaryCard
                key={topic.id}
                topic={topic}
                href={`/topics/${topic.id}`}
              />
            ))}
          </section>

          <TopicPaginationBar
            page={safePage}
            pageSize={PAGE_SIZE}
            totalItems={filteredTopics.length}
            totalPages={totalPages}
            onPageChange={setPage}
          />
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
