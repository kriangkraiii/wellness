import type { Metadata } from "next";
import { Bai_Jamjuree, Pridi } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { UserMenu } from "@/components/UserMenu";

const bodyFont = Bai_Jamjuree({
  variable: "--font-bai",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const headingFont = Pridi({
  variable: "--font-pridi",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Khon Kaen Wellness Atlas",
  description:
    "แพลตฟอร์มท่องเที่ยวเชิงสุขภาพขอนแก่น — วิเคราะห์ แนะนำ พยากรณ์ สำหรับผู้ประกอบการและนักท่องเที่ยว",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentAdminSession();

  return (
    <html
      lang="th"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-deep)] text-[var(--ink)] transition-colors duration-300">
        {/* ─── Shared Top Bar ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-accent via-emerald-500 to-accent-deep text-white text-xs font-semibold py-2 px-6 flex justify-between items-center z-30 relative shadow-sm transition-all duration-300">
          <span className="hidden md:inline font-medium tracking-wide">ยินดีต้อนรับสู่ขอนแก่น การท่องเที่ยวเชิงสุขภาพ</span>
          <div className="flex items-center gap-4 ml-auto">
            <UserMenu initialSession={session} />
          </div>
        </div>

        {/* ─── Shared Header / Navbar ────────────────────────────── */}
        <header className="bg-white border-b border-slate-100 py-3 px-6 sticky top-0 z-45 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="hover:opacity-95 transition">
              <div>
                <p className="font-heading text-lg font-semibold leading-none text-slate-800">
                  Khon Kaen Wellness
                </p>
                <p className="text-xs text-accent font-medium mt-0.5 transition-colors duration-300">Tourism Platform</p>
              </div>
            </Link>

            {/* Desktop Nav with Dropdowns */}
            <nav className="hidden lg:flex items-center gap-6 font-heading text-sm text-slate-700">
              <Link href="/discover" className="hover:text-accent transition font-medium">เริ่มต้นจัดทริป</Link>
              
              <div className="dropdown-trigger cursor-pointer select-none">
                <span className="hover:text-accent transition">ข้อมูลข่าวสาร</span>
                <div className="dropdown-menu">
                  <Link href="/discover" className="dropdown-item">ข่าวประชาสัมพันธ์</Link>
                  <Link href="/discover" className="dropdown-item">กิจกรรมท่องเที่ยว</Link>
                </div>
              </div>

              <div className="dropdown-trigger cursor-pointer select-none">
                <span className="hover:text-accent transition">การท่องเที่ยวเชิงสุขภาพ</span>
                <div className="dropdown-menu">
                  <Link href="/discover/partners?filter=การบริการ" className="dropdown-item">การบริการเชิงสุขภาพ</Link>
                  <Link href="/discover/partners?filter=แหล่งท่องเที่ยว" className="dropdown-item">แหล่งท่องเที่ยวเชิงสุขภาพ</Link>
                  <Link href="/discover" className="dropdown-item">เส้นทางท่องเที่ยว</Link>
                </div>
              </div>

              <div className="dropdown-trigger cursor-pointer select-none">
                <span className="hover:text-accent transition">ที่พัก</span>
                <div className="dropdown-menu">
                  <Link href="/discover/partners?filter=โรงแรม" className="dropdown-item">โรงแรมและรีสอร์ท</Link>
                  <Link href="/discover/partners?filter=โฮมสเตย์" className="dropdown-item">โฮมสเตย์</Link>
                </div>
              </div>

              <div className="dropdown-trigger cursor-pointer select-none">
                <span className="hover:text-accent transition">การเดินทาง</span>
                <div className="dropdown-menu">
                  <Link href="/discover/partners?filter=รถโดยสาร" className="dropdown-item">ตารางเวลาเดินรถ</Link>
                  <Link href="/discover/partners?filter=รถเช่า" className="dropdown-item">บริการรถเช่า</Link>
                </div>
              </div>

              <div className="dropdown-trigger cursor-pointer select-none">
                <span className="hover:text-accent transition">สำหรับผู้ประกอบการ</span>
                <div className="dropdown-menu">
                  <Link href="/merchant" className="dropdown-item font-semibold text-accent">เข้าสู่ Dashboard ธุรกิจ</Link>
                  <Link href="/merchant/recommendations" className="dropdown-item">รับคำแนะนำการตลาดจาก AI</Link>
                  <Link href="/merchant/forecast" className="dropdown-item">ระบบวิเคราะห์พยากรณ์ดีมานด์</Link>
                </div>
              </div>

              {session && (
                <div className="dropdown-trigger cursor-pointer select-none">
                  <span className="hover:text-accent transition">แบบฟอร์มสปา</span>
                  <div className="dropdown-menu">
                    <Link href="/form/customer" className="dropdown-item">แบบฟอร์มสำหรับลูกค้า</Link>
                    <Link href="/form/therapist" className="dropdown-item">แบบฟอร์มสำหรับนักบำบัด</Link>
                  </div>
                </div>
              )}

              <Link href="/discover" className="hover:text-accent transition">สิ่งอำนวยความสะดวก</Link>
              <Link href="/" className="hover:text-accent transition">เกี่ยวกับเรา</Link>
            </nav>

            <div className="flex gap-2">
              <Link href="/merchant" className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-full hover:scale-102 transition duration-200">
                Merchant App
              </Link>
            </div>
          </div>
        </header>

        {children}

        {/* Mobile / Tablet Bottom Nav */}
        <nav className="glass-nav fixed inset-x-3 bottom-3 z-20 rounded-2xl p-2 shadow-md lg:hidden">
          <ul className={`grid gap-1 ${session ? "grid-cols-6" : "grid-cols-4"}`}>
            <li>
              <Link
                href="/"
                className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
                </svg>
                <span className="mt-1">หน้าแรก</span>
              </Link>
            </li>
            <li>
              <Link
                href="/discover"
                className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="mt-1">สำรวจ</span>
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link
                    href="/form/customer"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="mt-1">ฟอร์มลูกค้า</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/form/therapist"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="mt-1">ฟอร์มบำบัด</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/merchant"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="mt-1">ธุรกิจ</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="mt-1">แดชบอร์ด</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/merchant"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="mt-1">ธุรกิจ</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/login"
                    className="flex flex-col items-center rounded-xl px-2 py-2 text-[10px] font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-accent duration-300"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="mt-1">โปรไฟล์</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </body>
    </html>
  );
}
