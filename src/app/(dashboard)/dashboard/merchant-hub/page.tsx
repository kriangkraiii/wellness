"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Store, Sparkles, TrendingUp } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

interface MerchantData {
  id: string;
  slug: string;
  name: string;
  businessType: string;
  location: string;
  offerings: unknown[];
  merchantIngredients: unknown[];
}

interface HistoryData {
  merchants: MerchantData[];
  recentRecommendations: Array<{
    id: string;
    ruleScore: number;
    createdAt: string;
  }>;
  recentForecasts: Array<{
    id: string;
    projectedRevenue: number;
    confidence: number;
    createdAt: string;
  }>;
}

const bizIcon: Record<string, string> = {
  MASSAGE: "🤲",
  SPA: "🧖",
  WELLNESS_TOURISM: "🌿",
};

export default function MerchantHubPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/merchant-hub")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setData(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  const { merchants = [], recentRecommendations = [], recentForecasts = [] } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("เครือข่ายผู้ประกอบการ", "Merchant Network Hub")}</h2>
        <p className="text-sm text-slate-500">{t("ระบบรวบรวมข้อมูลรายชื่อผู้ประกอบการท่องเที่ยวเชิงสุขภาพภาคอีสาน", "Central repository of E-san wellness spa and health tourism merchants")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Column: Merchant Cards List */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <Store className="h-5 w-5 text-[#2D6A4F]" />
            <h3 className="font-heading text-base font-bold text-slate-800">
              {t("ผู้ประกอบการทั้งหมด", "All Spa & Wellness Merchants")}
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#2D6A4F]">
              {merchants.length} {t("ราย", "stores")}
            </span>
          </div>

          {merchants.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center text-slate-400">
              <span className="text-4xl block mb-2">🏪</span>
              <p className="font-semibold text-slate-700">{t("ไม่พบข้อมูลผู้ประกอบการ", "No Merchants Found")}</p>
              <p className="text-xs text-slate-400 mt-1">{t("กรุณารัน seed ข้อมูล", "Please seed the database.")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {merchants.map((merchant) => (
                <div
                  key={merchant.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-emerald-500/20 hover:bg-white transition-all duration-200 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{bizIcon[merchant.businessType] || "🏢"}</span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-bold uppercase text-[#2D6A4F]">
                      {merchant.businessType}
                    </span>
                  </div>
                  <h4 className="mt-3 font-heading text-lg font-bold text-slate-800">
                    {merchant.name}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">📍 {merchant.location}</p>
                  
                  <div className="mt-4 pt-3 border-t border-slate-100/50 flex gap-3 text-[10px] text-slate-400 font-semibold">
                    <span className="bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                      {merchant.offerings?.length || 0} {t("บริการ", "services")}
                    </span>
                    <span className="bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                      {merchant.merchantIngredients?.length || 0} {t("วัตถุดิบ", "ingredients")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
            <Link 
              href="/dashboard/ai-advisor" 
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white py-2 px-4 rounded-xl text-xs font-semibold hover:scale-102 transition duration-200 shadow-sm inline-flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              {t("เปิดห้องวิเคราะห์คำแนะนำ", "Go to AI Recommendation Studio")}
            </Link>
            <Link 
              href="/dashboard/forecast" 
              className="border border-slate-200 hover:border-emerald-500 hover:text-[#2D6A4F] text-slate-600 bg-white py-2 px-4 rounded-xl text-xs font-semibold hover:scale-102 transition duration-200 shadow-sm inline-flex items-center gap-1.5"
            >
              <TrendingUp className="h-4 w-4" />
              {t("เปิดระบบพยากรณ์ดีมานด์", "Go to Forecast Dashboard")}
            </Link>
          </div>
        </div>

        {/* Right Column: Dynamic history logs */}
        <div className="space-y-6">
          {/* Latest Recommendation runs */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-[#D4A843]" />
              <h3 className="font-heading text-sm font-bold text-slate-800">
                {t("ประวัติการรันคำแนะนำ AI", "Latest Recommendation Runs")}
              </h3>
            </div>
            
            <div className="space-y-2.5">
              {recentRecommendations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {t("ยังไม่มีการรันคำแนะนำ", "No recommendation runs found.")}
                </p>
              ) : (
                recentRecommendations.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-700">
                        {t("คะแนนความสอดคล้องกฎ:", "Rule Score:")} <span className="text-[#2D6A4F] font-bold">{row.ruleScore}%</span>
                      </p>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-[#2D6A4F]">
                        Score
                      </span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {new Date(row.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest Forecast runs */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-[#2D6A4F]" />
              <h3 className="font-heading text-sm font-bold text-slate-800">
                {t("ประวัติการวิเคราะห์พยากรณ์รายได้", "Latest Forecast Snapshots")}
              </h3>
            </div>
            
            <div className="space-y-2.5">
              {recentForecasts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {t("ยังไม่มีการรันพยากรณ์", "No forecast snapshots found.")}
                </p>
              ) : (
                recentForecasts.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-1.5"
                  >
                    <p className="text-xs font-bold text-slate-700">
                      {t("รายได้พยากรณ์:", "Projected Revenue:")} <span className="text-[#2D6A4F] font-bold">฿{row.projectedRevenue.toLocaleString("th-TH")}</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-bold text-[#2D6A4F]">
                        {t("ความเชื่อมั่น", "Conf.")} {Math.round(row.confidence * 100)}%
                      </span>
                      <span>{new Date(row.createdAt).toLocaleString("th-TH")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
