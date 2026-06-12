"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }
    setStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-deep)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="glow-orb-emerald absolute -left-40 top-20 h-[500px] w-[500px] opacity-10 pointer-events-none" />
      <div className="glow-orb-gold absolute -right-40 bottom-20 h-[400px] w-[400px] opacity-10 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Navigation back */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-deep transition duration-200">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>

        <header className="mb-10 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
            ✦ Get in Touch
          </span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-slate-800">
            ติดต่อเรา (Contact Us)
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            สอบถามข้อมูลเพิ่มเติมเกี่ยวกับแพลตฟอร์ม ข้อเสนอแนะ หรือติดต่อเพื่อร่วมเป็นพาร์ทเนอร์ในเครือข่ายท่องเที่ยวสุขภาพภาคอีสาน
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-800 mb-1">สถานที่ตั้งอย่างเป็นทางการ</h3>
              <p className="text-sm font-semibold text-slate-700">คณะบริหารธุรกิจและการบัญชี มหาวิทยาลัยขอนแก่น</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                123 ถนน มิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40002
              </p>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เบอร์โทรศัพท์</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">043-202-401</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">อีเมลติดต่อ</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">wellness.kku@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เวลาทำการ</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">จันทร์ - ศุกร์ | 08:30 น. - 16:30 น.</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs leading-relaxed text-slate-500">
                หากมีข้อสงสัยเกี่ยวกับข้อมูลส่วนบุคคลหรือความปลอดภัยของข้อมูลในแบบฟอร์มประเมินสุขภาพ 
                ท่านสามารถแจ้งฝ่ายดูแลด้านความคุ้มครองข้อมูลของสถาบันได้โดยตรง
              </p>
            </div>
          </div>

          {/* Interactive Form Card */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-slate-800 mb-6">ส่งข้อความติดต่อเรา</h3>

            {status === "success" && (
              <div className="mb-6 rounded-2xl bg-emerald-50 border border-emerald-200/50 p-4 text-emerald-800 text-sm flex items-start gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold">ส่งข้อความสำเร็จ!</p>
                  <p className="text-xs text-emerald-700/95 mt-0.5">ขอบคุณที่ติดต่อเรา เจ้าหน้าที่จะดำเนินการตอบกลับทางอีเมลของท่านโดยเร็วที่สุด</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200/50 p-4 text-red-800 text-sm flex items-start gap-2.5">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-bold">กรอกข้อมูลไม่ครบถ้วน</p>
                  <p className="text-xs text-red-700/95 mt-0.5">โปรดระบุ ชื่อ อีเมล และข้อความที่ต้องการส่ง</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="สมชาย ดีใจ"
                    className="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:bg-white focus:border-accent focus:outline-none transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                    อีเมลติดต่อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="somchai@example.com"
                    className="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:bg-white focus:border-accent focus:outline-none transition duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  หัวข้อเรื่อง
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="สอบถามเกี่ยวกับการเป็นพาร์ทเนอร์"
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:bg-white focus:border-accent focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  ข้อความ <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="ระบุข้อความของคุณที่นี่..."
                  className="w-full text-sm border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 focus:bg-white focus:border-accent focus:outline-none transition duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full py-3 hover:scale-[1.01] transition-transform duration-200 cursor-pointer disabled:opacity-50"
              >
                {status === "submitting" ? "กำลังส่งข้อความ..." : "✦ ส่งข้อความติดต่อ"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
