"use client";

import { useState } from "react";
import { TrendingUp, MessageCircle, Lightbulb, BarChart2, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/components/dashboard/language-context";

const trendData = [
  { month: "ม.ค.", aromatherapy: 120, thaiMassage: 95, hotStone: 60, herbal: 45 },
  { month: "ก.พ.", aromatherapy: 135, thaiMassage: 100, hotStone: 65, herbal: 50 },
  { month: "มี.ค.", aromatherapy: 150, thaiMassage: 110, hotStone: 70, herbal: 55 },
  { month: "เม.ย.", aromatherapy: 170, thaiMassage: 108, hotStone: 75, herbal: 62 },
  { month: "พ.ค.", aromatherapy: 185, thaiMassage: 115, hotStone: 72, herbal: 68 },
  { month: "มิ.ย.", aromatherapy: 200, thaiMassage: 120, hotStone: 80, herbal: 75 },
];

const sentimentData = [
  { label: "เชิงบวก (Positive)", value: 85, color: "#2D6A4F" },
  { label: "เป็นกลาง (Neutral)", value: 10, color: "#D4A843" },
  { label: "เชิงลบ (Negative)", value: 5, color: "#EF4444" },
];

const innovations = [
  { name: "Sleep Wellness", desc: "โปรแกรมสปาช่วยการนอนหลับลึก", demand: "38%", badge: "HOT" },
  { name: "Men Wellness", desc: "ทรีตเมนต์สปาและนวดไทยเฉพาะสำหรับผู้ชาย", demand: "25%", badge: "NEW" },
  { name: "Digital Detox Program", desc: "บำบัดอาการล้าทางสายตาและออฟฟิศซินโดรม", demand: "22%", badge: "NEW" },
  { name: "Longevity Program", desc: "โปรแกรมชะลอวัยและฟื้นฟูสุขภาพองค์รวม", demand: "18%", badge: null },
];

export default function TryTrendsPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-800">เทรนด์สุขภาพสปาอีสาน (Market Trends Sandbox)</h2>
        <p className="text-sm text-slate-500">
          วิเคราะห์แนวโน้มตลาด พฤติกรรมความต้องการการนวด และสถิติ Social Listening ในระดับภูมิภาค
        </p>
      </div>

      {/* Main Trend Line Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-[#2D6A4F]" />
          แนวโน้มความต้องการแต่ละบริการสปา
        </h3>
        <p className="text-xs text-slate-400 mb-4">Service Demand Trends (6 months overview)</p>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trendAroma" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="trendThai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52B788" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#52B788" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 11 }} />
              <Area type="monotone" dataKey="aromatherapy" name="Aroma Therapy" stroke="#2D6A4F" strokeWidth={2} fill="url(#trendAroma)" />
              <Area type="monotone" dataKey="thaiMassage" name="Thai Massage" stroke="#52B788" strokeWidth={2} fill="url(#trendThai)" />
              <Area type="monotone" dataKey="hotStone" name="Hot Stone" stroke="#D4A843" strokeWidth={1.5} fill="none" />
              <Area type="monotone" dataKey="herbal" name="Herbal Compression" stroke="#95D5B2" strokeWidth={1.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Social listening + Innovation columns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sentiment analysis card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-[#2D6A4F]" />
            <h3 className="text-sm font-bold text-slate-800">Social Listening Sentiment</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {sentimentData.map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xl font-bold" style={{ color: s.color }}>
                  {s.value}%
                </p>
                <p className="text-[9px] text-slate-500 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-500">{t("แฮชแท็ก/คำค้นหายอดนิยม", "Top Search Queries")}</p>
            <div className="flex flex-wrap gap-1.5">
              {["สปาขอนแก่น", "นวดแผนไทยเพื่อสุขภาพ", "สมุนไพรอีสานบำบัด", "นวดแก้ออฟฟิศซินโดรม", "Aroma นวดน้ำมัน", "แพ็คเกจคู่รักสปา"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-[#2D6A4F]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Innovation radar card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-[#D4A843]" />
            <h3 className="text-sm font-bold text-slate-800">Innovation Radar (บริการมาแรง)</h3>
          </div>
          <div className="space-y-3">
            {innovations.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`rounded px-1 py-0.5 text-[8px] font-bold text-white leading-none ${
                          item.badge === "HOT" ? "bg-red-500" : "bg-[#2D6A4F]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#2D6A4F]">{item.demand}</p>
                  <p className="text-[9px] text-slate-400">ดีมานด์</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
