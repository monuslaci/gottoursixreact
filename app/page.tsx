import { Card, CardBody, Chip } from "@heroui/react";
import { ArrowRight, MessageSquare, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-6 rounded-2xl border border-divider bg-content1 p-5 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="flat">
              Mobile first
            </Chip>
            <Chip color="secondary" variant="flat">
              Light and dark
            </Chip>
            <Chip variant="flat">Base ready</Chip>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Six is the base for a men&apos;s support community.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
              This shell is built for topics, subscriptions, discussion, and
              private conversations. It is intentionally simple now so we can
              grow the product without fighting the foundation later.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open demo
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#base"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-divider px-4 text-sm font-medium text-foreground transition-colors hover:bg-default-100"
            >
              View base
            </Link>
          </div>
        </div>

        <Card id="base" className="border border-divider bg-background/80">
          <CardBody className="gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Community base</p>
                <p className="text-xs text-default-500">
                  Ready for future auth and moderation flows
                </p>
              </div>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-divider p-3">
                <p className="text-default-500">Topics</p>
                <p className="mt-1 font-semibold">Discussion spaces</p>
              </div>
              <div className="rounded-xl border border-divider p-3">
                <p className="text-default-500">Messages</p>
                <p className="mt-1 font-semibold">Private support</p>
              </div>
              <div className="rounded-xl border border-divider p-3">
                <p className="text-default-500">Safety</p>
                <p className="mt-1 font-semibold">Admin visibility</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: <Shield className="h-5 w-5" />,
            title: "Safety first",
            text: "The structure leaves room for moderation and full admin visibility.",
          },
          {
            icon: <MessageSquare className="h-5 w-5" />,
            title: "Conversation ready",
            text: "The base supports public topic spaces and private messages later.",
          },
          {
            icon: <Users className="h-5 w-5" />,
            title: "Built for mobile",
            text: "Layouts stack cleanly and stay readable on smaller screens.",
          },
        ].map((item) => (
          <Card key={item.title} className="border border-divider bg-content1">
            <CardBody className="gap-3 p-5">
              <div className="w-fit rounded-xl bg-default-100 p-3 text-foreground">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="text-sm text-default-600">{item.text}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
}

