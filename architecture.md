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

## Production Hosting
The production domain and hosting flow is:
- Domain registrar: GoDaddy
- DNS provider: Cloudflare
- App host: Railway
- Production domain: `https://www.gotyoursix.club/`
- Working Railway domain: `https://gottoursixreact-production.up.railway.app/`

The intended path is:
1. GoDaddy owns the domain registration.
2. GoDaddy nameservers point to the two Cloudflare nameservers for the domain.
3. Cloudflare manages DNS records for `gotyoursix.club`.
4. Railway hosts the Next.js app and owns the custom domain target.
5. Cloudflare DNS points `www` to the Railway-provided custom domain target.

Railway custom domain setup:
- Add `www.gotyoursix.club` as a custom domain on the Railway Next.js app service.
- Add the Railway-provided DNS records in Cloudflare exactly as Railway shows them.
- For the initial setup, keep the Cloudflare proxy status as DNS only for the Railway CNAME.
- Add the Railway TXT verification record exactly as Railway shows it.
- After Railway verifies the custom domain and SSL works, Cloudflare proxying can be considered, but DNS only is the safer first state.
- The custom domain target port in Railway must match the port where the deployed app is actually listening. The working Railway-provided domain currently uses port `8080`, so `www.gotyoursix.club` should also target port `8080`, not `3000`.

Cloudflare SSL setup:
- If the `www` record is proxied through Cloudflare, Cloudflare SSL/TLS mode should be `Full`.
- Cloudflare Universal SSL should be enabled so Cloudflare can issue an edge certificate for `www.gotyoursix.club`.
- If the site loads but the browser says it is not secure, check Cloudflare Edge Certificates first, then check for mixed-content warnings in the browser console.

Production environment variables in Railway should include:
- `NEXTAUTH_URL=https://www.gotyoursix.club`
- `NEXT_PUBLIC_SITE_URL=https://www.gotyoursix.club`

Google OAuth production setup:
- Add this authorized redirect URI in Google Cloud Console:
  - `https://www.gotyoursix.club/api/auth/google/callback`
- Keep the Railway temporary redirect URI too if the temporary Railway domain is still used:
  - `https://<railway-app-domain>/api/auth/google/callback`

Troubleshooting notes:
- A Cloudflare 502 for `www.gotyoursix.club` usually means Cloudflare can reach DNS but the origin path is failing, misconfigured, unavailable, or rejecting the request.
- If Cloudflare proxying is enabled during setup, switch the `www` CNAME to DNS only until Railway verifies the domain and serves HTTPS successfully.
- If the Railway-provided domain works but the custom domain returns 502, compare the target ports in Railway Public Networking first.
- If the custom domain loads but HTTPS is marked unsafe, confirm Cloudflare Universal SSL is active for the hostname and that the page is not loading any `http://` assets.
- Check Railway deployment logs, custom domain verification status, and service health before changing app code.
