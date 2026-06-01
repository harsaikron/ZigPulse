# Zig Pulse AI Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing ZigPulse flat repo into Zig Pulse AI — a full-stack monorepo with NestJS backend, PostgreSQL, seeded mock opportunities, and a fully functional Command Centre page.

**Architecture:** Existing Next.js 16 app at repo root + new `backend/` directory (NestJS + Prisma + PostgreSQL). Frontend polls backend REST API every 60s. No SSE.

**Tech Stack:** Next.js 16, NestJS, PostgreSQL, Prisma ORM, Tailwind CSS v4, Framer Motion, next-themes, Recharts, shadcn/ui, TypeScript, Inter font, Lucide React.

---

## File Map

**Created:**
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env`
- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/prisma/schema.prisma`
- `backend/prisma/seed.ts`
- `backend/src/modules/opportunities/opportunities.module.ts`
- `backend/src/modules/opportunities/opportunities.controller.ts`
- `backend/src/modules/opportunities/opportunities.service.ts`
- `backend/src/modules/opportunities/dto/opportunity.dto.ts`
- `backend/src/modules/events/events.module.ts`
- `backend/src/modules/events/events.controller.ts`
- `backend/src/modules/events/events.service.ts`
- `backend/src/modules/weather/weather.module.ts`
- `backend/src/modules/weather/weather.controller.ts`
- `backend/src/modules/weather/weather.service.ts`
- `backend/src/modules/transport/transport.module.ts`
- `backend/src/modules/transport/transport.controller.ts`
- `backend/src/modules/transport/transport.service.ts`
- `backend/src/modules/command-centre/command-centre.module.ts`
- `backend/src/modules/command-centre/command-centre.controller.ts`
- `backend/src/modules/command-centre/command-centre.service.ts`
- `lib/types.ts`
- `lib/api.ts`
- `lib/hooks/useCommandCentre.ts`
- `components/layout/Sidebar.tsx`
- `components/layout/TopBar.tsx`
- `components/command-centre/OpportunityScore.tsx`
- `components/command-centre/ActiveOpportunities.tsx`
- `components/command-centre/HighestImpact.tsx`
- `components/command-centre/UpcomingEvents.tsx`
- `components/command-centre/WeatherStrip.tsx`
- `components/command-centre/TransportAlerts.tsx`
- `components/command-centre/AIRecommendations.tsx`
- `app/opportunity-feed/page.tsx`
- `app/weather-intelligence/page.tsx`
- `app/transport/page.tsx`
- `app/campaign-studio/page.tsx`
- `app/creative-studio/page.tsx`
- `app/calendar/page.tsx`
- `app/analytics/page.tsx`
- `app/settings/page.tsx`

**Modified:**
- `app/globals.css` — design tokens
- `app/layout.tsx` — next-themes provider, Inter font
- `app/page.tsx` — Command Centre full rebuild
- `app/events/page.tsx` — stub replacement

**Deleted:**
- `app/demand/`, `app/heatmap/`, `app/weather/`, `app/profit/`, `app/marketing/`
- `app/api/stream/`
- `components/tiles/`, `components/charts/`, `components/marketing/`
- `lib/mock/`
- `hooks/useSSE.js`
- `public/zig-logo-icon.svg`, `public/zig-logo-wordmark.svg`

---

## Task 1: NestJS Backend Scaffold

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/src/main.ts`
- Create: `backend/src/app.module.ts`

- [ ] **Step 1: Create backend directory and package.json**

```bash
mkdir -p /Users/pavithraharsaikron/Downloads/zigpulse/backend/src
```

Write `backend/package.json`:
```json
{
  "name": "zigpulse-api",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@prisma/client": "^5.0.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "prisma": "^5.0.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Write `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

- [ ] **Step 3: Create main.ts**

Write `backend/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Zig Pulse AI API running on port ${port}`);
}
bootstrap();
```

- [ ] **Step 4: Create app.module.ts (stub — will fill modules in later tasks)**

Write `backend/src/app.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { EventsModule } from './modules/events/events.module';
import { WeatherModule } from './modules/weather/weather.module';
import { TransportModule } from './modules/transport/transport.module';
import { CommandCentreModule } from './modules/command-centre/command-centre.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpportunitiesModule,
    EventsModule,
    WeatherModule,
    TransportModule,
    CommandCentreModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 5: Install dependencies**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npm install
```

Expected: `added N packages` with no errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/package.json backend/tsconfig.json backend/src/main.ts backend/src/app.module.ts
git commit -m "feat: scaffold NestJS backend"
```

---

## Task 2: Prisma Schema + PostgreSQL Migration

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/.env`

- [ ] **Step 1: Create .env**

Write `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/zigpulse
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

- [ ] **Step 2: Create Prisma schema**

Write `backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OpportunityType {
  WEATHER
  EVENT
  TRANSPORT
  HOLIDAY
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model Opportunity {
  id                String          @id @default(cuid())
  type              OpportunityType
  title             String
  severity          Severity
  score             Int
  confidence        Int
  reasons           String[]
  suggestedCampaign String
  potentialReach    Int
  location          String?
  startDate         DateTime?
  expiresAt         DateTime
  createdAt         DateTime        @default(now())
  dismissed         Boolean         @default(false)
}

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
  id           String    @id @default(cuid())
  type         String
  severity     Severity
  affectedLine String?
  affectedRoad String?
  description  String
  demandUplift Int
  startTime    DateTime
  endTime      DateTime?
  source       String
  createdAt    DateTime  @default(now())
}

model AIRecommendation {
  id             String   @id @default(cuid())
  title          String
  reason         String
  campaignType   String
  opportunityId  String?
  createdAt      DateTime @default(now())
}
```

- [ ] **Step 3: Ensure PostgreSQL is running and create database**

```bash
psql -U postgres -c "CREATE DATABASE zigpulse;" 2>/dev/null || echo "Database may already exist"
```

Expected: `CREATE DATABASE` or "already exists" message.

- [ ] **Step 4: Run Prisma migration**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npx prisma migrate dev --name init
```

Expected: `✔  Your database is now in sync with your schema.`

- [ ] **Step 5: Generate Prisma client**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npx prisma generate
```

Expected: `✔ Generated Prisma Client`

- [ ] **Step 6: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/prisma/ backend/.env
git commit -m "feat: add Prisma schema and initial migration"
```

---

## Task 3: Seed Data (10 Mock Opportunities + Related Records)

**Files:**
- Create: `backend/prisma/seed.ts`

- [ ] **Step 1: Create seed file**

Write `backend/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.aIRecommendation.deleteMany();
  await prisma.transportAlert.deleteMany();
  await prisma.weatherSnapshot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.opportunity.deleteMany();

  const now = new Date();
  const days = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  // 10 Opportunities
  await prisma.opportunity.createMany({
    data: [
      {
        type: 'EVENT',
        title: 'Taylor Swift Eras Tour',
        severity: 'CRITICAL',
        score: 94,
        confidence: 96,
        reasons: ['120,000 expected attendees', 'National Stadium zone', '3 nights consecutive'],
        suggestedCampaign: 'Concert Surge Pricing Alert',
        potentialReach: 45000,
        location: 'National Stadium, Kallang',
        startDate: days(3),
        expiresAt: days(6),
      },
      {
        type: 'EVENT',
        title: 'F1 Singapore Grand Prix',
        severity: 'CRITICAL',
        score: 91,
        confidence: 95,
        reasons: ['Marina Bay circuit closure', '300,000 weekend attendance', 'International visitors surge'],
        suggestedCampaign: 'F1 Weekend Transfer Package',
        potentialReach: 80000,
        location: 'Marina Bay Street Circuit',
        startDate: days(12),
        expiresAt: days(15),
      },
      {
        type: 'WEATHER',
        title: 'Heavy Rain Forecast Tomorrow',
        severity: 'HIGH',
        score: 78,
        confidence: 84,
        reasons: ['88% rain probability', 'CBD and Orchard affected', 'Demand uplift typically +22%'],
        suggestedCampaign: 'Rainy Day Promo Push',
        potentialReach: 28000,
        location: 'CBD, Orchard, Marina Bay',
        startDate: days(1),
        expiresAt: days(2),
      },
      {
        type: 'EVENT',
        title: 'Airport Surge — Long Weekend',
        severity: 'HIGH',
        score: 74,
        confidence: 88,
        reasons: ['Long weekend departure surge', 'T1/T2/T3 congestion expected', '+40% airport transfers'],
        suggestedCampaign: 'Airport Transfer Priority',
        potentialReach: 22000,
        location: 'Changi Airport',
        startDate: days(2),
        expiresAt: days(4),
      },
      {
        type: 'WEATHER',
        title: 'Thunderstorm Alert — CBD',
        severity: 'HIGH',
        score: 76,
        confidence: 79,
        reasons: ['Thunderstorm warning issued', 'Lunchtime peak overlap', 'MRT disruption risk'],
        suggestedCampaign: 'CBD Afternoon Availability Push',
        potentialReach: 18000,
        location: 'Central Business District',
        startDate: days(0),
        expiresAt: days(1),
      },
      {
        type: 'TRANSPORT',
        title: 'EW Line Maintenance Saturday',
        severity: 'HIGH',
        score: 71,
        confidence: 92,
        reasons: ['EW line partial closure 10pm–6am', 'Jurong–Tampines corridor affected', 'No shuttle bus alternative'],
        suggestedCampaign: 'EW Line Night Replacement Service',
        potentialReach: 15000,
        location: 'East–West Line',
        startDate: days(5),
        expiresAt: days(6),
      },
      {
        type: 'HOLIDAY',
        title: 'National Day Long Weekend',
        severity: 'HIGH',
        score: 65,
        confidence: 100,
        reasons: ['3-day weekend', 'Fireworks at Marina Bay', 'Tourism spike expected'],
        suggestedCampaign: 'National Day Explorer Package',
        potentialReach: 35000,
        location: 'Island-wide',
        startDate: days(8),
        expiresAt: days(11),
      },
      {
        type: 'EVENT',
        title: 'Singapore Food Festival',
        severity: 'MEDIUM',
        score: 58,
        confidence: 72,
        reasons: ['10-day festival at Marina Bay', '50,000 expected visitors', 'Evening peak demand'],
        suggestedCampaign: 'Food Festival Night Rides',
        potentialReach: 12000,
        location: 'Marina Bay Sands',
        startDate: days(4),
        expiresAt: days(14),
      },
      {
        type: 'HOLIDAY',
        title: 'School Holidays June',
        severity: 'MEDIUM',
        score: 62,
        confidence: 100,
        reasons: ['4-week school holiday period', 'Family travel increase', 'Zoo/Sentosa demand up'],
        suggestedCampaign: 'Family Day Out Package',
        potentialReach: 20000,
        location: 'Island-wide',
        startDate: days(0),
        expiresAt: days(28),
      },
      {
        type: 'EVENT',
        title: 'IT Show @ Expo',
        severity: 'LOW',
        score: 44,
        confidence: 65,
        reasons: ['Expo convention centre', '15,000 expected visitors', 'MRT Expo station handles most traffic'],
        suggestedCampaign: 'Expo Connector Promo',
        potentialReach: 4000,
        location: 'Singapore Expo, Changi',
        startDate: days(7),
        expiresAt: days(10),
      },
    ],
  });

  // 5 Upcoming Events
  await prisma.event.createMany({
    data: [
      { name: 'Taylor Swift Eras Tour', venue: 'National Stadium', zone: 'Kallang', category: 'Concert', startDate: days(3), attendanceEst: 55000, opportunityScore: 94, source: 'mock' },
      { name: 'F1 Singapore Grand Prix', venue: 'Marina Bay Circuit', zone: 'Marina Bay', category: 'Sports', startDate: days(12), attendanceEst: 100000, opportunityScore: 91, source: 'mock' },
      { name: 'Singapore Food Festival', venue: 'Marina Bay Sands', zone: 'Marina Bay', category: 'Festival', startDate: days(4), attendanceEst: 8000, opportunityScore: 58, source: 'mock' },
      { name: 'IT Show', venue: 'Singapore Expo', zone: 'Changi', category: 'Exhibition', startDate: days(7), attendanceEst: 4000, opportunityScore: 44, source: 'mock' },
      { name: 'National Day Parade', venue: 'The Float @ Marina Bay', zone: 'Marina Bay', category: 'Festival', startDate: days(8), attendanceEst: 25000, opportunityScore: 65, source: 'mock' },
    ],
  });

  // 7-day Weather Snapshots
  const conditions = ['Partly Cloudy', 'Heavy Rain', 'Thunderstorm', 'Sunny', 'Light Rain', 'Cloudy', 'Partly Cloudy'];
  const rainProbs = [45, 88, 92, 20, 65, 55, 40];
  const highs = [32, 29, 28, 34, 30, 31, 33];
  const lows = [26, 25, 24, 27, 25, 26, 26];
  const uplifts = [5, 22, 28, 0, 12, 8, 4];
  for (let i = 0; i < 7; i++) {
    await prisma.weatherSnapshot.create({
      data: {
        date: days(i),
        condition: conditions[i],
        high: highs[i],
        low: lows[i],
        rainProb: rainProbs[i],
        elNinoConfidence: 72,
        demandUplift: uplifts[i],
      },
    });
  }

  // Transport Alerts
  await prisma.transportAlert.createMany({
    data: [
      {
        type: 'MRT_DISRUPTION',
        severity: 'HIGH',
        affectedLine: 'East West Line',
        description: 'Scheduled maintenance between Jurong East and Tampines, Sat 10pm–6am Sun.',
        demandUplift: 18,
        startTime: days(5),
        endTime: days(6),
        source: 'mock',
      },
      {
        type: 'ROAD_CLOSURE',
        severity: 'MEDIUM',
        affectedRoad: 'Raffles Avenue',
        description: 'F1 circuit preparation — Raffles Ave and Marina Blvd closed to traffic.',
        demandUplift: 12,
        startTime: days(10),
        endTime: days(16),
        source: 'mock',
      },
      {
        type: 'MAINTENANCE',
        severity: 'LOW',
        affectedLine: 'Circle Line',
        description: 'Track inspection works between Buona Vista and one-north 2am–5am.',
        demandUplift: 6,
        startTime: days(2),
        endTime: days(2),
        source: 'mock',
      },
    ],
  });

  // AI Recommendations
  await prisma.aIRecommendation.createMany({
    data: [
      { title: 'Launch Taylor Swift Surge Campaign', reason: 'Concert starts in 3 days — push notifications to Kallang-area users now for maximum conversion.', campaignType: 'PUSH_NOTIFICATION' },
      { title: 'Pre-position Fleet for Rain Tomorrow', reason: '88% rain probability tomorrow means +22% demand spike — alert drivers to CBD and Orchard zones.', campaignType: 'DRIVER_ALERT' },
      { title: 'F1 Transfer Package — Book Early CTA', reason: 'F1 weekend in 12 days — early booking incentive can lock in 8,000+ airport transfers.', campaignType: 'EMAIL_CAMPAIGN' },
      { title: 'School Holiday Family Bundle', reason: 'June school holidays ongoing — families travelling to Sentosa, Zoo, Science Centre show 40% higher LTV.', campaignType: 'IN_APP_PROMO' },
    ],
  });

  console.log('✅ Seed complete');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Add seed script to backend package.json**

Edit `backend/package.json` to add under `"scripts"`:
```json
"seed": "ts-node prisma/seed.ts"
```

And add under `"devDependencies"`:
```json
"ts-node": "^10.9.1"
```

- [ ] **Step 3: Run seed**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npm run seed
```

Expected: `✅ Seed complete`

- [ ] **Step 4: Verify seed data in DB**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npx prisma studio &
```

Open http://localhost:5555 and confirm 10 opportunities, 5 events, 7 weather snapshots, 3 transport alerts, 4 AI recommendations. Kill studio after confirming (`kill %1`).

- [ ] **Step 5: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/prisma/seed.ts backend/package.json
git commit -m "feat: add seed data with 10 mock opportunities"
```

---

## Task 4: NestJS Opportunities Module

**Files:**
- Create: `backend/src/modules/opportunities/opportunities.module.ts`
- Create: `backend/src/modules/opportunities/opportunities.controller.ts`
- Create: `backend/src/modules/opportunities/opportunities.service.ts`
- Create: `backend/src/modules/opportunities/prisma.service.ts`

- [ ] **Step 1: Create PrismaService (shared)**

Write `backend/src/prisma.service.ts`:
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

- [ ] **Step 2: Create OpportunitiesService**

Write `backend/src/modules/opportunities/opportunities.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where: { dismissed: false },
        orderBy: { score: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.opportunity.count({ where: { dismissed: false } }),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    return this.prisma.opportunity.findUnique({ where: { id } });
  }
}
```

- [ ] **Step 3: Create OpportunitiesController**

Write `backend/src/modules/opportunities/opportunities.controller.ts`:
```typescript
import { Controller, Get, Param, Query } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.service.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
```

- [ ] **Step 4: Create OpportunitiesModule**

Write `backend/src/modules/opportunities/opportunities.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService, PrismaService],
  exports: [OpportunitiesService, PrismaService],
})
export class OpportunitiesModule {}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/src/
git commit -m "feat: add OpportunitiesModule with CRUD endpoints"
```

---

## Task 5: NestJS Events, Weather, Transport Modules

**Files:**
- Create: `backend/src/modules/events/events.module.ts`
- Create: `backend/src/modules/events/events.controller.ts`
- Create: `backend/src/modules/events/events.service.ts`
- Create: `backend/src/modules/weather/weather.module.ts`
- Create: `backend/src/modules/weather/weather.controller.ts`
- Create: `backend/src/modules/weather/weather.service.ts`
- Create: `backend/src/modules/transport/transport.module.ts`
- Create: `backend/src/modules/transport/transport.controller.ts`
- Create: `backend/src/modules/transport/transport.service.ts`

- [ ] **Step 1: Create EventsService**

Write `backend/src/modules/events/events.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    });
  }
}
```

- [ ] **Step 2: Create EventsController**

Write `backend/src/modules/events/events.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
```

- [ ] **Step 3: Create EventsModule**

Write `backend/src/modules/events/events.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, PrismaService],
  exports: [EventsService],
})
export class EventsModule {}
```

- [ ] **Step 4: Create WeatherService**

Write `backend/src/modules/weather/weather.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class WeatherService {
  constructor(private prisma: PrismaService) {}

  async getCurrent() {
    const snapshots = await this.prisma.weatherSnapshot.findMany({
      orderBy: { date: 'asc' },
      take: 7,
    });
    const today = snapshots[0] || null;
    return {
      today,
      forecast: snapshots,
      elNinoConfidence: today?.elNinoConfidence ?? 72,
    };
  }
}
```

- [ ] **Step 5: Create WeatherController**

Write `backend/src/modules/weather/weather.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly service: WeatherService) {}

  @Get('current')
  getCurrent() {
    return this.service.getCurrent();
  }
}
```

- [ ] **Step 6: Create WeatherModule**

Write `backend/src/modules/weather/weather.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, PrismaService],
  exports: [WeatherService],
})
export class WeatherModule {}
```

- [ ] **Step 7: Create TransportService**

Write `backend/src/modules/transport/transport.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TransportService {
  constructor(private prisma: PrismaService) {}

  findAlerts() {
    return this.prisma.transportAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
```

- [ ] **Step 8: Create TransportController**

Write `backend/src/modules/transport/transport.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { TransportService } from './transport.service';

@Controller('transport')
export class TransportController {
  constructor(private readonly service: TransportService) {}

  @Get('alerts')
  findAlerts() {
    return this.service.findAlerts();
  }
}
```

- [ ] **Step 9: Create TransportModule**

Write `backend/src/modules/transport/transport.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TransportController],
  providers: [TransportService, PrismaService],
  exports: [TransportService],
})
export class TransportModule {}
```

- [ ] **Step 10: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/src/modules/events/ backend/src/modules/weather/ backend/src/modules/transport/
git commit -m "feat: add Events, Weather, Transport NestJS modules"
```

---

## Task 6: CommandCentre Module (Summary Aggregation)

**Files:**
- Create: `backend/src/modules/command-centre/command-centre.module.ts`
- Create: `backend/src/modules/command-centre/command-centre.controller.ts`
- Create: `backend/src/modules/command-centre/command-centre.service.ts`

- [ ] **Step 1: Create CommandCentreService**

Write `backend/src/modules/command-centre/command-centre.service.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CommandCentreService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [opportunities, events, weatherSnaps, transportAlerts, aiRecs] =
      await Promise.all([
        this.prisma.opportunity.findMany({
          where: { dismissed: false },
          orderBy: { score: 'desc' },
        }),
        this.prisma.event.findMany({
          orderBy: { startDate: 'asc' },
          take: 5,
        }),
        this.prisma.weatherSnapshot.findMany({
          orderBy: { date: 'asc' },
          take: 7,
        }),
        this.prisma.transportAlert.findMany({
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.aIRecommendation.findMany({
          orderBy: { createdAt: 'desc' },
          take: 4,
        }),
      ]);

    // Composite opportunity score = average of top 5 scores
    const top5 = opportunities.slice(0, 5);
    const opportunityScore =
      top5.length > 0
        ? Math.round(top5.reduce((s, o) => s + o.score, 0) / top5.length)
        : 0;

    const today = weatherSnaps[0] || null;
    const weatherSummary = today
      ? {
          today,
          forecast: weatherSnaps,
          elNinoConfidence: today.elNinoConfidence,
        }
      : null;

    return {
      opportunityScore,
      activeOpportunities: opportunities,
      highestImpact: opportunities[0] || null,
      upcomingEvents: events,
      weatherSummary,
      transportAlerts,
      aiRecommendations: aiRecs,
      lastUpdated: new Date().toISOString(),
    };
  }
}
```

- [ ] **Step 2: Create CommandCentreController**

Write `backend/src/modules/command-centre/command-centre.controller.ts`:
```typescript
import { Controller, Get } from '@nestjs/common';
import { CommandCentreService } from './command-centre.service';

@Controller('command-centre')
export class CommandCentreController {
  constructor(private readonly service: CommandCentreService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }
}
```

- [ ] **Step 3: Create CommandCentreModule**

Write `backend/src/modules/command-centre/command-centre.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { CommandCentreController } from './command-centre.controller';
import { CommandCentreService } from './command-centre.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [CommandCentreController],
  providers: [CommandCentreService, PrismaService],
})
export class CommandCentreModule {}
```

- [ ] **Step 4: Start backend and test all endpoints**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npm run start:dev &
sleep 5
curl -s http://localhost:4000/command-centre/summary | python3 -m json.tool | head -40
```

Expected: JSON with `opportunityScore`, `activeOpportunities` array of 10, `highestImpact` object.

```bash
curl -s http://localhost:4000/opportunities | python3 -m json.tool | head -20
curl -s http://localhost:4000/events | python3 -m json.tool | head -20
curl -s http://localhost:4000/weather/current | python3 -m json.tool | head -20
curl -s http://localhost:4000/transport/alerts | python3 -m json.tool | head -20
```

Expected: Each returns valid JSON arrays/objects.

- [ ] **Step 5: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add backend/src/modules/command-centre/
git commit -m "feat: add CommandCentre summary endpoint aggregating all data"
```

---

## Task 7: Frontend — Design Tokens + next-themes Setup

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install next-themes**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse && npm install next-themes
```

Expected: `added 1 package`

- [ ] **Step 2: Rewrite globals.css with design tokens**

Write `app/globals.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    --color-bg: #F8FAFC;
    --color-surface: #FFFFFF;
    --color-surface-2: #F1F5F9;
    --color-border: #E2E8F0;
    --color-text-1: #0F172A;
    --color-text-2: #64748B;
    --color-text-3: #94A3B8;
    --color-primary: #0367FC;
    --color-primary-dim: rgba(3, 103, 252, 0.10);
    --color-success: #00C853;
    --color-warning: #FFB300;
    --color-danger: #FF5252;
    --color-ai: #7C3AED;
    --color-ai-dim: rgba(124, 58, 237, 0.10);
  }

  .dark {
    --color-bg: #060C18;
    --color-surface: #0D1526;
    --color-surface-2: #152033;
    --color-border: #1E2D42;
    --color-text-1: #F0F6FF;
    --color-text-2: #8BA3C4;
    --color-text-3: #4A6580;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text-1);
    font-family: 'Inter', sans-serif;
  }
}
```

- [ ] **Step 3: Rewrite app/layout.tsx with ThemeProvider and Inter font**

Read current `app/layout.tsx` first, then write:
```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zig Pulse AI',
  description: 'AI-powered Opportunity Detection & Marketing Intelligence Platform — ComfortDelGro Singapore',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verify no build errors so far**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` or similar (may fail due to old pages — that's ok, check again after cleanup in Task 11).

- [ ] **Step 5: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add app/globals.css app/layout.tsx package.json package-lock.json
git commit -m "feat: add design tokens, next-themes ThemeProvider, Inter font"
```

---

## Task 8: Shared TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Create lib/types.ts**

Write `lib/types.ts`:
```typescript
export type OpportunityType = 'WEATHER' | 'EVENT' | 'TRANSPORT' | 'HOLIDAY'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Opportunity {
  id: string
  type: OpportunityType
  title: string
  severity: Severity
  score: number
  confidence: number
  reasons: string[]
  suggestedCampaign: string
  potentialReach: number
  location?: string | null
  startDate?: string | null
  expiresAt: string
  createdAt: string
  dismissed: boolean
}

export interface Event {
  id: string
  name: string
  venue: string
  zone: string
  category: string
  startDate: string
  attendanceEst: number
  opportunityScore: number
  source: string
  createdAt: string
}

export interface WeatherDay {
  id: string
  date: string
  condition: string
  high: number
  low: number
  rainProb: number
  elNinoConfidence: number
  demandUplift: number
  createdAt: string
}

export interface WeatherSummary {
  today: WeatherDay | null
  forecast: WeatherDay[]
  elNinoConfidence: number
}

export interface TransportAlert {
  id: string
  type: 'MRT_DISRUPTION' | 'ROAD_CLOSURE' | 'MAINTENANCE'
  severity: Severity
  affectedLine?: string | null
  affectedRoad?: string | null
  description: string
  demandUplift: number
  startTime: string
  endTime?: string | null
  source: string
  createdAt: string
}

export interface AIRecommendation {
  id: string
  title: string
  reason: string
  campaignType: string
  opportunityId?: string | null
  createdAt: string
}

export interface CommandCentreSummary {
  opportunityScore: number
  activeOpportunities: Opportunity[]
  highestImpact: Opportunity | null
  upcomingEvents: Event[]
  weatherSummary: WeatherSummary | null
  transportAlerts: TransportAlert[]
  aiRecommendations: AIRecommendation[]
  lastUpdated: string
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add lib/types.ts
git commit -m "feat: add shared TypeScript types for all data models"
```

---

## Task 9: API Client + useCommandCentre Hook

**Files:**
- Create: `lib/api.ts`
- Create: `lib/hooks/useCommandCentre.ts`

- [ ] **Step 1: Create lib/api.ts**

Write `lib/api.ts`:
```typescript
import type { CommandCentreSummary, Opportunity } from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  getCommandCentreSummary: () => get<CommandCentreSummary>('/command-centre/summary'),
  getOpportunities: (page = 1) => get<{ data: Opportunity[]; total: number }>(`/opportunities?page=${page}`),
  getOpportunity: (id: string) => get<Opportunity>(`/opportunities/${id}`),
}
```

- [ ] **Step 2: Create lib/hooks/useCommandCentre.ts**

```bash
mkdir -p /Users/pavithraharsaikron/Downloads/zigpulse/lib/hooks
```

Write `lib/hooks/useCommandCentre.ts`:
```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import type { CommandCentreSummary } from '../types'

const POLL_INTERVAL = 60_000 // 60 seconds

export function useCommandCentre() {
  const [data, setData] = useState<CommandCentreSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const summary = await api.getCommandCentreSummary()
      setData(summary)
      setIsLive(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      setIsLive(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchData])

  return { data, loading, error, isLive, refetch: fetchData }
}
```

- [ ] **Step 3: Add NEXT_PUBLIC_API_URL to .env.local**

Check if `.env.local` exists:
```bash
cat /Users/pavithraharsaikron/Downloads/zigpulse/.env.local
```

If `NEXT_PUBLIC_API_URL` is not already there, append it:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" >> /Users/pavithraharsaikron/Downloads/zigpulse/.env.local
```

- [ ] **Step 4: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add lib/api.ts lib/hooks/useCommandCentre.ts
git commit -m "feat: add typed API client and useCommandCentre polling hook"
```

---

## Task 10: Brand Assets Folder

**Files:**
- Instruction: place PNG files in `public/brand/`

- [ ] **Step 1: Create brand folder**

```bash
mkdir -p /Users/pavithraharsaikron/Downloads/zigpulse/public/brand
```

- [ ] **Step 2: Copy PNG logos from wherever user placed them**

Check if the user already placed the files:
```bash
ls /Users/pavithraharsaikron/Downloads/zigpulse/public/brand/ 2>/dev/null
ls /Users/pavithraharsaikron/Downloads/zigpulse/public/*.png 2>/dev/null
```

If `zig-icon.png` and `zig-wordmark.png` exist anywhere in the repo, copy them:
```bash
# If they exist at root public/ level:
cp /Users/pavithraharsaikron/Downloads/zigpulse/public/zig-icon.png /Users/pavithraharsaikron/Downloads/zigpulse/public/brand/zig-icon.png 2>/dev/null || true
cp /Users/pavithraharsaikron/Downloads/zigpulse/public/zig-wordmark.png /Users/pavithraharsaikron/Downloads/zigpulse/public/brand/zig-wordmark.png 2>/dev/null || true
```

> **Note:** If PNG files are not yet present, the sidebar and topbar will show broken images. The app will still render — images will just be missing. Place `zig-icon.png` (square icon, ~36×36) and `zig-wordmark.png` (horizontal lockup) in `public/brand/` manually if needed.

- [ ] **Step 3: Verify files**

```bash
ls -la /Users/pavithraharsaikron/Downloads/zigpulse/public/brand/
```

Expected: `zig-icon.png` and `zig-wordmark.png` listed.

- [ ] **Step 4: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add public/brand/
git commit -m "feat: add public/brand folder for PNG logo assets"
```

---

## Task 11: Delete Old Pages and Components

- [ ] **Step 1: Remove old pages**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
rm -rf app/demand app/heatmap app/weather app/profit app/marketing
rm -rf app/api/stream
```

- [ ] **Step 2: Remove old components**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
rm -rf components/tiles components/charts components/marketing
```

- [ ] **Step 3: Remove old mock data and hooks**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
rm -rf lib/mock
rm -f hooks/useSSE.js
```

- [ ] **Step 4: Remove old SVG logos**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
rm -f public/zig-logo-icon.svg public/zig-logo-wordmark.svg
```

- [ ] **Step 5: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add -A
git commit -m "chore: remove old pages, components, SSE routes, and mock data"
```

---

## Task 12: Rebuild Sidebar (10 Items, 3 Groups, Collapse, Theme-Aware)

**Files:**
- Modify: `components/layout/Sidebar.tsx` (rename from .jsx)

- [ ] **Step 1: Write new Sidebar.tsx**

```bash
rm /Users/pavithraharsaikron/Downloads/zigpulse/components/layout/Sidebar.jsx 2>/dev/null || true
```

Write `components/layout/Sidebar.tsx`:
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import {
  Zap, Sparkles, CalendarDays, CloudSun, Train,
  Megaphone, Paintbrush, Calendar, BarChart3, Settings,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_GROUPS = [
  {
    label: 'INTELLIGENCE',
    items: [
      { href: '/', label: 'Command Centre', icon: Zap },
      { href: '/opportunity-feed', label: 'Opportunity Feed', icon: Sparkles, badge: true },
      { href: '/events', label: 'Upcoming Events', icon: CalendarDays },
      { href: '/weather-intelligence', label: 'Weather Intel', icon: CloudSun },
      { href: '/transport', label: 'Transport Intel', icon: Train },
    ],
  },
  {
    label: 'STUDIO',
    items: [
      { href: '/campaign-studio', label: 'Campaign Studio', icon: Megaphone },
      { href: '/creative-studio', label: 'Creative Studio', icon: Paintbrush },
      { href: '/calendar', label: 'Opportunity Cal.', icon: Calendar },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 z-40 transition-all duration-300',
        'border-r',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center gap-3 border-b',
          collapsed ? 'px-3 py-4 justify-center' : 'px-4 py-4'
        )}
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex-shrink-0">
          <Image
            src="/brand/zig-icon.png"
            alt="Zig icon"
            width={36}
            height={36}
            priority
          />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-1">
            <span className="font-black text-base leading-none" style={{ color: 'var(--color-text-1)' }}>
              ZigPulse
            </span>
            <span
              className="text-[10px] font-bold px-1 py-0.5 rounded"
              style={{ backgroundColor: 'var(--color-ai-dim)', color: 'var(--color-ai)' }}
            >
              AI
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p
                className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-1"
                style={{ color: 'var(--color-text-3)' }}
              >
                {group.label}
              </p>
            )}
            {group.items.map(({ href, label, icon: Icon, badge }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 my-0.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-h-[44px] group relative',
                    collapsed && 'justify-center',
                    active ? '' : ''
                  )}
                  style={
                    active
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                      : { color: 'var(--color-text-2)' }
                  }
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface-2)'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = ''
                  }}
                >
                  <Icon
                    size={18}
                    className="flex-shrink-0"
                    style={active ? { color: '#fff' } : { color: 'var(--color-text-3)' }}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{label}</span>
                  )}
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F5C400' }} />
                  )}
                  {badge && !active && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3" style={{ borderColor: 'var(--color-border)' }}>
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-2 py-2 mb-2 rounded-xl"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#F5C400' }}
            >
              <span className="text-xs font-black" style={{ color: 'var(--color-primary)' }}>CDG</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>Marketing Team</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-3)' }}>Singapore</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-xl transition-colors min-h-[40px]"
          style={{ color: 'var(--color-text-3)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/layout/Sidebar.tsx
git commit -m "feat: rebuild Sidebar with 10-item nav, 3 groups, collapse, theme-aware"
```

---

## Task 13: Rebuild TopBar (Theme Toggle, Notifications, LIVE, ⌘K)

**Files:**
- Modify: `components/layout/TopBar.tsx` (rename from .jsx)

- [ ] **Step 1: Delete old TopBar.jsx**

```bash
rm /Users/pavithraharsaikron/Downloads/zigpulse/components/layout/TopBar.jsx 2>/dev/null || true
```

- [ ] **Step 2: Write new TopBar.tsx**

Write `components/layout/TopBar.tsx`:
```tsx
'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Bell, Sun, Moon, Monitor, Command } from 'lucide-react'

interface TopBarProps {
  title: string
  isLive?: boolean
}

export default function TopBar({ title, isLive = false }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const ThemeIcon = !mounted
    ? Monitor
    : theme === 'light'
    ? Sun
    : theme === 'dark'
    ? Moon
    : Monitor

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-4 px-6 h-[60px] border-b backdrop-blur-md"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Wordmark */}
      <div className="flex-shrink-0">
        <Image
          src="/brand/zig-wordmark.png"
          alt="ZigPulse"
          width={120}
          height={28}
          priority
          className="object-contain"
        />
      </div>

      {/* Page title */}
      <h1 className="text-base font-semibold" style={{ color: 'var(--color-text-1)' }}>
        {title}
      </h1>

      <div className="flex-1" />

      {/* LIVE indicator */}
      {isLive && (
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs font-semibold text-green-500">LIVE</span>
        </div>
      )}

      {/* ⌘K — Command Palette trigger (empty modal Phase 1) */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors border"
        style={{ color: 'var(--color-text-3)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-2)' }}
        onClick={() => {/* Phase 2 */}}
        aria-label="Open command palette"
      >
        <Command size={13} />
        <span>K</span>
      </button>

      {/* Notifications */}
      <button
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-2)' }}
        aria-label="Notifications"
      >
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white font-bold">
          3
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={cycleTheme}
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-2)' }}
        aria-label="Toggle theme"
      >
        <ThemeIcon size={18} />
      </button>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ backgroundColor: '#F5C400', color: 'var(--color-primary)' }}
      >
        CDG
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/layout/TopBar.tsx
git commit -m "feat: rebuild TopBar with theme toggle, LIVE indicator, notifications"
```

---

## Task 14: OpportunityScore Component (Animated SVG Ring)

**Files:**
- Create: `components/command-centre/OpportunityScore.tsx`

- [ ] **Step 1: Create components/command-centre/ directory and component**

```bash
mkdir -p /Users/pavithraharsaikron/Downloads/zigpulse/components/command-centre
```

Write `components/command-centre/OpportunityScore.tsx`:
```tsx
'use client'
import { useEffect, useState } from 'react'

interface Props {
  score: number
  lastUpdated: string
}

function ringColor(score: number) {
  if (score >= 85) return '#FF5252'
  if (score >= 65) return '#FFB300'
  if (score >= 45) return '#0367FC'
  return '#00C853'
}

export default function OpportunityScore({ score, lastUpdated }: Props) {
  const [displayScore, setDisplayScore] = useState(0)
  const [offset, setOffset] = useState(339.29) // 2π × 54 = circumference

  const circumference = 2 * Math.PI * 54
  const targetOffset = circumference - (score / 100) * circumference

  useEffect(() => {
    // Count up animation
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplayScore(Math.round(eased * score))
      setOffset(circumference - eased * (score / 100) * circumference)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score, circumference])

  const color = ringColor(score)
  const updatedAt = new Date(lastUpdated).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="relative w-[140px] h-[140px]">
        <svg width="140" height="140" className="-rotate-90">
          {/* Track */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            strokeWidth="10"
            style={{ stroke: 'var(--color-surface-2)' }}
          />
          {/* Progress */}
          <circle
            cx="70" cy="70" r="54"
            fill="none"
            strokeWidth="10"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.016s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black leading-none" style={{ color: 'var(--color-text-1)' }}>
            {displayScore}
          </span>
          <span className="text-xs font-semibold mt-1" style={{ color: 'var(--color-text-3)' }}>
            / 100
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-1)' }}>
          Singapore Opportunity Index
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-3)' }}>
          Updated at {updatedAt}
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/OpportunityScore.tsx
git commit -m "feat: add OpportunityScore animated SVG ring component"
```

---

## Task 15: ActiveOpportunities Component (Pill Grid)

**Files:**
- Create: `components/command-centre/ActiveOpportunities.tsx`

- [ ] **Step 1: Write ActiveOpportunities.tsx**

Write `components/command-centre/ActiveOpportunities.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { CloudRain, CalendarDays, Train, Sparkles } from 'lucide-react'
import type { Opportunity, OpportunityType, Severity } from '@/lib/types'

const typeIcon: Record<OpportunityType, React.ElementType> = {
  WEATHER: CloudRain,
  EVENT: CalendarDays,
  TRANSPORT: Train,
  HOLIDAY: Sparkles,
}

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

interface Props {
  opportunities: Opportunity[]
}

export default function ActiveOpportunities({ opportunities }: Props) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-text-1)' }}>
          Active Opportunities
        </h2>
        <span
          className="text-2xl font-black"
          style={{ color: 'var(--color-primary)' }}
        >
          {opportunities.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {opportunities.map((opp) => {
          const Icon = typeIcon[opp.type]
          const color = severityColor[opp.severity]
          return (
            <button
              key={opp.id}
              onClick={() => router.push(`/opportunity-feed?type=${opp.type}`)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                border: `1px solid var(--color-border)`,
                color: 'var(--color-text-1)',
              }}
            >
              <Icon size={14} style={{ color }} />
              <span className="max-w-[140px] truncate group-hover:max-w-none">{opp.title}</span>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span
                className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color }}
              >
                {opp.score}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/ActiveOpportunities.tsx
git commit -m "feat: add ActiveOpportunities pill grid component"
```

---

## Task 16: HighestImpact Component (Hero Card with Countdown)

**Files:**
- Create: `components/command-centre/HighestImpact.tsx`

- [ ] **Step 1: Write HighestImpact.tsx**

Write `components/command-centre/HighestImpact.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Users, ArrowRight } from 'lucide-react'
import type { Opportunity, Severity } from '@/lib/types'

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

function useCountdown(target: string | null | undefined) {
  const [remaining, setRemaining] = useState('')

  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now()
      if (diff <= 0) { setRemaining('Now'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setRemaining(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`)
    }
    tick()
    const id = setInterval(tick, 60000)
    return () => clearInterval(id)
  }, [target])

  return remaining
}

interface Props {
  opportunity: Opportunity
}

export default function HighestImpact({ opportunity: opp }: Props) {
  const router = useRouter()
  const countdown = useCountdown(opp.startDate)
  const color = severityColor[opp.severity]

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {opp.severity}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-3)' }}>
              Highest Impact
            </span>
          </div>

          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text-1)' }}>
            {opp.title}
          </h2>

          {opp.location && (
            <p className="text-sm mb-3" style={{ color: 'var(--color-text-2)' }}>
              {opp.location}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-4">
            {countdown && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Starts in</p>
                <p className="text-lg font-black" style={{ color }}>{countdown}</p>
              </div>
            )}
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Score</p>
              <p className="text-lg font-black" style={{ color: 'var(--color-text-1)' }}>{opp.score}/100</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-3)' }}>Potential Reach</p>
              <p className="text-lg font-black flex items-center gap-1" style={{ color: 'var(--color-text-1)' }}>
                <Users size={14} />
                {opp.potentialReach.toLocaleString()}
              </p>
            </div>
          </div>

          <ul className="space-y-1 mb-4">
            {opp.reasons.slice(0, 3).map((r, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--color-text-2)' }}>
                <span style={{ color }}>•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => router.push(`/campaign-studio?opportunity=${opp.id}`)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
        style={{ backgroundColor: color, color: '#fff' }}
      >
        Generate Campaign <ArrowRight size={14} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/HighestImpact.tsx
git commit -m "feat: add HighestImpact hero card with live countdown"
```

---

## Task 17: UpcomingEvents Component

**Files:**
- Create: `components/command-centre/UpcomingEvents.tsx`

- [ ] **Step 1: Write UpcomingEvents.tsx**

Write `components/command-centre/UpcomingEvents.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { Users, Wand2 } from 'lucide-react'
import type { Event } from '@/lib/types'

const categoryColor: Record<string, string> = {
  Concert: '#7C3AED',
  Sports: '#0367FC',
  Festival: '#FFB300',
  Exhibition: '#00C853',
  Conference: '#64748B',
}

function daysUntil(date: string) {
  const diff = new Date(date).getTime() - Date.now()
  const d = Math.ceil(diff / 86400000)
  if (d <= 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return `${d}d`
}

interface Props {
  events: Event[]
}

export default function UpcomingEvents({ events }: Props) {
  const router = useRouter()
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Upcoming Events
      </h2>
      <div className="space-y-3">
        {events.map((event) => {
          const color = categoryColor[event.category] || '#64748B'
          return (
            <div
              key={event.id}
              className="group flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--color-surface-2)' }}
              onClick={() => router.push('/events')}
            >
              <div
                className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {daysUntil(event.startDate)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-1)' }}>
                  {event.name}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--color-text-3)' }}>
                  {event.venue}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-text-3)' }}>
                    <Users size={10} />
                    {event.attendanceEst.toLocaleString()}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color }}
                  >
                    Score {event.opportunityScore}
                  </span>
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs px-2 py-1 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}
                onClick={(e) => { e.stopPropagation(); router.push('/campaign-studio') }}
              >
                <Wand2 size={10} />
                Generate
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/UpcomingEvents.tsx
git commit -m "feat: add UpcomingEvents component with countdown and category colours"
```

---

## Task 18: WeatherStrip Component (7-Day Forecast)

**Files:**
- Create: `components/command-centre/WeatherStrip.tsx`

- [ ] **Step 1: Write WeatherStrip.tsx**

Write `components/command-centre/WeatherStrip.tsx`:
```tsx
'use client'
import { Sun, Cloud, CloudRain, Droplets } from 'lucide-react'
import type { WeatherSummary } from '@/lib/types'

const conditionIcon = (condition: string) => {
  if (condition.includes('Rain') || condition === 'Thunderstorm') return CloudRain
  if (condition.includes('Cloud')) return Cloud
  return Sun
}

interface Props {
  weather: WeatherSummary
}

export default function WeatherStrip({ weather }: Props) {
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Weather Intel
      </h2>
      <div className="space-y-2">
        {weather.forecast.map((day, i) => {
          const Icon = conditionIcon(day.condition)
          const isToday = i === 0
          const highRain = day.rainProb >= 70
          const dateLabel = isToday
            ? 'Today'
            : new Date(day.date).toLocaleDateString('en-SG', { weekday: 'short' })

          return (
            <div
              key={day.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl"
              style={{
                backgroundColor: isToday ? 'var(--color-primary-dim)' : 'var(--color-surface-2)',
                border: highRain && !isToday ? '1px solid #FFB30040' : '1px solid transparent',
              }}
            >
              <span
                className="text-xs font-semibold w-12 flex-shrink-0"
                style={{ color: isToday ? 'var(--color-primary)' : 'var(--color-text-3)' }}
              >
                {dateLabel}
              </span>
              <Icon
                size={16}
                style={{ color: day.rainProb >= 60 ? '#60A5FA' : '#F5C400' }}
                className="flex-shrink-0"
              />
              <span className="text-sm font-semibold w-8" style={{ color: 'var(--color-text-1)' }}>
                {day.high}°
              </span>
              {/* Rain probability bar */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${day.rainProb}%`,
                      backgroundColor: day.rainProb >= 70 ? '#FFB300' : 'var(--color-primary)',
                    }}
                  />
                </div>
                <span
                  className="text-xs font-semibold w-8 text-right flex items-center gap-0.5"
                  style={{ color: day.rainProb >= 70 ? '#FFB300' : 'var(--color-text-3)' }}
                >
                  <Droplets size={10} />{day.rainProb}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/WeatherStrip.tsx
git commit -m "feat: add WeatherStrip 7-day forecast with rain probability bars"
```

---

## Task 19: TransportAlerts Component

**Files:**
- Create: `components/command-centre/TransportAlerts.tsx`

- [ ] **Step 1: Write TransportAlerts.tsx**

Write `components/command-centre/TransportAlerts.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { Train, AlertTriangle, Wand2 } from 'lucide-react'
import type { TransportAlert, Severity } from '@/lib/types'

const severityColor: Record<Severity, string> = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB300',
  MEDIUM: '#0367FC',
  LOW: '#00C853',
}

interface Props {
  alerts: TransportAlert[]
}

export default function TransportAlerts({ alerts }: Props) {
  const router = useRouter()
  return (
    <div
      className="rounded-2xl p-5 h-full"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <h2 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>
        Transport Alerts
      </h2>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const color = severityColor[alert.severity]
          return (
            <div
              key={alert.id}
              className="p-3 rounded-xl"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div className="flex items-start gap-2 mb-1">
                <AlertTriangle size={14} style={{ color }} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {alert.severity}
                    </span>
                    {alert.affectedLine && (
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--color-text-2)' }}>
                        <Train size={10} /> {alert.affectedLine}
                      </span>
                    )}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-2)' }}>
                    {alert.description}
                  </p>
                  {alert.demandUplift > 0 && (
                    <p className="text-xs font-semibold mt-1" style={{ color: '#00C853' }}>
                      +{alert.demandUplift}% taxi demand opportunity
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push('/campaign-studio')}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg mt-2"
                style={{ backgroundColor: 'var(--color-primary-dim)', color: 'var(--color-primary)' }}
              >
                <Wand2 size={10} /> Generate Campaign
              </button>
            </div>
          )
        })}
        {alerts.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-3)' }}>
            No active transport alerts
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/TransportAlerts.tsx
git commit -m "feat: add TransportAlerts component with severity badges"
```

---

## Task 20: AIRecommendations Component (Shimmer + Stagger)

**Files:**
- Create: `components/command-centre/AIRecommendations.tsx`

- [ ] **Step 1: Write AIRecommendations.tsx**

Write `components/command-centre/AIRecommendations.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Wand2 } from 'lucide-react'
import type { AIRecommendation } from '@/lib/types'

const campaignTypeLabel: Record<string, string> = {
  PUSH_NOTIFICATION: 'Push',
  DRIVER_ALERT: 'Driver Alert',
  EMAIL_CAMPAIGN: 'Email',
  IN_APP_PROMO: 'In-App',
}

interface Props {
  recommendations: AIRecommendation[]
  loading?: boolean
}

function ShimmerCard() {
  return (
    <div
      className="flex-shrink-0 w-72 rounded-2xl p-5 animate-pulse"
      style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
    >
      <div className="w-24 h-3 rounded mb-3" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-full h-4 rounded mb-2" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-3/4 h-3 rounded mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
      <div className="w-20 h-7 rounded-lg" style={{ backgroundColor: 'var(--color-border)' }} />
    </div>
  )
}

export default function AIRecommendations({ recommendations, loading }: Props) {
  const router = useRouter()

  return (
    <div
      className="rounded-2xl p-5"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: 'var(--color-ai)' }} />
        <h2 className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>
          AI Recommendations
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? [1, 2, 3].map((i) => <ShimmerCard key={i} />)
          : recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                className="flex-shrink-0 w-72 rounded-2xl p-5"
                style={{
                  backgroundColor: 'var(--color-ai-dim)',
                  border: '1px solid rgba(124,58,237,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: 'var(--color-ai)' }} />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(124,58,237,0.15)', color: 'var(--color-ai)' }}
                  >
                    {campaignTypeLabel[rec.campaignType] || rec.campaignType}
                  </span>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-1)' }}>
                  {rec.title}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--color-text-2)' }}>
                  {rec.reason}
                </p>
                <button
                  onClick={() => router.push('/campaign-studio')}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--color-ai)', color: '#fff' }}
                >
                  <Wand2 size={12} /> Generate
                </button>
              </motion.div>
            ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add components/command-centre/AIRecommendations.tsx
git commit -m "feat: add AIRecommendations with shimmer loading and staggered entrance"
```

---

## Task 21: Command Centre Page Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite app/page.tsx**

Write `app/page.tsx`:
```tsx
'use client'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import OpportunityScore from '@/components/command-centre/OpportunityScore'
import ActiveOpportunities from '@/components/command-centre/ActiveOpportunities'
import HighestImpact from '@/components/command-centre/HighestImpact'
import UpcomingEvents from '@/components/command-centre/UpcomingEvents'
import WeatherStrip from '@/components/command-centre/WeatherStrip'
import TransportAlerts from '@/components/command-centre/TransportAlerts'
import AIRecommendations from '@/components/command-centre/AIRecommendations'
import { useCommandCentre } from '@/lib/hooks/useCommandCentre'

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl animate-pulse ${className}`}
      style={{ backgroundColor: 'var(--color-surface-2)', minHeight: 120 }}
    />
  )
}

export default function CommandCentrePage() {
  const { data, loading, isLive } = useCommandCentre()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Command Centre" isLive={isLive} />

        <main className="flex-1 p-6 space-y-6">
          {/* Zone A — Hero Row */}
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
            {loading || !data ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <OpportunityScore
                  score={data.opportunityScore}
                  lastUpdated={data.lastUpdated}
                />
                <ActiveOpportunities opportunities={data.activeOpportunities} />
              </>
            )}
          </div>

          {/* Zone B — Highest Impact */}
          {loading || !data ? (
            <SkeletonCard className="h-[200px]" />
          ) : data.highestImpact ? (
            <HighestImpact opportunity={data.highestImpact} />
          ) : null}

          {/* Zone C — 3-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading || !data ? (
              <>
                <SkeletonCard className="h-[360px]" />
                <SkeletonCard className="h-[360px]" />
                <SkeletonCard className="h-[360px]" />
              </>
            ) : (
              <>
                <UpcomingEvents events={data.upcomingEvents} />
                {data.weatherSummary && <WeatherStrip weather={data.weatherSummary} />}
                <TransportAlerts alerts={data.transportAlerts} />
              </>
            )}
          </div>

          {/* Zone D — AI Recommendations */}
          <AIRecommendations
            recommendations={data?.aiRecommendations ?? []}
            loading={loading}
          />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add app/page.tsx
git commit -m "feat: assemble Command Centre page with all zones and skeleton loading"
```

---

## Task 22: Stub Pages (9 Pages)

**Files:**
- Create/Modify: all stub pages

- [ ] **Step 1: Write stub page template helper**

All stub pages follow the same pattern. Write each file below:

Write `app/opportunity-feed/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Sparkles } from 'lucide-react'

export default function OpportunityFeedPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Opportunity Feed" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Sparkles size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Opportunity Feed</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View All Opportunities
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/events/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { CalendarDays } from 'lucide-react'

export default function EventsPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Upcoming Events" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <CalendarDays size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Upcoming Events</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            Browse Events
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/weather-intelligence/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { CloudSun } from 'lucide-react'

export default function WeatherIntelligencePage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Weather Intelligence" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <CloudSun size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Weather Intelligence</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View Forecast
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/transport/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Train } from 'lucide-react'

export default function TransportPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Transport Intelligence" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Train size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Transport Intelligence</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View Alerts
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/campaign-studio/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Megaphone } from 'lucide-react'

export default function CampaignStudioPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Campaign Studio" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Megaphone size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Campaign Studio</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            Generate Campaign
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/creative-studio/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Paintbrush } from 'lucide-react'

export default function CreativeStudioPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Creative Studio" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Paintbrush size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Creative Studio</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-ai)', color: '#fff' }}>
            Generate Creative Assets
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/calendar/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Calendar } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Opportunity Calendar" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Calendar size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Opportunity Calendar</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View Calendar
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/analytics/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Analytics" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <BarChart3 size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Analytics</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            View Reports
          </button>
        </main>
      </div>
    </div>
  )
}
```

Write `app/settings/page.tsx`:
```tsx
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Settings" />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-12 text-center">
          <Settings size={64} style={{ color: 'var(--color-text-3)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-1)' }}>Settings</h2>
          <p className="text-base" style={{ color: 'var(--color-text-3)' }}>Coming in Phase 2</p>
          <button disabled className="px-6 py-2 rounded-xl text-sm font-semibold opacity-40 cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
            Configure
          </button>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add app/opportunity-feed/ app/events/ app/weather-intelligence/ app/transport/ app/campaign-studio/ app/creative-studio/ app/calendar/ app/analytics/ app/settings/
git commit -m "feat: add 9 stub pages with empty states and Coming in Phase 2"
```

---

## Task 23: Build Verification

- [ ] **Step 1: Verify Next.js build passes**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse && npm run build 2>&1 | tail -30
```

Expected: `✓ Compiled successfully` with no TypeScript errors. If there are import errors (e.g., referencing deleted files), fix them before proceeding.

- [ ] **Step 2: Fix any import errors**

Common fixes:
- If `components/layout/Sidebar.jsx` import fails → check all pages import from `@/components/layout/Sidebar` (no extension)
- If old hook imports exist in surviving files → remove them
- If `lib/utils.ts` is missing `cn` function, check `lib/utils.ts` exists with `import { clsx } from 'clsx'; import { twMerge } from 'tailwind-merge'; export function cn(...inputs) { return twMerge(clsx(inputs)) }`

- [ ] **Step 3: Verify backend TypeScript compiles**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npx tsc --noEmit 2>&1
```

Expected: No errors.

- [ ] **Step 4: Run both services and do a full end-to-end smoke test**

```bash
# Terminal 1: backend
cd /Users/pavithraharsaikron/Downloads/zigpulse/backend && npm run start:dev &
sleep 4
curl -s http://localhost:4000/command-centre/summary | python3 -c "import json,sys; d=json.load(sys.stdin); print('Score:', d['opportunityScore'], '| Opportunities:', len(d['activeOpportunities']))"
```

Expected: `Score: 76 | Opportunities: 10` (or similar values).

```bash
# Frontend
cd /Users/pavithraharsaikron/Downloads/zigpulse && npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -i "zigpulse\|command" | head -5
```

Expected: HTML containing ZigPulse references.

- [ ] **Step 5: Commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add -A
git commit -m "chore: verify build passes, fix any import errors"
```

---

## Task 24: next.config.js — Image Domains + Environment

**Files:**
- Modify: `next.config.js` or `next.config.mjs`

- [ ] **Step 1: Check current next.config**

```bash
cat /Users/pavithraharsaikron/Downloads/zigpulse/next.config.mjs 2>/dev/null || cat /Users/pavithraharsaikron/Downloads/zigpulse/next.config.js 2>/dev/null
```

- [ ] **Step 2: Ensure remotePatterns config for next/image**

If `next.config.mjs` exists, update it. If `next.config.js` exists, update that. The content should include:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Local public/ images don't need remotePatterns
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
}

export default nextConfig
```

- [ ] **Step 3: Final build check**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse && npm run build 2>&1 | grep -E "(error|warning|✓|Route)" | head -30
```

Expected: No errors. Routes listed for all 10 pages.

- [ ] **Step 4: Final commit**

```bash
cd /Users/pavithraharsaikron/Downloads/zigpulse
git add next.config.mjs next.config.js 2>/dev/null
git commit -m "chore: finalize next.config, all Phase 1 tasks complete"
```

---

## Self-Review

**Spec coverage check:**

| Spec Section | Covered by Task |
|---|---|
| Monorepo structure | Task 1 (backend/ dir) |
| PostgreSQL schema | Task 2 |
| Seed data (10 records) | Task 3 |
| 6 REST endpoints | Tasks 4–6 |
| CSS design tokens | Task 7 |
| next-themes | Task 7 |
| Inter font | Task 7 |
| Shared types | Task 8 |
| API client + hook | Task 9 |
| Brand assets folder | Task 10 |
| Delete old pages | Task 11 |
| Sidebar (10 items, 3 groups) | Task 12 |
| TopBar (theme toggle, LIVE, ⌘K) | Task 13 |
| OpportunityScore ring | Task 14 |
| ActiveOpportunities pills | Task 15 |
| HighestImpact hero | Task 16 |
| UpcomingEvents countdown | Task 17 |
| WeatherStrip 7-day | Task 18 |
| TransportAlerts | Task 19 |
| AIRecommendations shimmer+stagger | Task 20 |
| Command Centre page | Task 21 |
| 9 stub pages | Task 22 |
| Build verification | Task 23 |
| next.config cleanup | Task 24 |

**Placeholder scan:** No TBDs. All steps contain complete code.

**Type consistency:** Types defined in Task 8 (`lib/types.ts`) and used consistently in Tasks 9–21. `Opportunity`, `Event`, `WeatherSummary`, `TransportAlert`, `AIRecommendation`, `CommandCentreSummary` — all match between frontend types and Prisma schema.
