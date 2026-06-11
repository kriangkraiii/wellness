-- CreateEnum
CREATE TYPE "public"."BusinessType" AS ENUM ('MASSAGE', 'SPA', 'WELLNESS_TOURISM');

-- CreateEnum
CREATE TYPE "public"."PartnerType" AS ENUM ('SUPPLIER', 'INVESTOR', 'MARKETING', 'TRAVEL');

-- CreateTable
CREATE TABLE "public"."Merchant" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessType" "public"."BusinessType" NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Offering" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "wellnessFocus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "marketPrice" DOUBLE PRECISION NOT NULL,
    "supplierName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MerchantIngredient" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "monthlyVolume" DOUBLE PRECISION NOT NULL,
    "usageNote" TEXT,

    CONSTRAINT "MerchantIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."PartnerType" NOT NULL,
    "channel" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "coverageArea" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 70,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoutePlan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "merchantId" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "focus" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startingPoint" TEXT NOT NULL,
    "endingPoint" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoutePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RouteStop" (
    "id" TEXT NOT NULL,
    "routePlanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DemandRecord" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "recordDate" TIMESTAMP(3) NOT NULL,
    "bookings" INTEGER NOT NULL,
    "avgTicket" DOUBLE PRECISION NOT NULL,
    "costIndex" DOUBLE PRECISION NOT NULL DEFAULT 1,

    CONSTRAINT "DemandRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RecommendationRun" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "budgetLevel" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "ruleScore" INTEGER NOT NULL,
    "ruleSummary" JSONB NOT NULL,
    "llmNarrative" TEXT,
    "llmModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ForecastSnapshot" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "horizonDays" INTEGER NOT NULL,
    "projectedBookings" DOUBLE PRECISION NOT NULL,
    "projectedRevenue" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "trendPerWeek" DOUBLE PRECISION NOT NULL,
    "scenario" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForecastSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_slug_key" ON "public"."Merchant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "public"."Ingredient"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantIngredient_merchantId_ingredientId_key" ON "public"."MerchantIngredient"("merchantId", "ingredientId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_slug_key" ON "public"."Partner"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "RoutePlan_slug_key" ON "public"."RoutePlan"("slug");

-- CreateIndex
CREATE INDEX "RouteStop_routePlanId_sortOrder_idx" ON "public"."RouteStop"("routePlanId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "DemandRecord_merchantId_recordDate_key" ON "public"."DemandRecord"("merchantId", "recordDate");

-- CreateIndex
CREATE INDEX "ForecastSnapshot_merchantId_createdAt_idx" ON "public"."ForecastSnapshot"("merchantId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "public"."Offering" ADD CONSTRAINT "Offering_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MerchantIngredient" ADD CONSTRAINT "MerchantIngredient_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MerchantIngredient" ADD CONSTRAINT "MerchantIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoutePlan" ADD CONSTRAINT "RoutePlan_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RouteStop" ADD CONSTRAINT "RouteStop_routePlanId_fkey" FOREIGN KEY ("routePlanId") REFERENCES "public"."RoutePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DemandRecord" ADD CONSTRAINT "DemandRecord_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecommendationRun" ADD CONSTRAINT "RecommendationRun_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ForecastSnapshot" ADD CONSTRAINT "ForecastSnapshot_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "public"."Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
