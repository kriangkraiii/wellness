import Link from "next/link";

export default function TermsOfServicePage() {
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
            ✦ Terms & Conditions
          </span>
          <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold text-slate-800">
            ข้อตกลงการให้บริการ (Terms of Service)
          </h1>
          <p className="mt-2 text-xs text-slate-400 font-medium">ปรับปรุงล่าสุดเมื่อ: 12 มิถุนายน 2569</p>
        </header>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-body">
          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">1. ยอมรับข้อตกลง</h2>
            <p>
              การเข้าถึงและการใช้งานแพลตฟอร์ม <strong>E-san Wellness</strong> รวมถึงฟีเจอร์ แบบฟอร์มประเมินสุขภาพ และคำแนะนำใด ๆ 
              ถือว่าท่านยินยอมที่จะปฏิบัติตามเงื่อนไขการให้บริการฉบับนี้โดยไม่มีข้อยกเว้น หากท่านไม่ยอมรับข้อตกลงนี้ โปรดยุติการเข้าใช้งานแพลตฟอร์มทันที
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">2. ขอบเขตและลักษณะของบริการ</h2>
            <p>
              แพลตฟอร์มนี้สร้างสรรค์ขึ้นเพื่อเป็นศูนย์กลางการให้บริการข้อมูล ท่องเที่ยวเชิงสุขภาพภาคอีสาน (E-san Wellness Atlas) 
              โดยมุ่งเน้นการวางแผนทริปท่องเที่ยว แนะนำวัตถุดิบและสมุนไพรท้องถิ่น การเชื่อมต่อพาร์ทเนอร์ธุรกิจ 
              และให้คำแนะนำเบื้องต้นเกี่ยวกับสุขภาพด้วยปัญญาประดิษฐ์ (AI Advisor)
            </p>
          </section>

          <section className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 text-amber-900">
            <h2 className="font-heading text-base font-bold text-amber-800 mb-1"> ข้อจำกัดความรับผิดชอบทางการแพทย์ (Medical Disclaimer)</h2>
            <p className="text-xs">
              คำแนะนำ วิเคราะห์สุขภาพ หรือแผนการเดินทางท่องเที่ยวเพื่อบำบัดรักษาต่าง ๆ ที่ปรากฏบนแพลตฟอร์มนี้ 
              เป็นเพียงข้อแนะนำเชิงข้อมูลเพื่อการผ่อนคลายและดูแลสุขภาพเบื้องต้น <strong>ไม่ใช่คำแนะนำหรือการวินิจฉัยโรคทางการแพทย์มืออาชีพ</strong> 
              และไม่สามารถใช้ทดแทนแพทย์แผนปัจจุบันหรือแพทย์แผนไทยในสถานพยาบาลได้ หากท่านมีโรคประจำตัวหรือปัญหาสุขภาพร้ายแรง 
              โปรดปรึกษาผู้เชี่ยวชาญก่อนดำเนินตามคำแนะนำ
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">3. การใช้งานที่พึงประสงค์และข้อห้าม</h2>
            <p className="mb-2">ท่านตกลงที่จะไม่กระทำการใด ๆ ดังนี้:</p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>ใช้ระบบในทางที่ผิด หรือป้อนข้อมูลเท็จ ปลอมแปลงตัวตน ข้อมูลสุขภาพ หรือข้อมูลผู้ประกอบการ</li>
              <li>พยายามเจาะระบบ ขัดขวางความมั่นคงปลอดภัย หรือสร้างความเสียหายต่อข้อมูลในฐานข้อมูลแพลตฟอร์ม</li>
              <li>ละเมิดลิขสิทธิ์ ทรัพย์สินทางปัญญา หรือแบรนด์สินค้าภายใต้ระบบนิเวศของ E-san Wellness</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-bold text-slate-800 mb-3">4. สิทธิ์ในทรัพย์สินทางปัญญา</h2>
            <p>
              เนื้อหา ซอร์สโค้ด รูปแบบดีไซน์ ฐานข้อมูลระบบ และโปรแกรมประมวลผลคำแนะนำ เป็นทรัพย์สินของแพลตฟอร์ม 
              และได้รับความคุ้มครองภายใต้กฎหมายทรัพย์สินทางปัญญา การทำซ้ำ ดัดแปลง เผยแพร่ หรือนำไปใช้เพื่อประโยชน์เชิงพาณิชย์
              โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากเราถือเป็นความผิดทางกฎหมาย
            </p>
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
