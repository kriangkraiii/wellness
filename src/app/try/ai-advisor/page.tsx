"use client";

import { useEffect, useState } from "react";
import { Sparkles, CheckCircle, Lightbulb, Loader2, Store, HelpCircle } from "lucide-react";
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

export default function TryAiAdvisorPage() {
  const { t } = useLanguage();

  const [merchants, setMerchants] = useState<Array<{ slug: string; name: string; location?: string }>>([]);
  const [merchantSlug, setMerchantSlug] = useState("guest-custom-store");
  
  // Custom store inputs
  const [customName, setCustomName] = useState("นวดคลายเส้น ขอนแก่น");
  const [customBusinessType, setCustomBusinessType] = useState<"MASSAGE" | "SPA" | "WELLNESS_TOURISM">("SPA");
  const [customLocation, setCustomLocation] = useState("เมืองขอนแก่น");

  const [objective, setObjective] = useState("ต้องการเพิ่มยอดลูกค้าคลายเครียดช่วงวันธรรมดา");
  const [budgetLevel, setBudgetLevel] = useState<"low" | "medium" | "high">("medium");
  const [targetAudience, setTargetAudience] = useState<"local" | "thai-traveler" | "international">("thai-traveler");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch real merchants
  useEffect(() => {
    fetch("/api/public/merchants")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok && payload.data?.merchants) {
          setMerchants(payload.data.merchants);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const bodyData: any = {
      merchantSlug,
      objective,
      budgetLevel,
      targetAudience,
    };

    if (merchantSlug === "guest-custom-store") {
      bodyData.customName = customName;
      bodyData.customBusinessType = customBusinessType;
      bodyData.customLocation = customLocation;
    }

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
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

  const isCustomStore = merchantSlug === "guest-custom-store";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("AI แนะนำกลยุทธ์ (Sandbox)", "AI Strategic Advisor")}</h2>
        <p className="text-sm text-slate-500">
          {t(
            "วิเคราะห์กลยุทธ์การตลาดและการบริการของสปาหรือร้านจำลองของคุณด้วย AI (Gemini 3.5)",
            "Analyze marketing & service strategies for your spa or simulated shop using Gemini 3.5"
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.1fr_1.3fr]">
        {/* Left Form Panel */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="h-4 w-4 text-[#D4A843]" />
            {t("ตั้งค่าข้อมูลวิเคราะห์", "Simulation Settings")}
          </h3>

          <div className="space-y-4">
            {/* Merchant selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {t("เลือกร้านค้าเพื่อวิเคราะห์", "Select Store type")}
              </label>
              <select
                value={merchantSlug}
                onChange={(e) => setMerchantSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white text-slate-700 font-medium"
              >
                <option value="guest-custom-store">
                   {t("จำลองเปิดร้านใหม่ / ผู้ใช้ทั่วไป", "Simulate Custom Shop")}
                </option>
                {merchants.map((m) => (
                  <option key={m.slug} value={m.slug}>
                     {m.name} ({m.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom attributes (only if Simulating new shop) */}
            {isCustomStore && (
              <div className="rounded-xl border border-emerald-100 bg-[#F7F9F6] p-3 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wide">
                  <Store className="h-3.5 w-3.5" />
                  <span>{t("ข้อมูลร้านค้าจำลองของคุณ", "Simulated Spa Settings")}</span>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                    {t("ชื่อร้านสปา/นวดจำลอง", "Simulated Shop Name")}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#52B788] transition"
                  />
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      {t("ประเภทสปา", "Business Type")}
                    </label>
                    <select
                      value={customBusinessType}
                      onChange={(e) => setCustomBusinessType(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#52B788] transition"
                    >
                      <option value="SPA">สปาเต็มรูปแบบ (SPA)</option>
                      <option value="MASSAGE">นวดเพื่อสุขภาพ (MASSAGE)</option>
                      <option value="WELLNESS_TOURISM">ท่องเที่ยวสุขภาพ (WELLNESS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      {t("ทำเลที่ตั้ง (จังหวัด)", "Location / Province")}
                    </label>
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#52B788] transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Strategy objectives */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {t("เป้าหมายหลักทางธุรกิจ", "Primary Business Objective")}
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition resize-none"
                placeholder={t("เช่น เพิ่มลูกค้าในวันธรรมดา, ขยายกลุ่มชาวต่างชาติ", "e.g., Increase weekday bookings, attract expats")}
              />
            </div>

            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {t("งบประมาณดำเนินการ", "Actionable Budget")}
                </label>
                <select
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value as "low" | "medium" | "high")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white"
                >
                  <option value="low">{t("งบประหยัด (Low)", "Low Budget")}</option>
                  <option value="medium">{t("งบปานกลาง (Medium)", "Medium Budget")}</option>
                  <option value="high">{t("งบพรีเมียม (High)", "High Budget")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {t("กลุ่มลูกค้าเป้าหมาย", "Target Segment")}
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as "local" | "thai-traveler" | "international")}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-[#52B788] transition bg-white"
                >
                  <option value="local">{t("ลูกค้าในพื้นที่ (Local)", "Locals")}</option>
                  <option value="thai-traveler">{t("นักท่องเที่ยวไทย (Thai)", "Thai Travelers")}</option>
                  <option value="international">{t("ชาวต่างชาติ (Int'l)", "Foreign Tourists")}</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2D6A4F] py-2.5 text-xs font-semibold text-white transition hover:bg-[#1B4332] flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("กำลังประมวลผลคำแนะนำ...", "Processing Recommendations...")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#95D5B2]" />
                {t("เริ่มวิเคราะห์คำแนะนำ AI", "Generate AI Recommendations")}
              </>
            )}
          </button>
        </form>

        {/* Right Output Panel */}
        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600 shadow-sm animate-fadeIn">
              {error}
            </div>
          )}

          {/* Loading state skeleton */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 rounded-2xl bg-slate-200" />
              <div className="space-y-3">
                <div className="h-16 rounded-xl bg-slate-200" />
                <div className="h-16 rounded-xl bg-slate-200" />
                <div className="h-16 rounded-xl bg-slate-200" />
              </div>
            </div>
          )}

          {/* Recommendations Result Display */}
          {!loading && result && (
            <div className="space-y-4 animate-fadeIn">
              {/* Score card */}
              <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] p-5 text-white shadow-sm flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Sparkles className="h-5 w-5 text-[#95D5B2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{t("การวิเคราะห์สปาสำเร็จ", "Analysis Success")}</h3>
                    <p className="text-[11px] text-white/80 leading-relaxed mt-0.5">
                      {result.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                  <div className="relative h-10 w-10">
                    <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#95D5B2" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${result.ruleScore * 2.51} 251`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold">{result.ruleScore}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#95D5B2]">{t("คะแนนกลยุทธ์รวม", "Total strategy score")}</p>
                    <p className="text-[8px] text-white/60">{t("ประเมินความสอดคล้องเชิงความสามารถและงบประมาณ", "Evaluated capabilities & budget alignment")}</p>
                  </div>
                </div>
              </div>

              {/* Suggestions List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t("แผนแนวทางปฏิบัติการ", "Actionable Suggestions")}
                </h4>
                <div className="space-y-2.5">
                  {result.items.map((item, index) => (
                    <div key={index} className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm hover:border-emerald-500/20 transition-all flex items-start gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-[#2D6A4F]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold text-slate-400 uppercase">
                            {item.category}
                          </span>
                          <span className="text-[9px] font-bold text-[#2D6A4F] bg-emerald-50 px-1.5 py-0.5 rounded">
                            Score: {item.score}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-800">{item.title}</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{item.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LLM Narrative */}
              {result.llmNarrative && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4.5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#D4A843]" />
                    <h4 className="text-xs font-bold text-slate-800">
                      {t("บทวิเคราะห์เชิงกลยุทธ์จาก AI", "AI Strategic Narrative")}
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
            <div className="rounded-2xl border border-slate-200/50 bg-white p-8 text-center max-w-sm mx-auto mt-6">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#2D6A4F] mb-4">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">{t("เริ่มต้นวิเคราะห์ด้วย AI", "Start AI Business Analysis")}</h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                {t(
                  "กำหนดข้อมูลร้านค้าเป้าหมายและงบประมาณด้านซ้ายมือ จากนั้นคลิกปุ่มเพื่อประมวลผลกลยุทธ์และรับเอกสารคำแนะนำฉบับบำบัดรักษาทันที",
                  "Configure your spa parameters on the left, then click generate to fetch instant strategic reports."
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
