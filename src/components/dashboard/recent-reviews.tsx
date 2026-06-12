"use client";

import { Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    id: "1",
    name: "Natasha S.",
    avatar: "N",
    rating: 5,
    comment: "บริการดีมากค่ะ พนักงานเป็นกันเอง นวดสบายมากๆ ค่ะ",
    date: "2 วันก่อน",
    color: "#2D6A4F",
  },
  {
    id: "2",
    name: "Weerasit K.",
    avatar: "W",
    rating: 4,
    comment: "บรรยากาศดี สะอาด แต่ต้องรอนานนิดนึง",
    date: "3 วันก่อน",
    color: "#52B788",
  },
  {
    id: "3",
    name: "Somchai P.",
    avatar: "S",
    rating: 5,
    comment: "ประทับใจมาก สมุนไพรหอมดี จะมาอีกแน่นอนครับ",
    date: "5 วันก่อน",
    color: "#40916C",
  },
];

export function RecentReviews() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">ความคิดเห็นล่าสุด</h3>
          <p className="mt-0.5 text-xs text-slate-400">Recent Reviews</p>
        </div>
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D6A4F] transition hover:text-[#1B4332]"
        >
          ดูทั้งหมด
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
          >
            {/* Avatar */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: review.color }}
            >
              {review.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {review.name}
                </span>
                <span className="text-[10px] text-slate-400">{review.date}</span>
              </div>
              {/* Stars */}
              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating
                        ? "fill-[#D4A843] text-[#D4A843]"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
