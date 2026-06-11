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
      </body>
    </html>
  );
}
