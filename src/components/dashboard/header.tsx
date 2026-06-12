"use client";

import { Bell, Calendar, ChevronDown, LogOut, LayoutDashboard, TrendingUp, Sparkles, Megaphone } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./language-context";

interface DashboardHeaderProps {
  spaName: string;
  userName: string;
}

export function DashboardHeader({ spaName, userName }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const today = new Date();
  const dateStr = today.toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-slate-200/60 bg-white px-4 py-3 md:px-6 lg:px-8">
      {/* Left: Page context */}
      <div className="ml-10 lg:ml-0">
        <h1 className="text-lg font-bold text-slate-800">{t("แดชบอร์ด", "Dashboard")}</h1>
        <p className="text-xs text-slate-500">
          {t("สวัสดี, ", "Hello, ")}{spaName} 👋
        </p>
      </div>

      {/* Right: Date + Actions */}
      <div className="flex items-center gap-3">
        {/* Date range */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 md:flex">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{dateStr}</span>
        </div>

        {/* Business Tools Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowBusinessMenu(!showBusinessMenu)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#52B788] hover:text-[#2D6A4F] cursor-pointer"
          >
            <span className="text-[#2D6A4F] font-bold">{t("สำหรับผู้ประกอบการ", "For Operators")}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showBusinessMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowBusinessMenu(false)} />
              <div className="absolute right-0 top-full z-40 mt-1 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {t("เครื่องมือจัดการสปา", "Spa Business Tools")}
                </div>
                <Link
                  href="/dashboard"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition font-medium"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <LayoutDashboard className="h-4 w-4 text-[#2D6A4F]" />
                  <span>{t("เข้าสู่ Dashboard ธุรกิจ", "Enter Business Dashboard")}</span>
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition font-medium"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <TrendingUp className="h-4 w-4 text-[#2D6A4F]" />
                  <span>{t("ระบบวิเคราะห์พยากรณ์ดีมานด์", "Demand Forecasting System")}</span>
                </Link>
                <Link
                  href="/dashboard/ai-advisor"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition font-medium"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <Sparkles className="h-4 w-4 text-[#2D6A4F]" />
                  <span>{t("รับคำแนะนำการตลาดจาก AI", "Get Marketing Advice from AI")}</span>
                </Link>
                <Link
                  href="/dashboard/marketing"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition font-medium"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <Megaphone className="h-4 w-4 text-[#2D6A4F]" />
                  <span>{t("เครื่องมือการตลาด", "Marketing Tools")}</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setLanguage("th")}
            className={`rounded px-1.5 py-1 text-[10px] font-bold transition ${
              language === "th" ? "bg-[#2D6A4F] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            TH
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`rounded px-1.5 py-1 text-[10px] font-bold transition ${
              language === "en" ? "bg-[#2D6A4F] text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            EN
          </button>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-[#52B788] hover:text-[#2D6A4F]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm transition hover:border-[#52B788]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full z-40 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                <div className="border-b border-slate-100 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-800">{userName}</p>
                  <p className="text-[10px] text-slate-400">{t("ผู้ประกอบการ", "Spa Operator")}</p>
                </div>
                <Link
                  href="/dashboard/settings"
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  {t("ตั้งค่าโปรไฟล์", "Profile Settings")}
                </Link>
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    try {
                      await fetch("/api/auth/logout", { method: "POST" });
                      window.location.href = "/admin/login";
                    } catch (e) {
                      console.error("Logout failed:", e);
                    }
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 transition hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t("ออกจากระบบ", "Log Out")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
