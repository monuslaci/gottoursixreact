"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Inbox,
  MessageSquarePlus,
  MessageSquareText,
  Send,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { EmojiComposer } from "@/components/common/emoji-composer";
import { PROFILE_UPDATED_EVENT } from "@/lib/client-events";
import type { MyPostActivityItem, MyPostActivityPayload } from "@/lib/community";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import type { ConversationDetails, ConversationListItem } from "@/lib/messages";

const PAGE_SIZE = 15;
const ACTIVITY_PAGE_SIZE = 10;

function initialsFromName(username: string | null, fallback = "Member") {
  const source = username || fallback;
  const parts = source.trim().split(/\s+/);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  return source.slice(0, 1).toUpperCase();
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function truncateWords(value: string, limit: number) {
  const words = value.trim().split(/\s+/);

  if (words.length <= limit) {
    return value;
  }

  return `${words.slice(0, limit).join(" ")}...`;
}

function buildPostActivityHref(item: MyPostActivityItem) {
  if (!item.topic?.id) {
    return "/messages";
  }

  return `/topics/${item.topic.id}#post-${item.id}`;
}

function MessageThreadSkeleton() {
  return (
    <Card className="internal-card">
      <CardBody className="gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-28 rounded-2xl" />
      </CardBody>
    </Card>
  );
}

export function MessagesPageContent() {
  const { user, isLoading: isLoadingProfile } = useUserProfile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientUsernameParam =
    searchParams.get("recipientUsername") || searchParams.get("recipientEmail");
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversationDetails, setConversationDetails] =
    useState<ConversationDetails | null>(null);
  const [activity, setActivity] = useState<MyPostActivityPayload>({
    posts: [],
    comments: [],
  });
  const [activeTab, setActiveTab] = useState<"inbox" | "activity">("inbox");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [messageBody, setMessageBody] = useState("");
  const [starterBody, setStarterBody] = useState("");
  const [search, setSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [inboxPage, setInboxPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [sendingConversationId, setSendingConversationId] = useState<
    string | null
  >(null);
  const currentUserId = user?.id ?? null;
  const pendingRecipientUsername = recipientUsernameParam?.trim() ?? "";

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const searchable = [
        conversation.title,
        conversation.preview,
        conversation.members
          .map((member) => member.username || "")
          .join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [conversations, search]);

  const filteredActivity = useMemo(() => {
    const query = activitySearch.trim().toLowerCase();

    if (!query) {
      return activity;
    }

    function matches(item: MyPostActivityItem) {
      const searchable = [
        item.body,
        item.topic?.title ?? "",
        item.topic?.slug ?? "",
        item.subtopic?.title ?? "",
        item.subtopic?.slug ?? "",
        item.parentPost?.body ?? "",
        item.parentPost?.author?.username ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    }

    return {
      posts: activity.posts.filter(matches),
      comments: activity.comments.filter(matches),
    };
  }, [activity, activitySearch]);

  const selectedConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === selectedConversationId) ??
      null,
    [conversations, selectedConversationId]
  );

  const targetedConversation = useMemo(() => {
    if (!pendingRecipientUsername) {
      return null;
    }

    const normalizedRecipient = pendingRecipientUsername.toLowerCase();

    return (
      conversations.find((conversation) =>
        conversation.members.some(
          (member) =>
            member.id !== currentUserId &&
            member.username?.toLowerCase() === normalizedRecipient
        )
      ) ?? null
    );
  }, [conversations, currentUserId, pendingRecipientUsername]);

  const totalInboxPages = Math.max(1, Math.ceil(filteredConversations.length / PAGE_SIZE));
  const safeInboxPage = Math.min(inboxPage, totalInboxPages);
  const inboxConversations = filteredConversations.slice(
    (safeInboxPage - 1) * PAGE_SIZE,
    safeInboxPage * PAGE_SIZE
  );
  const totalPostsPages = Math.max(
    1,
    Math.ceil(filteredActivity.posts.length / ACTIVITY_PAGE_SIZE)
  );
  const totalCommentsPages = Math.max(
    1,
    Math.ceil(filteredActivity.comments.length / ACTIVITY_PAGE_SIZE)
  );
  const safePostsPage = Math.min(postsPage, totalPostsPages);
  const safeCommentsPage = Math.min(commentsPage, totalCommentsPages);
  const visiblePosts = filteredActivity.posts.slice(
    (safePostsPage - 1) * ACTIVITY_PAGE_SIZE,
    safePostsPage * ACTIVITY_PAGE_SIZE
  );
  const visibleComments = filteredActivity.comments.slice(
    (safeCommentsPage - 1) * ACTIVITY_PAGE_SIZE,
    safeCommentsPage * ACTIVITY_PAGE_SIZE
  );

  function emitMessageChange() {
    window.dispatchEvent(new Event("messages-changed"));
  }

  async function loadConversations() {
    const email = user?.email;

    if (!email) {
      setConversations([]);
      setIsLoadingConversations(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/conversations?userEmail=${encodeURIComponent(email)}`,
        {
          cache: "no-store",
        }
      );

      const payload = (await response.json()) as {
        conversations?: ConversationListItem[];
        unreadCount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load conversations.");
      }

      setConversations(payload.conversations ?? []);
      if (!selectedConversationId && (payload.conversations ?? []).length > 0) {
        setSelectedConversationId(payload.conversations?.[0].id ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversations.");
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function loadMessages(conversationId: string) {
    const email = user?.email;

    if (!email) {
      return;
    }

    setIsLoadingMessages(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages?userEmail=${encodeURIComponent(
          email
        )}`,
        {
          cache: "no-store",
        }
      );

      const payload = (await response.json()) as ConversationDetails & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load messages.");
      }

      setConversationDetails(payload);
      emitMessageChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function loadActivity() {
    if (!user?.id) {
      setActivity({
        posts: [],
        comments: [],
      });
      setIsLoadingActivity(false);
      return;
    }

    setIsLoadingActivity(true);

    try {
      const response = await fetch("/api/me/post-activity", {
        cache: "no-store",
      });

      const payload = (await response.json()) as MyPostActivityPayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load your post activity.");
      }

      setActivity({
        posts: payload.posts ?? [],
        comments: payload.comments ?? [],
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your post activity."
      );
    } finally {
      setIsLoadingActivity(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!isMounted || isLoadingProfile) {
        return;
      }

      await loadConversations();
      await loadActivity();
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
    // loadConversations depends on user email and selectedConversationId
  }, [isLoadingProfile, user?.email, user?.id]);

  useEffect(() => {
    if (selectedConversationId) {
      void loadMessages(selectedConversationId);
      return;
    }

    setConversationDetails(null);
  }, [selectedConversationId, user?.email]);

  useEffect(() => {
    if (targetedConversation?.id && selectedConversationId !== targetedConversation.id) {
      setSelectedConversationId(targetedConversation.id);
      return;
    }

    if (pendingRecipientUsername && !targetedConversation) {
      setSelectedConversationId(null);
    }
  }, [pendingRecipientUsername, selectedConversationId, targetedConversation]);

  useEffect(() => {
    if (pendingRecipientUsername && !targetedConversation) {
      return;
    }

    if (!selectedConversationId && filteredConversations.length > 0) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [filteredConversations, pendingRecipientUsername, selectedConversationId, targetedConversation]);

  useEffect(() => {
    setInboxPage(1);
  }, [search]);

  useEffect(() => {
    setPostsPage(1);
    setCommentsPage(1);
  }, [activitySearch]);

  useEffect(() => {
    function handleProfileUpdated() {
      void Promise.all([loadConversations(), loadActivity()]).then(async () => {
        if (selectedConversationId) {
          await loadMessages(selectedConversationId);
        }
      });
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, [selectedConversationId, user?.email, user?.id]);

  async function handleCreateConversation() {
    const email = user?.email;

    if (!email) {
      setError("A member profile is required to send messages.");
      return;
    }

    const trimmedRecipient = pendingRecipientUsername.trim();
    const trimmedBody = starterBody.trim();

    if (!trimmedRecipient) {
      setError("Recipient username is required.");
      return;
    }

    setSendingConversationId("new");
    setError(null);

    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          recipientUsername: trimmedRecipient,
          body: trimmedBody,
        }),
      });

      const payload = (await response.json()) as {
        conversation?: ConversationListItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to start conversation.");
      }

      await loadConversations();

      if (payload.conversation) {
        setSelectedConversationId(payload.conversation.id);
        await loadMessages(payload.conversation.id);
      }

      setStarterBody("");
      router.replace("/messages");
      emitMessageChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start conversation.");
    } finally {
      setSendingConversationId(null);
    }
  }

  async function handleSendMessage() {
    const email = user?.email;
    const conversationId = selectedConversationId;

    if (!email || !conversationId) {
      setError("Select a conversation first.");
      return;
    }

    const trimmedBody = messageBody.trim();

    if (!trimmedBody) {
      setError("Write a message before sending.");
      return;
    }

    setSendingConversationId(conversationId);
    setError(null);

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          body: trimmedBody,
        }),
      });

      const payload = (await response.json()) as {
        message?: { id: string };
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to send message.");
      }

      setMessageBody("");
      await loadConversations();
      await loadMessages(conversationId);
      emitMessageChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message.");
    } finally {
      setSendingConversationId(null);
    }
  }

  const threadMessages = conversationDetails?.messages ?? [];
  const selectedOtherMember =
    selectedConversation?.members.find((member) => member.id !== currentUserId) ?? null;

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex rounded-2xl border border-primary/15 bg-content2/65 p-1 shadow-[0_10px_24px_rgba(27,54,93,0.08)]">
                <Button
                  color={activeTab === "inbox" ? "primary" : "default"}
                  variant={activeTab === "inbox" ? "solid" : "light"}
                  startContent={<Inbox className="h-4 w-4" />}
                  className={`rounded-xl px-4 ${
                    activeTab === "inbox"
                      ? "bg-[linear-gradient(135deg,rgba(var(--heroui-colors-primary-500),1),rgba(var(--heroui-colors-primary-700),1))] text-primary-foreground shadow-sm"
                      : "text-default-600"
                  }`}
                  onPress={() => setActiveTab("inbox")}
                >
                  Inbox
                </Button>
                <Button
                  color={activeTab === "activity" ? "primary" : "default"}
                  variant={activeTab === "activity" ? "solid" : "light"}
                  startContent={<FileText className="h-4 w-4" />}
                  className={`rounded-xl px-4 ${
                    activeTab === "activity"
                      ? "bg-[linear-gradient(135deg,rgba(var(--heroui-colors-primary-500),1),rgba(var(--heroui-colors-primary-700),1))] text-primary-foreground shadow-sm"
                      : "text-default-600"
                  }`}
                  onPress={() => setActiveTab("activity")}
                >
                  My posts
                </Button>
              </div>

              <Chip variant="flat" className="bg-brotherhood-bronze/12 text-brotherhood-bronze">
                {activeTab === "inbox" ? "Direct messages" : "Personal activity"}
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Message another member directly.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Visit a member profile to start a conversation, then keep the thread
                going here with the editor. The navbar message icon updates when unread
                messages are present.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.section>

      {activeTab === "inbox" ? (
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <motion.section
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
          className="space-y-4"
        >
          <Card className="internal-card">
            <CardBody className="gap-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Inbox className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-semibold">Inbox</h2>
                </div>
                <Chip variant="flat">
                  {conversations.reduce((sum, item) => sum + item.unreadCount, 0)} unread
                </Chip>
              </div>

              <label className="group relative block w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
                <input
                  aria-label="Search conversations"
                  className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
                  placeholder=" "
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
                  Search conversations
                </span>
              </label>

              <div className="grid gap-3">
                {isLoadingConversations ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-2xl" />
                  ))
                ) : inboxConversations.length > 0 ? (
                  inboxConversations.map((conversation) => {
                    const otherMember =
                      conversation.members.find((member) => member.id !== currentUserId) ??
                      null;
                    const displayName =
                      otherMember?.username ? `@${otherMember.username}` : conversation.title;
                    const preview = conversation.preview
                      ? truncateWords(conversation.preview, 8)
                      : "No messages yet.";
                    const isSelected = conversation.id === selectedConversationId;
                    const lastMessageAt = conversation.lastMessageAt
                      ? formatDateTime(conversation.lastMessageAt)
                      : "No messages yet";
                    const unreadCount = conversation.unreadCount;

                    return (
                      <Button
                        key={conversation.id}
                        className={`h-auto w-full justify-start rounded-2xl border px-4 py-4 text-left transition ${
                          isSelected
                            ? "border-primary/30 bg-primary/5"
                            : "border-divider/70 bg-content1/80 hover:bg-default-100"
                        }`}
                        variant="flat"
                        onPress={() => setSelectedConversationId(conversation.id)}
                      >
                        <div className="flex w-full items-start gap-3">
                          {otherMember?.username ? (
                            <Link
                              href={`/members/${encodeURIComponent(otherMember.username)}`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Avatar
                                src={otherMember.image || undefined}
                                name={initialsFromName(
                                  otherMember.username,
                                  conversation.title
                                )}
                                size="sm"
                                showFallback
                              />
                            </Link>
                          ) : (
                            <Avatar
                              src={otherMember?.image || undefined}
                              name={initialsFromName(
                                otherMember?.username ?? null,
                                conversation.title
                              )}
                              size="sm"
                              showFallback
                            />
                          )}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              {otherMember?.username ? (
                                <Link
                                  className="truncate text-sm font-semibold text-foreground transition hover:text-primary hover:underline"
                                  href={`/members/${encodeURIComponent(otherMember.username)}`}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {displayName}
                                </Link>
                              ) : (
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {displayName}
                                </p>
                              )}
                              {unreadCount > 0 ? (
                                <Chip color="primary" size="sm" variant="flat">
                                  {unreadCount}
                                </Chip>
                              ) : null}
                            </div>
                            <p className="truncate text-xs text-default-500">
                              {preview}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.14em] text-default-400">
                              {lastMessageAt}
                            </p>
                          </div>
                        </div>
                      </Button>
                    );
                  })
                ) : (
                  <div className="internal-empty p-4">
                    <p className="text-sm font-medium text-foreground">No conversations yet.</p>
                    <p className="mt-1 text-sm text-default-500">
                      Open a member profile and use the message button to start your inbox.
                    </p>
                  </div>
                )}
              </div>

              {!isLoadingConversations && filteredConversations.length > PAGE_SIZE ? (
                <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
                  <p className="text-xs text-default-500">
                    Page {safeInboxPage} of {totalInboxPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      isDisabled={safeInboxPage <= 1}
                      variant="flat"
                      onPress={() => setInboxPage((current) => Math.max(1, current - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      isDisabled={safeInboxPage >= totalInboxPages}
                      variant="flat"
                      onPress={() =>
                        setInboxPage((current) => Math.min(totalInboxPages, current + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.1 }}
        >
          {isLoadingMessages && selectedConversationId ? (
            <MessageThreadSkeleton />
          ) : selectedConversation ? (
            <Card className="internal-card internal-card--strong">
              <CardBody className="gap-5 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip color="secondary" variant="flat">
                        Thread
                      </Chip>
                      {selectedConversation.unreadCount > 0 ? (
                        <Chip color="primary" variant="flat">
                          {selectedConversation.unreadCount} unread
                        </Chip>
                      ) : null}
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      {selectedConversation.title}
                    </h2>
                    <p className="text-sm text-default-500">
                      {selectedConversation.members
                        .filter((member) => member.id !== currentUserId)
                        .map((member) => member.username || "Member")
                        .join(", ") || "Conversation"}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    href={
                      selectedOtherMember?.username
                        ? `/members/${encodeURIComponent(selectedOtherMember.username)}`
                        : "/profile"
                    }
                    variant="flat"
                    endContent={<ArrowUpRight className="h-4 w-4" />}
                  >
                    Profile
                  </Button>
                </div>

                <Divider />

                <div className="space-y-3">
                  {threadMessages.length > 0 ? (
                    threadMessages.map((message) => {
                      const isMine = message.sender?.id === currentUserId;

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`flex max-w-[88%] items-end gap-3 ${
                              isMine ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {!isMine && message.sender?.username ? (
                              <Link
                                href={`/members/${encodeURIComponent(message.sender.username)}`}
                              >
                                <Avatar
                                  size="sm"
                                  src={message.sender.image || undefined}
                                  name={initialsFromName(message.sender.username)}
                                  showFallback
                                  className="mb-1 shrink-0"
                                />
                              </Link>
                            ) : (
                              <Avatar
                                size="sm"
                                src={message.sender?.image || undefined}
                                name={initialsFromName(message.sender?.username ?? null)}
                                showFallback
                                className="mb-1 shrink-0"
                              />
                            )}
                            <div
                              className={`max-w-full rounded-2xl px-4 py-3 shadow-sm ${
                                isMine
                                  ? "bg-primary text-primary-foreground"
                                  : "border border-divider bg-content1/90"
                              }`}
                            >
                              <div className="mb-1 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] opacity-80">
                                <span>
                                  {message.sender?.username || "Member"}
                                </span>
                                <span>{formatTime(message.createdAt)}</span>
                              </div>
                              <p className="text-sm leading-6">{message.body}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-divider bg-background/70 p-4">
                      <p className="text-sm font-medium text-foreground">
                        No messages yet.
                      </p>
                      <p className="mt-1 text-sm text-default-500">
                        Be the first to send something supportive.
                      </p>
                    </div>
                  )}
                </div>

                <Divider />

                <EmojiComposer
                  actionLabel="Send"
                  actionIcon={<Send className="h-4 w-4" />}
                  value={messageBody}
                  onValueChange={setMessageBody}
                  onAction={handleSendMessage}
                  isActionLoading={sendingConversationId === selectedConversation.id}
                  label="Write a message"
                  minRows={5}
                  helperText="Messages are delivered immediately and marked as read when the thread is opened."
                />
              </CardBody>
            </Card>
          ) : pendingRecipientUsername ? (
            <Card className="internal-card internal-card--strong">
              <CardBody className="gap-5 p-5 sm:p-6">
                <div className="space-y-2">
                  <Chip color="primary" variant="flat">
                    New conversation
                  </Chip>
                  <h2 className="text-xl font-semibold tracking-tight">
                    Message @{pendingRecipientUsername}
                  </h2>
                  <p className="text-sm leading-6 text-default-500">
                    Your first message will open the thread here right away.
                  </p>
                </div>

                <EmojiComposer
                  actionLabel="Start conversation"
                  actionIcon={<MessageSquarePlus className="h-4 w-4" />}
                  value={starterBody}
                  onValueChange={setStarterBody}
                  onAction={handleCreateConversation}
                  isActionLoading={sendingConversationId === "new"}
                  label="First message"
                  minRows={6}
                  helperText="Use the quick emoji bar if you want a warm, low-pressure opener."
                />
              </CardBody>
            </Card>
          ) : (
            <Card className="internal-empty">
              <CardBody className="gap-3 p-5">
                <p className="text-sm font-medium text-foreground">Select a conversation</p>
                <p className="text-sm text-default-500">
                  Choose an inbox item or open a member profile to begin messaging.
                </p>
              </CardBody>
            </Card>
          )}
        </motion.section>
      </div>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
        >
          <Card className="internal-card internal-card--strong">
            <CardBody className="gap-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip color="primary" variant="flat">
                      My posts
                    </Chip>
                    <Chip color="secondary" variant="flat">
                      Newest first
                    </Chip>
                  </div>
                  <p className="text-sm text-default-500">
                    Review your latest posts and your comments on other members&apos; posts.
                  </p>
                </div>
              </div>

              <label className="group relative block w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
                <input
                  aria-label="Search your post activity"
                  className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
                  placeholder=" "
                  value={activitySearch}
                  onChange={(event) => setActivitySearch(event.target.value)}
                />
                <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
                  Search your posts and comments
                </span>
              </label>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card className="internal-card">
                  <CardBody className="gap-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-secondary" />
                        <h2 className="text-lg font-semibold">My posts</h2>
                      </div>
                      <Chip variant="flat">{filteredActivity.posts.length}</Chip>
                    </div>

                    <div className="grid gap-3">
                      {isLoadingActivity ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} className="h-28 rounded-2xl" />
                        ))
                      ) : visiblePosts.length > 0 ? (
                        visiblePosts.map((post) => (
                          <button
                            key={post.id}
                            type="button"
                            className="rounded-2xl border border-divider/70 bg-content1/80 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                            onClick={() => router.push(buildPostActivityHref(post))}
                          >
                            <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                              {post.topic ? (
                                <span className="font-medium text-foreground">
                                  {post.topic.title}
                                </span>
                              ) : null}
                              {post.subtopic ? (
                                <Chip size="sm" variant="flat">
                                  {post.subtopic.title}
                                </Chip>
                              ) : null}
                              <span>{formatDateTime(post.createdAt)}</span>
                              {post.isEdited ? <span>Edited</span> : null}
                            </div>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-default-700">
                              {truncateWords(post.body, 40)}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="internal-empty p-4">
                          <p className="text-sm font-medium text-foreground">No posts yet.</p>
                          <p className="mt-1 text-sm text-default-500">
                            Your topic posts will appear here.
                          </p>
                        </div>
                      )}
                    </div>

                    {!isLoadingActivity && filteredActivity.posts.length > ACTIVITY_PAGE_SIZE ? (
                      <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
                        <p className="text-xs text-default-500">
                          Page {safePostsPage} of {totalPostsPages}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            isDisabled={safePostsPage <= 1}
                            variant="flat"
                            onPress={() =>
                              setPostsPage((current) => Math.max(1, current - 1))
                            }
                          >
                            Previous
                          </Button>
                          <Button
                            isDisabled={safePostsPage >= totalPostsPages}
                            variant="flat"
                            onPress={() =>
                              setPostsPage((current) =>
                                Math.min(totalPostsPages, current + 1)
                              )
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardBody>
                </Card>

                <Card className="internal-card">
                  <CardBody className="gap-4 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <MessageSquareText className="h-5 w-5 text-secondary" />
                        <h2 className="text-lg font-semibold">My comments</h2>
                      </div>
                      <Chip variant="flat">{filteredActivity.comments.length}</Chip>
                    </div>

                    <div className="grid gap-3">
                      {isLoadingActivity ? (
                        Array.from({ length: 3 }).map((_, index) => (
                          <Skeleton key={index} className="h-32 rounded-2xl" />
                        ))
                      ) : visibleComments.length > 0 ? (
                        visibleComments.map((comment) => (
                          <button
                            key={comment.id}
                            type="button"
                            className="rounded-2xl border border-divider/70 bg-content1/80 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                            onClick={() => router.push(buildPostActivityHref(comment))}
                          >
                            <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                              {comment.topic ? (
                                <span className="font-medium text-foreground">
                                  {comment.topic.title}
                                </span>
                              ) : null}
                              {comment.subtopic ? (
                                <Chip size="sm" variant="flat">
                                  {comment.subtopic.title}
                                </Chip>
                              ) : null}
                              <span>{formatDateTime(comment.createdAt)}</span>
                              {comment.isEdited ? <span>Edited</span> : null}
                            </div>
                            {comment.parentPost ? (
                              <p className="mt-2 text-xs leading-5 text-default-500">
                                In reply to {comment.parentPost.author?.username ?? "member"}:{" "}
                                {truncateWords(comment.parentPost.body, 18)}
                              </p>
                            ) : null}
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-default-700">
                              {truncateWords(comment.body, 40)}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="internal-empty p-4">
                          <p className="text-sm font-medium text-foreground">
                            No comments on other posts yet.
                          </p>
                          <p className="mt-1 text-sm text-default-500">
                            Your replies to other members will appear here.
                          </p>
                        </div>
                      )}
                    </div>

                    {!isLoadingActivity && filteredActivity.comments.length > ACTIVITY_PAGE_SIZE ? (
                      <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
                        <p className="text-xs text-default-500">
                          Page {safeCommentsPage} of {totalCommentsPages}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            isDisabled={safeCommentsPage <= 1}
                            variant="flat"
                            onPress={() =>
                              setCommentsPage((current) => Math.max(1, current - 1))
                            }
                          >
                            Previous
                          </Button>
                          <Button
                            isDisabled={safeCommentsPage >= totalCommentsPages}
                            variant="flat"
                            onPress={() =>
                              setCommentsPage((current) =>
                                Math.min(totalCommentsPages, current + 1)
                              )
                            }
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </motion.section>
      )}

      {error ? <p className="text-sm text-danger-500">{error}</p> : null}
    </div>
  );
}
