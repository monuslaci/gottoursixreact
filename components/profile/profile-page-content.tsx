"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Search,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Dices,
  Images,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { AVATAR_OPTIONS, resolveAvatarPath } from "@/lib/avatars";
import { dispatchProfileUpdatedEvent } from "@/lib/client-events";
import type {
  ProfilePayload,
  ProfileSubtopicSubscription,
  ProfileTopicSubscription,
} from "@/lib/profile";

const PAGE_SIZE = 5;

type ProfileFormState = {
  username: string;
  image: string;
};

type FloatingFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  isRequired?: boolean;
};

const EMPTY_FORM: ProfileFormState = {
  username: "",
  image: "",
};

function buildFormState(profile: ProfilePayload): ProfileFormState {
  return {
    username: profile.user.username ?? "",
    image: profile.user.image ?? "",
  };
}

function initialsFromName(username: string | null) {
  if (username) {
    const parts = username.trim().split(/[-_.\s]+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return username.slice(0, 1).toUpperCase();
  }

  return "U";
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="internal-stat p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onValueChange,
  isRequired,
}: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <input
        required={isRequired}
        className="peer internal-field h-14 w-full px-4 pb-2 pt-6 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
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

function SearchInput({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <label className="group relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
      <input
        aria-label={label}
        className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
        {label}
      </span>
    </label>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
      <p className="text-xs text-default-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          aria-label="Previous page"
          isDisabled={page <= 1}
          variant="flat"
          onPress={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          isIconOnly
          aria-label="Next page"
          isDisabled={page >= totalPages}
          variant="flat"
          onPress={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

type SubscriptionListSectionProps<T extends { id: string }> = {
  title: string;
  activeCountLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  search: string;
  onSearchChange: (value: string) => void;
  items: T[];
  totalItemsLabel: string;
  renderItem: (item: T) => ReactNode;
};

function SubscriptionListSection<T extends { id: string }>({
  title,
  activeCountLabel,
  emptyTitle,
  emptyDescription,
  search,
  onSearchChange,
  items,
  totalItemsLabel,
  renderItem,
}: SubscriptionListSectionProps<T>) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-default-500">
          {title}
        </h2>
        <Chip variant="flat">{activeCountLabel}</Chip>
      </div>

      <SearchInput label={`Search ${title.toLowerCase()}`} value={search} onValueChange={onSearchChange} />

      <Card className="internal-card">
        <CardBody className="gap-0 p-0">
          {pageItems.length > 0 ? (
            <div className="divide-y divide-divider/70">
              {pageItems.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
              <p className="mt-1 text-sm text-default-500">{emptyDescription}</p>
            </div>
          )}
        </CardBody>
      </Card>

      <PaginationControls
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <p className="text-xs text-default-500">{totalItemsLabel}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="internal-card internal-card--strong">
        <CardBody className="gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-56 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-4 p-5 sm:p-6">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-xl" />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-4 p-5 sm:p-6">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function ProfilePageContent() {
  const {
    isOpen: isAvatarModalOpen,
    onOpen: openAvatarModal,
    onClose: closeAvatarModal,
    onOpenChange: onAvatarModalOpenChange,
  } = useDisclosure();
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingUsername, setIsGeneratingUsername] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);
  const [topicSearch, setTopicSearch] = useState("");
  const [subtopicSearch, setSubtopicSearch] = useState("");
  const [avatarSearch, setAvatarSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ProfilePayload & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load profile.");
        }

        if (isMounted) {
          setProfile(payload);
          setForm(buildFormState(payload));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const subscriptionCounts = useMemo(
    () => ({
      topics: profile?.subscriptions.topics.length ?? 0,
      subtopics: profile?.subscriptions.subtopics.length ?? 0,
    }),
    [profile]
  );

  const filteredTopicSubscriptions = useMemo(() => {
    const query = topicSearch.trim().toLowerCase();

    if (!profile) {
      return [];
    }

    return profile.subscriptions.topics.filter((subscription) => {
      if (!query) {
        return true;
      }

      const searchable = [
        subscription.topic.title,
        subscription.topic.slug,
        subscription.topic.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [profile, topicSearch]);

  const filteredSubtopicSubscriptions = useMemo(() => {
    const query = subtopicSearch.trim().toLowerCase();

    if (!profile) {
      return [];
    }

    return profile.subscriptions.subtopics.filter((subscription) => {
      if (!query) {
        return true;
      }

      const searchable = [
        subscription.subtopic.title,
        subscription.subtopic.slug,
        subscription.subtopic.description ?? "",
        subscription.topic.title,
        subscription.topic.slug,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [profile, subtopicSearch]);

  const profileAvatarSrc = useMemo(
    () =>
      resolveAvatarPath(
        profile?.user.image,
        profile?.user.username,
        profile?.user.email,
        profile?.user.id
      ),
    [profile]
  );
  const selectedAvatarLabel = useMemo(
    () =>
      AVATAR_OPTIONS.find((avatar) => avatar.path === form.image)?.label ?? "Selected avatar",
    [form.image]
  );
  const availableAvatarOptions = useMemo(() => {
    const query = avatarSearch.trim().toLowerCase();

    return AVATAR_OPTIONS.filter((avatar) => avatar.path !== form.image).filter((avatar) => {
      if (!query) {
        return true;
      }

      return [avatar.label, avatar.path.replace("/avatars/", "")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [avatarSearch, form.image]);

  function updateField<K extends keyof ProfileFormState>(field: K, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleAvatarSelect(path: string) {
    updateField("image", path);
    setAvatarSearch("");
    closeAvatarModal();
  }

  async function handleGenerateUsername() {
    setIsGeneratingUsername(true);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/username", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        username?: string;
        error?: string;
      };

      if (!response.ok || !payload.username) {
        throw new Error(payload.error || "Unable to generate a username.");
      }

      updateField("username", payload.username);
      setStatusMessage("New username suggestion ready.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate a username.");
    } finally {
      setIsGeneratingUsername(false);
    }
  }

  async function handleSaveProfile() {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.user.id,
          ...form,
        }),
      });

      const payload = (await response.json()) as ProfilePayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save profile.");
      }

      setProfile(payload);
      setForm(buildFormState(payload));
      setStatusMessage("Profile updated.");
      dispatchProfileUpdatedEvent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeTopicSubscription(subscription: ProfileTopicSubscription) {
    if (!profile) {
      return;
    }

    setUnsubscribingId(subscription.id);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/topics/${subscription.topic.id}/subscribe`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.user.id,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update topic subscription.");
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              subscriptions: {
                ...current.subscriptions,
                topics: current.subscriptions.topics.filter(
                  (item) => item.id !== subscription.id
                ),
              },
            }
          : current
      );
      setStatusMessage(`Unsubscribed from ${subscription.topic.title}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update topic subscription."
      );
    } finally {
      setUnsubscribingId(null);
    }
  }

  async function removeSubtopicSubscription(
    subscription: ProfileSubtopicSubscription
  ) {
    if (!profile) {
      return;
    }

    setUnsubscribingId(subscription.id);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/subtopics/${subscription.subtopic.id}/subscribe`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: profile.user.id,
          }),
        }
      );

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update subtopic subscription.");
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              subscriptions: {
                ...current.subscriptions,
                subtopics: current.subscriptions.subtopics.filter(
                  (item) => item.id !== subscription.id
                ),
              },
            }
          : current
      );
      setStatusMessage(`Unsubscribed from ${subscription.subtopic.title}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update subtopic subscription."
      );
    } finally {
      setUnsubscribingId(null);
    }
  }

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card className="internal-empty">
        <CardBody className="gap-3 p-5">
          <p className="text-sm font-medium text-foreground">Profile unavailable.</p>
          <p className="text-sm text-default-500">
            We could not load the current profile right now.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-divider/70 bg-content2 shadow-sm">
                <Image
                  src={profileAvatarSrc}
                  alt={`Avatar for @${profile.user.username}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    @{profile.user.username}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                    Manage the public username and avatar other members see across
                    conversations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Topic subscriptions" value={`${subscriptionCounts.topics}`} />
              <StatCard
                label="Subtopic subscriptions"
                value={`${subscriptionCounts.subtopics}`}
              />
              <StatCard
                label="Username"
                value={`@${profile.user.username}`}
              />
            </div>

            {statusMessage ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                {statusMessage}
              </div>
            ) : null}
            {error ? <p className="text-sm text-danger-500">{error}</p> : null}
          </CardBody>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.05 }}
      >
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="space-y-1">
              <Chip color="primary" variant="flat">
                Public profile
              </Chip>
              <p className="text-sm text-default-600">
                Keep your profile minimal. Your username is the only public
                identity other members need.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <FloatingInput
                    label="Username"
                    value={form.username}
                    onValueChange={(value) => updateField("username", value)}
                    isRequired
                  />
                </div>
                <Button
                  className="h-14 shrink-0 sm:min-w-[120px]"
                  isDisabled={isGeneratingUsername || isSaving}
                  startContent={<Dices className="h-4 w-4" />}
                  variant="flat"
                  onPress={() => void handleGenerateUsername()}
                >
                  {isGeneratingUsername ? "Generating..." : "Generate"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl border border-divider/70 bg-content1/70 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-divider/70 bg-content2 shadow-sm">
                    <Image
                      src={resolveAvatarPath(form.image, form.username, profile.user.email, profile.user.id)}
                      alt={`Avatar preview for @${form.username || profile.user.username}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-default-500">
                      Avatar
                    </p>
                    <p className="text-sm font-semibold text-foreground">{selectedAvatarLabel}</p>
                    <p className="text-sm text-default-500">
                      Choose the animal other members will see across posts and messages.
                    </p>
                  </div>
                  <div className="sm:ml-auto">
                    <Button
                      variant="flat"
                      startContent={<Images className="h-4 w-4" />}
                      onPress={openAvatarModal}
                    >
                      Change avatar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-divider/70 pt-2">
              <Button
                color="primary"
                isLoading={isSaving}
                startContent={<Save className="h-4 w-4" />}
                onPress={() => void handleSaveProfile()}
              >
                Save profile
              </Button>
              <Chip variant="flat">
                {profile.user.email || "Demo profile"}
              </Chip>
            </div>
          </CardBody>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <Chip color="secondary" variant="flat">
            Subscriptions
          </Chip>
          <p className="text-sm text-default-600">
            Search and manage the topics and subtopics you follow.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="internal-card internal-card--strong">
            <CardBody className="gap-5 p-5 sm:p-6">
              <SubscriptionListSection
                title="Topics"
                activeCountLabel={`${filteredTopicSubscriptions.length} active`}
                emptyTitle="No topic subscriptions yet."
                emptyDescription="Explore topics to start following conversations that matter to you."
                search={topicSearch}
                onSearchChange={setTopicSearch}
                items={filteredTopicSubscriptions}
                totalItemsLabel={`${subscriptionCounts.topics} total topic subscriptions`}
                renderItem={(subscription) => (
                  <div
                    key={subscription.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {subscription.topic.title}
                        </p>
                        <Chip size="sm" variant="flat">
                          Topic
                        </Chip>
                      </div>
                      <p className="truncate text-xs text-default-500">
                        /{subscription.topic.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        as={Link}
                        aria-label={`Open ${subscription.topic.title}`}
                        href={`/topics/${subscription.topic.id}`}
                        isIconOnly
                        variant="flat"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Unsubscribe from ${subscription.topic.title}`}
                        color="danger"
                        isIconOnly
                        isLoading={unsubscribingId === subscription.id}
                        variant="flat"
                        onPress={() => void removeTopicSubscription(subscription)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </CardBody>
          </Card>

          <Card className="internal-card internal-card--strong">
            <CardBody className="gap-5 p-5 sm:p-6">
              <SubscriptionListSection
                title="Subtopics"
                activeCountLabel={`${filteredSubtopicSubscriptions.length} active`}
                emptyTitle="No subtopic subscriptions yet."
                emptyDescription="Pick subtopics from a topic page to narrow the conversations you see."
                search={subtopicSearch}
                onSearchChange={setSubtopicSearch}
                items={filteredSubtopicSubscriptions}
                totalItemsLabel={`${subscriptionCounts.subtopics} total subtopic subscriptions`}
                renderItem={(subscription) => (
                  <div
                    key={subscription.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {subscription.subtopic.title}
                        </p>
                        <Chip size="sm" variant="flat">
                          {subscription.topic.title}
                        </Chip>
                      </div>
                      <p className="truncate text-xs text-default-500">
                        /{subscription.subtopic.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        as={Link}
                        aria-label={`Open ${subscription.subtopic.title}`}
                        href={`/topics/${subscription.topic.id}`}
                        isIconOnly
                        variant="flat"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Unsubscribe from ${subscription.subtopic.title}`}
                        color="danger"
                        isIconOnly
                        isLoading={unsubscribingId === subscription.id}
                        variant="flat"
                        onPress={() => void removeSubtopicSubscription(subscription)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </CardBody>
          </Card>
        </div>
      </motion.section>

      <Modal
        isOpen={isAvatarModalOpen}
        onOpenChange={onAvatarModalOpenChange}
        placement="center"
        size="3xl"
        scrollBehavior="inside"
        onClose={() => {
          setAvatarSearch("");
          closeAvatarModal();
        }}
      >
        <ModalContent className="max-h-[85vh] overflow-hidden border border-primary/15 bg-content1 shadow-[0_24px_64px_rgb(var(--heroui-colors-primary-500)/0.16)]">
          {(onClose) => (
            <>
              <ModalHeader className="sticky top-0 z-20 flex flex-col gap-3 border-b border-divider/70 bg-gradient-to-br from-primary/8 via-content1 to-content1 px-5 pb-4 pt-5 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Chip color="primary" variant="flat">
                      Change avatar
                    </Chip>
                    <p className="text-sm text-default-600">
                      Search the available animals and pick a new public avatar.
                    </p>
                  </div>
                  <Button isIconOnly variant="light" aria-label="Close avatar chooser" onPress={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  aria-label="Search avatars"
                  placeholder="Search avatars"
                  value={avatarSearch}
                  onValueChange={setAvatarSearch}
                  startContent={<Search className="h-4 w-4 text-default-400" />}
                  classNames={{
                    inputWrapper:
                      "border border-divider/70 bg-content1/90 shadow-sm",
                  }}
                />
              </ModalHeader>

              <ModalBody className="max-h-[calc(85vh-132px)] gap-4 overflow-y-auto px-5 py-4 sm:px-6">
                {availableAvatarOptions.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {availableAvatarOptions.map((avatar) => (
                      <button
                        key={avatar.path}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.path)}
                        className="group rounded-2xl border border-divider/70 bg-content1/80 p-3 text-left transition hover:border-primary/25 hover:bg-content2/80"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-divider/70 bg-content2">
                            <Image
                              src={avatar.path}
                              alt={avatar.label}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {avatar.label}
                              </p>
                              <span className="opacity-0 transition-opacity group-hover:opacity-100">
                                <Check className="h-3.5 w-3.5 text-primary" />
                              </span>
                            </div>
                            <p className="truncate text-xs text-default-500">
                              {avatar.path.replace("/avatars/", "")}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-divider bg-content1/70 p-6 text-center">
                    <p className="text-sm font-medium text-foreground">No avatars match that search.</p>
                    <p className="mt-1 text-sm text-default-500">
                      Try a different animal name or clear the search.
                    </p>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
