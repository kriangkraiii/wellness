import Link from "next/link";

export default function PrivacyPolicyPage() {
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
            ✦ Legal Policy
          </span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-slate-800">
            นโยบายความเป็นส่วนตัว (Privacy Policy)
          </h1>
          <p className="mt-2 text-xs text-slate-400 font-medium">ปรับปรุงล่าสุดเมื่อ: 12 มิถุนายน 2569</p>
        </header>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-body">
          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">1. ข้อมูลทั่วไป</h2>
            <p>
              แพลตฟอร์ม <strong>E-san Wellness</strong> (ซึ่งต่อไปนี้จะเรียกว่า &ldquo;เรา&rdquo; หรือ &ldquo;แพลตฟอร์ม&rdquo;) 
              เคารพในความเป็นส่วนตัวและมุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของผู้ใช้บริการทุกท่าน นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงขั้นตอนการเก็บรวบรวม 
              การใช้งาน การเปิดเผย และการรักษาความปลอดภัยของข้อมูลส่วนบุคคลที่ท่านมอบให้เมื่อใช้บริการแพลตฟอร์มและแบบฟอร์มประเมินสุขภาพต่าง ๆ ของเรา
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">2. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h2>
            <p className="mb-2">เราอาจเก็บรวบรวมข้อมูลส่วนบุคคลประเภทต่าง ๆ ดังต่อไปนี้:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li><strong>ข้อมูลบัญชีผู้ใช้:</strong> เช่น อีเมล ชื่อผู้ใช้ รหัสผ่านที่เข้ารหัส และบทบาทในระบบ</li>
              <li><strong>ข้อมูลประเมินและวิเคราะห์สุขภาพ:</strong> เช่น อายุ เพศ ส่วนสูง น้ำหนัก สัญชาติ เชื้อชาติ อาชีพ ข้อมูลด้านสุขภาพ และข้อมูลพฤติกรรมการท่องเที่ยวเชิงสุขภาพ</li>
              <li><strong>ข้อมูลพาร์ทเนอร์และผู้ประกอบการ:</strong> เช่น ชื่อธุรกิจ รายละเอียดบริการ พื้นที่ให้บริการ และพิกัดทางภูมิศาสตร์</li>
              <li><strong>ข้อมูลวัตถุดิบและคู่ค้า:</strong> เช่น ชื่อวัตถุดิบ ราคาตลาด และข้อมูลการส่งมอบผลิตภัณฑ์</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">3. วัตถุประสงค์ในการใช้งานข้อมูล</h2>
            <p className="mb-2">เราจะนำข้อมูลที่เก็บรวบรวมมาใช้เพื่อวัตถุประสงค์ต่อไปนี้:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>ประมวลผลคำแนะนำจากระบบปัญญาประดิษฐ์ (AI Advisor) เพื่อออกแบบเส้นทางท่องเที่ยวเชิงสุขภาพเฉพาะบุคคลในภาคอีสาน</li>
              <li>จัดทำรายงานวิเคราะห์แนวโน้มและดีมานด์เชิงท่องเที่ยวสุขภาพให้กับผู้ประกอบการ</li>
              <li>เชื่อมโยงพาร์ทเนอร์ในระบบนิเวศการท่องเที่ยวเชิงสุขภาพภาคอีสาน (E-san Wellness Ecosystem)</li>
              <li>ปรับปรุงพัฒนาประสิทธิภาพการใช้งาน ความปลอดภัย และความถูกต้องทางเทคนิคของแพลตฟอร์ม</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">4. การเก็บรักษาความปลอดภัยของข้อมูล</h2>
            <p>
              เราใช้มาตรการทางเทคนิคและการบริหารจัดการในระดับมาตรฐานอุตสาหกรรมเพื่อรักษาความปลอดภัยข้อมูลส่วนบุคคล 
              รวมถึงการเข้ารหัสข้อมูลสำคัญและการใช้โปรโตคอลรักษาความปลอดภัยระหว่างการรับส่งข้อมูล เพื่อป้องกันการสูญหาย 
              การเข้าถึงโดยไม่ได้รับอนุญาต การทำลาย การเปิดเผย หรือการแก้ไขโดยมิชอบ
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">5. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
            <p className="mb-2">ผู้ใช้งานทุกท่านมีสิทธิตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA) ดังนี้:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>สิทธิในการเข้าถึงข้อมูลส่วนบุคคลและขอรับสำเนาข้อมูล</li>
              <li>สิทธิในการขอแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง เป็นปัจจุบัน และสมบูรณ์</li>
              <li>สิทธิในการคัดค้านและขอระงับหรือยกเลิกการเก็บรวบรวมและใช้งานข้อมูล</li>
              <li>สิทธิในการถอนความยินยอมในการประมวลผลข้อมูลส่วนบุคคล</li>
            </ul>
          </section>

          <section className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-6">
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-2">ช่องทางการติดต่อ</h2>
            <p className="font-medium text-slate-700">คณะบริหารธุรกิจและการบัญชี มหาวิทยาลัยขอนแก่น</p>
            <p className="text-xs text-slate-500 mt-1">
              123 ถนน มิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40002
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
