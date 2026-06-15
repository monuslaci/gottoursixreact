import { Prisma } from "@prisma/client";

import { CommunityError } from "@/lib/community";
import { prisma } from "@/lib/prisma";

export const DEFAULT_PROFILE_EMAIL = "miles.parker@gotyoursix.local";

const USERNAME_FIRST_WORDS = [
  "amber",
  "brave",
  "cedar",
  "clear",
  "cloud",
  "ember",
  "field",
  "flint",
  "forest",
  "gold",
  "harbor",
  "moss",
  "north",
  "oak",
  "quiet",
  "river",
  "rock",
  "silver",
  "stone",
  "summit",
] as const;

const USERNAME_SECOND_WORDS = [
  "badger",
  "beetle",
  "brook",
  "canyon",
  "falcon",
  "finch",
  "forest",
  "harbor",
  "meadow",
  "otter",
  "panda",
  "pine",
  "ridge",
  "robin",
  "sparrow",
  "thicket",
  "trail",
  "willow",
  "wolf",
  "wren",
] as const;

export type ProfileUser = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  image: string | null;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  companyName: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type ProfileTopicSubscription = {
  id: string;
  createdAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
  };
};

export type ProfileSubtopicSubscription = {
  id: string;
  createdAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
  };
  subtopic: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    sortOrder: number;
  };
};

export type ProfilePayload = {
  user: ProfileUser;
  subscriptions: {
    topics: ProfileTopicSubscription[];
    subtopics: ProfileSubtopicSubscription[];
  };
};

export type UpdateProfileInput = {
  userId?: string | null;
  name?: string | null;
  username?: string | null;
  image?: string | null;
  givenName?: string | null;
  surname?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  companyName?: string | null;
  officeLocation?: string | null;
  mobilePhone?: string | null;
};

function normalizeText(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizeUsername(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return null;
  }

  return trimmed
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildGeneratedUsername() {
  const firstWord = pickRandom(USERNAME_FIRST_WORDS);
  const secondWord = pickRandom(USERNAME_SECOND_WORDS);
  const number = Math.floor(Math.random() * 99) + 1;

  return `${firstWord}${secondWord}${number}`;
}

export async function generateUniqueUsername(maxAttempts = 50) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const username = buildGeneratedUsername();
    const existing = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return username;
    }
  }

  throw new CommunityError("Unable to generate a unique username right now.", 503);
}

function mapUser(user: {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  image: string | null;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  companyName: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}): ProfileUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    image: user.image,
    givenName: user.givenName,
    surname: user.surname,
    jobTitle: user.jobTitle,
    department: user.department,
    companyName: user.companyName,
    officeLocation: user.officeLocation,
    mobilePhone: user.mobilePhone,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
  };
}

async function resolveDemoProfileUser(userId?: string | null) {
  if (userId) {
    const userById = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (userById) {
      return userById;
    }
  }

  const userByEmail = await prisma.user.findUnique({
    where: {
      email: DEFAULT_PROFILE_EMAIL,
    },
  });

  if (userByEmail) {
    return userByEmail;
  }

  return prisma.user.create({
    data: {
      name: "Miles Parker",
      username: "miles-parker",
      email: DEFAULT_PROFILE_EMAIL,
      businessPhones: [],
      givenName: "Miles",
      surname: "Parker",
    },
  });
}

async function loadTopicSubscriptions(userId: string) {
  const subscriptions = await prisma.topicSubscription.findMany({
    where: {
      userId,
      topic: {
        deletedAt: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
        },
      },
    },
  });

  return subscriptions.map((subscription) => ({
    id: subscription.id,
    createdAt: subscription.createdAt.toISOString(),
    topic: subscription.topic,
  }));
}

async function loadSubtopicSubscriptions(userId: string) {
  const subscriptions = await prisma.subtopicSubscription.findMany({
    where: {
      userId,
      subtopic: {
        deletedAt: null,
        topic: {
          deletedAt: null,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      subtopic: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          sortOrder: true,
          topic: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  return subscriptions.map((subscription) => ({
    id: subscription.id,
    createdAt: subscription.createdAt.toISOString(),
    topic: subscription.subtopic.topic,
    subtopic: {
      id: subscription.subtopic.id,
      title: subscription.subtopic.title,
      slug: subscription.subtopic.slug,
      description: subscription.subtopic.description,
      sortOrder: subscription.subtopic.sortOrder,
    },
  }));
}

export async function getProfilePayload(userId?: string | null) {
  const user = await resolveDemoProfileUser(userId);
  const [topics, subtopics] = await Promise.all([
    loadTopicSubscriptions(user.id),
    loadSubtopicSubscriptions(user.id),
  ]);

  return {
    user: mapUser(user),
    subscriptions: {
      topics,
      subtopics,
    },
  } satisfies ProfilePayload;
}

export async function updateProfilePayload(input: UpdateProfileInput) {
  const user = await resolveDemoProfileUser(input.userId ?? null);
  const username = normalizeUsername(input.username);

  if (!username) {
    throw new CommunityError("Username is required.", 400);
  }

  const usernameOwner = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (usernameOwner && usernameOwner.id !== user.id) {
    throw new CommunityError("That username is already in use.", 409);
  }

  const data: Prisma.UserUpdateInput = {
    name: normalizeText(input.name),
    username,
    image: normalizeText(input.image),
    givenName: normalizeText(input.givenName),
    surname: normalizeText(input.surname),
    jobTitle: normalizeText(input.jobTitle),
    department: normalizeText(input.department),
    companyName: normalizeText(input.companyName),
    officeLocation: normalizeText(input.officeLocation),
    mobilePhone: normalizeText(input.mobilePhone),
  };

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data,
    });

    return getProfilePayload(updatedUser.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new CommunityError("That username is already in use.", 409);
      }
    }

    throw error;
  }
}
