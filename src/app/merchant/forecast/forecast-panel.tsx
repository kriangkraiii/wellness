"use client";

import { useMemo, useState } from "react";

type MerchantOption = {
  slug: string;
  name: string;
};

type ForecastResponse = {
  ok: boolean;
  message?: string;
  data?: {
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
};

export function ForecastPanel({ merchants }: { merchants: MerchantOption[] }) {
  const defaultSlug = useMemo(() => merchants[0]?.slug || "", [merchants]);

  const [merchantSlug, setMerchantSlug] = useState(defaultSlug);
  const [horizonDays, setHorizonDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ForecastResponse["data"]>();

  const disabled = merchants.length === 0 || !merchantSlug;

  async function onRun() {
    if (disabled) return;

    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        merchantSlug,
        horizonDays: String(horizonDays),
      });

      const response = await fetch(`/api/forecast?${query.toString()}`);
      const payload = (await response.json()) as ForecastResponse;

      if (!response.ok || !payload.ok || !payload.data) {
        setError(payload.message || "ไม่สามารถคำนวณ forecast ได้");
        setResult(undefined);
      } else {
        setResult(payload.data);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error");
      setResult(undefined);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="glass-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          ✦ Forecast Controls
        </p>
        <h2 className="mt-2 font-heading text-3xl text-[var(--ink)]">
          Forecast Dashboard
        </h2>

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-[var(--ink-soft)]">
            Merchant
            <select
              value={merchantSlug}
              onChange={(e) => setMerchantSlug(e.target.value)}
              className="input-dark mt-2"
            >
              {merchants.map((merchant) => (
                <option key={merchant.slug} value={merchant.slug}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-[var(--ink-soft)]">
            Horizon (days)
            <input
              type="number"
              min={7}
              max={90}
              value={horizonDays}
              onChange={(e) => setHorizonDays(Number(e.target.value) || 14)}
              className="input-dark mt-2"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={disabled || loading}
          className="btn-gold mt-6 w-full"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
              </svg>
              กำลังคำนวณ...
            </span>
          ) : "✦ รัน Forecast"}
        </button>

        {error && (
          <p className="mt-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
      </article>

      <article className="glass-card p-6">
        <h3 className="font-heading text-2xl text-[var(--ink)]">ผลพยากรณ์</h3>

        {!result && (
          <div className="mt-8 flex flex-col items-center py-8 text-center">
            <span className="text-5xl">📊</span>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              เลือก merchant และช่วงเวลา
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              จากนั้นกดรัน forecast เพื่อดูผลพยากรณ์
            </p>
          </div>
        )}

        {result && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 fade-rise">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">Projected Bookings</p>
              <p className="mt-1 font-heading text-3xl text-gradient-emerald">
                {result.projectedBookings.toLocaleString("th-TH")}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">Projected Revenue</p>
              <p className="mt-1 font-heading text-3xl text-gradient-gold">
                {result.projectedRevenue.toLocaleString("th-TH")} ฿
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">Confidence</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-deep)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent-deep)] to-[var(--accent)] transition-all"
                    style={{ width: `${Math.round(result.confidence * 100)}%` }}
                  />
                </div>
                <span className="font-heading text-lg font-bold text-[var(--accent)]">
                  {Math.round(result.confidence * 100)}%
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs text-[var(--ink-muted)]">Trend / Week</p>
              <p className="mt-1 font-heading text-3xl text-[var(--ink)]">
                {result.trendPerWeek > 0 ? "↑" : result.trendPerWeek < 0 ? "↓" : "→"}{" "}
                {result.trendPerWeek}
              </p>
            </div>

            <div className="sm:col-span-2 rounded-xl border border-[var(--warn)]/20 bg-[var(--warn-bg)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--warn)]">
                ⚠ Scenario: Cost +10%
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
                ผลกระทบรายได้ {result.scenario.costIndexIncrease10.estimatedRevenueImpactPct}%
              </p>
              <p className="mt-1 text-sm leading-7 text-[var(--ink-soft)]">
                {result.scenario.costIndexIncrease10.suggestedAction}
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
