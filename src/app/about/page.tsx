import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-deep)] py-12 px-4 sm:px-6 lg:px-8">
      {/* Visual background decorations */}
      <div className="glow-orb-emerald absolute -left-40 top-20 h-[500px] w-[500px] opacity-10 pointer-events-none" />
      <div className="glow-orb-gold absolute -right-40 bottom-20 h-[400px] w-[400px] opacity-10 pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 soft-grid opacity-10" />

      <div className="relative z-10 max-w-4xl mx-auto bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm">
        {/* Navigation back */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent-deep transition duration-200">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            กลับหน้าแรก
          </Link>
        </div>

        <header className="border-b border-slate-100 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-accent transition-colors duration-300">
            ✦ About E-san Wellness
          </span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-slate-800">
            เกี่ยวกับเรา (About Us)
          </h1>
          <p className="mt-2 text-xs text-slate-400 font-medium">แพลตฟอร์มท่องเที่ยวเชิงสุขภาพและสปาสมุนไพรอัตลักษณ์อีสาน</p>
        </header>

        <div className="space-y-8 text-sm text-slate-650 leading-relaxed font-body">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#2D6A4F] flex items-center gap-2">
              🌾 จุดเริ่มต้นของโครงการ
            </h2>
            <p>
              แพลตฟอร์ม <strong>E-san Wellness Atlas</strong> พัฒนาขึ้นโดยความร่วมมือทางวิชาการร่วมกับ <strong>คณะบริหารธุรกิจและการบัญชี มหาวิทยาลัยขอนแก่น</strong> 
              โดยมีวัตถุประสงค์หลักในการขับเคลื่อนและยกระดับห่วงโซ่คุณค่าการท่องเที่ยวเชิงสุขภาพ (Wellness Tourism Valuing) ของภาคตะวันออกเฉียงเหนือ 
              ให้ก้าวไกลด้วยเทคโนโลยีดิจิทัลที่ทันสมัย
            </p>
            <p>
              เราบูรณาการงานวิจัยด้านการตลาด บริหารธุรกิจ และวิทยาการข้อมูลเพื่อสร้างสรรค์เครื่องมืออัจฉริยะที่ช่วยสนับสนุนทั้งกลุ่มนักท่องเที่ยว 
              และกลุ่มผู้ประกอบการสปา/บริการท่องเที่ยวเพื่อสุขภาพในภูมิภาคอีสาน
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-[#2D6A4F] flex items-center gap-2">
              💡 เสาหลักการพัฒนา (Core Pillars)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-[#FAF9F5] border border-slate-100 p-5 rounded-2xl">
                <span className="text-2xl"></span>
                <h3 className="font-heading font-semibold text-slate-800 mt-2 text-base">อัตลักษณ์สมุนไพรอีสาน</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ชูจุดเด่นวัตถุดิบและพืชสมุนไพรท้องถิ่น เช่น ไพลหอม ขมิ้นชัน ใบมะกรูด และข้าวสายพันธุ์อีสาน เพื่อสร้างสรรค์ทรีตเมนต์อันเป็นซิกเนเจอร์เฉพาะภูมิภาค
                </p>
              </div>
              <div className="bg-[#FAF9F5] border border-slate-100 p-5 rounded-2xl">
                <span className="text-2xl">💻</span>
                <h3 className="font-heading font-semibold text-slate-800 mt-2 text-base">เทคโนโลยี AI อัจฉริยะ</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  นำระบบ AI ประมวลผลคำแนะนำ (AI Advisor) วิเคราะห์สรีระ/ข้อพึงระวัง และระบบพยากรณ์ความต้องการ (Demand Forecasting) เพิ่มประสิทธิภาพการบริหารจัดการ
                </p>
              </div>
              <div className="bg-[#FAF9F5] border border-slate-100 p-5 rounded-2xl">
                <span className="text-2xl">🗺️</span>
                <h3 className="font-heading font-semibold text-slate-800 mt-2 text-base">เชื่อมโยงท่องเที่ยวครบวงจร</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  ผสานเครือข่ายสปา แหล่งท่องเที่ยว เส้นทางสุขภาพ และการเดินทาง เพื่อสร้างรายได้หมุนเวียนสู่ผู้ประกอบการชุมชนและท้องถิ่น
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-bold text-[#2D6A4F] flex items-center gap-2">
              🎯 วิสัยทัศน์และเป้าหมาย
            </h2>
            <p>
              เป้าหมายสูงสุดของเราคือการสร้างระบบนิเวศสุขภาพที่เข้มแข็ง (E-san Wellness Ecosystem) เพื่อผลักดันให้ภาคอีสานก้าวสู่การเป็นจุดหมายปลายทางของการท่องเที่ยวเชิงการแพทย์และการแพทย์แผนไทยระดับสากล 
              เสริมสร้างเศรษฐกิจฐานรากอย่างทั่วถึงและยั่งยืน
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-6 space-y-2">
            <h2 className="font-heading text-lg font-bold text-slate-850">ที่ปรึกษาและผู้ให้การสนับสนุนหลัก</h2>
            <p className="font-medium text-slate-700">คณะบริหารธุรกิจและการบัญชี มหาวิทยาลัยขอนแก่น</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              123 ถนน มิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40002
            </p>
            <div className="pt-2 border-t border-slate-200 flex gap-4 text-xs font-semibold text-accent">
              <Link href="/contact" className="hover:underline">ติดต่อเรา</Link>
              <Link href="/privacy-policy" className="hover:underline">นโยบายความเป็นส่วนตัว</Link>
              <Link href="/terms-of-service" className="hover:underline">ข้อตกลงการใช้งาน</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
