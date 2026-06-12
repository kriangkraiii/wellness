"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, TrendingUp, BarChart2, ClipboardList, Home, ArrowLeft } from "lucide-react";
import { LanguageProvider, useLanguage } from "@/components/dashboard/language-context";

function TryLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    {
      href: "/try",
      label: t("ภาพรวมการทดลอง", "Overview"),
      icon: Home,
      exact: true,
    },
    {
      href: "/try/ai-advisor",
      label: t("AI แนะนำกลยุทธ์", "AI Advisor"),
      icon: Sparkles,
      exact: false,
    },
    {
      href: "/try/forecast",
      label: t("พยากรณ์ยอดจอง/รายได้", "Demand Forecast"),
      icon: TrendingUp,
      exact: false,
    },
    {
      href: "/try/trends",
      label: t("เทรนด์สุขภาพอีสาน", "Market Trends"),
      icon: BarChart2,
      exact: false,
    },
    {
      href: "/try/records",
      label: t("ประวัติการบำบัด", "Spa Records"),
      icon: ClipboardList,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex flex-col text-slate-800">
      {/* Dynamic Glass Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/60 px-4 py-3 md:px-6 lg:px-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-[#2D6A4F]/10 hover:text-[#2D6A4F]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#2D6A4F] px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                Sandbox
              </span>
              <h1 className="text-sm md:text-base font-bold text-slate-800">
                {t("โหมดทดลองวิเคราะห์ธุรกิจ", "Try-It-Out Sandbox Mode")}
              </h1>
            </div>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium hidden sm:block">
              {t("ทดลองจำลองเปิดร้านนวด สปา และรับคำแนะนำโดยไม่ต้องล็อกอิน", "Simulate spa business & analytics without logging in")}
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => setLanguage("th")}
              className={`rounded px-2 py-1 text-[10px] font-bold transition ${
                language === "th" ? "bg-[#2D6A4F] text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              TH
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded px-2 py-1 text-[10px] font-bold transition ${
                language === "en" ? "bg-[#2D6A4F] text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              EN
            </button>
          </div>

          {/* Quick Dashboard Action */}
          <Link
            href="/admin/login"
            className="rounded-lg bg-[#2D6A4F] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#1B4332] shadow-sm flex items-center gap-1.5"
          >
            {t("เข้าสู่ระบบจริง", "Operator Login")}
          </Link>
        </div>
      </header>

      {/* Horizontal Tabs Bar */}
      <nav className="bg-white border-b border-slate-200/50 overflow-x-auto scrollbar-none sticky top-[57px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/try";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 py-3.5 px-1 border-b-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[#2D6A4F] text-[#2D6A4F] scale-105"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#2D6A4F]" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Try-It-Out Subpage Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <TryLayoutContent>{children}</TryLayoutContent>
    </LanguageProvider>
  );
}
