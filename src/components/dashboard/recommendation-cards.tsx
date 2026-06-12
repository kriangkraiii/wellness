"use client";

import { ArrowRight, Laptop, Leaf, Gift, Coffee } from "lucide-react";
import Link from "next/link";

const recommendations = [
  {
    icon: Laptop,
    title: "แก้ Office Syndrome",
    desc: "โปรแกรมนวดเฉพาะกลุ่มคนทำงานออฟฟิศ",
    color: "#2D6A4F",
    bgColor: "#2D6A4F10",
  },
  {
    icon: Leaf,
    title: "ใช้สมุนไพรท้องถิ่น",
    desc: "โคราชสมุนไพรคุณภาพราคาดี",
    color: "#52B788",
    bgColor: "#52B78810",
  },
  {
    icon: Gift,
    title: "โปรโมชั่นสุดพิเศษ",
    desc: "สุดสัปดาห์ Package ลด 20%",
    color: "#D4A843",
    bgColor: "#D4A84310",
  },
  {
    icon: Coffee,
    title: "สร้าง Signature Drink",
    desc: "เครื่องดื่มสมุนไพรอัตลักษณ์อีสาน",
    color: "#40916C",
    bgColor: "#40916C10",
  },
];

export function RecommendationCards() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            สิ่งที่ AI แนะนำให้คุณทำตอนนี้
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">AI Recommendations</p>
        </div>
        <Link
          href="/dashboard/ai-advisor"
          className="text-xs font-semibold text-[#2D6A4F] transition hover:text-[#1B4332]"
        >
          ดูทั้งหมด →
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Link
              key={rec.title}
              href="/dashboard/ai-advisor"
              className="group flex flex-col gap-2 rounded-xl border border-slate-100 p-3.5 transition-all duration-200 hover:border-[#52B788]/30 hover:shadow-md cursor-pointer"
            >
              <div
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: rec.bgColor }}
              >
                <Icon className="h-4 w-4" style={{ color: rec.color }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#2D6A4F]">
                  {rec.title}
                </h4>
                <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-2">
                  {rec.desc}
                </p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-[10px] font-semibold text-[#52B788] opacity-0 transition-opacity group-hover:opacity-100">
                ดูเพิ่มเติม
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
