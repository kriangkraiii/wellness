import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminSession } from "@/modules/auth/server-session";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login?next=/merchant");
  }

  return (
    <div className="relative min-h-screen overflow-x-clip pb-12 bg-[var(--bg-deep)]">
      <div className="glow-orb-gold absolute -right-32 -top-20 h-[500px] w-[500px] opacity-15" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-10" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-6">
        <header className="flex flex-col gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
              ✦ Merchant Workspace
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold text-slate-800">
              Khon Kaen Wellness Merchant Hub
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/merchant/recommendations"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Recommendations
            </Link>
            <Link
              href="/merchant/forecast"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Forecast
            </Link>
            <Link
              href="/merchant/records"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Customer Records
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Discovery
            </Link>
          </nav>
        </header>

        <main className="mt-6 fade-rise">{children}</main>
      </div>
    </div>
  );
}
