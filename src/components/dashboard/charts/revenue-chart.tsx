"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const monthlyData = [
  { name: "ม.ค.", revenue: 180000 },
  { name: "ก.พ.", revenue: 195000 },
  { name: "มี.ค.", revenue: 210000 },
  { name: "เม.ย.", revenue: 225000 },
  { name: "พ.ค.", revenue: 205000 },
  { name: "มิ.ย.", revenue: 238000 },
  { name: "ก.ค.", revenue: 250000 },
  { name: "ส.ค.", revenue: 248000 },
  { name: "ก.ย.", revenue: 265000 },
  { name: "ต.ค.", revenue: 275000 },
  { name: "พ.ย.", revenue: 290000 },
  { name: "ธ.ค.", revenue: 310000 },
];

const weeklyData = [
  { name: "จ.", revenue: 35000 },
  { name: "อ.", revenue: 42000 },
  { name: "พ.", revenue: 38000 },
  { name: "พฤ.", revenue: 45000 },
  { name: "ศ.", revenue: 52000 },
  { name: "ส.", revenue: 58000 },
  { name: "อา.", revenue: 48000 },
];

type TabKey = "daily" | "monthly" | "yearly";

const tabs: { key: TabKey; label: string }[] = [
  { key: "daily", label: "รายวัน" },
  { key: "monthly", label: "รายเดือน" },
  { key: "yearly", label: "รายปี" },
];

export function RevenueChart() {
  const [activeTab, setActiveTab] = useState<TabKey>("monthly");

  const data = activeTab === "daily" ? weeklyData : monthlyData;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">ภาพรวมรายรายเดือน</h3>
          <p className="mt-0.5 text-xs text-slate-400">Revenue Overview</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-[#2D6A4F] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total Revenue */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-slate-800">฿250,000</span>
        <span className="ml-2 text-xs font-medium text-emerald-600">+12.5% จากเดือนก่อน</span>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`฿${Number(value).toLocaleString()}`, "รายได้"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2D6A4F"
              strokeWidth={2.5}
              fill="url(#revenueGradient)"
              dot={{ fill: "#2D6A4F", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "#2D6A4F", r: 5, stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
