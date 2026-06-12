import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/app/admin/logout-button";
import { getCurrentAdminSession } from "@/modules/auth/server-session";

export const dynamic = "force-dynamic";

const statIcons = ["🏪", "🤝", "🗺️", "💡", "📊", "👤"];
const statColors = [
  "from-emerald-500/20 to-emerald-900/10",
  "from-blue-500/20 to-blue-900/10",
  "from-purple-500/20 to-purple-900/10",
  "from-amber-500/20 to-amber-900/10",
  "from-cyan-500/20 to-cyan-900/10",
  "from-rose-500/20 to-rose-900/10",
];

export default async function AdminDashboardPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [
    merchantCount,
    partnerCount,
    routePlanCount,
    recommendationCount,
    forecastCount,
    adminCount,
  ] = await Promise.all([
    prisma.merchant.count(),
    prisma.partner.count(),
    prisma.routePlan.count(),
    prisma.recommendationRun.count(),
    prisma.forecastSnapshot.count(),
    prisma.adminUser.count({ where: { isActive: true } }),
  ]);

  const stats = [
    ["Merchants", merchantCount],
    ["Partners", partnerCount],
    ["Route Plans", routePlanCount],
    ["Recommendation Runs", recommendationCount],
    ["Forecast Snapshots", forecastCount],
    ["Active Admin Users", adminCount],
  ] as const;

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="glow-orb-emerald absolute -right-40 top-0 h-[600px] w-[600px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-15" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 lg:px-10">
        <header className="glass-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                ✦ Admin Dashboard
              </p>
              <h1 className="mt-1 font-heading text-4xl text-[var(--ink)]">ภาพรวมระบบ</h1>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                ลงชื่อเข้าใช้เป็น{" "}
                <span className="font-semibold text-[var(--accent)]">{session.email}</span>{" "}
                <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                  {session.role}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/users" className="btn-secondary">
                จัดการผู้ใช้แอดมิน
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(([label, value], i) => (
            <article
              key={String(label)}
              className={`glass-card glass-card-hover overflow-hidden p-5 fade-rise fade-rise-delay-${Math.min(i + 1, 5)}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${statColors[i]} opacity-50`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">{label}</p>
                  <span className="text-2xl">{statIcons[i]}</span>
                </div>
                <p className="mt-3 font-heading text-4xl text-[var(--ink)]">{value}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/merchant-hub" className="btn-primary">
            เปิด Merchant Workspace (Dashboard)
          </Link>
          <Link href="/discover" className="btn-secondary">
            เปิด Traveler Discovery
          </Link>
        </section>
      </div>
    </main>
  );
}
