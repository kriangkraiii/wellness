"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHighlights, type WellnessHighlight } from "@/lib/highlights";

const startPoints = [
  "สนามบินขอนแก่น",
  "สถานีรถไฟขอนแก่น",
  "ตัวเมืองขอนแก่น",
];

const travelGoals = [
  "ผ่อนคลาย + สปา",
  "ฟื้นฟูร่างกาย + อาหารสุขภาพ",
  "ธรรมชาติ + สุขภาพจิต",
];

const coverById: Record<string, string> = {
  "nature-healing-loop":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "isan-spa-ritual":
    "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1200&q=80",
  "stress-escape-city":
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  "baan-phai-wellness":
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
};

const accentStyles: Record<
  WellnessHighlight["accent"],
  { border: string; badge: string; text: string; label: string }
> = {
  moss: {
    border: "hover:border-emerald-400 hover:shadow-emerald-500/5",
    badge: "bg-emerald-500",
    text: "text-emerald-600 hover:text-emerald-700",
    label: "NATURE",
  },
  brand: {
    border: "hover:border-amber-400 hover:shadow-amber-500/5",
    badge: "bg-amber-500",
    text: "text-amber-600 hover:text-amber-700",
    label: "SPA & HERBAL",
  },
  indigo: {
    border: "hover:border-indigo-400 hover:shadow-indigo-500/5",
    badge: "bg-indigo-500",
    text: "text-indigo-600 hover:text-indigo-700",
    label: "YOGA & RETREAT",
  },
};

const mobileTabs = [
  { href: "/", label: "หน้าแรก", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/discover", label: "สำรวจ", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { href: "/merchant", label: "ธุรกิจ", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { href: "/admin/login", label: "โปรไฟล์", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
];

const slideshowImages = [
  "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80"
];

export default function Home() {
  const highlights = getHighlights();
  const [slideIndex, setSlideIndex] = useState(0);

  // Cycle slideshow images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen pb-24 lg:pb-12">

      {/* ─── Hero Banner with Cross-Fading Slideshow ───────── */}
      <section className="relative h-[360px] md:h-[460px] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Render Slideshow Images */}
        {slideshowImages.map((src, i) => (
          <div
            key={src}
            className="slideshow-image"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.5)), url(${src})`,
              opacity: i === slideIndex ? 1 : 0,
              zIndex: i === slideIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Mourning Ribbon in Top Left */}
        <div className="absolute top-6 left-6 bg-white/90 p-2.5 rounded-full shadow-lg z-10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-800" fill="currentColor">
            <path d="M12 2C8.69 2 6 4.69 6 8c0 2.22 1.21 4.15 3 5.19l.71.41V22h4.58v-8.4l.71-.41c1.79-1.04 3-2.97 3-5.19 0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4 0 1.48-.81 2.75-2 3.46v2.54h-4v-2.54c-1.19-.71-2-1.98-2-3.46 0-2.21 1.79-4 4-4z" />
          </svg>
        </div>

        <div className="relative z-10 fade-rise max-w-3xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white tracking-wider uppercase drop-shadow-md">
            Khonkaen Wellness
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-white text-base md:text-xl font-semibold tracking-widest drop-shadow-sm">
            <div className="h-[2px] w-8 md:w-16 bg-white/80"></div>
            TOURISM
            <div className="h-[2px] w-8 md:w-16 bg-white/80"></div>
          </div>
        </div>
      </section>

      {/* ─── Overlapping Planner Card ──────────────────────── */}
      <section className="relative max-w-4xl mx-auto px-4 -mt-12 md:-mt-16 z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 hover:shadow-2xl transition duration-300">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
            <span className="text-2xl animate-bounce">🧳</span>
            <h2>
              เริ่มต้น<span className="text-accent transition-colors duration-300">จัดทริป</span>กันเลย
            </h2>
            <span className="text-2xl ml-auto hidden sm:inline">🚐</span>
          </div>

          <form action="/discover" method="get" className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                จุดเริ่มต้น
              </label>
              <select name="start" className="input-dark bg-slate-50 border-slate-200 text-slate-700 focus:bg-white transition">
                {startPoints.map((point) => (
                  <option key={point} value={point}>
                    {point}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                เป้าหมายการเดินทาง
              </label>
              <select name="goal" className="input-dark bg-slate-50 border-slate-200 text-slate-700 focus:bg-white transition">
                {travelGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full py-3 hover:scale-[1.01] transition-transform duration-200">
              ✦ ค้นหาแผนการเดินทาง
            </button>
          </form>
        </div>
      </section>

      {/* ─── Main Content Layout ───────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-12">
        {/* Recommended Routes */}
        <section className="fade-rise">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-slate-800">เส้นทางท่องเที่ยวเชิงสุขภาพแนะนำ</h2>
            <Link
              href="/discover"
              className="text-xs font-bold text-accent hover:text-accent-deep transition duration-300"
            >
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.slice(0, 4).map((item) => {
              const style = accentStyles[item.accent];
              return (
                <article
                  key={item.id}
                  className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${style.border}`}
                >
                  <div
                    aria-label={item.title}
                    className="h-36 w-full bg-cover bg-center transition-transform duration-500 hover:scale-103"
                    style={{
                      backgroundImage: `linear-gradient(180deg, transparent 40%, rgba(15,23,42,0.6) 100%), url(${coverById[item.id]})`,
                    }}
                  />
                  <div className="p-4">
                    <span className={`inline-block text-[9px] font-extrabold text-white ${style.badge} px-2 py-0.5 rounded mb-2 uppercase tracking-wider`}>
                      {style.label}
                    </span>
                    <h3 className="font-heading text-lg font-bold leading-tight text-slate-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{item.subtitle}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={`inline-flex items-center gap-1 text-xs font-bold ${style.text} transition`}
                      >
                        ดูข้อมูลเพิ่มเติม
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 2l4 4-4 4" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass-nav fixed inset-x-3 bottom-3 z-20 rounded-2xl p-2 shadow-md lg:hidden">
        <ul className="grid grid-cols-4 gap-1">
          {mobileTabs.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                <span className="mt-1">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
