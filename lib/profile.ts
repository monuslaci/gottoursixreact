import { Prisma } from "@prisma/client";

import { CommunityError } from "@/lib/community";
import { prisma } from "@/lib/prisma";

const DEFAULT_PROFILE_EMAIL = "miles.parker@six.local";

export type ProfileUser = {
  id: string;
  name: string | null;
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

function mapUser(user: {
  id: string;
  name: string | null;
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

  const data: Prisma.UserUpdateInput = {
    name: normalizeText(input.name),
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
        throw new CommunityError("That profile value is already in use.", 409);
      }
    }

    throw error;
  }
}
