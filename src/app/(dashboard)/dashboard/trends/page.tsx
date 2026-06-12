"use client";

import { useState } from "react";
import { TrendingUp, MessageCircle, Lightbulb, Search, ExternalLink, ThumbsUp, ThumbsDown, Minus, Flame, Sparkles } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const trendData = [
  { month: "ม.ค.", aromatherapy: 120, thaiMassage: 95, hotStone: 60, herbal: 45 },
  { month: "ก.พ.", aromatherapy: 135, thaiMassage: 100, hotStone: 65, herbal: 50 },
  { month: "มี.ค.", aromatherapy: 150, thaiMassage: 110, hotStone: 70, herbal: 55 },
  { month: "เม.ย.", aromatherapy: 170, thaiMassage: 108, hotStone: 75, herbal: 62 },
  { month: "พ.ค.", aromatherapy: 185, thaiMassage: 115, hotStone: 72, herbal: 68 },
  { month: "มิ.ย.", aromatherapy: 200, thaiMassage: 120, hotStone: 80, herbal: 75 },
];

const sentimentData = [
  { label: "เชิงบวก", value: 85, color: "#2D6A4F" },
  { label: "เป็นกลาง", value: 10, color: "#D4A843" },
  { label: "เชิงลบ", value: 5, color: "#EF4444" },
];

const innovations = [
  { name: "Sleep Wellness", desc: "โปรแกรมสปาช่วยการนอนหลับ", demand: "38%", trend: "up", badge: "HOT" },
  { name: "Men Wellness", desc: "สปาเฉพาะสำหรับผู้ชาย", demand: "25%", trend: "up", badge: "NEW" },
  { name: "Digital Detox Program", desc: "โปรแกรมลดการใช้หน้าจอ", demand: "22%", trend: "up", badge: "NEW" },
  { name: "Longevity Program", desc: "แพ็คเกจชะลอวัย", demand: "18%", trend: "up", badge: null },
];

const tabs = ["ภาพรวม", "Trends", "Social Listening", "Innovation Radar"];

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState("ภาพรวม");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">เทรนด์ & Social Listening</h2>
        <p className="text-sm text-slate-500">Trend Analysis — วิเคราะห์แนวโน้มตลาดและพฤติกรรมผู้บริโภค</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === tab ? "bg-white text-[#2D6A4F] shadow-sm" : "text-slate-500"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">แนวโน้มความต้องการบริการ</h3>
        <p className="text-xs text-slate-400 mb-4">Service Demand Trends (6 months)</p>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="trendAroma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.15}/><stop offset="100%" stopColor="#2D6A4F" stopOpacity={0}/></linearGradient>
                <linearGradient id="trendThai" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#52B788" stopOpacity={0.15}/><stop offset="100%" stopColor="#52B788" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 11 }} />
              <Area type="monotone" dataKey="aromatherapy" name="Aromatherapy" stroke="#2D6A4F" strokeWidth={2} fill="url(#trendAroma)" />
              <Area type="monotone" dataKey="thaiMassage" name="Thai Massage" stroke="#52B788" strokeWidth={2} fill="url(#trendThai)" />
              <Area type="monotone" dataKey="hotStone" name="Hot Stone" stroke="#D4A843" strokeWidth={1.5} fill="none" />
              <Area type="monotone" dataKey="herbal" name="Herbal" stroke="#95D5B2" strokeWidth={1.5} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Social Listening + Innovation Radar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Social Listening */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-4 w-4 text-[#2D6A4F]" />
            <h3 className="text-sm font-bold text-slate-800">Social Listening</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {sentimentData.map(s => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}%</p>
                <p className="text-[10px] text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-3">
            <p className="text-xs text-slate-400 font-medium">คำค้นหายอดนิยม</p>
            <div className="flex flex-wrap gap-1.5">
              {["สปาขอนแก่น", "นวดไทย", "อโรมา", "ประคบสมุนไพร", "ผ่อนคลาย", "Office Syndrome"].map(tag => (
                <span key={tag} className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-[#2D6A4F]">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Innovation Radar */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-[#D4A843]" />
            <h3 className="text-sm font-bold text-slate-800">Innovation Radar</h3>
          </div>
          <div className="space-y-3">
            {innovations.map(item => (
              <div key={item.name} className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-3 hover:bg-slate-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    {item.badge && (
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold text-white ${
                        item.badge === "HOT" ? "bg-red-500" : "bg-[#2D6A4F]"
                      }`}>{item.badge}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#2D6A4F]">{item.demand}</p>
                  <p className="text-[9px] text-slate-400">demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
