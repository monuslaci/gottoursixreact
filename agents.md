# Agents

## Working Rules
Always follow this order:
1. Read the markdown documentation files first
2. Review the existing plan
3. Only then start implementation

The markdown files are the source of truth for project intent. Before making code changes, always check `architecture.md` and this file again so work stays aligned with the agreed direction.

## Agent Responsibilities
When working in this repository, an agent should:
- Understand the product goal before editing code
- Keep changes consistent with the architecture document
- Make small, traceable changes instead of broad rewrites
- Preserve user and admin safety requirements
- Prefer implementation choices that are easy to maintain and test

## Expected Behavior
Agents should:
- Read the docs before planning any technical work
- Confirm assumptions when the scope is unclear
- Avoid starting implementation until the plan is in place
- Update the plan as work progresses
- Verify changes against the documented architecture

## Project Intent
This project is a self-help community platform for men.

Core capabilities:
- Google registration and login
- Topic and subtopic creation
- Topic subscription and participation
- Public discussion in topic spaces
- Private messaging for friendship building
- Full admin visibility for moderation

## Implementation Guidance
Suggested baseline choices:
- React for the client
- TypeScript across the stack
- Node.js for the backend
- PostgreSQL for persistence

Recommended implementation priorities:
1. Authentication
2. User profiles and roles
3. Topics and subscriptions
4. Discussion posts
5. Private messaging
6. Admin visibility and moderation

## Notes For Future Agents
If a future task conflicts with these docs, treat the docs as the default reference and ask for clarification before changing scope.

## Production Hosting Context
Do not forget the production deployment ownership:
- GoDaddy owns the domain registration.
- Cloudflare manages DNS.
- Railway hosts the Next.js app.
- Production URL: `https://www.gotyoursix.club/`
- Working Railway URL: `https://gottoursixreact-production.up.railway.app/`

For production domain issues, check this path first:
1. GoDaddy nameservers must point to Cloudflare.
2. Cloudflare DNS must contain the Railway-provided records for `www.gotyoursix.club`.
3. The Railway custom domain should be added and verified on the app service.
4. During initial setup, the Cloudflare `www` CNAME should usually be DNS only, not proxied.
5. The Railway custom domain target port must match the working Railway domain target port. The app currently works on Railway port `8080`, so `www.gotyoursix.club` should target port `8080`, not `3000`.
6. If the Cloudflare `www` record is proxied, Cloudflare SSL/TLS mode should be `Full` and Universal SSL should be enabled.
7. Railway variables should include `NEXTAUTH_URL=https://www.gotyoursix.club` and `NEXT_PUBLIC_SITE_URL=https://www.gotyoursix.club`.
8. Google OAuth should allow `https://www.gotyoursix.club/api/auth/google/callback`.

A Cloudflare 502 on the production URL usually points to an origin-side problem: Railway domain verification, service health, app crash, wrong DNS target, wrong Railway target port, Cloudflare proxy mode, or HTTPS/origin configuration.


## Project context
- This repository is a web application built with **Next.js**, **TypeScript**, **HeroUI**, **PostgreSQL**, and **Prisma**.- The app uses the Next.js **App Router** with the `app/` directory.- New **API routes** should be created under `app/api/<route>/route.ts`.- New **pages** and **layouts** should follow the existing structure under `app/`.- Reusable React components live in the `components/` folder.- Services, utilities, and non-UI logic belong in the `lib/` folder.- Database models are defined in `prisma/schema.prisma`, with migrations in `prisma/migrations/`.
## General coding guidelines
- Use **TypeScript** for all new code (`.ts` / `.tsx`).- Follow the existing folder structure:  - New UI elements → `components/` (or appropriate subfolder).  - New services / business logic → `lib/`.- Prefer **small, focused components** and functions over large, monolithic ones.- Do not introduce new libraries or dependencies unless clearly necessary; prefer existing utilities and patterns in this repo.- Follow existing naming conventions:  - **PascalCase** for React components.  - **camelCase** for variables, functions, and hooks.  - **UPPER_SNAKE_CASE** for environment variables.
## Frontend / UI conventions
- Prefer **[HeroUI](https://www.heroui.com/)** components and existing shared components under `components/` over raw HTML where reasonable.- Use HeroUI as the **primary design system and base UI** for new components and pages.- When designing more advanced or “fancy” components (hero sections, navbars, cards, interactive layouts), you may **take inspiration** from:  - **Aceternity UI** – <https://ui.aceternity.com>  - **Magic UI** – <https://magicui.design/>  - **SmoothUI** – <https://smoothui.dev/>- When using these for inspiration:  - **Only consider free components** and patterns. Do **not** rely on paid/premium-only components or features.  - Do **not** add these libraries as new dependencies unless they are already part of the project.  - Adapt their layouts, interactions, and styles into our stack using **HeroUI + Tailwind + Framer Motion** and existing utilities.- **Do not** use `window.alert` or `window.confirm`.  - Instead, use the shared modal components from `components/common/common-modals.tsx` (or existing common modal utilities).- For loading states:  - Prefer **loading indicators for individual items inside containers** (e.g. skeletons for titles, stats, table rows, or sections) instead of turning the entire card/container into a skeleton.  - The **container (card, section, page frame)** should render immediately so the layout feels responsive, while individual values or sub-sections show skeletons or placeholders until their data is ready.  - Let different parts of the UI **resolve independently**: do not block the whole container waiting for all data to load if some values are already available.  - Use **HeroUI Skeleton** components (or existing loading patterns) rather than basic spinners or plain “Loading…” text.- For icons, **use `lucide-react`**:  - Prefer Lucide icons instead of creating custom SVGs/icons, unless there is a very specific design requirement.- Aim for a **modern, clean, and slick** UI:  - Keep layouts uncluttered.  - Use consistent spacing and typography.  - Ensure components are responsive and work well on both desktop and mobile.
## Animations (Framer Motion)
- Use **Framer Motion** for animations by default on **most new UI elements**, especially when:  - Elements enter/exit the viewport.  - Components open/close (modals, drawers, dropdowns, toasts).  - Buttons, cards, or sections benefit from subtle hover/press or reveal effects.- Animations should be:  - **Subtle, smooth, and performant**.  - Not excessive, distracting, or likely to lag the page.- Prefer:  - Small opacity/translate transitions.  - Lightweight hover/press effects.  - Section-level or component-level motion, not every single DOM node.- Avoid:  - Overly long or complex animations.  - Excessive motion that makes the page feel “noisy” or annoying.
## Charts & dashboards (Nivo)
- For any **charts, metrics, or dashboard-style visualizations**, use **Nivo** as the charting library (https://github.com/plouc/nivo)- Create chart-related components under `components/charts/` (or an equivalent charts subfolder).- Wrap charts inside **HeroUI-based layout components** (cards, grids, etc.) so the chart area matches the rest of the UI.- Always include a **clean, modern legend** for new charts:  - Make legends **clear but minimal** (no clutter, no huge blocks of text).  - Align legend styling with the dashboard look (consistent font size, spacing, and colors).  - Prefer compact legends positioned near the chart (top/right/bottom) rather than separate, noisy sections.- Use a **sleek, modern dashboard feel**:  - Limited but consistent color palette across charts.  - Avoid overly bright or clashing colors.  - Ensure charts are responsive and look good at typical dashboard sizes.- When appropriate, use **Framer Motion** for subtle chart container animations (e.g. fade/slide in when the card appears), but **do not** animate every data point or make the chart distracting.
## Data fetching and API usage
- Use the Next.js **App Router** with API routes under `app/api/<route>/route.ts`.- When creating new pages, forms, or buttons that trigger actions (create/update/delete, etc.), also **create or reuse the corresponding API route and wire it up**. Avoid leaving UI actions as placeholders or `console.log` only.- Keep API handlers thin and delegate business logic to reusable modules in `lib/`.- Always handle errors explicitly in API routes:  - Return appropriate HTTP status codes.  - Include clear error messages in JSON responses.
## Database & Prisma
- Use **Prisma** for all database access.- Reuse the shared Prisma client (for example from `lib/prisma` or the existing pattern in this repo) instead of creating new instances.- When adding or changing models:  - Update `prisma/schema.prisma`.  - Generate and apply proper migrations under `prisma/migrations/`.- Keep Prisma queries in service/helper layers (e.g. `lib/...`) rather than directly inside React components.
## Error handling, logging, and UX
- Fail gracefully: show user-friendly error states instead of raw error messages or stack traces.- Whenever an operation may take noticeable time:  - Show a clear loading state (HeroUI Skeleton, button loading state, or similar).- Avoid blocking the UI without feedback or progress indication.
## Testing & maintainability
- When adding complex logic or critical flows, consider adding tests consistent with the existing testing setup (unit or integration).- Prefer clear, self-documenting code over excessive comments, but add brief comments where intent may not be obvious.- Keep new files and components consistent with the patterns already used in `components/`, `lib/`, and `prisma/`.
## Environment variables & secrets
- Use **`.env.example`** as the **only** reference file for environment variables in this project.  - When adding new environment variables, update `.env.example` with the variable names and placeholder values.- Treat all real environment files as **private and sensitive**:  - `.env.local`  - `.env.development`  - `.env.production`  - `.env.*` (any other env-specific files)- Do **not**:  - Read from, reference, or show the contents of `.env.local`, `.env.development`, `.env.production`, or any other real env files in code examples, comments, or documentation.  - Suggest committing these files or including their contents in logs, errors, or UI.- In code, always access configuration via `process.env.<VAR_NAME>` (or the appropriate Next.js configuration helpers), **never** by hardcoding secrets.- Do not log secrets or full environment variable values (only log safe, non-sensitive metadata where needed).

### Theme Integration

- **Tailwind Config** (`tailwind.config.js`) - Available as utility classes
- **Global CSS** (`styles/globals.css`) - CSS custom properties
- **HeroUI Theme** - Overrides primary colors
- **Dark/Light Mode** - Consistent across both themes

- 🎭 **Dark/Light Mode**: Seamless theme switching
- 📱 **Fully Responsive**: Mobile-first design approach

##  Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/auth/            # NextAuth.js API routes
│   ├── demo/                # Demo business application
│   ├── layout.tsx           # Root layout with auth provider
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── ui/                 # UI library components
│   └── navbar.tsx          # Navigation with auth integration
├── lib/                    # Utility libraries
│   ├── auth.ts            # NextAuth.js configuration
│   └── prisma.ts          # Database client
├── prisma/                # Database schema and migrations
│   └── schema.prisma      # User and auth schemas
├── scripts/               # Development scripts
│   └── dev-podman.ps1     # Podman HTTPS development script
├── types/                 # TypeScript definitions
│   └── next-auth.d.ts     # NextAuth.js type extensions
├── podman-compose.dev.yml # Development Podman services
└── .env.local.example     # Environment variables template
```
