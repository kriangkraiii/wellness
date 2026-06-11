import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminUserCreateForm } from "@/app/admin/admin-user-create-form";
import { LogoutButton } from "@/app/admin/logout-button";
import { prisma } from "@/lib/prisma";
import { getCurrentAdminSession } from "@/modules/auth/server-session";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div className="glow-orb-emerald absolute -left-40 top-20 h-[500px] w-[500px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-15" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 lg:px-10">
        <header className="glass-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Admin Users</p>
              <h1 className="mt-1 font-heading text-4xl text-[var(--ink)]">จัดการผู้ใช้แอดมิน</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin" className="btn-secondary inline-flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                กลับ Dashboard
              </Link>
              <LogoutButton />
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] fade-rise">
          <AdminUserCreateForm canCreateAdmin={session.role === "ADMIN"} />

          <section className="glass-card p-5">
            <h2 className="font-heading text-2xl text-[var(--ink)]">รายการผู้ใช้</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="text-left text-[var(--ink-muted)]">
                    <th className="border-b border-[var(--line)] py-3 pr-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                    <th className="border-b border-[var(--line)] py-3 pr-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                    <th className="border-b border-[var(--line)] py-3 pr-3 text-xs font-semibold uppercase tracking-wide">Role</th>
                    <th className="border-b border-[var(--line)] py-3 pr-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-[var(--bg-surface-hover)]">
                      <td className="border-b border-[var(--line)] py-3 pr-3 text-[var(--ink)]">
                        {user.name}
                      </td>
                      <td className="border-b border-[var(--line)] py-3 pr-3 text-[var(--ink-soft)]">
                        {user.email}
                      </td>
                      <td className="border-b border-[var(--line)] py-3 pr-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          user.role === "ADMIN"
                            ? "bg-[var(--gold-glow)] text-[var(--gold)]"
                            : "bg-[var(--bg-surface)] text-[var(--ink-soft)]"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="border-b border-[var(--line)] py-3 pr-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          user.isActive
                            ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                            : "bg-[var(--danger-bg)] text-[var(--danger)]"
                        }`}>
                          {user.isActive ? "ACTIVE" : "DISABLED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
