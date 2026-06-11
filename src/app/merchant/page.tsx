import Link from "next/link";
import type {
  ForecastSnapshot,
  Prisma,
  RecommendationRun,
} from "@prisma/client";
import { toUserDbError } from "@/lib/errors";
import {
  getMerchants,
  getRecentForecastSnapshots,
  getRecentRecommendationRuns,
} from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

type MerchantCard = Prisma.MerchantGetPayload<{
  include: {
    offerings: true;
    merchantIngredients: {
      include: {
        ingredient: true;
      };
    };
  };
}>;

const bizIcon: Record<string, string> = {
  MASSAGE: "🤲",
  SPA: "🧖",
  WELLNESS_TOURISM: "🌿",
};

export default async function MerchantDashboardPage() {
  let merchants: MerchantCard[] = [];
  let dbMessage: string | null = null;

  try {
    merchants = await getMerchants();
  } catch (error) {
    dbMessage = toUserDbError(error);
  }

  const primary = merchants[0];
  let recentRecommendations: RecommendationRun[] = [];
  let recentForecasts: ForecastSnapshot[] = [];

  if (primary) {
    [recentRecommendations, recentForecasts] = await Promise.all([
      getRecentRecommendationRuns(primary.id, 3),
      getRecentForecastSnapshots(primary.id, 3),
    ]);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <article className="glass-card p-6 lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          ✦ Merchant Dashboard
        </p>
        <h2 className="mt-2 font-heading text-3xl text-[var(--ink)]">
          ภาพรวมผู้ประกอบการ
        </h2>

        {dbMessage && (
          <div className="mt-5 rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
            ⚠ เชื่อมฐานข้อมูลไม่สำเร็จ: {dbMessage}
            <br />
            ตรวจสอบ DATABASE_URL แล้วรัน prisma migrate + seed
          </div>
        )}

        {!dbMessage && merchants.length === 0 && (
          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--bg-surface)] px-4 py-6 text-center text-sm text-[var(--ink-soft)]">
            <span className="text-4xl">🏪</span>
            <p className="mt-2">ยังไม่มีข้อมูล merchant ในฐานข้อมูล</p>
            <p className="text-xs text-[var(--ink-muted)]">กรุณารัน seed ข้อมูล</p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {merchants.map((merchant, i) => (
            <div
              key={merchant.id}
              className={`glass-card glass-card-hover p-5 fade-rise fade-rise-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{bizIcon[merchant.businessType] || "🏢"}</span>
                <span className="rounded-full bg-[var(--gold-glow)] px-2.5 py-1 text-[10px] font-bold uppercase text-[var(--gold)]">
                  {merchant.businessType}
                </span>
              </div>
              <h3 className="mt-3 font-heading text-xl text-[var(--ink)]">
                {merchant.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">📍 {merchant.location}</p>
              <div className="mt-3 flex gap-3 text-xs text-[var(--ink-muted)]">
                <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1">
                  {merchant.offerings.length} บริการ
                </span>
                <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1">
                  {merchant.merchantIngredients.length} วัตถุดิบ
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/merchant/recommendations" className="btn-primary">
            ไปหน้า Recommendation Studio
          </Link>
          <Link href="/merchant/forecast" className="btn-secondary">
            ไปหน้า Forecast Dashboard
          </Link>
        </div>
      </article>

      <div className="space-y-6">
        <article className="glass-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Latest Recommendation Runs
          </p>
          <div className="mt-4 space-y-3">
            {recentRecommendations.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]">
                ยังไม่มี recommendation run
              </p>
            ) : (
              recentRecommendations.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      คะแนนกฎ: {row.ruleScore}
                    </p>
                    <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                      Score
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--ink-muted)]">
                    {new Date(row.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="glass-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            ✦ Latest Forecast Snapshots
          </p>
          <div className="mt-4 space-y-3">
            {recentForecasts.length === 0 ? (
              <p className="text-sm text-[var(--ink-muted)]">ยังไม่มี forecast snapshot</p>
            ) : (
              recentForecasts.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-3"
                >
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    รายได้คาดการณ์ {row.projectedRevenue.toLocaleString("th-TH")} ฿
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--ink-muted)]">
                    <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                      {Math.round(row.confidence * 100)}%
                    </span>
                    <span>{new Date(row.createdAt).toLocaleString("th-TH")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
