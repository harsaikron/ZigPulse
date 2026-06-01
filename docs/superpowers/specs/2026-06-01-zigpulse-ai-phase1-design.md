# Zig Pulse AI — Phase 1: Foundation & Command Centre
## Design Specification

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement this spec task-by-task.

**Goal:** Transform the existing ZigPulse taxi operations dashboard into the foundational layer of Zig Pulse AI — an AI-powered Opportunity Detection & Marketing Intelligence Platform for ComfortDelGro Singapore.

**Phase 1 scope:** New design system, full-stack monorepo architecture, 10-item navigation shell, and a fully functional Command Centre page powered by a NestJS backend with PostgreSQL and seeded mock opportunity data.

**Architecture:** Next.js 16 frontend + NestJS backend (monorepo) + PostgreSQL database + Opportunity Scoring Engine (mock data in Phase 1, real API ingestion in Phase 2).

**Tech Stack:** Next.js 16, NestJS, PostgreSQL, Prisma ORM, Tailwind CSS v4, Framer Motion, next-themes, Recharts, Claude SDK, shadcn/ui, TypeScript (shared types package), Inter font.

---

## 1. Repository Structure

Convert the existing ZigPulse flat repo into a monorepo:

```
zigpulse/
  apps/
    web/                    ← existing Next.js frontend (moved)
      app/
        layout.tsx
        page.tsx            ← Command Centre (full rebuild)
        globals.css         ← new design tokens
        opportunity-feed/page.tsx
        events/page.tsx
        weather-intelligence/page.tsx
        transport/page.tsx
        campaign-studio/page.tsx
        creative-studio/page.tsx
        calendar/page.tsx
        analytics/page.tsx
        settings/page.tsx
      components/
        layout/
          Sidebar.tsx       ← full rebuild (10-item nav)
          TopBar.tsx        ← rebuild (theme toggle, search, notifications)
        command-centre/
          OpportunityScore.tsx
          ActiveOpportunities.tsx
          HighestImpact.tsx
          UpcomingEvents.tsx
          WeatherStrip.tsx
          TransportAlerts.tsx
          AIRecommendations.tsx
        ui/                 ← keep existing shadcn components
      lib/
        api.ts              ← typed fetch helpers for backend REST
        hooks/
          useCommandCentre.ts
          useOpportunities.ts
      public/
        brand/
          zig-icon.png      ← real PNG (user provides)
          zig-wordmark.png  ← real PNG (user provides)

    api/                    ← new NestJS backend
      src/
        app.module.ts
        main.ts
        modules/
          opportunities/
            opportunities.module.ts
            opportunities.controller.ts
            opportunities.service.ts
            dto/opportunity.dto.ts
          command-centre/
            command-centre.module.ts
            command-centre.controller.ts
            command-centre.service.ts
          events/
            events.module.ts
            events.service.ts
          weather/
            weather.module.ts
            weather.service.ts
          transport/
            transport.module.ts
            transport.service.ts
          seed/
            seed.module.ts
            seed.service.ts  ← realistic mock data seeder
        prisma/
          schema.prisma
          migrations/

  packages/
    shared/                 ← shared TypeScript types
      src/
        types/
          opportunity.ts
          event.ts
          weather.ts
          transport.ts
          command-centre.ts
        index.ts

  package.json              ← root (workspaces)
  turbo.json                ← Turborepo build orchestration
```

**Removed from existing codebase:**
- `app/demand/`, `app/events/`, `app/heatmap/`, `app/weather/`, `app/profit/`, `app/marketing/`
- `components/tiles/`, `components/charts/` (all), `components/marketing/`
- `lib/mock/` (replaced by backend seed data)
- All SSE API routes (`app/api/stream/`)

---

## 2. Full-Stack Architecture

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND  Next.js 16 (apps/web)                    │
│  - Polls GET /api/* every 60s                       │
│  - Skeleton loaders + error boundaries              │
│  - next-themes for dark/light/system                │
└─────────────────────┬───────────────────────────────┘
                       │ HTTP REST (JSON)
┌─────────────────────▼───────────────────────────────┐
│  BACKEND  NestJS (apps/api) — port 4000             │
│                                                      │
│  Modules:                                            │
│  ├── OpportunitiesModule  (CRUD + scoring)          │
│  ├── CommandCentreModule  (summary aggregation)     │
│  ├── EventsModule                                   │
│  ├── WeatherModule                                  │
│  ├── TransportModule                               │
│  └── SeedModule  (mock data on startup)             │
└─────────────────────┬───────────────────────────────┘
                       │ Prisma ORM
┌─────────────────────▼───────────────────────────────┐
│  DATABASE  PostgreSQL                                │
│  Tables: opportunities, events, weather_snapshots,  │
│          transport_alerts, holidays, ai_recs        │
└─────────────────────────────────────────────────────┘
```

**REST API endpoints (Phase 1):**

| Method | Path | Returns |
|--------|------|---------|
| GET | `/command-centre/summary` | `CommandCentreSummary` |
| GET | `/opportunities` | `Opportunity[]` (paginated) |
| GET | `/opportunities/:id` | `Opportunity` |
| GET | `/events` | `Event[]` |
| GET | `/weather/current` | `WeatherSummary` |
| GET | `/transport/alerts` | `TransportAlert[]` |

**CORS:** Backend allows `http://localhost:3000` in dev, configured via env var in prod.

---

## 3. Database Schema (Prisma)

```prisma
model Opportunity {
  id               String   @id @default(cuid())
  type             OpportunityType
  title            String
  severity         Severity
  score            Int      // 0–100
  confidence       Int      // 0–100
  reasons          String[] // array of reason strings
  suggestedCampaign String
  potentialReach   Int
  location         String?
  startDate        DateTime?
  expiresAt        DateTime
  createdAt        DateTime @default(now())
  dismissed        Boolean  @default(false)
}

enum OpportunityType { WEATHER EVENT TRANSPORT HOLIDAY }
enum Severity        { LOW MEDIUM HIGH CRITICAL }

model Event {
  id               String   @id @default(cuid())
  name             String
  venue            String
  zone             String
  category         String
  startDate        DateTime
  attendanceEst    Int
  opportunityScore Int
  source           String
  createdAt        DateTime @default(now())
}

model WeatherSnapshot {
  id               String   @id @default(cuid())
  date             DateTime
  condition        String
  high             Int
  low              Int
  rainProb         Int
  elNinoConfidence Int
  demandUplift     Int
  createdAt        DateTime @default(now())
}

model TransportAlert {
  id               String   @id @default(cuid())
  type             String   // MRT_DISRUPTION | ROAD_CLOSURE | MAINTENANCE
  severity         Severity
  affectedLine     String?
  affectedRoad     String?
  description      String
  demandUplift     Int
  startTime        DateTime
  endTime          DateTime?
  source           String
  createdAt        DateTime @default(now())
}

model AIRecommendation {
  id               String   @id @default(cuid())
  title            String
  reason           String
  campaignType     String
  opportunityId    String?
  createdAt        DateTime @default(now())
}
```

---

## 4. Opportunity Scoring Formula

```
OpportunityScore (0–100) =
  EventScore    (0–40)  × weight
  + WeatherScore  (0–25)  × weight
  + TransportScore(0–20)  × weight
  + HolidayScore  (0–15)  × weight

EventScore:
  base = attendanceEst / 1000 (capped at 20)
  + category bonus: Concert +10, Festival +8, Sports +6, Exhibition +4
  + proximity bonus (days until): ≤3d +10, ≤7d +7, ≤14d +4

WeatherScore:
  rainProb ≥ 80% → 25
  rainProb 60–79% → 18
  rainProb 40–59% → 10
  elNinoConfidence ≥ 70% → +5 bonus

TransportScore:
  MRT disruption (CRITICAL) → 20
  MRT disruption (HIGH) → 14
  Road closure major → 10
  Maintenance scheduled → 7

HolidayScore:
  Public holiday → 15
  School holiday → 10
  Long weekend → 12

Severity classification:
  score ≥ 85 → CRITICAL
  score ≥ 65 → HIGH
  score ≥ 45 → MEDIUM
  score < 45 → LOW
```

---

## 5. Design System

### Colour Tokens (CSS Variables)

```css
/* Light Mode */
--color-bg:          #F8FAFC;
--color-surface:     #FFFFFF;
--color-surface-2:   #F1F5F9;
--color-border:      #E2E8F0;
--color-text-1:      #0F172A;
--color-text-2:      #64748B;
--color-text-3:      #94A3B8;

/* Dark Mode */
--color-bg:          #060C18;
--color-surface:     #0D1526;
--color-surface-2:   #152033;
--color-border:      #1E2D42;
--color-text-1:      #F0F6FF;
--color-text-2:      #8BA3C4;
--color-text-3:      #4A6580;

/* Brand (both modes) */
--color-primary:     #0367FC;
--color-primary-dim: rgba(3,103,252,0.10);
--color-success:     #00C853;
--color-warning:     #FFB300;
--color-danger:      #FF5252;
--color-ai:          #7C3AED;
--color-ai-dim:      rgba(124,58,237,0.10);
```

### Opportunity Severity Colours
```
CRITICAL  → #FF5252 (danger red)
HIGH      → #FFB300 (warning amber)
MEDIUM    → #0367FC (primary blue)
LOW       → #00C853 (success green)
```

### Typography (Inter)
```
Display:  48px / 900  — Opportunity Score number
H1:       32px / 800  — Page titles
H2:       20px / 700  — Section headings
H3:       16px / 600  — Card titles
Body:     14px / 400  — Default text
Caption:  12px / 500  — Labels, badges
```

### Spacing: 8px grid — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px
### Border radius: 8px (pills) → 12px (buttons) → 16px (cards) → 24px (panels)

### Theme: `next-themes` with `defaultTheme="system"`, `attribute="class"`

---

## 6. Sidebar Navigation

**10 items across 3 grouped sections:**

```
INTELLIGENCE
  ⚡ Command Centre      /
  🔮 Opportunity Feed   /opportunity-feed
  📅 Upcoming Events    /events
  ☁️  Weather Intel     /weather-intelligence
  🚇 Transport Intel    /transport

STUDIO
  📣 Campaign Studio    /campaign-studio
  🎨 Creative Studio    /creative-studio
  📆 Opportunity Cal.   /calendar

INSIGHTS
  📊 Analytics          /analytics
  ⚙️  Settings          /settings
```

**Behaviour:**
- Width: 260px expanded / 64px collapsed (icon-only), 300ms ease transition
- Active item: `--color-primary` bg pill, white text, yellow dot `#F5C400` trailing
- Inactive: `text-2` colour, hover → `surface-2` bg + primary icon
- Section labels hidden when collapsed, shown as tooltips on hover
- Live unread badge on Opportunity Feed (red dot)
- Logo: `public/brand/zig-icon.png` (36×36) + "ZigPulse" text + purple "AI" superscript badge
- Footer: CDG user card + collapse toggle

---

## 7. TopBar

```
[zig-wordmark.png]  [Page Title]          [⌘K]  [🔔 3]  [◐]  [avatar]
```

- Sticky, `z-30`, `backdrop-blur-md` (dark mode), clean white border (light)
- **⌘K:** Command palette trigger (empty modal Phase 1)
- **🔔:** Notification bell with unread count badge
- **◐:** Theme toggle cycling light → dark → system, icon changes per mode
- **LIVE dot:** Green pulsing indicator (shown only when backend is reachable)
- Real PNG wordmark `public/brand/zig-wordmark.png` via `next/image`

---

## 8. Command Centre Page Layout

### Zone A — Hero Row (2 columns)

**OpportunityScore** (left, ~35% width):
- Animated SVG ring gauge, `stroke-dashoffset` transition on mount
- Score counts up from 0 → value (spring, 1200ms)
- Ring colour: green → amber → red (threshold-based)
- Label: "Singapore Opportunity Index"
- Last updated timestamp

**ActiveOpportunities** (right, ~65% width):
- Count: "12 Active Opportunities"
- Pill grid: each pill = icon + label + severity colour dot
- Hover expands pill to show score
- Click navigates to `/opportunity-feed` filtered by type

### Zone B — Highest Impact (full width)

- Gradient left border (severity colour)
- `CRITICAL` badge + event name (H2) + score ring (small, inline)
- Venue + live countdown timer (days/hrs/mins)
- `Potential Reach` metric
- `Generate Campaign →` CTA → navigates to `/campaign-studio?opportunity=:id`

### Zone C — 3-column grid

**UpcomingEvents:**
- Top 5 events, each with live countdown, crowd size, opportunity score chip
- `Generate Assets` micro-button appears on hover

**WeatherStrip:**
- 7-day compact forecast row
- Rain probability bar per day
- Today highlighted in primary blue
- Days with rain >70%: amber border warning

**TransportAlerts:**
- Card list: severity badge, affected line, disruption description
- Marketing opportunity text per alert
- `Generate Campaign` inline CTA

### Zone D — AI Recommendations (full width, horizontal scroll)

- 3+ cards in a scrollable row
- Each: AI spark icon (purple), action title, reason sentence, `Generate` CTA
- "AI thinking" shimmer state on initial load (800ms)
- Staggered entrance: 80ms delay between cards (Framer Motion)

---

## 9. Stub Pages (9 pages, empty state)

Each non-Command-Centre page shows:
- Correct TopBar title
- Centred empty state illustration (Lucide icon, large)
- "Coming in Phase 2" subtitle
- `Generate Campaign` or relevant CTA button (disabled, greyed)

---

## 10. Brand Assets

```
public/brand/zig-icon.png      ← blue square "zig" logo (36×36 in sidebar)
public/brand/zig-wordmark.png  ← "Time to zig" full lockup (topbar)
```

Use `next/image` with `priority` on both. User places real PNG files in this folder — no SVG recreation. The existing `public/zig-logo-icon.svg` and `public/zig-logo-wordmark.svg` are deleted.

---

## 11. Seeded Mock Opportunities (10 records)

| Title | Type | Score | Severity |
|-------|------|-------|----------|
| Taylor Swift Eras Tour | EVENT | 94 | CRITICAL |
| F1 Singapore Grand Prix | EVENT | 91 | CRITICAL |
| Heavy Rain Forecast Tomorrow | WEATHER | 78 | HIGH |
| Airport Surge — Long Weekend | EVENT | 74 | HIGH |
| Thunderstorm Alert — CBD | WEATHER | 76 | HIGH |
| EW Line Maintenance Saturday | TRANSPORT | 71 | HIGH |
| National Day Long Weekend | HOLIDAY | 65 | HIGH |
| Singapore Food Festival | EVENT | 58 | MEDIUM |
| School Holidays June | HOLIDAY | 62 | MEDIUM |
| IT Show @ Expo | EVENT | 44 | LOW |

---

## 12. Environment Variables

```bash
# apps/api/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/zigpulse
PORT=4000
NODE_ENV=development

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
ANTHROPIC_API_KEY=sk-ant-...        ← kept from existing setup
```

---

## 13. What Is NOT in Phase 1

The following are explicitly deferred to Phase 2+:

- Real Eventbrite / LTA / Weather API ingestion (agents are scaffolded, not wired)
- Command palette functionality (⌘K opens empty modal only)
- Campaign generation from Command Centre (button navigates, Studio is stub)
- Creative Studio (image generation)
- Opportunity Calendar
- Analytics tracking
- Push notifications / email campaigns
- User authentication / multi-tenant

---

## 14. Definition of Done — Phase 1

- [ ] Monorepo structure with `apps/web` and `apps/api` builds cleanly
- [ ] PostgreSQL schema migrated, seed data loaded
- [ ] All 6 NestJS endpoints return correct mock data
- [ ] `GET /command-centre/summary` returns full `CommandCentreSummary`
- [ ] Next.js frontend fetches from backend (no hardcoded mock in frontend)
- [ ] Command Centre renders all 7 zones with real data
- [ ] Animated OpportunityScore ring works (both themes)
- [ ] All 9 stub pages render correct empty states
- [ ] Dark/light/system theme works via `next-themes`, no flash on load
- [ ] New sidebar with 10 items, groupings, collapse, active state
- [ ] TopBar with theme toggle, notifications, LIVE indicator
- [ ] `public/brand/` PNG assets used (no SVG fallback)
- [ ] `npm run build` passes for both apps
- [ ] Deployed to Vercel (web) + Railway (api)
