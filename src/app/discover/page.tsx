import Link from "next/link";
import { toUserDbError } from "@/lib/errors";
import { getRoutePlans } from "@/modules/repository/merchant-repository";

export const dynamic = "force-dynamic";

const coverById: Record<string, string> = {
  "nature-healing-loop":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  "isan-spa-ritual":
    "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80",
  "stress-escape-spa-retreat":
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  "baan-phai-wellness":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
};

function getAccentStyle(tags: string[], focus: string) {
  const t = tags.map((v) => v.toLowerCase());
  const f = focus.toLowerCase();

  if (t.includes("nature") || f.includes("nature")) {
    return {
      border: "hover:border-emerald-400 hover:shadow-emerald-500/5",
      badge: "bg-emerald-500",
      text: "text-emerald-600 hover:text-emerald-700",
      pill: "bg-emerald-50 text-emerald-600 border-emerald-100",
      btn: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-500/20",
      label: "NATURE",
    };
  }
  if (
    t.includes("spa") ||
    t.includes("music") ||
    f.includes("massage") ||
    f.includes("spa")
  ) {
    return {
      border: "hover:border-amber-400 hover:shadow-amber-500/5",
      badge: "bg-amber-500",
      text: "text-amber-600 hover:text-amber-700",
      pill: "bg-amber-50 text-amber-600 border-amber-100",
      btn: "bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-amber-500/20",
      label: "SPA & HERBAL",
    };
  }
  if (
    t.includes("yoga") ||
    t.includes("mindfulness") ||
    f.includes("mind") ||
    f.includes("recovery")
  ) {
    return {
      border: "hover:border-indigo-400 hover:shadow-indigo-500/5",
      badge: "bg-indigo-500",
      text: "text-indigo-600 hover:text-indigo-700",
      pill: "bg-indigo-50 text-indigo-600 border-indigo-100",
      btn: "bg-gradient-to-r from-indigo-500 to-violet-600 hover:shadow-indigo-500/20",
      label: "YOGA & RETREAT",
    };
  }
  // Default Teal
  return {
    border: "hover:border-accent/85 hover:shadow-accent/5",
    badge: "bg-accent",
    text: "text-accent hover:text-accent-deep",
    pill: "bg-accent/5 text-accent border-accent/10",
    btn: "bg-gradient-to-r from-accent to-accent-deep hover:shadow-accent/20",
    label: "WELLNESS TOUR",
  };
}

export default async function DiscoverPage() {
  let plans: Awaited<ReturnType<typeof getRoutePlans>> = [];
  let dbMessage: string | null = null;

  try {
    plans = await getRoutePlans();
  } catch (error) {
    dbMessage = toUserDbError(error);
  }

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
        Discovery Routes
      </p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-slate-800">
        เลือกเส้นทางสุขภาพที่เหมาะกับคุณ
      </h2>

      {dbMessage && (
        <div className="mt-5 rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
          ⚠ เชื่อมฐานข้อมูลไม่สำเร็จ: {dbMessage}
        </div>
      )}

      {!dbMessage && plans.length === 0 && (
        <div className="mt-8 flex flex-col items-center py-12 text-center">
          <span className="text-5xl">🗺️</span>
          <p className="mt-4 text-sm text-slate-500 font-medium">
            ยังไม่มี route plan ในฐานข้อมูล
          </p>
          <p className="mt-1 text-xs text-slate-400">
            รัน prisma migrate + seed เพื่อเพิ่มข้อมูล
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {plans.map((plan, i) => {
          const style = getAccentStyle(plan.tags, plan.focus);
          return (
            <article
              key={plan.id}
              className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${style.border} fade-rise fade-rise-delay-${Math.min(i + 1, 5)}`}
            >
              {/* Header Image */}
              <div
                className="h-44 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.6) 100%), url(${coverById[plan.slug] || coverById["nature-healing-loop"]})`,
                }}
              />
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent transition-colors duration-300">
                      {plan.durationDays} วัน
                    </span>
                    <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-100">
                      {plan.stops.length} จุดท่องเที่ยว
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-800">{plan.title}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{plan.subtitle}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 line-clamp-3">{plan.summary}</p>
                  
                  {plan.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {plan.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-2.5 py-0.5 text-xs ${style.pill}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/discover/routes/${plan.slug}`}
                  className={`btn-primary mt-6 w-full text-center block text-xs ${style.btn}`}
                >
                  ดูรายละเอียดเส้นทาง →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
