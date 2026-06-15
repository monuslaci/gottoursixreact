"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import {
  LoaderCircle,
  PencilLine,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import type { SubtopicListItem, TopicListItem } from "@/lib/community";

type SubtopicsManagerProps = {
  topics: TopicListItem[];
};

type FloatingFieldProps = {
  isRequired?: boolean;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

function FloatingInput({
  isRequired,
  label,
  value,
  onValueChange,
}: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <input
        required={isRequired}
        className="peer internal-field h-12 w-full px-4 pb-2 pt-5 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-default-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:uppercase peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function FloatingTextarea({ label, value, onValueChange }: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <textarea
        className="peer internal-field min-h-24 w-full resize-y px-4 pb-3 pt-6 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-default-500 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:uppercase peer-placeholder-shown:tracking-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:uppercase peer-focus:tracking-[0.14em] peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function FloatingSelect({
  label,
  value,
  onValueChange,
  options,
}: FloatingFieldProps & {
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="group relative block w-full">
      <select
        className="internal-field h-12 w-full px-4 pb-2 pt-5 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
        disabled={options.length === 0}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      >
        <option value="">Select a topic</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute left-4 top-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-default-500">
        {label}
      </span>
    </label>
  );
}

export function SubtopicsManager({ topics }: SubtopicsManagerProps) {
  const [subtopics, setSubtopics] = useState<SubtopicListItem[]>([]);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingSortOrder, setEditingSortOrder] = useState("");
  const [isSavingSubtopicId, setIsSavingSubtopicId] = useState<string | null>(
    null
  );
  const [pendingDeleteSubtopicId, setPendingDeleteSubtopicId] = useState<
    string | null
  >(null);
  const [isDeletingSubtopicId, setIsDeletingSubtopicId] = useState<string | null>(
    null
  );
  const [managementError, setManagementError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSubtopics() {
      try {
        const response = await fetch("/api/subtopics", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          subtopics?: SubtopicListItem[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load subtopics.");
        }

        if (isMounted) {
          setSubtopics(payload.subtopics ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setManagementError(
            err instanceof Error ? err.message : "Unable to load subtopics."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubtopics(false);
        }
      }
    }

    loadSubtopics();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id);
    }
  }, [selectedTopicId, topics]);

  const topicOptions = useMemo(
    () =>
      topics.map((topic) => ({
        label: topic.title,
        value: topic.id,
      })),
    [topics]
  );

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? null,
    [selectedTopicId, topics]
  );

  const visibleSubtopics = subtopics.filter((subtopic) => {
    if (subtopic.deletedAt) {
      return false;
    }

    if (selectedTopicId && subtopic.topicId !== selectedTopicId) {
      return false;
    }

    if (!search.trim()) {
      return true;
    }

    const searchable = [
      subtopic.title,
      subtopic.slug,
      subtopic.description ?? "",
      subtopic.topic.title,
      subtopic.topic.slug,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(search.trim().toLowerCase());
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/subtopics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topicId: selectedTopicId,
          title,
          description,
          sortOrder: sortOrder ? Number(sortOrder) : undefined,
        }),
      });

      const payload = (await response.json()) as {
        subtopic?: SubtopicListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create subtopic.");
      }

      if (payload.subtopic) {
        setSubtopics((current) => [payload.subtopic!, ...current]);
        setTitle("");
        setDescription("");
        setSortOrder("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create subtopic.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditingSubtopic(subtopic: SubtopicListItem) {
    setEditingSubtopicId(subtopic.id);
    setEditingTitle(subtopic.title);
    setEditingDescription(subtopic.description ?? "");
    setEditingSortOrder(String(subtopic.sortOrder));
    setPendingDeleteSubtopicId(null);
    setManagementError(null);
  }

  function stopEditingSubtopic() {
    setEditingSubtopicId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingSortOrder("");
  }

  async function handleSaveSubtopic(subtopicId: string) {
    setIsSavingSubtopicId(subtopicId);
    setManagementError(null);

    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTitle,
          description: editingDescription,
          sortOrder: editingSortOrder ? Number(editingSortOrder) : undefined,
        }),
      });

      const payload = (await response.json()) as {
        subtopic?: SubtopicListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update subtopic.");
      }

      if (payload.subtopic) {
        setSubtopics((current) =>
          current.map((subtopic) =>
            subtopic.id === subtopicId ? payload.subtopic! : subtopic
          )
        );
      }

      stopEditingSubtopic();
    } catch (err) {
      setManagementError(
        err instanceof Error ? err.message : "Unable to update subtopic."
      );
    } finally {
      setIsSavingSubtopicId(null);
    }
  }

  async function handleDeleteSubtopic(subtopicId: string) {
    setIsDeletingSubtopicId(subtopicId);
    setManagementError(null);

    try {
      const response = await fetch(`/api/subtopics/${subtopicId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete subtopic.");
      }

      setSubtopics((current) => current.filter((subtopic) => subtopic.id !== subtopicId));
      setPendingDeleteSubtopicId(null);

      if (editingSubtopicId === subtopicId) {
        stopEditingSubtopic();
      }
    } catch (err) {
      setManagementError(
        err instanceof Error ? err.message : "Unable to delete subtopic."
      );
    } finally {
      setIsDeletingSubtopicId(null);
    }
  }

  return (
    <Card className="internal-card internal-card--strong">
      <CardBody className="gap-5 p-4 sm:p-5">
        <div className="space-y-1">
          <Chip color="secondary" variant="flat">
            Subtopics
          </Chip>
          <p className="text-sm text-default-600">
            Choose a topic first, then manage only the subtopics connected to it.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <FloatingSelect
            label="Topic to manage"
            value={selectedTopicId}
            onValueChange={(value) => {
              setSelectedTopicId(value);
              setSearch("");
            }}
            options={topicOptions}
          />
          <div className="internal-stat p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-default-500">
              Active topic
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {selectedTopic?.title ?? "No topic selected"}
            </p>
            <p className="mt-1 text-xs text-default-500">
              {selectedTopic
                ? `${visibleSubtopics.length} matching subtopics`
                : "Pick a topic to load its subtopics."}
            </p>
          </div>
        </div>

        {selectedTopic ? (
          <>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div className="grid gap-3 lg:grid-cols-2">
                <FloatingInput
                  isRequired
                  label="Title"
                  value={title}
                  onValueChange={setTitle}
                />
                <FloatingInput
                  label="Sort order"
                  value={sortOrder}
                  onValueChange={setSortOrder}
                />
              </div>

              <FloatingTextarea
                label="Description"
                value={description}
                onValueChange={setDescription}
              />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  startContent={<Sparkles size={16} />}
                  type="submit"
                >
                  Create subtopic for {selectedTopic.title}
                </Button>
                <p className="text-xs text-default-500">
                  The new subtopic will be created under the selected topic.
                </p>
              </div>

              {error ? <p className="text-sm text-danger-500">{error}</p> : null}
            </form>

            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <label className="group relative block w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
                <input
                  aria-label="Search subtopics"
                  className="h-12 w-full rounded-xl border border-divider/70 bg-content1/90 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
                  placeholder=" "
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
                  Search subtopics
                </span>
              </label>
              <p className="text-sm text-default-500">
                {visibleSubtopics.length} visible
              </p>
            </div>
          </>
        ) : null}

        {managementError ? (
          <p className="text-sm text-danger-500">{managementError}</p>
        ) : null}

        {isLoadingSubtopics ? (
          <div className="internal-empty p-4 text-sm text-default-500">
            Loading subtopics...
          </div>
        ) : null}

        {!isLoadingSubtopics && selectedTopic && visibleSubtopics.length === 0 ? (
          <div className="internal-empty p-4 text-sm text-default-500">
            No subtopics match this topic and search.
          </div>
        ) : null}

        {!isLoadingSubtopics && selectedTopic ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSubtopics.map((subtopic) => {
              const isEditing = editingSubtopicId === subtopic.id;
              const isSaving = isSavingSubtopicId === subtopic.id;
              const isDeleting = isDeletingSubtopicId === subtopic.id;
              const isPendingDelete = pendingDeleteSubtopicId === subtopic.id;

              return (
                <Card
                  key={subtopic.id}
                  className="internal-card h-full"
                >
                  <CardBody className="flex h-full flex-col gap-3 p-4">
                    {isEditing ? (
                      <div className="flex h-full flex-col gap-3">
                        <FloatingInput
                          isRequired
                          label="Title"
                          value={editingTitle}
                          onValueChange={setEditingTitle}
                        />
                        <FloatingTextarea
                          label="Description"
                          value={editingDescription}
                          onValueChange={setEditingDescription}
                        />
                        <FloatingInput
                          label="Sort order"
                          value={editingSortOrder}
                          onValueChange={setEditingSortOrder}
                        />

                        <div className="mt-auto flex flex-wrap gap-2 border-t border-divider/70 pt-3">
                          <Button
                            color="primary"
                            isLoading={isSaving}
                            startContent={<Save className="h-4 w-4" />}
                            onPress={() => void handleSaveSubtopic(subtopic.id)}
                          >
                            Save changes
                          </Button>
                          <Button
                            variant="flat"
                            startContent={<X className="h-4 w-4" />}
                            onPress={stopEditingSubtopic}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {subtopic.title}
                            </p>
                            <Chip size="sm" variant="flat">
                              {subtopic.topic.title}
                            </Chip>
                          </div>
                          <p className="truncate text-xs text-default-500">
                            /{subtopic.slug}
                          </p>
                          <p className="line-clamp-2 text-sm text-default-600">
                            {subtopic.description || "No description yet."}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                          <span>Order {subtopic.sortOrder}</span>
                          <span>{subtopic.counts.posts} posts</span>
                          <span>{subtopic.counts.subscriptions} subscribers</span>
                        </div>

                        <p className="text-xs text-default-500">
                          Updated {new Date(subtopic.updatedAt).toLocaleDateString()}
                        </p>

                        <div className="mt-auto flex flex-wrap gap-2">
                          <Button
                            variant="flat"
                            startContent={<PencilLine className="h-4 w-4" />}
                            onPress={() => startEditingSubtopic(subtopic)}
                          >
                            Edit
                          </Button>
                          <Button
                            color="danger"
                            variant={isPendingDelete ? "solid" : "flat"}
                            isLoading={isDeleting}
                            startContent={
                              isDeleting ? (
                                <LoaderCircle className="h-4 w-4" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )
                            }
                            onPress={() => {
                              if (isPendingDelete) {
                                void handleDeleteSubtopic(subtopic.id);
                                return;
                              }

                              setPendingDeleteSubtopicId(subtopic.id);
                            }}
                          >
                            {isPendingDelete ? "Confirm delete" : "Mark deleted"}
                          </Button>
                        </div>

                        {isPendingDelete ? (
                          <Button
                            variant="light"
                            startContent={<X className="h-4 w-4" />}
                            onPress={() => setPendingDeleteSubtopicId(null)}
                          >
                            Keep subtopic
                          </Button>
                        ) : null}
                      </>
                    )}
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
