"use client";

import Link from "next/link";
import { Sparkles, TrendingUp, BarChart2, ClipboardList, BookOpen, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

export default function TryLandingPage() {
  const { t } = useLanguage();

  const modules = [
    {
      href: "/try/ai-advisor",
      title: t("AI แนะนำกลยุทธ์", "AI Strategic Advisor"),
      desc: t(
        "จำลองเป้าหมายธุรกิจและงบประมาณเพื่อสร้างคู่มือกลยุทธ์การตลาดและแนวทางบริการจาก AI อัจฉริยะ",
        "Input business goals and budget levels to generate a tailored marketing and service strategy report."
      ),
      icon: Sparkles,
      color: "from-amber-500/10 to-yellow-500/10 hover:border-amber-400 text-amber-700 border-amber-100",
      iconColor: "text-amber-600 bg-amber-50",
    },
    {
      href: "/try/forecast",
      title: t("พยากรณ์ความต้องการ (Demand Forecast)", "Business Demand Forecast"),
      desc: t(
        "คำนวณสถิติยอดจองและคาดการณ์รายได้อนาคต พร้อมวิเคราะห์ความอ่อนไหวต่อต้นทุนในระบบจำลอง",
        "Calculate booking patterns, forecast future revenues, and analyze sensitivity to operating costs."
      ),
      icon: TrendingUp,
      color: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-400 text-emerald-700 border-emerald-100",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      href: "/try/trends",
      title: t("เทรนด์สุขภาพและนวดแผนไทย", "E-san Wellness Trends"),
      desc: t(
        "สำรวจความนิยมประเภทสมุนไพร บริการยอดฮิต และเมนูบำบัดซิกเนเจอร์ที่ครองใจกลุ่มลูกค้าในภาคอีสาน",
        "Explore popular herbs, highly-rated massage therapies, and signature treatments in Northeast Thailand."
      ),
      icon: BarChart2,
      color: "from-blue-500/10 to-indigo-500/10 hover:border-blue-400 text-blue-700 border-blue-100",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      href: "/try/records",
      title: t("บันทึกการบำบัดรักษา", "Spa Treatment Records"),
      desc: t(
        "ตรวจสอบประวัติประเมินผลการนวดของลูกค้า ความเห็นของผู้นวด และคำแนะนำดูแลตนเองหลังจบบริการ",
        "Inspect customer health feedback, pain points tracking, therapist advice, and rehabilitation logs."
      ),
      icon: ClipboardList,
      color: "from-slate-500/10 to-zinc-500/10 hover:border-slate-400 text-slate-700 border-slate-100",
      iconColor: "text-slate-600 bg-slate-50",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#2D6A4F] to-[#1B4332] p-6 md:p-8 text-white shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t("ยินดีต้อนรับสู่โหมดทดลอง", "Welcome to Sandbox Sandbox")}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {t(
              "ทดลองวิเคราะห์และวางแผนธุรกิจสปาอีสาน",
              "Isan Spa & Wellness Analytics Simulator"
            )}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            {t(
              "เราออกแบบระบบจำลองนี้ขึ้นมาสำหรับผู้ประกอบการจริง และบุคคลทั่วไปที่กำลังสนใจต้องการเริ่มเปิดร้านนวดหรือสปา โดยคุณสามารถทดลองใช้งานเครื่องมือระดับโปรของระบบ ได้ฟรีทันทีโดยไม่ต้องทำการล็อกอินหรือสมัครสมาชิกใดๆ",
              "We designed this simulator for active spa operators and prospective entrepreneurs who wish to open a wellness business. Test our premium analytics features and get recommendations without registration."
            )}
          </p>
        </div>
      </section>

      {/* Guide Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 text-xs text-amber-800 leading-relaxed shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{t(" คำแนะนำสำหรับผู้เริ่มเปิดร้านใหม่:", " Advice for prospective owners:")}</span>{" "}
          {t(
            "ในแต่ละหน้าของโหมดทดลอง คุณสามารถเลือกร้านค้าจำลอง 'ร้านจำลองของคุณ' (Simulate Custom Shop) เพื่อกรอกข้อมูล ชื่อร้าน, ประเภทสปา, และจังหวัดที่ต้องการเปิดร้าน จากนั้นระบบจะสร้างข้อมูลจำลองเพื่อใช้ในการคำนวณและวิเคราะห์คำแนะนำทางการตลาดจาก AI ให้สอดคล้องกันโดยอัตโนมัติ!",
            "In each simulator page, you can choose 'Simulate Custom Shop' to specify your own shop name, business type, and location. The system will auto-generate mock datasets to feed our forecasting models and AI advisors."
          )}
        </div>
      </div>

      {/* Modules Grid */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {t("เลือกโมดูลที่ต้องการทดลอง", "Select Simulator Module")}
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`group block rounded-2xl border bg-white bg-gradient-to-b p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer ${m.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${m.iconColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#2D6A4F] transition-colors">
                    {t("เริ่มทดลอง ➔", "Try now ➔")}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-[#2D6A4F] transition-colors">
                  {m.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
