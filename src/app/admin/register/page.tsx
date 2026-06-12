import Link from "next/link";
import { AdminRegisterForm } from "@/app/admin/register/register-form";

export const dynamic = "force-dynamic";

export default function AdminRegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="glow-orb-gold absolute -left-32 top-1/3 h-[500px] w-[500px] opacity-25" />
      <div className="glow-orb-emerald absolute -right-40 bottom-0 h-[500px] w-[500px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-15" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-5xl items-center gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="glass-card p-8 fade-rise">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            ✦ E-san Wellness Platform
          </p>
          <h2 className="mt-3 font-heading text-4xl text-[var(--ink)]">
            Create <span className="text-gradient-emerald">Member</span> Account
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            สร้างบัญชีผู้ใช้งานเพื่อเข้าใช้งานระบบวิเคราะห์คำแนะนำ AI และระบบพยากรณ์ดีมานด์
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-secondary inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 19l-7-7 7-7" />
              </svg>
              กลับหน้าแรก
            </Link>
            <Link href="/admin/login" className="btn-secondary">
              ไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </section>

        <AdminRegisterForm />
      </div>
    </main>
  );
}
