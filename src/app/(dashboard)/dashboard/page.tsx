"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { CategoryDonut } from "@/components/dashboard/charts/category-donut";
import { AiInsightCard } from "@/components/dashboard/ai-insight-card";
import { RecommendationCards } from "@/components/dashboard/recommendation-cards";
import { RecentReviews } from "@/components/dashboard/recent-reviews";
import {
  DollarSign,
  UserPlus,
  Users,
  Star,
  RefreshCcw,
} from "lucide-react";

const kpiData = [
  {
    title: "รายได้รวม",
    titleEn: "Revenue",
    value: "฿250,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "#2D6A4F",
  },
  {
    title: "ลูกค้าใหม่",
    titleEn: "New Customers",
    value: "125",
    suffix: "คน",
    change: "+18.2%",
    trend: "up" as const,
    icon: UserPlus,
    color: "#52B788",
  },
  {
    title: "ลูกค้าทั้งหมด",
    titleEn: "Total Customers",
    value: "320",
    suffix: "คน",
    change: "+10.1%",
    trend: "up" as const,
    icon: Users,
    color: "#40916C",
  },
  {
    title: "ความพึงพอใจ",
    titleEn: "Satisfaction",
    value: "4.7",
    suffix: "★",
    change: "+0.3",
    trend: "up" as const,
    icon: Star,
    color: "#D4A843",
  },
  {
    title: "อัตราการกลับมา",
    titleEn: "Return Rate",
    value: "68%",
    change: "+8.3%",
    trend: "up" as const,
    icon: RefreshCcw,
    color: "#2D6A4F",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {kpiData.map((kpi, i) => (
          <KpiCard key={kpi.titleEn} {...kpi} delay={i * 80} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RevenueChart />
        <CategoryDonut />
      </div>

      {/* AI Insight + Recommendation */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <AiInsightCard />
        <RecommendationCards />
      </div>

      {/* Recent Reviews */}
      <RecentReviews />
    </div>
  );
}
