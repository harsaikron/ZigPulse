-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('WEATHER', 'EVENT', 'TRANSPORT', 'HOLIDAY');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL,
    "title" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "score" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reasons" TEXT[],
    "suggestedCampaign" TEXT NOT NULL,
    "potentialReach" INTEGER NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "attendanceEst" INTEGER NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherSnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "condition" TEXT NOT NULL,
    "high" INTEGER NOT NULL,
    "low" INTEGER NOT NULL,
    "rainProb" INTEGER NOT NULL,
    "elNinoConfidence" INTEGER NOT NULL,
    "demandUplift" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "affectedLine" TEXT,
    "affectedRoad" TEXT,
    "description" TEXT NOT NULL,
    "demandUplift" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransportAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "campaignType" TEXT NOT NULL,
    "opportunityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);
