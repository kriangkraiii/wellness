import { RecommendationPanel } from "@/app/merchant/recommendations/recommendation-panel";
import { toUserDbError } from "@/lib/errors";
import { getMerchants } from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

export default async function MerchantRecommendationPage() {
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
          ตั้งค่า DATABASE_URL แล้วรัน migration/seed ก่อนใช้งาน recommendation
        </div>
      )}
      <RecommendationPanel merchants={merchantOptions} />
    </section>
  );
}
