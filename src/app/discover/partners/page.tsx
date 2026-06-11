import Link from "next/link";
import { getPartners } from "@/modules/repository/merchant-repository";
import { toUserDbError } from "@/lib/errors";

export const dynamic = "force-dynamic";

const typeColors: Record<string, string> = {
  SUPPLIER: "text-[var(--accent)] bg-[var(--accent-subtle)]",
  INVESTOR: "text-[var(--gold)] bg-[var(--gold-glow)]",
  MARKETING: "text-purple-400 bg-purple-400/10",
  TRAVEL: "text-blue-400 bg-blue-400/10",
};

const partnerCovers: Record<string, string> = {
  "grab-merchant":
    "https://images.unsplash.com/photo-1610348725531-843dff163e2c?auto=format&fit=crop&w=600&q=80",
  "tiktok-shop-seller":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
  "gowabi-business":
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80",
  "pullman-raja-orchid":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  "baan-sila-homestay":
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
  "khonkaen-carrent":
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
  "khonkaen-citybus":
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80",
};

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function DiscoverPartnersPage({ searchParams }: Props) {
  const params = await searchParams;
  const filter = params.filter;

  let partners: Awaited<ReturnType<typeof getPartners>> = [];
  let dbMessage: string | null = null;

  try {
    const allPartners = await getPartners();
    if (filter) {
      const f = filter.toLowerCase().trim();
      partners = allPartners.filter((p) => {
        return (
          p.name.toLowerCase().includes(f) ||
          p.channel.toLowerCase().includes(f) ||
          p.summary.toLowerCase().includes(f)
        );
      });
    } else {
      partners = allPartners;
    }
  } catch (error) {
    dbMessage = toUserDbError(error);
  }

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
        ✦ Platform Partners
      </p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-slate-800">
        เครือข่ายพาร์ทเนอร์ธุรกิจสุขภาพ {filter && <span className="text-xl text-accent font-medium">({filter})</span>}
      </h2>

      {dbMessage && (
        <div className="mt-5 rounded-2xl border border-[var(--warn)]/30 bg-[var(--warn-bg)] px-4 py-3 text-sm text-[var(--warn)]">
          ⚠ เชื่อมฐานข้อมูลไม่สำเร็จ: {dbMessage}
        </div>
      )}

      {!dbMessage && partners.length === 0 && (
        <div className="mt-8 flex flex-col items-center py-12 text-center bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <span className="text-5xl">🏢</span>
          <p className="mt-4 text-sm text-slate-500 font-medium">
            ไม่พบข้อมูลพาร์ทเนอร์สำหรับการค้นหา &ldquo;{filter}&rdquo;
          </p>
          <Link href="/discover/partners" className="mt-3 text-xs font-bold text-accent hover:underline transition-colors duration-300">
            ดูพาร์ทเนอร์ทั้งหมด
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {partners.map((partner, i) => (
          <article
            key={partner.id}
            className={`bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden fade-rise fade-rise-delay-${Math.min(i + 1, 5)}`}
          >
            <div>
              {/* Partner Cover Image */}
              <div
                className="h-40 w-full bg-cover bg-center rounded-xl mb-4 border border-slate-100"
                style={{
                  backgroundImage: `url(${partnerCovers[partner.slug] || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80"})`,
                }}
              />

              <div className="flex items-center justify-between mt-1 mb-3">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${typeColors[partner.type] || "text-slate-500 bg-slate-50"}`}>
                  {partner.type}
                </span>
                {/* Score ring */}
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(partner.score / 100) * 94.25} 94.25`}
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-accent transition-colors duration-300">{partner.score}</span>
                </div>
              </div>

              <h3 className="font-heading text-xl font-bold text-slate-800">
                {partner.name}
              </h3>
              <p className="text-xs text-accent font-semibold mt-0.5 transition-colors duration-300">{partner.channel}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{partner.summary}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>📍 พื้นที่ให้บริการ: {partner.coverageArea}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
