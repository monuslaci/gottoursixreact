import type { Metadata } from "next";
import { Avatar, Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowLeft, MessageSquareMore } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicProfilePayload } from "@/lib/profile";
import { buildMetadata } from "@/lib/seo";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type MemberProfilePageProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: MemberProfilePageProps): Promise<Metadata> {
  const profile = await getPublicProfilePayload(params.username);

  if (!profile) {
    return buildMetadata({
      title: "Member not found",
      description: "This member profile could not be found.",
      path: `/members/${params.username}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `@${profile.user.username}`,
    description: `View @${profile.user.username}'s public community profile on Got Your Six.`,
    path: `/members/${params.username}`,
    noIndex: true,
  });
}

export default async function MemberProfilePage({
  params,
}: MemberProfilePageProps) {
  const [profile, currentUser] = await Promise.all([
    getPublicProfilePayload(params.username),
    getCurrentSessionUser(),
  ]);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = currentUser?.id === profile.user.id;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          as={Link}
          href="/topics"
          variant="flat"
          startContent={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <Chip color="primary" variant="flat">
          Member profile
        </Chip>
      </div>

      <Card className="internal-card internal-card--strong">
        <CardBody className="gap-6 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                src={profile.user.image || undefined}
                name={profile.user.username.slice(0, 1).toUpperCase()}
                showFallback
              />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                  Community member
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  @{profile.user.username}
                </h1>
                <p className="text-sm text-default-500">
                  Joined {new Date(profile.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {!isOwnProfile ? (
              <Button
                as={Link}
                href={`/messages?recipientUsername=${encodeURIComponent(profile.user.username)}`}
                isIconOnly
                color="primary"
                aria-label={`Send a message to ${profile.user.username}`}
              >
                <MessageSquareMore className="h-5 w-5" />
              </Button>
            ) : (
              <Button as={Link} href="/profile" variant="flat">
                Edit your profile
              </Button>
            )}
          </div>

          <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
            This member keeps a light public profile. If you want to reach out, use the
            message button to open the messenger and start a private conversation there.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="internal-stat p-3.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                Topic follows
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {profile.counts.topics}
              </p>
            </div>
            <div className="internal-stat p-3.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                Subtopic follows
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {profile.counts.subtopics}
              </p>
            </div>
            <div className="internal-stat p-3.5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                Posts shared
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {profile.counts.posts}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
