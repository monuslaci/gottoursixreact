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
        <div className="rounded-2xl border border-divider bg-content1 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Demo workspace
            </span>
            <span className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium text-foreground">
              Base UI only
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              A place to test the future community flow.
            </h1>
            <p className="max-w-2xl text-sm text-default-600 sm:text-base">
              This screen shows the shell we will build on: topic browsing,
              lightweight status, and a clear path for support-oriented
              features.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <InteractiveHoverButton className="w-full sm:w-auto" type="button">
              Start a topic
            </InteractiveHoverButton>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-divider px-4 text-sm font-medium text-foreground transition-colors hover:bg-default-100"
            >
              Back home
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-divider bg-content1 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Readiness</p>
              <p className="text-xs text-default-500">Base implementation</p>
            </div>
          </div>
          <div className="flex items-center justify-center py-5">
            <AnimatedCircularProgressBar
              value={72}
              gaugePrimaryColor="var(--heroui-colors-primary-500)"
              gaugeSecondaryColor="var(--heroui-colors-default-200)"
              className="size-36 sm:size-40"
            />
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-default-100">
            <div className="h-full w-[72%] rounded-full bg-primary" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {demoTopics.map((topic) => (
          <article key={topic.name} className="rounded-2xl border border-divider bg-content1 p-5">
            <p className="text-sm font-medium">{topic.name}</p>
            <p className="text-xs text-default-500">{topic.status}</p>
            <p className="mt-2 text-sm text-default-600">
              Placeholder space for posts, subscriptions, and community cues.
            </p>
          </article>
        ))}
      </section>

      <div className="rounded-2xl border border-divider bg-content1 p-5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Next steps</h2>
        </div>
        <p className="mt-3 text-sm text-default-600">
          Authentication, role handling, topic CRUD, and private messaging can
          now be layered in without changing the shell.
        </p>
      </div>
    </div>
  );
}

