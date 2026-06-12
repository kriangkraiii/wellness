import { ForecastPanel } from "@/app/merchant/forecast/forecast-panel";
import { toUserDbError } from "@/lib/errors";
import { getMerchants } from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

export default async function TryForecastPage() {
  let merchants: Awaited<ReturnType<typeof getMerchants>> = [];
  let dbMessage: string | null = null;

  try {
    // Fetch real merchants
    const allMerchants = await getMerchants();
    // Exclude guest-custom-store if it happens to be returned
    merchants = allMerchants.filter((m) => m.slug !== "guest-custom-store");
  } catch (error) {
    dbMessage = toUserDbError(error);
  }

  // Prepend virtual custom store option
  const merchantOptions = [
    {
      slug: "guest-custom-store",
      name: " จำลองเปิดร้านใหม่ / ผู้ใช้ทั่วไป (Simulate Custom Shop)",
    },
    ...merchants.map((merchant) => ({
      slug: merchant.slug,
      name: ` ${merchant.name} (${merchant.location})`,
    })),
  ];

  return (
    <section className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-800">พยากรณ์ความต้องการ (Demand Forecast Simulator)</h2>
        <p className="text-sm text-slate-500">
          คำนวณสถิติและคาดการณ์ปริมาณผู้เข้าใช้บริการ ยอดจอง และประมาณการรายได้ล่วงหน้า
        </p>
      </div>

      {dbMessage && (
        <div className="rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
           เชื่อมฐานข้อมูลไม่สำเร็จ: {dbMessage}
        </div>
      )}

      <ForecastPanel merchants={merchantOptions} />
    </section>
  );
}
