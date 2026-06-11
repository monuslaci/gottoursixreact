"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowRight, Inbox, MessageSquare } from "lucide-react";
import Link from "next/link";

const conversations = [
  {
    name: "Support check-in",
    status: "Unread",
    preview: "Thanks for reaching out. We can talk later tonight.",
  },
  {
    name: "Friendship note",
    status: "Read",
    preview: "Appreciate the chat yesterday. Let's keep the momentum going.",
  },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.1)]">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Private messaging
              </Chip>
              <Chip color="secondary" variant="flat">
                Friendship support
              </Chip>
              <Chip className="bg-brotherhood-forest/16 text-brotherhood-forest" variant="flat">
                Trust layer
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Private conversations with a calm support posture.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                This is the start of the private conversation area. It is ready
                for unread states, conversation lists, and future moderation
                tools.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Open", "2 conversations"],
                ["Unread", "1 priority note"],
                ["Safety", "Admin-ready"],
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button color="primary" startContent={<MessageSquare size={16} />}>
                Start a conversation
              </Button>
              <Button
                as={Link}
                href="/"
                className="border-brotherhood-bronze/50 text-brotherhood-bronze"
                variant="bordered"
                endContent={<ArrowRight size={16} />}
              >
                Back home
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-primary/12 bg-brotherhood-navy text-white shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.12)]">
          <CardBody className="gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-3 text-brotherhood-bronze">
                <Inbox className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Unread state</p>
                <p className="text-xs text-white/65">Ready for badge wiring</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-white/72">
              The navbar icon is prepared to show a small badge whenever the
              unread count becomes greater than zero.
            </p>
            <div className="h-1.5 w-20 rounded-full bg-brotherhood-bronze" />
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {conversations.map((item) => (
          <Card
            key={item.name}
            className="border border-primary/12 bg-content1 shadow-sm"
          >
            <CardBody className="gap-2 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-sm text-default-600">{item.preview}</p>
                </div>
                <Chip
                  size="sm"
                  color={item.status === "Unread" ? "primary" : "default"}
                  className={item.status === "Unread" ? "bg-brotherhood-bronze/16 text-brotherhood-bronze" : ""}
                  variant="flat"
                >
                  {item.status}
                </Chip>
              </div>
              <div className="mt-3 h-1 w-16 rounded-full bg-secondary" />
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
}
