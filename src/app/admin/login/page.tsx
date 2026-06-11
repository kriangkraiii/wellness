import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/login/login-form";
import { getCurrentAdminSession } from "@/modules/auth/server-session";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ next?: string }> | { next?: string };
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const session = await getCurrentAdminSession();
  if (session) {
    const resolvedSearchParams = await searchParams;
    const next = resolvedSearchParams?.next || "/admin";
    redirect(next);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="glow-orb-emerald absolute -left-40 top-1/4 h-[600px] w-[600px] opacity-30" />
      <div className="glow-orb-gold absolute -right-32 bottom-0 h-[400px] w-[400px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-15" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-5xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="glass-card p-8 fade-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Khon Kaen Wellness Platform
          </p>
          <h2 className="mt-3 font-heading text-4xl text-[var(--ink)]">
            <span className="text-gradient-emerald">Wellness</span> Portal Center
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            ระบบจัดการสำหรับผู้ใช้งานและผู้ประกอบการท่องเที่ยวเชิงสุขภาพขอนแก่น เข้าใช้งานระบบวิเคราะห์คำแนะนำ AI และระบบพยากรณ์ดีมานด์
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-secondary inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              กลับหน้าแรก
            </Link>
            <Link href="/admin/register" className="btn-secondary">
              ไปหน้าลงทะเบียน
            </Link>
            <Link href="/merchant" className="btn-secondary">
              ไป Merchant
            </Link>
          </div>
        </section>

        <AdminLoginForm />
      </div>
    </main>
  );
}
