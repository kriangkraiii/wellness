"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Sparkles,
  Package,
  Handshake,
  TrendingUp,
  Megaphone,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Home,
  Store,
  LineChart,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./language-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/merchant-hub", label: "เครือข่ายผู้ประกอบการ", labelEn: "Merchant Hub", icon: Store },
  { href: "/dashboard/analytics", label: "วิเคราะห์ธุรกิจ", labelEn: "Analytics", icon: BarChart3 },
  { href: "/dashboard/customers", label: "ลูกค้า", labelEn: "Customers", icon: Users },
  { href: "/dashboard/records", label: "ประวัติสปา & บำบัด", labelEn: "Spa Records", icon: ClipboardList },
  { href: "/dashboard/forecast", label: "พยากรณ์ธุรกิจ", labelEn: "Forecast", icon: LineChart },
  { href: "/dashboard/ai-advisor", label: "AI แนะนำ", labelEn: "AI Advisor", icon: Sparkles },
  { href: "/dashboard/signature-menu", label: "Signature Menu", labelEn: "Signature", icon: Leaf },
  { href: "/dashboard/suppliers", label: "วัตถุดิบ & Supplier", labelEn: "Suppliers", icon: Package },
  { href: "/dashboard/partners", label: "พาร์ทเนอร์", labelEn: "Partners", icon: Handshake },
  { href: "/dashboard/trends", label: "เทรนด์", labelEn: "Trends", icon: TrendingUp },
  { href: "/dashboard/marketing", label: "การตลาด", labelEn: "Marketing", icon: Megaphone },
  { href: "/dashboard/settings", label: "ตั้งค่า", labelEn: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-50 rounded-xl bg-[#2D6A4F] p-2.5 text-white shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#2D6A4F] text-white shadow-xl
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-[72px]" : "w-[240px]"}
        `}
      >
        {/* Logo Area */}
        <div className={`flex items-center gap-3 border-b border-white/10 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Leaf className="h-5 w-5 text-[#95D5B2]" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold leading-tight">Spa & Wellness</p>
              <p className="text-[10px] text-white/60">Intelligence Platform</p>
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-white/60" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                  transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }
                `}
                title={collapsed ? t(item.label, item.labelEn) : undefined}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-[#95D5B2]" : "text-white/50 group-hover:text-white/80"}`} />
                {!collapsed && <span>{t(item.label, item.labelEn)}</span>}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-2 border-t border-white/10" />

          {/* Return to website */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`
              group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
              transition-all duration-200
              ${collapsed ? "justify-center" : ""}
              text-white/70 hover:bg-white/10 hover:text-white
            `}
            title={collapsed ? t("กลับหน้าหลัก", "Back to Home") : undefined}
          >
            <Home className="h-[18px] w-[18px] shrink-0 text-white/50 group-hover:text-white/80" />
            {!collapsed && <span>{t("กลับหน้าหลัก", "Back to Home")}</span>}
          </Link>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden border-t border-white/10 p-3 text-white/40 transition hover:text-white lg:block"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="mx-auto h-4 w-4" />
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <ChevronLeft className="h-4 w-4" />
              <span>{t("ย่อเมนู", "Collapse Menu")}</span>
            </div>
          )}
        </button>

        {/* User info at bottom */}
        {!collapsed && (
          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#95D5B2] text-sm font-bold text-[#2D6A4F]">
                K
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-xs font-semibold">E-san Wellness Spa</p>
                <p className="truncate text-[10px] text-white/50">{t("ผู้ประกอบการ", "Spa Operator")}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
