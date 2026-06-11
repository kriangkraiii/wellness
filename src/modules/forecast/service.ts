import { prisma } from "@/lib/prisma";
import { getMerchantBySlug } from "@/modules/repository/merchant-repository";

export type ForecastResult = {
  merchantSlug: string;
  merchantName: string;
  horizonDays: number;
  projectedBookings: number;
  projectedRevenue: number;
  confidence: number;
  trendPerWeek: number;
  scenario: {
    costIndexIncrease10: {
      estimatedRevenueImpactPct: number;
      suggestedAction: string;
    };
  };
};

function movingAverage(values: number[], windowSize: number) {
  if (values.length === 0) return 0;
  const w = Math.max(1, Math.min(values.length, windowSize));
  const segment = values.slice(-w);
  const sum = segment.reduce((acc, value) => acc + value, 0);
  return sum / segment.length;
}

export async function runForecast(
  merchantSlug: string,
  horizonDays = 14,
): Promise<ForecastResult> {
  const merchant = await getMerchantBySlug(merchantSlug);
  if (!merchant) {
    throw new Error("Merchant not found");
  }

  const records = merchant.demandRecords;
  if (records.length < 7) {
    throw new Error("Not enough demand data. Seed or upload at least 7 days.");
  }

  const bookingSeries = records.map((r) => r.bookings);
  const ticketSeries = records.map((r) => r.avgTicket);

  const shortAvg = movingAverage(bookingSeries, 7);
  const longAvg = movingAverage(bookingSeries, 21);
  const avgTicket = movingAverage(ticketSeries, 7);

  const trendPerWeek = Number(((shortAvg - longAvg) * 7).toFixed(2));
  const projectedBookings = Math.max(0, Number((shortAvg * horizonDays).toFixed(0)));
  const projectedRevenue = Number((projectedBookings * avgTicket).toFixed(2));

  const confidenceRaw = Math.max(0.5, Math.min(0.93, 0.76 + Math.sign(trendPerWeek) * 0.03));
  const confidence = Number(confidenceRaw.toFixed(2));

  const scenario = {
    costIndexIncrease10: {
      estimatedRevenueImpactPct: -6.5,
      suggestedAction:
        "ปรับสัดส่วนเมนูใช้วัตถุดิบต้นทุนต่ำขึ้น + เพิ่มแพ็กเกจกลุ่มช่วง weekday",
    },
  };

  await prisma.forecastSnapshot.create({
    data: {
      merchantId: merchant.id,
      horizonDays,
      projectedBookings,
      projectedRevenue,
      confidence,
      trendPerWeek,
      scenario,
    },
  });

  return {
    merchantSlug,
    merchantName: merchant.name,
    horizonDays,
    projectedBookings,
    projectedRevenue,
    confidence,
    trendPerWeek,
    scenario,
  };
}
