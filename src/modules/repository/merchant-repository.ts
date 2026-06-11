import { prisma } from "@/lib/prisma";

export async function getMerchants() {
  return prisma.merchant.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      offerings: true,
      merchantIngredients: {
        include: {
          ingredient: true,
        },
      },
    },
  });
}

export async function getMerchantBySlug(slug: string) {
  return prisma.merchant.findUnique({
    where: { slug },
    include: {
      offerings: true,
      merchantIngredients: {
        include: {
          ingredient: true,
        },
      },
      demandRecords: {
        orderBy: {
          recordDate: "asc",
        },
      },
    },
  });
}

export async function getRoutePlans() {
  return prisma.routePlan.findMany({
    include: {
      stops: {
        orderBy: { sortOrder: "asc" },
      },
      merchant: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getRoutePlanBySlug(slug: string) {
  return prisma.routePlan.findUnique({
    where: { slug },
    include: {
      stops: {
        orderBy: { sortOrder: "asc" },
      },
      merchant: true,
    },
  });
}

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
  });
}

export async function getRecentRecommendationRuns(merchantId: string, take = 5) {
  return prisma.recommendationRun.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function getRecentForecastSnapshots(merchantId: string, take = 5) {
  return prisma.forecastSnapshot.findMany({
    where: { merchantId },
    orderBy: { createdAt: "desc" },
    take,
  });
}
