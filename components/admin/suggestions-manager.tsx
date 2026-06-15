"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { CheckCircle2, Filter, RotateCcw, Search, ThumbsDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { SuggestionListItem } from "@/lib/community";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

type SuggestionStatusFilter = "ALL" | SuggestionListItem["status"];

const STATUS_FILTERS: Array<{
  label: string;
  value: SuggestionStatusFilter;
}> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const STATUS_STYLES: Record<
  SuggestionListItem["status"],
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-700" },
  REVIEWED: { label: "Reviewed", className: "bg-sky-500/10 text-sky-700" },
  APPROVED: { label: "Approved", className: "bg-emerald-500/10 text-emerald-700" },
  REJECTED: { label: "Rejected", className: "bg-rose-500/10 text-rose-700" },
};

export function SuggestionsManager() {
  const { user } = useUserProfile();
  const [suggestions, setSuggestions] = useState<SuggestionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<SuggestionStatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSuggestions() {
      try {
        const response = await fetch("/api/suggestions", { cache: "no-store" });
        const payload = (await response.json()) as {
          suggestions?: SuggestionListItem[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load suggestions.");
        }

        if (isMounted) {
          setSuggestions(payload.suggestions ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load suggestions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSuggestions();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleSuggestions = useMemo(() => {
    return suggestions.filter((suggestion) => {
      if (statusFilter !== "ALL" && suggestion.status !== statusFilter) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const searchable = [
        suggestion.title,
        suggestion.description ?? "",
        suggestion.topic?.title ?? "",
        suggestion.topic?.slug ?? "",
        suggestion.kind,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(search.trim().toLowerCase());
    });
  }, [search, statusFilter, suggestions]);

  async function updateSuggestionStatus(
    suggestionId: string,
    status: SuggestionListItem["status"]
  ) {
    const reviewerEmail = user?.email;
    if (!reviewerEmail) {
      setError("A reviewer profile is required.");
      return;
    }

    setUpdatingId(suggestionId);
    setError(null);

    try {
      const response = await fetch(`/api/suggestions/${suggestionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reviewedByEmail: reviewerEmail,
        }),
      });

      const payload = (await response.json()) as {
        suggestion?: SuggestionListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update suggestion.");
      }

      if (payload.suggestion) {
        setSuggestions((current) =>
          current.map((item) => (item.id === suggestionId ? payload.suggestion! : item))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update suggestion.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Card className="internal-card internal-card--strong">
      <CardBody className="gap-5 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-secondary/12 p-3 text-secondary">
            <Filter className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <Chip color="secondary" variant="flat">
              Suggestions
            </Chip>
            <p className="text-sm text-default-600">
              Review topic and subtopic ideas from members.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="group relative block w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
            <input
              aria-label="Search suggestions"
              className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
              placeholder=" "
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
              Search suggestions
            </span>
          </label>
          <p className="text-sm text-default-500">
            {visibleSuggestions.length} visible
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter.value}
              color={statusFilter === filter.value ? "primary" : "default"}
              variant={statusFilter === filter.value ? "solid" : "flat"}
              onPress={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {error ? <p className="text-sm text-danger-500">{error}</p> : null}

        {isLoading ? (
          <div className="internal-empty p-4 text-sm text-default-500">
            Loading suggestions...
          </div>
        ) : null}

        {!isLoading && visibleSuggestions.length === 0 ? (
          <div className="internal-empty p-4 text-sm text-default-500">
            No suggestions match that filter.
          </div>
        ) : null}

        {!isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSuggestions.map((suggestion) => {
              const statusMeta = STATUS_STYLES[suggestion.status];
              const isUpdating = updatingId === suggestion.id;

              return (
                <Card
                  key={suggestion.id}
                  className="internal-card"
                >
                  <CardBody className="gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {suggestion.title}
                          </p>
                          <Chip size="sm" variant="flat">
                            {suggestion.kind}
                          </Chip>
                        </div>
                        <p className="text-xs text-default-500">
                          {suggestion.topic ? `${suggestion.topic.title} / ${suggestion.topic.slug}` : "General topic suggestion"}
                        </p>
                      </div>
                      <Chip
                        className={statusMeta.className}
                        size="sm"
                        variant="flat"
                      >
                        {statusMeta.label}
                      </Chip>
                    </div>

                    <p className="text-sm leading-6 text-default-600">
                      {suggestion.description || "No details provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-default-500">
                      <span>By {suggestion.suggestedBy?.name || suggestion.suggestedBy?.email || "Unknown"}</span>
                      <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 border-t border-divider/70 pt-3">
                      <Button
                        color="secondary"
                        variant="flat"
                        isDisabled={suggestion.status === "REVIEWED"}
                        isLoading={isUpdating}
                        startContent={<RotateCcw className="h-4 w-4" />}
                        onPress={() => void updateSuggestionStatus(suggestion.id, "REVIEWED")}
                      >
                        Review
                      </Button>
                      <Button
                        color="primary"
                        variant="flat"
                        isDisabled={suggestion.status === "APPROVED"}
                        isLoading={isUpdating}
                        startContent={<CheckCircle2 className="h-4 w-4" />}
                        onPress={() => void updateSuggestionStatus(suggestion.id, "APPROVED")}
                      >
                        Approve
                      </Button>
                      <Button
                        color="danger"
                        variant="flat"
                        isDisabled={suggestion.status === "REJECTED"}
                        isLoading={isUpdating}
                        startContent={<ThumbsDown className="h-4 w-4" />}
                        onPress={() => void updateSuggestionStatus(suggestion.id, "REJECTED")}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
