"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type Severity = "severe" | "moderate" | "treatment";
type ReadinessStatus = "yes" | "no" | "na";
interface BodyPoint { id: string; label: string; x: number; y: number }
interface SelectedBodyPoint extends BodyPoint { severity: Severity }

interface CustomerRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  conditions: string[];
  surgeryStatus: string;
  surgeryDetail?: string | null;
  medStatus: string;
  medDetail?: string | null;
  cautions?: string | null;
  bodyPoints: SelectedBodyPoint[] | string;
  overallRating: number;
  feelingAfter: number;
  improvement: number;
  comment?: string | null;
  aiRecommendation?: string | null;
  createdAt: string;
  therapistRecord?: {
    id: string;
    customerRecordId: string;
    readinessChecks: string;
    beforePainPoints: string;
    afterPainPoints: string;
    techniquesUsed: string[];
    selfCareTips: string[];
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STEP_TITLES = [
  "เช็คลิสต์สำหรับลูกค้า",
  "ประเมินอาการก่อนนวด",
  "ประเมินหลังนวด & วิธีการนวด",
  "คำแนะนำต่อการปฏิบัติตัว",
];

const SEV_COLOR: Record<Severity, string> = { severe: "#f87171", moderate: "#fbbf24", treatment: "#34d399" };
const SEV_LABEL: Record<Severity, string> = { severe: "ปวดมาก", moderate: "ปวดปานกลาง", treatment: "ต้องการบำบัด" };
const SEV_ORDER: Severity[] = ["moderate", "severe", "treatment"];

const BODY_POINTS: BodyPoint[] = [
  { id: "head", label: "ศีรษะ", x: 50, y: 14 }, { id: "neck", label: "คอ", x: 50, y: 29 },
  { id: "l-shoulder", label: "ไหล่ซ้าย", x: 23, y: 38 }, { id: "r-shoulder", label: "ไหล่ขวา", x: 77, y: 38 },
  { id: "l-upper-arm", label: "ต้นแขนซ้าย", x: 14, y: 52 }, { id: "r-upper-arm", label: "ต้นแขนขวา", x: 86, y: 52 },
  { id: "l-chest", label: "หน้าอกซ้าย", x: 37, y: 53 }, { id: "r-chest", label: "หน้าอกขวา", x: 63, y: 53 },
  { id: "upper-abd", label: "ท้องส่วนบน", x: 50, y: 63 },
  { id: "l-elbow", label: "ข้อศอกซ้าย", x: 11, y: 68 }, { id: "r-elbow", label: "ข้อศอกขวา", x: 89, y: 68 },
  { id: "lower-abd", label: "ท้องส่วนล่าง", x: 50, y: 76 },
  { id: "l-hip", label: "สะโพกซ้าย", x: 37, y: 89 }, { id: "r-hip", label: "สะโพกขวา", x: 63, y: 89 },
  { id: "l-thigh", label: "ต้นขาซ้าย", x: 37, y: 118 }, { id: "r-thigh", label: "ต้นขาขวา", x: 63, y: 118 },
  { id: "l-knee", label: "เข่าซ้าย", x: 36, y: 149 }, { id: "r-knee", label: "เข่าขวา", x: 64, y: 149 },
  { id: "l-shin", label: "แข้งซ้าย", x: 34, y: 176 }, { id: "r-shin", label: "แข้งขวา", x: 65, y: 176 },
];

const BACK_POINTS: BodyPoint[] = [
  { id: "neck-back", label: "คอด้านหลัง", x: 50, y: 25 },
  { id: "l-upper-back", label: "บ่าซ้าย", x: 34, y: 40 }, { id: "r-upper-back", label: "บ่าขวา", x: 66, y: 40 },
  { id: "mid-back-l", label: "หลังบนซ้าย", x: 38, y: 55 }, { id: "mid-back-r", label: "หลังบนขวา", x: 62, y: 55 },
  { id: "lower-back-l", label: "หลังล่างซ้าย", x: 38, y: 73 }, { id: "lower-back-r", label: "หลังล่างขวา", x: 62, y: 73 },
  { id: "l-glute", label: "ก้นซ้าย", x: 38, y: 89 }, { id: "r-glute", label: "ก้นขวา", x: 62, y: 89 },
  { id: "l-back-thigh", label: "หลังขาซ้าย", x: 37, y: 118 }, { id: "r-back-thigh", label: "หลังขาขวา", x: 63, y: 118 },
  { id: "l-calf", label: "น่องซ้าย", x: 35, y: 162 }, { id: "r-calf", label: "น่องขวา", x: 65, y: 162 },
];

const READINESS_ITEMS = [
  "แจ้งสถานะสุขภาพปัจจุบันถูกต้อง", "รับประทานอาหารก่อนนวด 1–2 ชั่วโมง",
  "ไม่ดื่มแอลกอฮอล์/กาแฟก่อนนวด", "ไม่มีอาการไข้หรือการอักเสบรุนแรง",
  "ไม่ได้รับการผ่าตัดภายใน 3 เดือน", "ไม่ปวดตัวรุนแรงก่อนนวด",
];

const CAUTION_ITEMS = [
  "ห้ามนวดบริเวณที่มีแผลเปิด", "ระวังบริเวณที่มีรอยช้ำ", "ระวังความดันโลหิตสูง",
  "โรคหัวใจ", "ภาวะกระดูกพรุน", "เส้นเลือดดำขอด", "อื่นๆ",
];

const PAIN_AREAS = ["คอ / บ่า / ไหล่", "หลังส่วนบน", "หลังส่วนล่าง", "สะโพก / ก้น", "ขา / เข่า / แข้ง"];

const MASSAGE_TECHNIQUES = [
  { id: "thai", label: "นวดไทย", icon: "🤲" }, { id: "oil", label: "นวดน้ำมัน", icon: "🫙" },
  { id: "hot-compress", label: "ประคบ", icon: "🌡️" }, { id: "acupressure", label: "กดจุด", icon: "👆" },
  { id: "other", label: "อื่นๆ", icon: "➕" },
];

const SELF_CARE_TIPS = [
  { icon: "💧", title: "ดื่มน้ำมากๆ", detail: "ดื่มน้ำอย่างน้อย 1.5–2 ลิตรต่อวัน" },
  { icon: "🛌", title: "หลีกเลี่ยงการออกกำลังกายหนัก", detail: "อย่างน้อย 24–48 ชั่วโมง" },
  { icon: "🧘", title: "ยืดกล้ามเนื้อเบาๆ", detail: "วันละ 10–15 นาที" },
  { icon: "🌡️", title: "ประคบอุ่น", detail: "ประคบบริเวณที่นวด 1–2 ครั้ง/วัน" },
  { icon: "📅", title: "บอกนักนวดหากไม่สบายตัว", detail: "บอกทันที หากมีอาการผิดปกติ 6–8 ชั่วโมง" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEP_TITLES.map((_, i) => {
        const idx = i + 1; const active = idx === current; const done = idx < current;
        return (
          <div key={idx} className="flex items-center">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${active ? "bg-[var(--gold)] text-[#1a1a0e] shadow-[0_0_12px_var(--gold-glow)]" : done ? "bg-[var(--gold)] text-[#1a1a0e]" : "bg-[var(--bg-surface)] text-[var(--ink-muted)]"}`}>
              {done ? <svg viewBox="0 0 12 12" className="h-3 w-3"><path d="M2 6l3 3 5-5" stroke="#1a1a0e" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg> : idx}
            </div>
            {i < STEP_TITLES.length - 1 && <div className={`h-0.5 w-6 ${done ? "bg-[var(--gold)]" : "bg-[var(--line)]"}`} />}
          </div>
        );
      })}
    </div>
  );
}

function FormHeader({ step, onBack, onSubmit, submitting }: { step: number; onBack: () => void; onSubmit: () => void; submitting: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg-deep)]/95 px-4 pb-3 pt-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-surface)] text-[var(--ink-soft)] transition hover:text-[var(--gold)]" aria-label="ย้อนกลับ">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-base font-semibold text-[var(--ink)]">{STEP_TITLES[step - 1]}</h1>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-full border border-[var(--gold)]/30 bg-[var(--gold-glow)] px-3 py-1.5 text-xs font-semibold text-[var(--gold)] transition hover:bg-[var(--gold-glow)] disabled:opacity-50 flex items-center gap-1"
        >
          {submitting && (
            <svg className="h-3 w-3 animate-spin text-[var(--gold)]" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
          )}
          บันทึก
        </button>
      </div>
      <div className="mt-3"><StepDots current={step} /></div>
    </header>
  );
}

function BodySVG() {
  return (<>
    <ellipse cx="50" cy="14" rx="11" ry="12" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M46 25 L54 25 L53 33 L47 33 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M30 33 C22 37 19 52 19 82 C19 87 24 89 50 89 C76 89 81 87 81 82 C81 52 78 37 70 33 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M29 35 Q18 41 13 68 L19 70 Q24 47 32 39 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M13 68 L10 83 L16 84 L19 70 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="12" cy="88" rx="5" ry="5" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M71 35 Q82 41 87 68 L81 70 Q76 47 68 39 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M87 68 L90 83 L84 84 L81 70 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="88" cy="88" rx="5" ry="5" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M36 89 C33 112 32 132 32 157 L41 157 C41 132 42 112 46 89 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M54 89 C58 112 58 132 59 157 L68 157 C68 132 67 112 64 89 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M32 157 C30 179 29 197 29 211 L38 211 C38 197 39 179 41 157 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M59 157 C61 179 62 197 62 211 L71 211 C70 197 68 179 68 157 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="34" cy="215" rx="9" ry="4" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="65" cy="215" rx="9" ry="4" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
  </>);
}

function BackBodySVG() {
  return (<>
    <ellipse cx="50" cy="14" rx="11" ry="12" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M46 25 L54 25 L53 33 L47 33 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M30 33 C22 37 19 52 19 82 C19 87 24 89 50 89 C76 89 81 87 81 82 C81 52 78 37 70 33 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <line x1="50" y1="33" x2="50" y2="85" stroke="var(--line-hover)" strokeWidth="0.8" strokeDasharray="3 2" />
    <path d="M29 35 Q18 41 13 68 L19 70 Q24 47 32 39 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M13 68 L10 83 L16 84 L19 70 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="12" cy="88" rx="5" ry="5" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M71 35 Q82 41 87 68 L81 70 Q76 47 68 39 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M87 68 L90 83 L84 84 L81 70 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="88" cy="88" rx="5" ry="5" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M36 89 C33 112 32 132 32 157 L41 157 C41 132 42 112 46 89 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M54 89 C58 112 58 132 59 157 L68 157 C68 132 67 112 64 89 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M32 157 C30 179 29 197 29 211 L38 211 C38 197 39 179 41 157 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <path d="M59 157 C61 179 62 197 62 211 L71 211 C70 197 68 179 68 157 Z" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="34" cy="215" rx="9" ry="4" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
    <ellipse cx="65" cy="215" rx="9" ry="4" fill="var(--bg-elevated)" stroke="var(--line-hover)" strokeWidth="1.1" />
  </>);
}

function BodyDiagram({ selected, onToggle, points, useFront }: { selected: SelectedBodyPoint[]; onToggle: (p: BodyPoint) => void; points: BodyPoint[]; useFront: boolean }) {
  const selMap = new Map(selected.map((p) => [p.id, p.severity]));
  return (
    <svg viewBox="0 0 100 240" className="mx-auto w-full max-w-[150px]" style={{ overflow: "visible" }}>
      {useFront ? <BodySVG /> : <BackBodySVG />}
      {points.map((point) => {
        const sev = selMap.get(point.id);
        const color = sev ? SEV_COLOR[sev] : "rgba(138,159,138,0.3)";
        const stroke = sev ? SEV_COLOR[sev] : "var(--ink-muted)";
        return (
          <g key={point.id} onClick={() => onToggle(point)} style={{ cursor: "pointer" }}>
            <circle cx={point.x} cy={point.y} r="7" fill="transparent" />
            {sev && <circle cx={point.x} cy={point.y} r="8" fill={color} opacity="0.2" />}
            <circle cx={point.x} cy={point.y} r="4" fill={color} stroke={stroke} strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (<div className="glass-card p-4"><h3 className="mb-3 text-sm font-semibold text-[var(--gold)]">{title}</h3>{children}</div>);
}

function ReadinessRow({ label, value, onChange }: { label: string; value: ReadinessStatus; onChange: (v: ReadinessStatus) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--line)] py-2.5 last:border-0">
      <span className="flex-1 pr-2 text-xs text-[var(--ink-soft)]">{label}</span>
      <div className="flex gap-1.5">
        {(["yes", "no", "na"] as ReadinessStatus[]).map((v) => {
          const labels = { yes: "ใช่", no: "ไม่", na: "ไม่ใช่" };
          const active = value === v;
          return (
            <button key={v} type="button" onClick={() => onChange(v)}
              className={`rounded-lg px-2 py-1 text-[10px] font-medium transition ${active ? v === "yes" ? "bg-[var(--accent)] text-white" : v === "no" ? "bg-[var(--danger)] text-white" : "bg-[var(--ink-muted)] text-white" : "bg-[var(--bg-surface)] text-[var(--ink-muted)]"}`}>
              {labels[v]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IntensitySlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const barColor = value >= 8 ? "var(--danger)" : value >= 5 ? "var(--warn)" : "var(--accent)";
  return (
    <div className="border-b border-[var(--line)] pb-3 pt-2 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--ink-soft)]">{label}</span>
        <span className="text-sm font-bold" style={{ color: barColor }}>{value}</span>
      </div>
      <input type="range" min={0} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1.5 w-full accent-[var(--accent)]" />
      <div className="relative mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--bg-deep)]">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${value * 10}%`, background: barColor }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function TherapistForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const queryRecordId = searchParams.get("recordId");

  const [customerRecords, setCustomerRecords] = useState<CustomerRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string>("");
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [readiness, setReadiness] = useState<Record<string, ReadinessStatus>>(Object.fromEntries(READINESS_ITEMS.map((item) => [item, "na"])));
  const [cautions, setCautions] = useState<string[]>([]);
  const [note1, setNote1] = useState("");
  const [prePoints, setPrePoints] = useState<SelectedBodyPoint[]>([]);
  const [preIntensity, setPreIntensity] = useState<Record<string, number>>(Object.fromEntries(PAIN_AREAS.map((a) => [a, 0])));
  const [postPoints, setPostPoints] = useState<SelectedBodyPoint[]>([]);
  const [postIntensity, setPostIntensity] = useState<Record<string, number>>(Object.fromEntries(PAIN_AREAS.map((a) => [a, 0])));
  const [techniques, setTechniques] = useState<string[]>([]);
  const [triggerPoints, setTriggerPoints] = useState<SelectedBodyPoint[]>([]);
  const [nextDate, setNextDate] = useState("");
  const [therapistNote, setTherapistNote] = useState("");

  useEffect(() => {
    async function fetchRecords() {
      setLoadingRecords(true);
      try {
        const res = await fetch("/api/forms/records");
        const data = await res.json();
        if (data.ok) {
          setCustomerRecords(data.records);
          if (data.records.length > 0) {
            const queryMatched = queryRecordId ? data.records.find((r: CustomerRecord) => r.id === queryRecordId) : null;
            const pending = queryMatched || data.records.find((r: CustomerRecord) => !r.therapistRecord) || data.records[0];
            handleCustomerSelect(pending);
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer records:", err);
      } finally {
        setLoadingRecords(false);
      }
    }
    fetchRecords();
  }, [queryRecordId]);

  function handleCustomerSelect(record: CustomerRecord) {
    setSelectedRecordId(record.id);
    if (record.bodyPoints) {
      try {
        const points = typeof record.bodyPoints === "string" ? JSON.parse(record.bodyPoints) : record.bodyPoints;
        setPrePoints(points || []);
      } catch (e) {
        console.error("Failed to parse bodyPoints:", e);
        setPrePoints([]);
      }
    } else {
      setPrePoints([]);
    }
  }

  async function handleSubmit() {
    if (!selectedRecordId) {
      alert("กรุณาเลือกประวัติลูกค้าก่อนบันทึก");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerRecordId: selectedRecordId,
        readinessChecks: Object.entries(readiness).map(([label, status]) => ({
          label,
          status,
        })),
        beforePainPoints: prePoints.map((p) => ({
          id: p.id,
          label: p.label,
          x: p.x,
          y: p.y,
          severity: p.severity,
        })),
        afterPainPoints: postPoints.map((p) => ({
          id: p.id,
          label: p.label,
          x: p.x,
          y: p.y,
          severity: p.severity,
        })),
        techniquesUsed: techniques,
        selfCareTips: SELF_CARE_TIPS.map((tip) => tip.title),
        notes: therapistNote || undefined,
      };

      const res = await fetch("/api/forms/therapist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSubmitted(true);
      } else {
        alert("ไม่สามารถบันทึกข้อมูลได้: " + (data.message || "เกิดข้อผิดพลาด"));
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleBodyPoint(point: BodyPoint, list: SelectedBodyPoint[], setter: React.Dispatch<React.SetStateAction<SelectedBodyPoint[]>>) {
    setter((prev) => {
      const existing = prev.find((p) => p.id === point.id);
      if (!existing) return [...prev, { ...point, severity: "moderate" }];
      const curIdx = SEV_ORDER.indexOf(existing.severity);
      const nextIdx = (curIdx + 1) % (SEV_ORDER.length + 1);
      if (nextIdx === SEV_ORDER.length) return prev.filter((p) => p.id !== point.id);
      return prev.map((p) => p.id === point.id ? { ...p, severity: SEV_ORDER[nextIdx] } : p);
    });
  }

  function toggleTechnique(id: string) { setTechniques((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]); }
  function toggleCaution(item: string) { setCautions((prev) => prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]); }
  function handleBack() { if (step > 1) setStep((s) => s - 1); }
  function handleNext() { if (step < 4) setStep((s) => s + 1); else handleSubmit(); }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <div className="rounded-full bg-[var(--gold)] p-5 shadow-[0_0_40px_var(--gold-glow)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-[#1a1a0e]" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[var(--ink)]">บันทึกข้อมูลสำเร็จ</h2>
        <p className="mt-2 text-sm text-[var(--ink-soft)]">บันทึกการนวดเรียบร้อยแล้ว</p>
        <Link href="/" className="btn-gold mt-6">กลับหน้าหลัก</Link>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <label className="mb-2 block text-xs font-bold text-[var(--gold)] uppercase tracking-wider">เลือกประวัติลูกค้า</label>
          {loadingRecords ? (
            <div className="flex items-center gap-2 py-2 text-xs text-[var(--ink-muted)]">
              <svg className="h-4 w-4 animate-spin text-[var(--gold)]" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
              กำลังโหลดข้อมูล...
            </div>
          ) : customerRecords.length === 0 ? (
            <p className="py-2 text-xs text-[var(--danger)]">ไม่มีประวัติลูกค้าในระบบ กรุณาแจ้งลูกค้ากรอกแบบฟอร์มก่อน</p>
          ) : (
            <select
              value={selectedRecordId}
              onChange={(e) => {
                const rec = customerRecords.find((r) => r.id === e.target.value);
                if (rec) handleCustomerSelect(rec);
              }}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg-deep)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold)]"
            >
              {customerRecords.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.name} ({rec.age} ปี, {rec.gender}) - {new Date(rec.createdAt).toLocaleDateString("th-TH")} {rec.therapistRecord ? "✓ ประเมินแล้ว" : "⚡ รอประเมิน"}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedRecordId && (
          <>
            {(() => {
              const rec = customerRecords.find((r) => r.id === selectedRecordId);
              if (!rec) return null;
              return (
                <div className="glass-card p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[var(--gold-glow)] text-2xl">
                      {rec.gender === "ชาย" ? "👨" : "👩"}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--ink)]">{rec.name}</p>
                      <p className="text-xs text-[var(--ink-soft)]">
                        อายุ {rec.age} ปี | เพศ {rec.gender} | สัญชาติ {rec.nationality}
                      </p>
                      <p className="text-xs text-[var(--ink-muted)]">
                        วันที่ลงทะเบียน: {new Date(rec.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--line)] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--ink-muted)] block">โรคประจำตัว:</span>
                      <span className="text-[var(--ink-soft)] font-medium">
                        {rec.conditions && rec.conditions.length > 0 ? rec.conditions.join(", ") : "ไม่มี"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--ink-muted)] block">ข้อควรระวังพิเศษ:</span>
                      <span className="text-[var(--danger)] font-medium">
                        {rec.cautions || "ไม่มี"}
                      </span>
                    </div>
                    {rec.surgeryStatus === "yes" && (
                      <div className="col-span-2">
                        <span className="text-[var(--ink-muted)] block">ประวัติการผ่าตัด:</span>
                        <span className="text-[var(--ink-soft)] font-medium">{rec.surgeryDetail || "มี"}</span>
                      </div>
                    )}
                    {rec.medStatus === "yes" && (
                      <div className="col-span-2">
                        <span className="text-[var(--ink-muted)] block">ยาที่ทานเป็นประจำ:</span>
                        <span className="text-[var(--ink-soft)] font-medium">{rec.medDetail || "มี"}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        )}
        <SectionCard title="1. ความพร้อมในการรับบริการ">
          {READINESS_ITEMS.map((item) => (<ReadinessRow key={item} label={item} value={readiness[item] ?? "na"} onChange={(v) => setReadiness((prev) => ({ ...prev, [item]: v }))} />))}
        </SectionCard>
        <SectionCard title="2. ข้อห้าม / ข้อควรระวัง">
          <div className="grid grid-cols-2 gap-2">
            {CAUTION_ITEMS.map((item) => (
              <button key={item} type="button" onClick={() => toggleCaution(item)}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs transition ${cautions.includes(item) ? "border-[var(--danger)]/40 bg-[var(--danger-bg)] text-[var(--danger)]" : "border-[var(--line)] bg-[var(--bg-surface)] text-[var(--ink-soft)]"}`}>
                <span className={`h-4 w-4 flex-shrink-0 rounded-full border-2 ${cautions.includes(item) ? "border-[var(--danger)] bg-[var(--danger)]" : "border-[var(--line-hover)]"}`} />
                {item}
              </button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="หมายเหตุเพิ่มเติม (ถ้ามี)">
          <textarea value={note1} onChange={(e) => setNote1(e.target.value)} placeholder="บันทึกข้อสังเกตพิเศษ..." className="input-dark w-full" rows={3} />
        </SectionCard>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <h3 className="mb-2 text-center text-sm font-semibold text-[var(--accent)]">1. ประเมินอาการ (สถานภาพก่อนนวด)</h3>
          <div className="flex gap-2">
            <div className="flex-1 text-center">
              <p className="mb-1 text-[11px] text-[var(--ink-muted)]">ด้านหน้า</p>
              <BodyDiagram selected={prePoints} onToggle={(p) => toggleBodyPoint(p, prePoints, setPrePoints)} points={BODY_POINTS} useFront={true} />
            </div>
            <div className="flex-1 text-center">
              <p className="mb-1 text-[11px] text-[var(--ink-muted)]">ด้านหลัง</p>
              <BodyDiagram selected={prePoints} onToggle={(p) => toggleBodyPoint(p, prePoints, setPrePoints)} points={BACK_POINTS} useFront={false} />
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-4">
            {(Object.entries(SEV_LABEL) as [Severity, string][]).map(([sev, label]) => (
              <div key={sev} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full" style={{ background: SEV_COLOR[sev] }} /><span className="text-[10px] text-[var(--ink-muted)]">{label}</span></div>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-[var(--ink-muted)]">เลือกแล้ว {prePoints.length} จุด — แตะซ้ำเพื่อเปลี่ยนระดับ</p>
        </div>
        <SectionCard title="2. ระดับความรุนแรงของอาการ (0-10)">
          {PAIN_AREAS.map((area) => (<IntensitySlider key={area} label={area} value={preIntensity[area] ?? 0} onChange={(v) => setPreIntensity((prev) => ({ ...prev, [area]: v }))} />))}
        </SectionCard>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <h3 className="mb-2 text-center text-sm font-semibold text-[var(--accent)]">1. อาการหลังนวด</h3>
          <div className="flex gap-2">
            <div className="flex-1 text-center">
              <p className="mb-1 text-[11px] text-[var(--ink-muted)]">ด้านหน้า</p>
              <BodyDiagram selected={postPoints} onToggle={(p) => toggleBodyPoint(p, postPoints, setPostPoints)} points={BODY_POINTS} useFront={true} />
            </div>
            <div className="flex-1 text-center">
              <p className="mb-1 text-[11px] text-[var(--ink-muted)]">ด้านหลัง</p>
              <BodyDiagram selected={postPoints} onToggle={(p) => toggleBodyPoint(p, postPoints, setPostPoints)} points={BACK_POINTS} useFront={false} />
            </div>
          </div>
        </div>
        <SectionCard title="2. ระดับความรุนแรงหลังนวด (0-10)">
          {PAIN_AREAS.map((area) => (<IntensitySlider key={area} label={area} value={postIntensity[area] ?? 0} onChange={(v) => setPostIntensity((prev) => ({ ...prev, [area]: v }))} />))}
        </SectionCard>
        <SectionCard title="3. วิธีนวดที่ใช้ (เลือกได้มากกว่า 1)">
          <div className="grid grid-cols-3 gap-2">
            {MASSAGE_TECHNIQUES.map((tech) => {
              const active = techniques.includes(tech.id);
              return (
                <button key={tech.id} type="button" onClick={() => toggleTechnique(tech.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 transition ${active ? "border-[var(--gold)]/50 bg-[var(--gold-glow)]" : "border-[var(--line)] bg-[var(--bg-surface)]"}`}>
                  <span className="text-xl">{tech.icon}</span>
                  <span className={`text-[11px] font-medium ${active ? "text-[var(--gold)]" : "text-[var(--ink-soft)]"}`}>{tech.label}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>
        <div className="glass-card p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--gold)]">4. จุดที่เน้น (Trigger Point)</h3>
          <p className="mb-3 text-xs text-[var(--ink-muted)]">แตะตำแหน่งที่นวดเน้นบนร่างกาย</p>
          <BodyDiagram selected={triggerPoints} onToggle={(p) => toggleBodyPoint(p, triggerPoints, setTriggerPoints)} points={BODY_POINTS} useFront={true} />
          <div className="mt-2 flex gap-2">
            <button type="button" className="flex-1 rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-glow)] py-2 text-sm font-medium text-[var(--gold)]">จุดที่เน้น ({triggerPoints.length})</button>
            <button type="button" onClick={() => setTriggerPoints([])} className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] py-2 text-sm text-[var(--ink-soft)]">ล้างข้อมูล</button>
          </div>
        </div>
      </div>
    );
  }

  function renderStep4() {
    const reduced = PAIN_AREAS.reduce((sum, a) => sum + (preIntensity[a] ?? 0), 0) > PAIN_AREAS.reduce((sum, a) => sum + (postIntensity[a] ?? 0), 0);
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${reduced ? "bg-[var(--accent)]" : "bg-[var(--warn)]"}`}>
              {reduced ? <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg> : <span className="text-white text-lg">!</span>}
            </div>
            <div>
              <p className="font-semibold text-[var(--ink)]">สรุปผลการนวด</p>
              <p className="text-xs text-[var(--ink-soft)]">{reduced ? "อาการดีขึ้นหลังนวด — ระดับปวดลดลงโดยรวม 60%" : "ระดับอาการยังคงต้องติดตาม"}</p>
            </div>
          </div>
        </div>
        <SectionCard title="คำแนะนำสำหรับลูกค้า">
          <div className="space-y-2.5">
            {SELF_CARE_TIPS.map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-3">
                <span className="text-xl leading-none">{tip.icon}</span>
                <div><p className="text-sm font-medium text-[var(--ink)]">{tip.title}</p><p className="text-xs text-[var(--ink-soft)]">{tip.detail}</p></div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="แผนการนวดครั้งต่อไป">
          <div className="flex items-center gap-3">
            <div className="flex-1"><input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="input-dark w-full" /></div>
            <button type="button" className="rounded-xl border border-[var(--gold)]/40 bg-[var(--gold-glow)] px-3 py-2 text-sm font-medium text-[var(--gold)]">📅 นัด</button>
          </div>
        </SectionCard>
        <SectionCard title="หมายเหตุเพิ่มเติมจาก Therapist">
          <textarea value={therapistNote} onChange={(e) => setTherapistNote(e.target.value)} placeholder="บันทึกข้อสังเกตหรือสิ่งที่ควรแจ้งลูกค้า..." className="input-dark w-full" rows={4} />
          <p className="mt-1 text-right text-[10px] text-[var(--ink-muted)]">{therapistNote.length}/300</p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <FormHeader step={step} onBack={handleBack} onSubmit={handleSubmit} submitting={submitting} />
      <main className="flex-1 overflow-y-auto px-4 py-4">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        <div className="h-24" />
      </main>
      <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-[var(--bg-deep)] via-[var(--bg-deep)] to-transparent px-4 pb-5 pt-8">
        <button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="btn-gold w-full py-3.5 text-base flex justify-center items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="h-5 w-5 animate-spin text-[#1a1a0e]" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
              กำลังบันทึก...
            </>
          ) : step < 4 ? (
            "ถัดไป"
          ) : (
            "✦ บันทึก"
          )}
        </button>
        <p className="mt-2 text-center text-[10px] text-[var(--ink-muted)]">🔒 ข้อมูลของคุณปลอดภัยตามมาตรฐาน PDPA</p>
      </div>
    </div>
  );
}
