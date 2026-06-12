import { ForecastPanel } from "@/app/merchant/forecast/forecast-panel";
import { toUserDbError } from "@/lib/errors";
import { getMerchants } from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

export default async function DashboardForecastPage() {
  let merchants: Awaited<ReturnType<typeof getMerchants>> = [];
  let dbMessage: string | null = null;

  try {
    merchants = await getMerchants();
  } catch (error) {
    dbMessage = toUserDbError(error);
  }

  const merchantOptions = merchants.map((merchant) => ({
    slug: merchant.slug,
    name: merchant.name,
  }));

  return (
    <section className="space-y-4">
      {dbMessage && (
        <div className="rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
           เชื่อมฐานข้อมูลไม่สำเร็จ: {dbMessage}
          <br />
          ต้องมีข้อมูล demand records อย่างน้อย 7 วันจึงจะ forecast ได้
        </div>
      )}
      <ForecastPanel merchants={merchantOptions} />
    </section>
  );
}
