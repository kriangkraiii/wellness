"use client";

import { useEffect, useState } from "react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { BarChart3, Users, TrendingUp, DollarSign, Target, ShoppingBag, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { useLanguage } from "@/components/dashboard/language-context";

interface AnalyticsData {
  kpi: {
    totalRevenue: number;
    netProfit: number;
    totalBookings: number;
    avgTicket: number;
    satisfaction: number;
    returnRate: number;
  };
  chartData: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
  servicePerformance: Array<{
    name: string;
    bookings: number;
    revenue: number;
  }>;
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
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

  const { kpi, chartData, servicePerformance } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("วิเคราะห์ธุรกิจ", "Business Analytics")}</h2>
        <p className="text-sm text-slate-500">{t("ภาพรวมการวิเคราะห์ธุรกิจ", "Business Analytics Overview")}</p>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <KpiCard title={t("รายได้รวม", "Total Revenue")} titleEn="Revenue" value={`฿${kpi.totalRevenue.toLocaleString()}`} change="+12.5%" trend="up" icon={DollarSign} color="#2D6A4F" />
        <KpiCard title={t("กำไรสุทธิ", "Net Profit")} titleEn="Profit" value={`฿${kpi.netProfit.toLocaleString()}`} change="+15.2%" trend="up" icon={TrendingUp} color="#52B788" />
        <KpiCard title={t("จำนวนจอง", "Total Bookings")} titleEn="Bookings" value={kpi.totalBookings.toString()} change="+10.1%" trend="up" icon={ShoppingBag} color="#40916C" />
        <KpiCard title={t("ลูกค้าใหม่", "New Customers")} titleEn="New" value="125" suffix={t("คน", "pax")} change="+18.2%" trend="up" icon={Users} color="#D4A843" />
        <KpiCard title={t("อัตราการกลับมา", "Return Rate")} titleEn="Return" value={`${kpi.returnRate}%`} change="+8.3%" trend="up" icon={Target} color="#2D6A4F" />
        <KpiCard title={t("Avg. Ticket", "Avg. Ticket")} titleEn="Per Visit" value={`฿${kpi.avgTicket.toLocaleString()}`} change="+7.6%" trend="up" icon={BarChart3} color="#52B788" />
      </div>

      {/* Revenue vs Cost Chart */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">{t("รายได้ vs ต้นทุน", "Revenue vs Cost")}</h3>
        <p className="text-xs text-slate-400 mb-4">{t("รายได้ vs ต้นทุน vs กำไร (30 วันล่าสุด)", "Revenue vs Cost vs Profit (Last 30 Days)")}</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }} formatter={(v) => [`฿${Number(v).toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="revenue" name={t("รายได้", "Revenue")} fill="#2D6A4F" radius={[6,6,0,0]} />
              <Bar dataKey="cost" name={t("ต้นทุน", "Cost")} fill="#95D5B2" radius={[6,6,0,0]} />
              <Bar dataKey="profit" name={t("กำไร", "Profit")} fill="#D4A843" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Performance */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">{t("ประสิทธิภาพบริการ", "Service Performance")}</h3>
        <p className="text-xs text-slate-400 mb-4">{t("อันดับประสิทธิภาพของแต่ละบริการ", "Service Performance Ranking")}</p>
        <div className="space-y-3">
          {servicePerformance.map((svc, i) => (
            <div key={svc.name} className="flex items-center gap-4">
              <span className="w-5 text-xs font-bold text-slate-400">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{svc.name}</span>
                  <span className="text-xs text-slate-500">{svc.bookings} {t("จอง", "bookings")} · ฿{svc.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#52B788]" style={{ width: `${Math.min(100, (svc.bookings / (kpi.totalBookings * 0.5)) * 100)}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
