"use client";

import { type LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  titleEn: string;
  value: string;
  suffix?: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function KpiCard({
  title,
  value,
  suffix,
  change,
  trend,
  icon: Icon,
  color,
  delay = 0,
}: KpiCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative corner */}
      <div
        className="absolute -right-3 -top-3 h-16 w-16 rounded-full opacity-8 transition-opacity duration-300 group-hover:opacity-15"
        style={{ background: color }}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className="mb-3 inline-flex items-center justify-center rounded-xl p-2"
          style={{ background: `${color}12` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-slate-800">
            {value}
          </span>
          {suffix && (
            <span className="text-sm font-medium text-slate-500">{suffix}</span>
          )}
        </div>

        {/* Title */}
        <p className="mt-1 text-xs font-medium text-slate-500">{title}</p>

        {/* Change indicator */}
        <div
          className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            trend === "up"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
}
