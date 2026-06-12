"use client";

import { useMemo, useState } from "react";

type MerchantOption = {
  slug: string;
  name: string;
};

type RecommendationResponse = {
  ok: boolean;
  message?: string;
  data?: {
    ruleScore: number;
    summary: string;
    items: Array<{
      title: string;
      reason: string;
      score: number;
      category: string;
    }>;
    llmNarrative?: string;
    llmModel?: string;
  };
};

export function RecommendationPanel({ merchants }: { merchants: MerchantOption[] }) {
  const defaultSlug = useMemo(() => merchants[0]?.slug || "", [merchants]);

  const [merchantSlug, setMerchantSlug] = useState(defaultSlug);
  const [objective, setObjective] = useState("ต้องการเพิ่มยอดลูกค้าคลายเครียดช่วงวันธรรมดา");
  const [budgetLevel, setBudgetLevel] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState<
    "local" | "thai-traveler" | "international"
  >("thai-traveler");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResponse["data"]>();

  const disabled = merchants.length === 0 || !merchantSlug;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          merchantSlug,
          objective,
          budgetLevel,
          targetAudience,
        }),
      });

      const payload = (await response.json()) as RecommendationResponse;
      if (!response.ok || !payload.ok || !payload.data) {
        setError(payload.message || "ไม่สามารถสร้างคำแนะนำได้");
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
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form
        onSubmit={onSubmit}
        className="glass-card p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Rule + LLM Recommendation
        </p>
        <h2 className="mt-2 font-heading text-3xl text-[var(--ink)]">
          Recommendation Studio
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
            Objective
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={4}
              className="input-dark mt-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-[var(--ink-soft)]">
              Budget
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value as typeof budgetLevel)}
                className="input-dark mt-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-[var(--ink-soft)]">
              Audience
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as typeof targetAudience)}
                className="input-dark mt-2"
              >
                <option value="local">Local</option>
                <option value="thai-traveler">Thai Traveler</option>
                <option value="international">International</option>
              </select>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || loading}
          className="btn-primary mt-6 w-full"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
              </svg>
              กำลังวิเคราะห์...
            </span>
          ) : "สร้างคำแนะนำ"}
        </button>

        {error && (
          <p className="mt-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger)]">
            {error}
          </p>
        )}
      </form>

      <article className="glass-card p-6">
        <h3 className="font-heading text-2xl text-[var(--ink)]">ผลลัพธ์ Recommendation</h3>

        {!result && (
          <div className="mt-8 flex flex-col items-center py-8 text-center">
            <span className="text-5xl"></span>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              กรอกข้อมูลแล้วกดสร้างคำแนะนำ
            </p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              ผลจาก rule engine และ LLM จะแสดงที่นี่
            </p>
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4 fade-rise">
            {/* Score */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Rule Score</p>
              <p className="mt-1 font-heading text-5xl text-gradient-emerald">{result.ruleScore}</p>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{result.summary}</p>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {result.items.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                    <span className="rounded-full bg-[var(--accent-subtle)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                      {item.score}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                    {item.category}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{item.reason}</p>
                </div>
              ))}
            </div>

            {/* LLM Narrative */}
            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--gold-glow)] p-5">
              <div className="flex items-center gap-2">
                <span className="text-sm">✦</span>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
                  LLM Narrative {result.llmModel ? `(${result.llmModel})` : "(fallback)"}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--ink)]">
                {result.llmNarrative || "ยังไม่มี LLM narrative ในระบบนี้"}
              </p>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
