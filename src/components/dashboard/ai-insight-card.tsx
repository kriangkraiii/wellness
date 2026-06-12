"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AiInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
      {/* Decorative */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#2D6A4F]/5" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[#95D5B2]/10" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-lg bg-[#2D6A4F]/10 p-1.5">
            <Sparkles className="h-4 w-4 text-[#2D6A4F]" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">AI Insight วันนี้</h3>
        </div>

        {/* AI Avatar + Message */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F]">
            <Sparkles className="h-5 w-5 text-[#95D5B2]" />
          </div>
          <div className="flex-1 rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm border border-slate-100">
            <p className="text-xs leading-relaxed text-slate-600">
              ลูกค้าส่วนใหญ่ให้ความสนใจกับ{" "}
              <span className="font-bold text-[#2D6A4F]">&quot;Aromatherapy&quot;</span>{" "}
              มากที่สุด แนะนำให้พัฒนาเป็น{" "}
              <span className="font-bold text-[#2D6A4F]">Signature</span>{" "}
              เพื่อเพิ่มมูลค่า!
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/ai-advisor"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#2D6A4F] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#1B4332] hover:shadow-md"
        >
          ดูคำแนะนำทั้งหมด
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
