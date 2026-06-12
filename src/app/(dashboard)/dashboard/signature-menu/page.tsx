"use client";

import { useState } from "react";
import { Sparkles, Leaf, Coffee, Palette, Music, Hand, BookOpen, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

const provinces = [
  "ขอนแก่น", "อุดรธานี", "นครราชสีมา", "อุบลราชธานี", "ชัยภูมิ",
  "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "มหาสารคาม", "ร้อยเอ็ด",
  "กาฬสินธุ์", "สกลนคร", "นครพนม", "มุกดาหาร", "ยโสธร",
  "อำนาจเจริญ", "หนองคาย", "หนองบัวลำภู", "เลย", "บึงกาฬ"
];

const themes = [
  { id: "luxury", label: "Luxury", icon: "✨" },
  { id: "thai-traditional", label: "Thai Traditional", icon: "🏯" },
  { id: "herbal", label: "Herbal", icon: "🌿" },
  { id: "modern-wellness", label: "Modern Wellness", icon: "💆" },
];

interface SignatureResult {
  name: string;
  totalPrice: number;
  story: string;
  visual: string;
  taste: string;
  scent: string;
  sound: string;
  touch: string;
  breakdown: Array<{
    item: string;
    price: string;
  }>;
  supplierCost: number;
  margin: number;
}

export default function SignatureMenuPage() {
  const { t } = useLanguage();
  
  const [selectedProvince, setSelectedProvince] = useState("ขอนแก่น");
  const [selectedTheme, setSelectedTheme] = useState("herbal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignatureResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/signature-menu/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          province: selectedProvince,
          theme: selectedTheme,
        }),
      });

      const payload = await res.json();
      if (payload.ok) {
        setResult(payload.data);
      } else {
        setError(payload.message || "เกิดข้อผิดพลาดในการสร้างเมนู");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อกับบริการ AI ของเราได้ในขณะนี้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("AI แนะนำ Signature", "AI Signature Menu Builder")}</h2>
        <p className="text-sm text-slate-500">{t("สร้างเมนู Signature อัตลักษณ์อีสาน ครบ 5 ประสาทสัมผัส", "Generate unique Isan-identity wellness packages across all 5 senses")}</p>
      </div>

      {/* Selectors */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Province */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#2D6A4F]" />
            {t("เลือกจังหวัดอัตลักษณ์", "Select Province Identity")}
          </h3>
          <div className="grid grid-cols-4 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
            {provinces.map(p => (
              <button
                key={p}
                onClick={() => setSelectedProvince(p)}
                type="button"
                className={`rounded-lg px-2 py-1.5 text-[10px] font-medium transition ${
                  selectedProvince === p
                    ? "bg-[#2D6A4F] text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#D4A843]" />
              {t("เลือกธีม/แนวคิดร้าน", "Select Brand Theme")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(tTheme => (
                <button
                  key={tTheme.id}
                  onClick={() => setSelectedTheme(tTheme.id)}
                  type="button"
                  className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                    selectedTheme === tTheme.id
                      ? "border-[#2D6A4F] bg-emerald-50 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  <span className="text-xl">{tTheme.icon}</span>
                  <span className="text-xs font-semibold text-slate-700">{tTheme.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#2D6A4F] py-2.5 text-xs font-semibold text-white transition hover:bg-[#1B4332] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("กำลังถอดรหัสวัฒนธรรมเพื่อสร้างเมนู...", "Analyzing Local Identity...")}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#95D5B2]" />
                {t("สร้าง Signature Menu ด้วย AI", "Generate Signature Menu")}
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm animate-pulse space-y-4">
          <div className="h-10 w-1/3 bg-slate-100 rounded" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl" />
            ))}
          </div>
          <div className="h-28 bg-slate-50 rounded-xl" />
        </div>
      )}

      {/* Generated Signature */}
      {!loading && result && (
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{result.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t("อัตลักษณ์จังหวัด: ", "Identity: ")}{selectedProvince} · {t("ธีม: ", "Theme: ")}{selectedTheme.toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#2D6A4F]">฿{result.totalPrice.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400">{t("ต่อคน", "per pax")}</p>
            </div>
          </div>

          {/* 5 Senses Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              { sense: t("รูป (Visual)", "Visual (รูป)"), icon: Palette, desc: result.visual, color: "#2D6A4F" },
              { sense: t("รส (Taste)", "Taste (รส)"), icon: Coffee, desc: result.taste, color: "#D4A843" },
              { sense: t("กลิ่น (Scent)", "Scent (กลิ่น)"), icon: Leaf, desc: result.scent, color: "#52B788" },
              { sense: t("เสียง (Sound)", "Sound (เสียง)"), icon: Music, desc: result.sound, color: "#40916C" },
              { sense: t("สัมผัส (Touch)", "Touch (สัมผัส)"), icon: Hand, desc: result.touch, color: "#2D6A4F" },
              { sense: "Story", icon: BookOpen, desc: result.story, color: "#8B5E3C" },
            ].map(comp => {
              const Icon = comp.icon;
              return (
                <div key={comp.sense} className="rounded-xl border border-slate-100 p-3 hover:border-[#52B788]/30 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" style={{ color: comp.color }} />
                    <span className="text-xs font-bold text-slate-700">{comp.sense}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{comp.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Treatment Breakdown */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <h4 className="text-xs font-bold text-slate-800 mb-3">{t("ลำดับการทรีตเมนต์", "Treatment Flow & Duration")}</h4>
            <div className="space-y-2">
              {result.breakdown.map((step, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{step.item}</span>
                  <span className="text-slate-400">{step.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="text-xs text-slate-600">{t("ต้นทุนวัตถุดิบเฉลี่ย", "Ingredient Cost")}</span>
              <span className="text-xs font-bold text-slate-800">฿{result.supplierCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-[#2D6A4F]">{t("อัตรากำไรขั้นต้น/คน", "Gross Profit/Pax")}</span>
              <span className="text-sm font-bold text-[#2D6A4F]">฿{result.margin.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty onboarding state */}
      {!loading && !result && (
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center max-w-lg mx-auto">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-[#2D6A4F] mb-4">
            <Leaf className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{t("สร้าง Signature Menu เอกลักษณ์เฉพาะตัว", "Unlock Isan Signature Experience")}</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {t("เลือกจังหวัดแหล่งต้นกำเนิดวัตถุดิบและธีมทรีตเมนต์ด้านบน เพื่อให้ระบบสังเคราะห์สูตร รูป-รส-กลิ่น-เสียง-สัมผัส ท้องถิ่นเฉพาะสปาของคุณ", 
               "Select an Isan province and brand theme to compile culturally rooted visual ambiance, recipes, scent oils, therapeutic sounds, and massage techniques.")}
          </p>
        </div>
      )}
    </div>
  );
}
