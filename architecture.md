# Architecture

## Product Overview
This project is a self-help community application for men to support each other through topics, subtopics, discussion, and private friendship-building.

Core goals:
- Let users register and sign in with Google
- Let users create and join discussion topics
- Let users subscribe to topics and subtopics
- Let users discuss openly in topic spaces
- Let users message each other privately to build friendships
- Let admins view all activity for moderation and safety

## Suggested Stack
- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- Database: MySQL
- Authentication: Google OAuth, with session-based or token-based app auth
- API style: REST for the first version

## High-Level Structure
The application should be split into three logical layers:

1. Client app
   - Renders pages, forms, feeds, topic browsing, messaging UI, and admin screens
   - Handles client-side state, validation, and API calls

2. API server
   - Owns authentication, authorization, business rules, moderation rules, and data access
   - Exposes endpoints for topics, subscriptions, discussions, messaging, and admin actions

3. MySQL persistence layer
   - Stores users, roles, topics, subtopics, subscriptions, posts, messages, and audit data

## Core Domain Model
Primary entities:
- User
- Role
- Topic
- Subtopic
- TopicSubscription
- DiscussionPost
- Conversation
- Message
- Report or moderation flag

Recommended relationships:
- A user can have one or more roles, including admin
- A topic can contain many subtopics
- A user can subscribe to many topics and subtopics
- A topic or subtopic can contain many discussion posts
- A conversation belongs to two or more users
- A conversation contains many messages
- Admins can read all records, including private messages, for moderation

## Key User Flows
### Registration and Login
- User selects Google sign-in
- Google OAuth returns verified identity data
- Backend creates or updates the user record
- App establishes an authenticated session

### Topic Creation and Discovery
- A user creates a topic with title, description, and optional tags
- Users browse topics and subtopics
- Users subscribe to receive updates and participate in discussions

### Discussion
- Users create posts inside topics or subtopics
- Other users reply and continue the conversation
- Topics should support sorting by recent activity and popularity

### Private Messaging
- Users can start a private conversation with another user
- Messages are stored persistently
- Admins can review conversations when required by moderation policy

### Administration
- Admin users can see all topics, discussions, subscriptions, and messages
- Admins can moderate content, manage users, and review reports

## API Surface
Initial endpoint groups:
- `POST /auth/google`
- `GET /me`
- `GET /topics`
- `POST /topics`
- `GET /topics/:id`
- `POST /topics/:id/subscribe`
- `POST /topics/:id/posts`
- `GET /topics/:id/posts`
- `POST /conversations`
- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `GET /admin/users`
- `GET /admin/topics`
- `GET /admin/messages`

## Data Storage Notes
MySQL is a good fit for the relational nature of the app:
- It supports users, roles, subscriptions, and moderation records cleanly
- It handles message history and topic hierarchies well
- It gives predictable querying for admin dashboards and activity feeds

Recommended operational tables:
- `users`
- `roles`
- `user_roles`
- `topics`
- `subtopics`
- `topic_subscriptions`
- `posts`
- `conversations`
- `conversation_members`
- `messages`
- `audit_logs`
- `content_reports`

## Security and Access Control
- Use role-based access control for admin and member permissions
- Protect private messages and admin routes with authenticated middleware
- Sanitize and validate all user-generated content
- Record moderation actions in audit logs
- Consider rate limiting for sign-in, posting, and messaging

## Future-Friendly Choices
The first version should stay simple but leave room for:
- Notifications
- Search across topics and messages
- Rich text or markdown posting
- Reporting and moderation queues
- Mobile-friendly UI and later native apps
- Real-time messaging with WebSockets or SSE if needed

