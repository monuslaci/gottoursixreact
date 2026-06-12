"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import {
  LoaderCircle,
  PencilLine,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import type { TopicListItem } from "@/lib/community";
import { TopicPaginationBar } from "@/components/topics/topic-pagination-bar";
import { TopicSummaryCard } from "@/components/topics/topic-summary-card";

type FloatingFieldProps = {
  isRequired?: boolean;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

const PAGE_SIZE = 9;

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
        className="peer h-14 w-full rounded-xl border border-divider/70 bg-content1/90 px-4 pb-2 pt-6 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function FloatingTextarea({ label, value, onValueChange }: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <textarea
        className="peer min-h-28 w-full resize-y rounded-xl border border-divider/70 bg-content1/90 px-4 pb-3 pt-7 text-sm leading-6 text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

export function TopicsDashboard() {
  const [topics, setTopics] = useState<TopicListItem[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingTags, setEditingTags] = useState("");
  const [isSavingTopicId, setIsSavingTopicId] = useState<string | null>(null);
  const [pendingDeleteTopicId, setPendingDeleteTopicId] = useState<string | null>(
    null
  );
  const [isDeletingTopicId, setIsDeletingTopicId] = useState<string | null>(null);
  const [managementError, setManagementError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTopics() {
      try {
        const response = await fetch("/api/topics", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          topics?: TopicListItem[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load topics.");
        }

        if (isMounted) {
          setTopics(payload.topics ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setManagementError(
            err instanceof Error ? err.message : "Unable to load topics."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingTopics(false);
        }
      }
    }

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

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

      const payload = (await response.json()) as {
        topic?: TopicListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create topic.");
      }

      if (payload.topic) {
        setTopics((current) => [payload.topic!, ...current]);
        setPage(1);
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

  function startEditingTopic(topic: TopicListItem) {
    setEditingTopicId(topic.id);
    setEditingTitle(topic.title);
    setEditingDescription(topic.description ?? "");
    setEditingTags(topic.tags.join(", "));
    setPendingDeleteTopicId(null);
    setManagementError(null);
  }

  function stopEditingTopic() {
    setEditingTopicId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingTags("");
  }

  async function handleSaveTopic(topicId: string) {
    setIsSavingTopicId(topicId);
    setManagementError(null);

    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTitle,
          description: editingDescription,
          tags: editingTags,
        }),
      });

      const payload = (await response.json()) as {
        topic?: TopicListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update topic.");
      }

      if (payload.topic) {
        setTopics((current) =>
          current.map((topic) => (topic.id === topicId ? payload.topic! : topic))
        );
      }

      stopEditingTopic();
    } catch (err) {
      setManagementError(
        err instanceof Error ? err.message : "Unable to update topic."
      );
    } finally {
      setIsSavingTopicId(null);
    }
  }

  async function handleDeleteTopic(topicId: string) {
    setIsDeletingTopicId(topicId);
    setManagementError(null);

    try {
      const response = await fetch(`/api/topics/${topicId}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to delete topic.");
      }

      setTopics((current) => current.filter((topic) => topic.id !== topicId));
      setPendingDeleteTopicId(null);

      if (editingTopicId === topicId) {
        stopEditingTopic();
      }
    } catch (err) {
      setManagementError(
        err instanceof Error ? err.message : "Unable to delete topic."
      );
    } finally {
      setIsDeletingTopicId(null);
    }
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString();
  }

  const totalPages = Math.max(1, Math.ceil(topics.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageTopics = topics.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
      <CardBody className="gap-6 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Plus className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <Chip color="primary" variant="flat">
              Create topic
            </Chip>
            <p className="text-sm text-default-600">
              Add a new topic with optional tags.
            </p>
          </div>
        </div>

        <form className="grid gap-3" onSubmit={handleSubmit}>
          <FloatingInput
            isRequired
            label="Title"
            value={title}
            onValueChange={setTitle}
          />
          <FloatingTextarea
            label="Description"
            value={description}
            onValueChange={setDescription}
          />
          <FloatingInput
            label="Tags"
            value={tags}
            onValueChange={setTags}
          />

          {error ? <p className="text-sm text-danger-500">{error}</p> : null}

          <Button
            color="primary"
            isLoading={isSubmitting}
            startContent={<Sparkles size={16} />}
            type="submit"
          >
            Create topic
          </Button>
        </form>

        <div className="h-px bg-divider" />

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Chip color="secondary" variant="flat">
                  Existing topics
                </Chip>
                <Chip
                  className="bg-brotherhood-bronze/16 text-brotherhood-bronze"
                  variant="flat"
                >
                  Admin actions
                </Chip>
              </div>
              <p className="text-sm text-default-500">
                Edit titles, descriptions, and tags, or mark a topic deleted.
              </p>
            </div>
            <p className="text-sm text-default-500">
              {topics.length === 0 ? "No active topics" : `${topics.length} active topics`}
            </p>
          </div>

          {managementError ? (
            <p className="text-sm text-danger-500">{managementError}</p>
          ) : null}

          {isLoadingTopics ? (
            <div className="rounded-xl border border-divider/70 bg-background/70 p-4 text-sm text-default-500">
              Loading topics...
            </div>
          ) : null}

          {!isLoadingTopics && topics.length === 0 ? (
            <div className="rounded-xl border border-divider/70 bg-background/70 p-4 text-sm text-default-500">
              No active topics yet.
            </div>
          ) : null}

          {!isLoadingTopics ? (
            <div className="space-y-4">
              <div className="grid auto-rows-fr gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pageTopics.map((topic) => {
                  const isEditing = editingTopicId === topic.id;
                  const isSaving = isSavingTopicId === topic.id;
                  const isDeleting = isDeletingTopicId === topic.id;
                  const isPendingDelete = pendingDeleteTopicId === topic.id;

                  return (
                    isEditing ? (
                      <Card
                        key={topic.id}
                        className="h-full overflow-hidden rounded-[28px] border border-divider/70 bg-background/80 shadow-[0_18px_44px_rgba(15,23,42,0.08)]"
                      >
                        <CardBody className="flex h-full flex-col gap-4 p-6">
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
                            label="Tags"
                            value={editingTags}
                            onValueChange={setEditingTags}
                          />

                          <div className="mt-auto flex flex-wrap gap-2 border-t border-divider/70 pt-4">
                            <Button
                              color="primary"
                              isLoading={isSaving}
                              startContent={<Save className="h-4 w-4" />}
                              onPress={() => void handleSaveTopic(topic.id)}
                            >
                              Save changes
                            </Button>
                            <Button
                              variant="flat"
                              startContent={<X className="h-4 w-4" />}
                              onPress={stopEditingTopic}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ) : (
                      <TopicSummaryCard
                        key={topic.id}
                        topic={topic}
                        mode="admin"
                        footer={
                          <div className="space-y-3">
                            <p className="text-xs text-default-500">
                              Updated {formatDate(topic.updatedAt)}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="flat"
                                startContent={<PencilLine className="h-4 w-4" />}
                                onPress={() => startEditingTopic(topic)}
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
                                    void handleDeleteTopic(topic.id);
                                    return;
                                  }

                                  setPendingDeleteTopicId(topic.id);
                                }}
                              >
                                {isPendingDelete ? "Confirm delete" : "Mark deleted"}
                              </Button>
                            </div>

                            {isPendingDelete ? (
                              <Button
                                variant="light"
                                startContent={<X className="h-4 w-4" />}
                                onPress={() => setPendingDeleteTopicId(null)}
                              >
                                Keep topic
                              </Button>
                            ) : null}
                          </div>
                        }
                      />
                    )
                  );
                })}
              </div>

              <TopicPaginationBar
                page={safePage}
                pageSize={PAGE_SIZE}
                totalItems={topics.length}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </section>
      </CardBody>
    </Card>
  );
}
