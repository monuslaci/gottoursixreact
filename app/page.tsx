"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowRight, MessageSquare, Shield, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const pillars = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Safety and trust",
      text: "Moderation-ready foundations for conversations that need care.",
      className: "bg-brotherhood-navy text-white",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Guided brotherhood",
      text: "Topic spaces shaped for mentorship, accountability, and growth.",
      className: "bg-brotherhood-steel text-white",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: "Private support",
      text: "Messaging patterns prepared for stronger one-to-one connection.",
      className: "bg-brotherhood-forest text-white",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-content1 shadow-[0_24px_70px_rgb(var(--heroui-colors-primary-500)/0.14)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6 p-5 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-primary/15 bg-background shadow-sm sm:h-28 sm:w-28">
                <Image
                  src="/logo.png"
                  alt="Six logo"
                  fill
                  sizes="112px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary">Six</p>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">
                  Leadership support network
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat">
                Men&apos;s wellness
              </Chip>
              <Chip color="secondary" variant="flat">
                Coaching ready
              </Chip>
              <Chip className="bg-brotherhood-bronze/16 text-brotherhood-bronze" variant="flat">
                Trust first
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                A disciplined community base for men building steadier lives.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Six is shaped for support groups, coaching circles, veteran
                communities, and mental fitness programs where trust, privacy,
                and accountability matter.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Navy", "Command and trust", "bg-brotherhood-navy"],
                ["Steel", "Calm structure", "bg-brotherhood-steel"],
                ["Bronze", "Progress earned", "bg-brotherhood-bronze"],
              ].map(([name, text, color]) => (
                <div
                  key={name}
                  className="rounded-xl border border-primary/10 bg-background/80 p-3"
                >
                  <div className={`mb-3 h-1.5 w-12 rounded-full ${color}`} />
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-xs text-default-500">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                as={Link}
                href="/topics"
                color="primary"
                endContent={<ArrowRight size={16} />}
              >
                Browse topics
              </Button>
              <Button
                as={Link}
                href="/messages"
                className="border-brotherhood-bronze/50 text-brotherhood-bronze"
                variant="bordered"
              >
                View messages
              </Button>
            </div>
          </div>

          <div className="bg-brotherhood-navy p-5 text-white sm:p-8">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="space-y-5">
                <div className="w-fit rounded-xl bg-white/10 px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white/80">
                  Operating posture
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-semibold">Steady. Private. Accountable.</p>
                  <p className="text-sm leading-6 text-white/72">
                    The base experience favors clear navigation, visible status,
                    and restrained surfaces that feel at home in coaching,
                    wellness, and veteran-support environments.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {[
                  ["01", "Topic spaces", "Public discussion and guided groups"],
                  ["02", "Private messages", "Friendship building and check-ins"],
                  ["03", "Admin visibility", "Moderation and safety workflows"],
                ].map(([count, title, text]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-white/12 bg-white/8 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-semibold text-brotherhood-bronze">
                        {count}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 text-xs text-white/65">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map((item) => (
          <Card
            key={item.title}
            className="border border-primary/12 bg-content1 shadow-[0_14px_38px_rgb(var(--heroui-colors-primary-500)/0.08)]"
          >
            <CardBody className="gap-4 p-5">
              <div className={`w-fit rounded-xl p-3 ${item.className}`}>
                {item.icon}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="text-sm text-default-600">{item.text}</p>
              </div>
              <div className="h-1 w-16 rounded-full bg-brotherhood-bronze" />
            </CardBody>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-primary/12 bg-content1 p-4 shadow-[0_18px_48px_rgb(var(--heroui-colors-secondary-500)/0.08)] sm:p-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl bg-secondary/12 p-5">
          <p className="text-sm font-semibold text-secondary">Base system</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            Designed to grow into the full community product.
          </h2>
          <p className="mt-3 text-sm leading-6 text-default-600">
            The shell keeps the next build steps clear: authentication, roles,
            topics, subscriptions, posts, messaging, and admin moderation.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
              ["Topics", "Discussion spaces"],
              ["Messages", "Private support"],
              ["Safety", "Admin visibility"],
            ].map(([label, text]) => (
            <div
              key={label}
              className="rounded-xl border border-divider bg-background/80 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                {label}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
