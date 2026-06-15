import { CommunityError } from "@/lib/community";
import { DEFAULT_PROFILE_EMAIL, normalizeUsername } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

export type MessageUser = {
  id: string;
  username: string;
  image: string | null;
};

export type ConversationMessageItem = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  sender: MessageUser | null;
};

export type ConversationListItem = {
  id: string;
  isGroup: boolean;
  title: string;
  preview: string;
  lastMessageAt: string | null;
  updatedAt: string;
  unreadCount: number;
  members: MessageUser[];
  lastMessage: {
    body: string;
    createdAt: string;
    sender: MessageUser | null;
  } | null;
};

export type ConversationDetails = {
  conversation: ConversationListItem;
  messages: ConversationMessageItem[];
};

type IdentityInput = {
  userId?: string | null;
  userEmail?: string | null;
  userUsername?: string | null;
};

function normalizeIdentityValue(value: string | null | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

async function resolveConversationUser(input: IdentityInput) {
  if (input.userId) {
    const userById = await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
      },
    });

    if (userById) {
      return userById;
    }
  }

  const username = normalizeUsername(input.userUsername);

  if (username) {
    const userByUsername = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });

    if (userByUsername) {
      return userByUsername;
    }
  }

  const email = normalizeIdentityValue(input.userEmail);

  if (email) {
    const userByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (userByEmail) {
      return userByEmail;
    }
  }

  const fallbackUser = await prisma.user.findUnique({
    where: {
      email: DEFAULT_PROFILE_EMAIL,
    },
    select: {
      id: true,
    },
  });

  if (fallbackUser) {
    return fallbackUser;
  }

  return prisma.user.create({
    data: {
      username: "miles-parker",
      email: DEFAULT_PROFILE_EMAIL,
      businessPhones: [],
    },
    select: {
      id: true,
    },
  });
}

async function resolveConversationParticipant(input: IdentityInput) {
  const user = await resolveConversationUser(input);
  return user.id;
}

function mapUser(user: {
  id: string;
  username: string;
  image: string | null;
}): MessageUser {
  return {
    id: user.id,
    username: user.username,
    image: user.image,
  };
}

function formatConversationTitle(
  conversation: {
    isGroup: boolean;
    members: Array<{ user: MessageUser }>;
  },
  viewerId: string
) {
  if (conversation.isGroup) {
    const names = conversation.members
      .map(({ user }) => user.username || "Member")
      .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "Group conversation";
  }

  const otherMember = conversation.members.find(({ user }) => user.id !== viewerId);
  return otherMember?.user.username || "Conversation";
}

function countUnreadMessages(
  messages: Array<{
    senderId: string | null;
    createdAt: Date;
  }>,
  viewerId: string,
  lastReadAt: Date | null
) {
  return messages.filter((message) => {
    if (message.senderId === viewerId) {
      return false;
    }

    if (!lastReadAt) {
      return true;
    }

    return message.createdAt > lastReadAt;
  }).length;
}

function mapConversationListItem(
  conversation: {
    id: string;
    isGroup: boolean;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    members: Array<{
      user: MessageUser;
      lastReadAt: Date | null;
    }>;
    messages: Array<{
      id: string;
      body: string;
      createdAt: Date;
      updatedAt: Date;
      senderId: string | null;
      sender: MessageUser | null;
    }>;
  },
  viewerId: string
): ConversationListItem {
  const viewerMembership =
    conversation.members.find(({ user }) => user.id === viewerId) ?? null;
  const sortedMessages = [...conversation.messages].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
  );
  const lastMessage = sortedMessages[0] ?? null;
  const lastReadAt = viewerMembership?.lastReadAt ?? null;

  return {
    id: conversation.id,
    isGroup: conversation.isGroup,
    title: formatConversationTitle(conversation, viewerId),
    preview: lastMessage?.body || "No messages yet.",
    lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
    updatedAt: conversation.updatedAt.toISOString(),
    unreadCount: countUnreadMessages(conversation.messages, viewerId, lastReadAt),
    members: conversation.members.map(({ user }) => user),
    lastMessage: lastMessage
      ? {
          body: lastMessage.body,
          createdAt: lastMessage.createdAt.toISOString(),
          sender: lastMessage.sender,
        }
      : null,
  };
}

function mapConversationMessageItem(message: {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  sender: MessageUser | null;
}): ConversationMessageItem {
  return {
    id: message.id,
    body: message.body,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
    sender: message.sender,
  };
}

async function getConversationMembers(conversationId: string) {
  return prisma.conversationMember.findMany({
    where: {
      conversationId,
    },
    include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
    },
  });
}

async function ensureDirectConversation(
  viewerId: string,
  recipientId: string
) {
  const directConversations = await prisma.conversation.findMany({
    where: {
      isGroup: false,
      members: {
        some: {
          userId: viewerId,
        },
      },
    },
    include: {
      members: true,
    },
  });

  const existing = directConversations.find((conversation) => {
    const memberIds = conversation.members.map((member) => member.userId);

    return memberIds.length === 2 && memberIds.includes(viewerId) && memberIds.includes(recipientId);
  });

  if (existing) {
    return existing;
  }

  return prisma.conversation.create({
    data: {
      createdById: viewerId,
      isGroup: false,
      members: {
        create: [
          {
            userId: viewerId,
          },
          {
            userId: recipientId,
          },
        ],
      },
    },
  });
}

export async function listConversations(identity: IdentityInput) {
  const viewerId = await resolveConversationParticipant(identity);
  const memberships = await prisma.conversationMember.findMany({
    where: {
      userId: viewerId,
    },
    include: {
      conversation: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 20,
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const conversations = memberships
    .sort(
      (left, right) =>
        right.conversation.updatedAt.getTime() - left.conversation.updatedAt.getTime()
    )
    .map((membership) =>
    mapConversationListItem(
      {
        ...membership.conversation,
        members: membership.conversation.members.map((member) => ({
          ...member,
          user: member.user,
        })),
      },
      viewerId
    )
  );

  const unreadCount = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0
  );

  return {
    userId: viewerId,
    unreadCount,
    conversations,
  };
}

export async function createOrOpenConversation(input: {
  userId?: string | null;
  userEmail?: string | null;
  recipientId?: string | null;
  recipientEmail?: string | null;
  recipientUsername?: string | null;
  body?: string | null;
}) {
  const viewerId = await resolveConversationParticipant({
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
  });

  let recipientId = input.recipientId ?? null;

  if (!recipientId && input.recipientUsername) {
    const username = normalizeUsername(input.recipientUsername);

    if (username) {
      const recipient = await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });

      recipientId = recipient?.id ?? null;
    }
  }

  if (!recipientId && input.recipientEmail) {
    const recipient = await prisma.user.findUnique({
      where: {
        email: input.recipientEmail.trim().toLowerCase(),
      },
      select: {
        id: true,
      },
    });

    recipientId = recipient?.id ?? null;
  }

  if (!recipientId) {
    throw new CommunityError("Recipient not found.", 404);
  }

  if (recipientId === viewerId) {
    throw new CommunityError("You cannot message yourself.", 400);
  }

  const existingRecipient = await prisma.user.findUnique({
    where: {
      id: recipientId,
    },
    select: {
      id: true,
    },
  });

  if (!existingRecipient) {
    throw new CommunityError("Recipient not found.", 404);
  }

  const conversation = await ensureDirectConversation(viewerId, recipientId);

  const body = input.body?.trim();

  if (body) {
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: viewerId,
        body,
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        lastMessageAt: new Date(),
      },
    });
  }

  const memberships = await getConversationMembers(conversation.id);
  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  return {
    conversation: mapConversationListItem(
      {
        ...conversation,
        members: memberships.map((membership) => ({
          ...membership,
          user: membership.user,
        })),
        messages,
      },
      viewerId
    ),
    unreadCount: 0,
  };
}

export async function getConversationMessages(
  conversationId: string,
  identity: IdentityInput
) {
  const viewerId = await resolveConversationParticipant(identity);

  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: viewerId,
      },
    },
  });

  if (!membership) {
    throw new CommunityError("Conversation not found.", 404);
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
            id: true,
            username: true,
            image: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
            id: true,
            username: true,
            image: true,
            },
          },
        },
      },
    },
  });

  if (!conversation) {
    throw new CommunityError("Conversation not found.", 404);
  }

  const mappedConversation = mapConversationListItem(conversation, viewerId);

  await prisma.conversationMember.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId: viewerId,
      },
    },
    data: {
      lastReadAt: new Date(),
    },
  });

  return {
    conversation: mappedConversation,
    messages: conversation.messages.map(mapConversationMessageItem),
  } satisfies ConversationDetails;
}

export async function sendConversationMessage(
  conversationId: string,
  input: {
    userId?: string | null;
    userEmail?: string | null;
    body?: string | null;
  }
) {
  const viewerId = await resolveConversationParticipant({
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
  });

  const membership = await prisma.conversationMember.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: viewerId,
      },
    },
  });

  if (!membership) {
    throw new CommunityError("Conversation not found.", 404);
  }

  const body = input.body?.trim();

  if (!body) {
    throw new CommunityError("Message body is required.", 400);
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: viewerId,
      body,
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  });

  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      lastMessageAt: new Date(),
    },
  });

  return mapConversationMessageItem(message);
}

export async function getUnreadConversationCount(identity: IdentityInput) {
  const { unreadCount } = await listConversations(identity);
  return unreadCount;
}
