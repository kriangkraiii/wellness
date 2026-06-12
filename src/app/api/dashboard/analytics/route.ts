import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { slug: "sabaidee-spa-khonkaen" },
      include: {
        demandRecords: {
          orderBy: { recordDate: "asc" },
        },
        offerings: true,
      },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, message: "Merchant not found" }, { status: 404 });
    }

    const demandRecords = merchant.demandRecords;

    // Calculate metrics
    let totalRevenue = 0;
    let totalCost = 0;
    let totalBookings = 0;

    const dailyData = demandRecords.map((rec) => {
      const revenue = rec.bookings * rec.avgTicket;
      // cost is roughly 40% of revenue scaled by costIndex
      const cost = revenue * 0.4 * rec.costIndex;
      const profit = revenue - cost;
      
      totalRevenue += revenue;
      totalCost += cost;
      totalBookings += rec.bookings;

      return {
        date: new Date(rec.recordDate).toLocaleDateString("th-TH", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.round(revenue),
        cost: Math.round(cost),
        profit: Math.round(profit),
      };
    });

    const netProfit = totalRevenue - totalCost;
    const avgTicket = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    // Service performance ranking based on actual offerings and mock relative shares
    const serviceShares = [0.4, 0.28, 0.18, 0.1, 0.04];
    const servicePerformance = merchant.offerings.map((offering, idx) => {
      const share = serviceShares[idx] || 0.05;
      const svcBookings = Math.round(totalBookings * share);
      const svcRevenue = Math.round(totalRevenue * share);
      return {
        name: offering.title,
        bookings: svcBookings,
        revenue: svcRevenue,
      };
    }).sort((a, b) => b.bookings - a.bookings);

    return NextResponse.json({
      ok: true,
      data: {
        kpi: {
          totalRevenue: Math.round(totalRevenue),
          netProfit: Math.round(netProfit),
          totalBookings,
          avgTicket,
          satisfaction: 4.8,
          returnRate: 68,
        },
        chartData: dailyData,
        servicePerformance,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
