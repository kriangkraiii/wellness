import type { Metadata } from "next";
import { Bai_Jamjuree, Pridi } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { UserMenu } from "@/components/UserMenu";
import PublicHeaderWrapper from "@/components/PublicHeaderWrapper";
import { ChatWidget } from "@/components/chat/ChatWidget";

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
  title: "E-san Wellness Atlas",
  description:
    "แพลตฟอร์มท่องเที่ยวเชิงสุขภาพภาคอีสาน — วิเคราะห์ แนะนำ พยากรณ์ สำหรับผู้ประกอบการและนักท่องเที่ยว",
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
        <PublicHeaderWrapper>
          {/* ─── Shared Top Bar ─────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-accent via-emerald-500 to-accent-deep text-white text-xs font-semibold py-2 px-6 flex justify-between items-center z-30 relative shadow-sm transition-all duration-300">
            <span className="hidden md:inline font-medium tracking-wide">ยินดีต้อนรับสู่การท่องเที่ยวเชิงสุขภาพภาคอีสาน</span>
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
                  E-san Wellness
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
              <Link href="/about" className="hover:text-accent transition">เกี่ยวกับเรา</Link>
            </nav>

            <div className="flex gap-2">
              {session && (
                <Link 
                  href="/dashboard" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-4 text-xs font-semibold rounded-full hover:scale-102 transition duration-200 shadow-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="14" rx="1" />
                  </svg>
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </header>
        </PublicHeaderWrapper>

        {children}

        <PublicHeaderWrapper>
          <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 py-12 px-6 font-body transition-all duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="space-y-4">
                <Link href="/" className="hover:opacity-95 transition">
                  <div>
                    <p className="font-heading text-lg font-semibold leading-none text-white">
                      E-san Wellness
                    </p>
                    <p className="text-xs text-accent font-medium mt-0.5 transition-colors duration-300">Tourism Platform</p>
                  </div>
                </Link>
                <p className="text-xs text-slate-400 leading-relaxed">
                  แพลตฟอร์มท่องเที่ยวเชิงสุขภาพภาคอีสาน — วิเคราะห์ แนะนำ พยากรณ์ สำหรับผู้ประกอบการและนักท่องเที่ยว
                </p>
              </div>

              {/* Our Services Section */}
              <div>
                <h4 className="font-heading text-sm font-semibold text-white tracking-wider mb-4">การให้บริการของเรา</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li>
                    <Link href="/discover" className="hover:text-accent transition duration-200">
                      เส้นทางท่องเที่ยวเชิงสุขภาพแนะนำ
                    </Link>
                  </li>
                  <li>
                    <Link href="/discover/partners" className="hover:text-accent transition duration-200">
                      เครือข่ายพาร์ทเนอร์ธุรกิจสุขภาพ
                    </Link>
                  </li>
                  <li>
                    <Link href="/discover" className="hover:text-accent transition duration-200">
                      วิเคราะห์ข้อมูลสุขภาพเพื่อการท่องเที่ยว
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/login" className="hover:text-accent transition duration-200">
                      ระบบวิเคราะห์ดีมานด์ความต้องการสปา
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal & Navigation Section */}
              <div>
                <h4 className="font-heading text-sm font-semibold text-white tracking-wider mb-4">ข้อมูลทางกฎหมาย & การติดต่อ</h4>
                <ul className="space-y-2.5 text-xs text-slate-400">
                  <li>
                    <Link href="/privacy-policy" className="hover:text-accent transition duration-200">
                      นโยบายความเป็นส่วนตัว
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="hover:text-accent transition duration-200">
                      ข้อตกลงการให้บริการ
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-accent transition duration-200">
                      ติดต่อเรา
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Address / University Info Section */}
              <div>
                <h4 className="font-heading text-sm font-semibold text-white tracking-wider mb-4">สถานที่ติดต่อ</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  คณะบริหารธุรกิจและการบัญชี มหาวิทยาลัยขอนแก่น
                </p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  123 ถนน มิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40002
                </p>
              </div>
            </div>

            <hr className="border-slate-900 my-8 max-w-7xl mx-auto" />

            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-500">
              <p>© 2026 E-san Wellness Atlas. All rights reserved.</p>
              <p className="mt-2 sm:mt-0 font-medium">Developed for Academic & Wellness Tourism Development</p>
            </div>
          </footer>
        </PublicHeaderWrapper>

        <PublicHeaderWrapper>
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
                    href="/dashboard/merchant-hub"
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
                    href="/dashboard/merchant-hub"
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
        </PublicHeaderWrapper>
        <ChatWidget />
      </body>
    </html>
  );
}
