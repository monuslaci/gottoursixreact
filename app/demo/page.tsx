import { Card, CardBody, Chip, Progress } from "@heroui/react";
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
        <Card className="border border-divider bg-content1">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Demo workspace
              </Chip>
              <Chip variant="flat">Base UI only</Chip>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">
                A place to test the future community flow.
              </h1>
              <p className="max-w-2xl text-sm text-default-600 sm:text-base">
                This screen shows the shell we will build on: topic browsing,
                lightweight status, and a clear path for support-oriented
                features.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <InteractiveHoverButton className="w-full sm:w-auto" type="button">
                Start a topic
              </InteractiveHoverButton>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-divider px-4 py-3 text-sm font-medium transition-colors hover:bg-default-100"
              >
                Back home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-divider bg-content1">
          <CardBody className="gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Readiness</p>
                <p className="text-xs text-default-500">Base implementation</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <AnimatedCircularProgressBar
                value={72}
                gaugePrimaryColor="var(--heroui-colors-primary-500)"
                gaugeSecondaryColor="var(--heroui-colors-default-200)"
                className="size-36 sm:size-40"
              />
            </div>
            <Progress aria-label="Base progress" value={72} className="max-w-full" />
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {demoTopics.map((topic) => (
          <Card key={topic.name} className="border border-divider bg-content1">
            <CardBody className="gap-2 p-5">
              <p className="text-sm font-medium">{topic.name}</p>
              <p className="text-xs text-default-500">{topic.status}</p>
              <p className="text-sm text-default-600">
                Placeholder space for posts, subscriptions, and community cues.
              </p>
            </CardBody>
          </Card>
        ))}
      </section>

      <Card className="border border-divider bg-content1">
        <CardBody className="gap-3 p-5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Next steps</h2>
          </div>
          <p className="text-sm text-default-600">
            Authentication, role handling, topic CRUD, and private messaging can
            now be layered in without changing the shell.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

