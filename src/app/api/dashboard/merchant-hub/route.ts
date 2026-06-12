import { NextResponse } from "next/server";
import {
  getMerchants,
  getRecentForecastSnapshots,
  getRecentRecommendationRuns,
} from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const merchants = await getMerchants();
    const primary = merchants[0];

    let recentRecommendations: Awaited<ReturnType<typeof getRecentRecommendationRuns>> = [];
    let recentForecasts: Awaited<ReturnType<typeof getRecentForecastSnapshots>> = [];

    if (primary) {
      [recentRecommendations, recentForecasts] = await Promise.all([
        getRecentRecommendationRuns(primary.id, 3),
        getRecentForecastSnapshots(primary.id, 3),
      ]);
    }

    return NextResponse.json({
      ok: true,
      data: {
        merchants,
        recentRecommendations,
        recentForecasts,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
