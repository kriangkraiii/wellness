"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle, Lightbulb, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

interface RecommendationItem {
  title: string;
  reason: string;
  score: number;
  category: string;
}

interface RecommendationResponse {
  ruleScore: number;
  summary: string;
  items: RecommendationItem[];
  llmNarrative?: string;
  llmModel?: string;
}

export default function AiAdvisorPage() {
  const { t } = useLanguage();
  
  const [merchants, setMerchants] = useState<Array<{ slug: string; name: string }>>([]);
  const [merchantSlug, setMerchantSlug] = useState("");
  const [objective, setObjective] = useState("ต้องการเพิ่มยอดลูกค้าคลายเครียดช่วงวันธรรมดา");
  const [budgetLevel, setBudgetLevel] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState<"local" | "thai-traveler" | "international">("thai-traveler");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/merchant-hub")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok && payload.data?.merchants) {
          setMerchants(payload.data.merchants);
          if (payload.data.merchants.length > 0) {
            setMerchantSlug(payload.data.merchants[0].slug);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantSlug) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantSlug,
          objective,
          budgetLevel,
          targetAudience,
        }),
      });

      const payload = await res.json();
      if (payload.ok) {
        setResult(payload.data);
      } else {
        setError(payload.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์บำบัดคำแนะนำได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("AI แนะนำ", "AI Advisor")}</h2>
        <p className="text-sm text-slate-500">{t("คำแนะนำทางธุรกิจส่วนบุคคลจากโมเดลภาษาขนาดใหญ่และฐานข้อมูลกฎเกณฑ์", "Personalized business strategies powered by LLM and Rule Engine")}</p>
      </div>

      {/* Input panel */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D4A843]" />
          {t("ตั้งค่าเงื่อนไขวิเคราะห์ความเห็น", "Set Analysis Parameters")}
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              {t("ผู้ประกอบการ / สปา", "Spa / Merchant")}
            </label>
            <select
              value={merchantSlug}
              onChange={(e) => setMerchantSlug(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white text-slate-700 font-medium mb-3"
            >
              {merchants.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              {t("เป้าหมายหลักทางธุรกิจ", "Primary Business Objective")}
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition resize-none"
              placeholder={t("เช่น เพิ่มสัดส่วนจองวันธรรมดา 15%", "e.g., Increase weekday bookings by 15%")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {t("ระดับงบประมาณดำเนินการ", "Actionable Budget Level")}
              </label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value as "low" | "medium" | "high")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white"
              >
                <option value="low">{t("งบประมาณน้อย (Low)", "Low Budget")}</option>
                <option value="medium">{t("งบประมาณปานกลาง (Medium)", "Medium Budget")}</option>
                <option value="high">{t("งบประมาณสูง/พรีเมียม (High)", "High Budget")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {t("กลุ่มลูกค้าเป้าหมาย", "Target Audience")}
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as "local" | "thai-traveler" | "international")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white"
              >
                <option value="local">{t("ลูกค้าในพื้นที่ (Local)", "Local Customers")}</option>
                <option value="thai-traveler">{t("นักท่องเที่ยวไทย (Thai Traveler)", "Thai Travelers")}</option>
                <option value="international">{t("นักท่องเที่ยวต่างชาติ (International)", "International Tourists")}</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#2D6A4F] py-2.5 text-xs font-semibold text-white transition hover:bg-[#1B4332] flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("กำลังประมวลผลคำแนะนำ...", "Processing Recommendations...")}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-[#95D5B2]" />
              {t("เริ่มวิเคราะห์ AI Advisor", "Generate AI Recommendations")}
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Loading state skeleton */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="space-y-3">
            <div className="h-16 rounded-xl bg-slate-100" />
            <div className="h-16 rounded-xl bg-slate-100" />
            <div className="h-16 rounded-xl bg-slate-100" />
          </div>
        </div>
      )}

      {/* Recommendations Result Display */}
      {!loading && result && (
        <div className="space-y-6">
          {/* Rule Summary gauge card */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Sparkles className="h-7 w-7 text-[#95D5B2]" />
              </div>
              <div>
                <h3 className="text-base font-bold">{t("การวิเคราะห์สำเร็จ", "Strategic Recommendation Report")}</h3>
                <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                  {result.summary}
                </p>
              </div>
            </div>
            
            {/* Rule score badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative h-14 w-14">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#95D5B2" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${result.ruleScore * 2.51} 251`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold">{result.ruleScore}%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#95D5B2]">{t("ความคุ้มค่าเชิงนโยบาย", "Rule score")}</p>
                <p className="text-[9px] text-white/60">{t("ความคุ้มค่าการดำเนินนโยบาย", "Operational Viability")}</p>
              </div>
            </div>
          </div>

          {/* List of dynamic rule items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800">{t("ข้อเสนอแนะเชิงปฎิบัติการ", "Actionable Suggestions")}</h4>
            {result.items.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:border-emerald-500/20 transition-all flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-[#2D6A4F]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-medium text-slate-400 uppercase">{item.category}</span>
                    <span className="text-[10px] font-bold text-[#2D6A4F] bg-emerald-50 px-1.5 py-0.5 rounded">Score: {item.score}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          {/* LLM Narrative narrative card */}
          {result.llmNarrative && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-[#D4A843]" />
                <h4 className="text-xs font-bold text-slate-800">
                  {t("บทสรุปกลยุทธ์จาก AI", "AI Strategic Narrative")} 
                  <span className="text-[9px] font-medium text-slate-400 ml-2">({result.llmModel || "gemini-3.5-flash"})</span>
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {result.llmNarrative}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Initial onboarding state */}
      {!loading && !result && (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center max-w-lg mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#2D6A4F] mb-4">
            <Lightbulb className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{t("เริ่มต้นวิเคราะห์ด้วย AI", "Start AI Business Analysis")}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t("กรอกเป้าหมายธุรกิจและงบประมาณด้านบน จากนั้นคลิกปุ่มด้านบนเพื่อให้ระบบประเมินนโยบายพร้อมร่างแนวทางกลยุทธ์โดยละเอียด", 
               "Enter your business goals, operational budget, and target customer segment to generate a comprehensive strategy report powered by our Isan Wellness LLM model.")}
          </p>
        </div>
      )}
    </div>
  );
}
