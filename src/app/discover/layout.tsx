import Link from "next/link";

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-clip pb-12 bg-[var(--bg-deep)]">
      <div className="glow-orb-emerald absolute -left-40 top-0 h-[600px] w-[600px] opacity-20" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-10" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-6">
        <header className="flex flex-col gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
              Traveler Discovery
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold text-slate-800">
              E-san Wellness Route Explorer
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Explore Routes
            </Link>
            <Link
              href="/discover/partners"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
            >
              Partners
            </Link>
          </nav>
        </header>

        <main className="mt-6 fade-rise">{children}</main>
      </div>
    </div>
  );
}
