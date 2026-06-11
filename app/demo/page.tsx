"use client";

import { Button, Card, CardBody, Chip, Progress } from "@heroui/react";
import { ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";

import { AnimatedCircularProgressBar } from "@/components/animated-circular-progress-bar";
import { InteractiveHoverButton } from "@/components/interactive-hover-button";

const demoTopics = [
  { name: "Check-ins", status: "Active" },
  { name: "Career", status: "Growing" },
  { name: "Relationships", status: "Quiet" },
];

export default function DemoPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.1)]">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Demo workspace
              </Chip>
              <Chip color="secondary" variant="flat">
                Coaching flow
              </Chip>
              <Chip className="bg-brotherhood-bronze/16 text-brotherhood-bronze" variant="flat">
                Operational
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                A working surface for future community operations.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Use this page to test topic discovery, member signals, and
                support workflows with the same calm, premium system used
                across the app.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Readiness", "72%", "bg-brotherhood-navy"],
                ["Trust", "High", "bg-brotherhood-forest"],
                ["Cadence", "Weekly", "bg-brotherhood-bronze"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-xl border border-divider bg-background/80 p-4">
                  <div className={`mb-3 h-1.5 w-10 rounded-full ${color}`} />
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                    {label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <InteractiveHoverButton className="w-full sm:w-auto" type="button">
                Start a topic
              </InteractiveHoverButton>
              <Button
                as={Link}
                href="/"
                className="border-brotherhood-bronze/50 text-brotherhood-bronze"
                variant="bordered"
                endContent={<ArrowRight className="h-4 w-4" />}
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
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Readiness</p>
                <p className="text-xs text-white/65">Base implementation</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-5">
              <AnimatedCircularProgressBar
                value={72}
                gaugePrimaryColor="rgb(var(--heroui-colors-warning))"
                gaugeSecondaryColor="rgb(255 255 255 / 0.16)"
                className="size-36 sm:size-40"
              />
            </div>
            <Progress
              aria-label="Demo progress"
              classNames={{
                indicator: "bg-brotherhood-bronze",
                track: "bg-white/14",
              }}
              value={72}
            />
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {demoTopics.map((topic) => (
          <Card key={topic.name} className="border border-primary/12 bg-content1 shadow-sm">
            <CardBody className="gap-2 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{topic.name}</p>
                <span className="h-2 w-2 rounded-full bg-brotherhood-forest" />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                {topic.status}
              </p>
              <p className="text-sm text-default-600">
                Placeholder space for posts, subscriptions, and community cues.
              </p>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card className="border border-primary/12 bg-content1 shadow-sm">
        <CardBody className="gap-3 p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brotherhood-bronze" />
            <h2 className="text-base font-semibold">Next steps</h2>
          </div>
          <p className="text-sm leading-6 text-default-600">
            Authentication, role handling, topic CRUD, and private messaging can
            now be layered in without changing the shell.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
