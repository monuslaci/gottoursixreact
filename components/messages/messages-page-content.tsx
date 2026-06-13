"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Skeleton,
  Textarea,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Inbox,
  MessageSquarePlus,
  Send,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useUserProfile } from "@/lib/hooks/useUserProfile";
import type { ConversationDetails, ConversationListItem } from "@/lib/messages";

function initialsFromName(name: string | null, email: string | null) {
  const source = name || email || "Member";
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

function MessageThreadSkeleton() {
  return (
    <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
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
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [conversationDetails, setConversationDetails] =
    useState<ConversationDetails | null>(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [starterBody, setStarterBody] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendingConversationId, setSendingConversationId] = useState<
    string | null
  >(null);

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
          .map((member) => member.name || member.email || "")
          .join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [conversations, search]);

  const selectedConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === selectedConversationId) ??
      null,
    [conversations, selectedConversationId]
  );

  const currentUserId = user?.id ?? null;

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

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      if (!isMounted || isLoadingProfile) {
        return;
      }

      await loadConversations();
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
    // loadConversations depends on user email and selectedConversationId
  }, [isLoadingProfile, user?.email]);

  useEffect(() => {
    if (selectedConversationId) {
      void loadMessages(selectedConversationId);
      return;
    }

    setConversationDetails(null);
  }, [selectedConversationId, user?.email]);

  useEffect(() => {
    if (!selectedConversationId && filteredConversations.length > 0) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedConversationId]);

  async function handleCreateConversation() {
    const email = user?.email;

    if (!email) {
      setError("A member profile is required to send messages.");
      return;
    }

    const trimmedRecipient = recipientEmail.trim();
    const trimmedBody = starterBody.trim();

    if (!trimmedRecipient) {
      setError("Recipient email is required.");
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
          recipientEmail: trimmedRecipient,
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

      setRecipientEmail("");
      setStarterBody("");
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

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.1)]">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Private messaging
              </Chip>
              <Chip color="secondary" variant="flat">
                Unread-aware inbox
              </Chip>
              <Chip className="bg-brotherhood-forest/16 text-brotherhood-forest" variant="flat">
                Basic editor
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Message another member directly.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Start a conversation by email, then keep the thread going with a simple
                editor. The navbar message icon updates when unread messages are present.
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <motion.section
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
          className="space-y-4"
        >
          <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
            <CardBody className="gap-4 p-5 sm:p-6">
              <div className="space-y-1">
                <Chip color="primary" variant="flat">
                  Start conversation
                </Chip>
                <p className="text-sm text-default-600">
                  Send a first message to another member.
                </p>
              </div>

              <Input
                label="Recipient email"
                placeholder=" "
                value={recipientEmail}
                onValueChange={setRecipientEmail}
              />
              <Textarea
                label="First message"
                minRows={4}
                placeholder=" "
                value={starterBody}
                onValueChange={setStarterBody}
              />
              <Button
                color="primary"
                isLoading={sendingConversationId === "new"}
                startContent={<MessageSquarePlus className="h-4 w-4" />}
                onPress={() => void handleCreateConversation()}
              >
                Start conversation
              </Button>
            </CardBody>
          </Card>

          <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
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
                  className="h-12 w-full rounded-xl border border-divider/70 bg-content1/90 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
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
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
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
                            : "border-divider/70 bg-background/80 hover:bg-default-100"
                        }`}
                        variant="flat"
                        onPress={() => setSelectedConversationId(conversation.id)}
                      >
                        <div className="flex w-full items-start gap-3">
                          <Avatar
                            name={initialsFromName(
                              conversation.members.find((member) => member.id !== currentUserId)
                                ?.name ?? conversation.title,
                              conversation.members.find((member) => member.id !== currentUserId)
                                ?.email ?? null
                            )}
                            size="sm"
                            showFallback
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {conversation.title}
                              </p>
                              {unreadCount > 0 ? (
                                <Chip color="primary" size="sm" variant="flat">
                                  {unreadCount}
                                </Chip>
                              ) : null}
                            </div>
                            <p className="truncate text-xs text-default-500">
                              {conversation.preview}
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
                  <div className="rounded-2xl border border-dashed border-divider bg-background/70 p-4">
                    <p className="text-sm font-medium text-foreground">No conversations yet.</p>
                    <p className="mt-1 text-sm text-default-500">
                      Send a first message to start your inbox.
                    </p>
                  </div>
                )}
              </div>
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
            <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
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
                        .map((member) => member.name || member.email || "Member")
                        .join(", ") || "Conversation"}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    href="/profile"
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
                            className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                              isMine
                                ? "bg-primary text-primary-foreground"
                                : "border border-divider bg-background/90"
                            }`}
                          >
                            <div className="mb-1 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] opacity-80">
                              <span>
                                {message.sender?.name || message.sender?.email || "Member"}
                              </span>
                              <span>{formatTime(message.createdAt)}</span>
                            </div>
                            <p className="text-sm leading-6">{message.body}</p>
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

                <div className="space-y-3">
                  <Textarea
                    label="Write a message"
                    minRows={4}
                    placeholder=" "
                    value={messageBody}
                    onValueChange={setMessageBody}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-default-500">
                      Messages are delivered immediately and mark the thread as read when opened.
                    </p>
                    <Button
                      color="primary"
                      isLoading={sendingConversationId === selectedConversation.id}
                      startContent={<Send className="h-4 w-4" />}
                      onPress={() => void handleSendMessage()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="border border-dashed border-divider bg-content1">
              <CardBody className="gap-3 p-5">
                <p className="text-sm font-medium text-foreground">Select a conversation</p>
                <p className="text-sm text-default-500">
                  Choose an inbox item or start a new conversation to begin messaging.
                </p>
              </CardBody>
            </Card>
          )}
        </motion.section>
      </div>

      {error ? <p className="text-sm text-danger-500">{error}</p> : null}
    </div>
  );
}
