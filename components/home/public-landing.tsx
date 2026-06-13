"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageSquareText,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { LoginButton } from "@/components/auth/login-button";

const highlights = [
  {
    title: "Topic spaces with real structure",
    description:
      "Browse discussions, subscribe to subtopics, and keep track of the conversations that matter.",
    icon: Users,
  },
  {
    title: "Private messages for direct support",
    description:
      "Reach out to another member by username without exposing personal details.",
    icon: MessageSquareText,
  },
  {
    title: "Public identity, private data",
    description:
      "Other members see your username. Your email and personal profile stay hidden.",
    icon: Shield,
  },
];

export function PublicLanding() {
  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="relative overflow-hidden rounded-[2rem] border border-primary/12 bg-content1/85 px-6 py-10 shadow-[0_24px_80px_rgb(var(--heroui-colors-primary-500)/0.12)] backdrop-blur-xl sm:px-10 sm:py-14"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(22,160,133,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_32%)]" />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                For honest conversation
              </Chip>
              <Chip variant="flat">Private by default</Chip>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A better place for men to talk, learn, and support each other.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-default-600 sm:text-lg">
                Got Your Six brings together topic discussions, direct messaging, and
                a simple profile system so people can show up with a public username
                and keep the personal details private.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="/auth?mode=register"
                color="primary"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                Register
              </Button>
              <LoginButton />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border border-divider/70 bg-background/70 shadow-sm">
                <CardBody className="p-4">
                  <p className="text-2xl font-semibold">1 username</p>
                  <p className="text-sm text-default-500">That is all other members see.</p>
                </CardBody>
              </Card>
              <Card className="border border-divider/70 bg-background/70 shadow-sm">
                <CardBody className="p-4">
                  <p className="text-2xl font-semibold">Private DMs</p>
                  <p className="text-sm text-default-500">Start conversations directly.</p>
                </CardBody>
              </Card>
              <Card className="border border-divider/70 bg-background/70 shadow-sm">
                <CardBody className="p-4">
                  <p className="text-2xl font-semibold">Topic feeds</p>
                  <p className="text-sm text-default-500">Follow what matters most.</p>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.05 }}
                >
                  <Card className="border border-primary/12 bg-content1/90 shadow-[0_14px_40px_rgb(var(--heroui-colors-primary-500)/0.08)]">
                    <CardBody className="flex flex-row items-start gap-4 p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm leading-6 text-default-600">
                          {item.description}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })}

            <Card className="border border-primary/12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 shadow-[0_16px_44px_rgb(var(--heroui-colors-primary-500)/0.1)]">
              <CardBody className="gap-3 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    What you get
                  </p>
                </div>
                <p className="text-sm leading-6 text-default-600">
                  A clean landing page, a normal password login, and a dashboard that
                  focuses on topics, subscriptions, and messages instead of clutter.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
