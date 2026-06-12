"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { Shield, Sparkles, Table2 } from "lucide-react";
import Link from "next/link";

import { TopicsDashboard } from "@/components/topics/topics-dashboard";

export function AdminPageContent() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Chip color="primary" variant="flat">
            Admin
          </Chip>
          <Chip color="secondary" variant="flat">
            Topic tools
          </Chip>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Admin console
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-default-500">
          Use this area for topic management and moderation-adjacent work. The
          creation form lives here so the browse page can stay lighter.
        </p>
      </section>

      <section className="space-y-4">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary/12 p-3 text-secondary">
                <Shield className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Table2 className="h-4 w-4" />
                  Topic administration
                </div>
                <p className="text-sm text-default-500">
                  Create and shape the spaces that appear on the public browse page.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button as={Link} href="/topics" variant="flat">
                View topics
              </Button>
              <Button
                as={Link}
                href="/topics"
                color="primary"
                startContent={<Sparkles className="h-4 w-4" />}
              >
                Review live list
              </Button>
            </div>
          </CardBody>
        </Card>

        <TopicsDashboard />
      </section>
    </div>
  );
}
