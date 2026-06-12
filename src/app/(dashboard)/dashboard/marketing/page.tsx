"use client";

import { Megaphone, Calendar, Gift, Users, TrendingUp, Eye, MousePointer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const campaigns = [
  { name: "Summer Wellness 20%", status: "active", reach: 2400, clicks: 320, conversion: 13.3, budget: "฿5,000", color: "#2D6A4F" },
  { name: "New Customer Welcome", status: "active", reach: 1800, clicks: 245, conversion: 11.2, budget: "฿3,000", color: "#52B788" },
  { name: "Weekend Special", status: "scheduled", reach: 0, clicks: 0, conversion: 0, budget: "฿2,500", color: "#D4A843" },
  { name: "Couple Package", status: "ended", reach: 3200, clicks: 480, conversion: 15.0, budget: "฿4,000", color: "#40916C" },
];

const channelData = [
  { channel: "LINE OA", reach: 1200, cost: 2000 },
  { channel: "Facebook", reach: 900, cost: 1500 },
  { channel: "Instagram", reach: 600, cost: 1000 },
  { channel: "Walk-in", reach: 400, cost: 0 },
  { channel: "Referral", reach: 300, cost: 500 },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">การตลาด</h2>
        <p className="text-sm text-slate-500">Marketing — จัดการแคมเปญและวิเคราะห์ช่องทางการตลาด</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "แคมเปญ Active", value: "2", icon: Megaphone, color: "#2D6A4F" },
          { label: "Reach ทั้งหมด", value: "4,200", icon: Eye, color: "#52B788" },
          { label: "Clicks", value: "565", icon: MousePointer, color: "#D4A843" },
          { label: "Conversion Rate", value: "12.8%", icon: TrendingUp, color: "#40916C" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <s.icon className="h-4 w-4 mb-2" style={{ color: s.color }} />
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Campaign List */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">แคมเปญทั้งหมด</h3>
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.name} className="flex items-center gap-4 rounded-xl border border-slate-50 bg-slate-50/50 p-3 hover:bg-slate-50 transition">
              <div className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{c.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Budget: {c.budget}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                c.status === "active" ? "bg-emerald-50 text-emerald-600" :
                c.status === "scheduled" ? "bg-amber-50 text-amber-600" :
                "bg-slate-100 text-slate-400"
              }`}>{c.status}</span>
              <div className="text-right text-xs">
                <p className="text-slate-600">{c.reach.toLocaleString()} reach</p>
                <p className="text-[10px] text-slate-400">{c.conversion}% conv.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Performance */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">ประสิทธิภาพช่องทาง</h3>
        <p className="text-xs text-slate-400 mb-4">Channel Performance</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 5, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="channel" type="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 11 }} />
              <Bar dataKey="reach" name="Reach" fill="#2D6A4F" radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
