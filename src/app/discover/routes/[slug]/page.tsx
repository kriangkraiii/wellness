import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoutePlanBySlug } from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const coverById: Record<string, string> = {
  "nature-healing-loop":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "isan-spa-ritual":
    "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1200&q=80",
  "stress-escape-spa-retreat":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
  "baan-phai-wellness":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
};

export default async function DiscoverRouteDetailPage({ params }: Props) {
  const { slug } = await params;

  let plan: Awaited<ReturnType<typeof getRoutePlanBySlug>> | null = null;
  try {
    plan = await getRoutePlanBySlug(slug);
  } catch {
    notFound();
  }

  if (!plan) {
    notFound();
  }

  const coverUrl = coverById[plan.slug] || coverById["nature-healing-loop"];

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm fade-rise">
      <div className="mb-6">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:border-accent/50 hover:text-accent transition duration-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          ย้อนกลับไปแผนท่องเที่ยว
        </Link>
      </div>

      {/* Hero Image Banner */}
      <div 
        className="relative h-[280px] w-full bg-cover bg-center rounded-2xl overflow-hidden mb-6 flex items-end shadow-sm"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(15,23,42,0.85) 100%), url(${coverUrl})`
        }}
      >
        <div className="p-6 relative z-10 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">Detailed Itinerary</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-1">{plan.title}</h2>
          <p className="text-xs text-white/80 font-medium mt-0.5">{plan.subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent transition-all duration-300">
          {plan.durationDays} วัน
        </span>
        <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {plan.stops.length} จุดแนะนำ
        </span>
        <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          📍 {plan.startingPoint} → {plan.endingPoint}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-500 mt-2">{plan.summary}</p>

      {plan.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-100 pb-6">
          {plan.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-0.5 text-xs text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Timeline Stops */}
      <div className="mt-8 space-y-0">
        {plan.stops.map((stop, i) => (
          <article key={stop.id} className="relative flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border-2 border-accent bg-accent/10 text-xs font-bold text-accent transition-all duration-300">
                {stop.sortOrder}
              </div>
              {i < plan.stops.length - 1 && (
                <div className="w-0.5 flex-1 bg-slate-100" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:bg-slate-50 transition duration-200">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white border border-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                    {stop.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    ⏱ ~{stop.durationMinutes} นาที
                  </span>
                </div>
                <h3 className="mt-2 font-heading text-xl font-bold text-slate-800">{stop.name}</h3>
                {stop.notes && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 bg-white p-3 rounded-lg border border-slate-100">{stop.notes}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
