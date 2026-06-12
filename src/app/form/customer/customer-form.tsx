"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


// ─── Types ────────────────────────────────────────────────────────────────────
type Severity = "severe" | "moderate" | "treatment";
interface BodyPoint { id: string; label: string; x: number; y: number }
interface SelectedBodyPoint extends BodyPoint { severity: Severity }

// ─── Constants ────────────────────────────────────────────────────────────────
const STEP_TITLES = [
  "ข้อมูลทั่วไป",
  "สุขภาพ / ประวัติการเจ็บป่วย",
  "จุดที่มีอาการ / จุดที่ต้องการบำบัด",
  "Feedback",
];

const SEV_COLOR: Record<Severity, string> = {
  severe: "#f87171",
  moderate: "#fbbf24",
  treatment: "#34d399",
};
const SEV_LABEL: Record<Severity, string> = {
  severe: "อาการรุนแรง",
  moderate: "อาการปานกลาง",
  treatment: "ต้องการบำบัด",
};
const SEV_ORDER: Severity[] = ["moderate", "severe", "treatment"];

const BODY_POINTS: BodyPoint[] = [
  { id: "head", label: "ศีรษะ", x: 50, y: 14 },
  { id: "neck", label: "คอ", x: 50, y: 29 },
  { id: "l-shoulder", label: "ไหล่ซ้าย", x: 23, y: 38 },
  { id: "r-shoulder", label: "ไหล่ขวา", x: 77, y: 38 },
  { id: "l-upper-arm", label: "ต้นแขนซ้าย", x: 14, y: 52 },
  { id: "r-upper-arm", label: "ต้นแขนขวา", x: 86, y: 52 },
  { id: "l-chest", label: "หน้าอกซ้าย", x: 37, y: 53 },
  { id: "r-chest", label: "หน้าอกขวา", x: 63, y: 53 },
  { id: "upper-abd", label: "ท้องส่วนบน", x: 50, y: 63 },
  { id: "l-elbow", label: "ข้อศอกซ้าย", x: 11, y: 68 },
  { id: "r-elbow", label: "ข้อศอกขวา", x: 89, y: 68 },
  { id: "lower-abd", label: "ท้องส่วนล่าง", x: 50, y: 76 },
  { id: "l-wrist", label: "ข้อมือซ้าย", x: 10, y: 82 },
  { id: "r-wrist", label: "ข้อมือขวา", x: 90, y: 82 },
  { id: "l-hip", label: "สะโพกซ้าย", x: 37, y: 89 },
  { id: "r-hip", label: "สะโพกขวา", x: 63, y: 89 },
  { id: "l-thigh", label: "ต้นขาซ้าย", x: 37, y: 118 },
  { id: "r-thigh", label: "ต้นขาขวา", x: 63, y: 118 },
  { id: "l-knee", label: "เข่าซ้าย", x: 36, y: 149 },
  { id: "r-knee", label: "เข่าขวา", x: 64, y: 149 },
  { id: "l-shin", label: "แข้งซ้าย", x: 34, y: 176 },
  { id: "r-shin", label: "แข้งขวา", x: 65, y: 176 },
  { id: "l-ankle", label: "ข้อเท้าซ้าย", x: 33, y: 204 },
  { id: "r-ankle", label: "ข้อเท้าขวา", x: 65, y: 204 },
];

const CONDITIONS = [
  "ไม่มีโรคประจำตัว",
  "ความดันโลหิตสูง",
  "เบาหวาน",
  "โรคหัวใจ",
  "ไทรอยด์",
  "ประวัติผ่าตัด",
  "โรคกระดูก / ข้อกระดูก",
  "อื่นๆ",
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {STEP_TITLES.map((_, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={idx} className="flex items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                active
                  ? "bg-[var(--accent)] text-white shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                  : done
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-surface)] text-[var(--ink-muted)]"
              }`}
            >
              {done ? (
                <svg viewBox="0 0 12 12" className="h-3 w-3 fill-white">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              ) : (
                idx
              )}
            </div>
            {i < STEP_TITLES.length - 1 && (
              <div className={`h-0.5 w-6 ${done ? "bg-[var(--accent)]" : "bg-[var(--line)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormHeader({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--bg-deep)]/95 px-4 pb-3 pt-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-surface)] text-[var(--ink-soft)] transition hover:border-[var(--accent)]/40 hover:text-[var(--accent)]"
          aria-label="ย้อนกลับ"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-[var(--ink)]">{STEP_TITLES[step - 1]}</h1>
        <div className="w-9" />
      </div>
      <div className="mt-3">
        <StepDots current={step} />
      </div>
    </header>
  );
}

function BodyDiagram({
  selected,
  onToggle,
}: {
  selected: SelectedBodyPoint[];
  onToggle: (p: BodyPoint) => void;
}) {
  const selMap = new Map(selected.map((p) => [p.id, p.severity]));
  return (
    <svg viewBox="0 0 100 240" className="mx-auto w-full max-w-[170px]" style={{ overflow: "visible" }}>
      {/* Body silhouette */}
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
      {/* Interactive hotspots */}
      {BODY_POINTS.map((point) => {
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

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-3xl leading-none transition hover:scale-110"
          style={{ color: n <= value ? "var(--gold)" : "var(--line-hover)" }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const EMOJIS = ["😞", "🙁", "😐", "🙂", "😄"];
const EMOJI_LABELS = ["แย่มาก", "ไม่พอใจ", "ปานกลาง", "พอใจ", "ประทับใจมาก"];

function EmojiRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex justify-between gap-1">
      {EMOJIS.map((emoji, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="flex flex-col items-center gap-1"
        >
          <span
            className="text-2xl leading-none transition-transform"
            style={{ transform: value === i + 1 ? "scale(1.35)" : "scale(1)", opacity: value === i + 1 ? 1 : 0.4 }}
          >
            {emoji}
          </span>
          <span className={`text-[9px] ${value === i + 1 ? "font-bold text-[var(--accent)]" : "text-[var(--ink-muted)]"}`}>
            {EMOJI_LABELS[i]}
          </span>
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-[var(--accent)]" : "bg-[var(--line-hover)]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--accent)]">{title}</h3>
      {children}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--line)] py-2.5 last:border-0">
      <span className="text-sm text-[var(--ink-soft)]">{label}</span>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function InputField({
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-xl border border-[var(--line)] bg-[var(--bg-deep)] px-2.5 py-1.5 text-right text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] ${className}`}
    />
  );
}

function ConditionChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
        checked
          ? "border-[var(--accent)]/50 bg-[var(--accent-subtle)]"
          : "border-[var(--line)] bg-[var(--bg-surface)]"
      }`}
    >
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
          checked ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--line-hover)]"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 10" className="h-3 w-3 fill-none stroke-white" strokeWidth="1.8" strokeLinecap="round">
            <path d="M2 5l2.5 2.5 3.5-3.5" />
          </svg>
        )}
      </span>
      <span className={`text-left text-xs leading-snug ${checked ? "font-medium text-[var(--accent)]" : "text-[var(--ink-soft)]"}`}>
        {label}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CustomerForm({ initialName = "" }: { initialName?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [name, setName] = useState(initialName || "คุณลูกค้า");
  const [isEditingName, setIsEditingName] = useState(false);
  const [age, setAge] = useState("24");
  const [gender, setGender] = useState("หญิง");
  const [nationality, setNationality] = useState("ไทย");
  const [religion, setReligion] = useState("พุทธ");
  const [occupation, setOccupation] = useState("นักศึกษา");
  const [idCard, setIdCard] = useState("");
  const [weight, setWeight] = useState("52");
  const [height, setHeight] = useState("160");
  const [address, setAddress] = useState("กรุงเทพมหานคร, ประเทศไทย");

  // Step 2
  const [conditions, setConditions] = useState<string[]>(["ไม่มีโรคประจำตัว"]);
  const [surgeryStatus, setSurgeryStatus] = useState<"none" | "yes">("none");
  const [surgeryDetail, setSurgeryDetail] = useState("");
  const [medStatus, setMedStatus] = useState<"none" | "yes">("none");
  const [medDetail, setMedDetail] = useState("");
  const [cautions, setCautions] = useState("");

  // Step 3
  const [bodyPoints, setBodyPoints] = useState<SelectedBodyPoint[]>([]);

  // Step 4
  const [overallRating, setOverallRating] = useState(4);
  const [feelingAfter, setFeelingAfter] = useState(4);
  const [improvement, setImprovement] = useState(75);
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(true);

  function toggleBodyPoint(point: BodyPoint) {
    setBodyPoints((prev) => {
      const existing = prev.find((p) => p.id === point.id);
      if (!existing) {
        return [...prev, { ...point, severity: "moderate" }];
      }
      const curIdx = SEV_ORDER.indexOf(existing.severity);
      const nextIdx = (curIdx + 1) % (SEV_ORDER.length + 1);
      if (nextIdx === SEV_ORDER.length) {
        return prev.filter((p) => p.id !== point.id);
      }
      return prev.map((p) => p.id === point.id ? { ...p, severity: SEV_ORDER[nextIdx] } : p);
    });
  }

  function setPointSeverity(id: string, severity: Severity) {
    setBodyPoints((prev) => prev.map((p) => p.id === id ? { ...p, severity } : p));
  }

  function removeBodyPoint(id: string) {
    setBodyPoints((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleCondition(cond: string) {
    setConditions((prev) => {
      if (cond === "ไม่มีโรคประจำตัว") return ["ไม่มีโรคประจำตัว"];
      const without = prev.filter((c) => c !== "ไม่มีโรคประจำตัว" && c !== cond);
      return prev.includes(cond) ? without : [...without, cond];
    });
  }

  function handleBack() {
    if (step === 1) {
      if (typeof window !== "undefined" && document.referrer && document.referrer.includes(window.location.host)) {
        router.back();
      } else {
        router.push("/");
      }
      return;
    }
    setStep((s) => s - 1);
  }

  async function handleNext() {
    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      setSubmitting(true);
      try {
        const response = await fetch("/api/forms/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            age: parseInt(age) || 24,
            gender,
            nationality,
            conditions,
            surgeryStatus,
            surgeryDetail: surgeryStatus === "yes" && surgeryDetail ? surgeryDetail : undefined,
            medStatus,
            medDetail: medStatus === "yes" && medDetail ? medDetail : undefined,
            cautions: cautions || undefined,
            bodyPoints: bodyPoints.map((p) => ({
              id: p.id,
              label: p.label,
              x: p.x,
              y: p.y,
              severity: p.severity,
            })),
            overallRating,
            feelingAfter,
            improvement,
            comment: comment || undefined,
          }),
        });

        const data = await response.json();
        if (response.ok && data.ok) {
          setAiAdvice(data.record.aiRecommendation);
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
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center max-w-xl mx-auto">
        <div className="rounded-full bg-accent p-5 shadow-[0_0_40px_var(--accent-glow)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[var(--ink)]">บันทึกข้อมูลและวิเคราะห์อาการสำเร็จ</h2>
        
        {aiAdvice && (
          <div className="mt-6 text-left bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-3 w-full">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider">✦ คำแนะนำการบำบัดด้วย AI</h3>
            <div className="text-xs leading-relaxed text-slate-600 whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 max-h-[300px] overflow-y-auto">
              {aiAdvice}
            </div>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">ขอบคุณสำหรับการกรอกแบบฟอร์มเชิงลึก ระบบจัดเตรียมคำแนะนำนี้ไว้ให้นักบำบัดของคุณแล้ว</p>
        <Link href="/" className="btn-primary mt-6 w-full max-w-[200px] text-center block">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-2xl">
              👤
            </div>
            <div className="flex-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-[var(--line)] bg-[var(--bg-deep)] px-2.5 py-1 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] w-full max-w-[200px] text-left"
                  autoFocus
                />
              ) : (
                <p className="font-semibold text-[var(--ink)]">{name}</p>
              )}
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">ข้อมูลสมาชิก</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
              className="ml-auto rounded-full border border-[var(--accent)]/40 px-3 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-subtle)] transition"
            >
              {isEditingName ? "ตกลง" : "แก้ไขข้อมูล"}
            </button>
          </div>
        </div>

        <SectionCard title="ข้อมูลที่สามารถแก้ไขได้">
          <FieldRow label="อายุ">
            <div className="flex items-center gap-1">
              <InputField value={age} onChange={setAge} type="number" className="w-16 text-center" />
              <span className="text-xs text-[var(--ink-muted)]">ปี</span>
            </div>
          </FieldRow>
          <FieldRow label="เพศ">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="rounded-xl border border-[var(--line)] bg-[var(--bg-deep)] px-2.5 py-1.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            >
              {["ชาย", "หญิง", "อื่นๆ"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </FieldRow>
          <FieldRow label="เชื้อชาติ">
            <InputField value={nationality} onChange={setNationality} className="w-24" />
          </FieldRow>
          <FieldRow label="สัญชาติ">
            <InputField value={religion} onChange={setReligion} className="w-24" />
          </FieldRow>
          <FieldRow label="อาชีพ">
            <InputField value={occupation} onChange={setOccupation} className="w-24" />
          </FieldRow>
          <FieldRow label="เลขประจำตัวประชาชน">
            <InputField value={idCard} onChange={setIdCard} placeholder="1-2345-67890-12-3" className="w-36 text-xs" />
          </FieldRow>
          <FieldRow label="น้ำหนัก">
            <div className="flex items-center gap-1">
              <InputField value={weight} onChange={setWeight} type="number" className="w-14 text-center" />
              <span className="text-xs text-[var(--ink-muted)]">กก.</span>
            </div>
          </FieldRow>
          <FieldRow label="ส่วนสูง">
            <div className="flex items-center gap-1">
              <InputField value={height} onChange={setHeight} type="number" className="w-14 text-center" />
              <span className="text-xs text-[var(--ink-muted)]">ซม.</span>
            </div>
          </FieldRow>
          <FieldRow label="ที่อยู่ปัจจุบัน">
            <InputField value={address} onChange={setAddress} className="w-40 text-xs" />
          </FieldRow>
        </SectionCard>
      </div>
    );
  }

  function renderStep2() {
    return (
      <div className="space-y-3">
        <SectionCard title="1. โรคประจำตัว / ประวัติการเจ็บป่วย">
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((cond) => (
              <ConditionChip
                key={cond}
                label={cond}
                checked={conditions.includes(cond)}
                onChange={() => toggleCondition(cond)}
              />
            ))}
          </div>
          {conditions.includes("อื่นๆ") && (
            <textarea
              className="input-dark mt-2 w-full"
              rows={2}
              placeholder="ระบุโรคประจำตัวอื่นๆ..."
            />
          )}
        </SectionCard>

        <SectionCard title="2. การผ่าตัด / อุปกรณ์โลหะ">
          <div className="flex gap-3">
            {(["none", "yes"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSurgeryStatus(val)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                  surgeryStatus === val
                    ? "border-[var(--accent)]/50 bg-[var(--accent-subtle)] font-medium text-[var(--accent)]"
                    : "border-[var(--line)] bg-[var(--bg-surface)] text-[var(--ink-soft)]"
                }`}
              >
                <span className={`h-4 w-4 rounded-full border-2 ${surgeryStatus === val ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--line-hover)]"}`} />
                {val === "none" ? "ไม่มี" : "มี (ระบุ)"}
              </button>
            ))}
          </div>
          {surgeryStatus === "yes" && (
            <input
              type="text"
              value={surgeryDetail}
              onChange={(e) => setSurgeryDetail(e.target.value)}
              placeholder="ระบุรายละเอียด..."
              className="input-dark mt-2"
            />
          )}
        </SectionCard>

        <SectionCard title="3. ยาที่รับประทานเป็นประจำ">
          <div className="flex gap-3">
            {(["none", "yes"] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMedStatus(val)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition ${
                  medStatus === val
                    ? "border-[var(--accent)]/50 bg-[var(--accent-subtle)] font-medium text-[var(--accent)]"
                    : "border-[var(--line)] bg-[var(--bg-surface)] text-[var(--ink-soft)]"
                }`}
              >
                <span className={`h-4 w-4 rounded-full border-2 ${medStatus === val ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--line-hover)]"}`} />
                {val === "none" ? "ไม่มี" : "มี (ระบุ)"}
              </button>
            ))}
          </div>
          {medStatus === "yes" && (
            <input
              type="text"
              value={medDetail}
              onChange={(e) => setMedDetail(e.target.value)}
              placeholder="ระบุยาที่ทาน..."
              className="input-dark mt-2"
            />
          )}
        </SectionCard>

        <SectionCard title="4. ข้อควรระวัง / สิ่งที่ไม่ควรทำ">
          <textarea
            value={cautions}
            onChange={(e) => setCautions(e.target.value)}
            placeholder="ระบุข้อควรระวัง เช่น แพ้น้ำมัน ห้ามนวดบริเวณ..."
            className="input-dark w-full"
            rows={3}
          />
        </SectionCard>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <p className="text-center text-xs text-[var(--ink-soft)]">
            กรุณาแตะบริเวณที่มีอาการ — แตะซ้ำเพื่อเปลี่ยนระดับ แตะครั้งที่ 4 เพื่อลบ
          </p>
          <div className="mt-2 flex justify-center gap-4">
            {(Object.entries(SEV_LABEL) as [Severity, string][]).map(([sev, label]) => (
              <div key={sev} className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full" style={{ background: SEV_COLOR[sev] }} />
                <span className="text-[11px] text-[var(--ink-soft)]">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <BodyDiagram selected={bodyPoints} onToggle={toggleBodyPoint} />
          </div>
        </div>

        {bodyPoints.length > 0 && (
          <SectionCard title="รายการจุดที่เลือก">
            <div className="space-y-2">
              {bodyPoints.map((point) => (
                <div key={point.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg-surface)] p-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ background: SEV_COLOR[point.severity] }} />
                      <span className="text-sm font-medium text-[var(--ink)]">{point.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBodyPoint(point.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-deep)] text-[var(--ink-muted)] text-xs hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {(Object.keys(SEV_COLOR) as Severity[]).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setPointSeverity(point.id, sev)}
                        className={`flex-1 rounded-lg py-1 text-[11px] font-medium transition ${
                          point.severity === sev
                            ? "text-white"
                            : "bg-[var(--bg-deep)] text-[var(--ink-muted)] border border-[var(--line)]"
                        }`}
                        style={point.severity === sev ? { background: SEV_COLOR[sev] } : {}}
                      >
                        {SEV_LABEL[sev]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {bodyPoints.length === 0 && (
          <p className="text-center text-sm text-[var(--ink-muted)]">ยังไม่ได้เลือกจุดใด — แตะบนร่างกายด้านบนเพื่อเลือก</p>
        )}
      </div>
    );
  }

  function renderStep4() {
    return (
      <div className="space-y-3">
        <SectionCard title="ความพึงพอใจโดยรวม">
          <div className="flex items-center gap-3">
            <StarRating value={overallRating} onChange={setOverallRating} />
            <span className="text-sm font-semibold text-[var(--gold)]">{overallRating}/5</span>
          </div>
        </SectionCard>

        <SectionCard title="ความรู้สึกหลังการรับบริการครั้งนี้">
          <EmojiRating value={feelingAfter} onChange={setFeelingAfter} />
        </SectionCard>

        <SectionCard title="อาการลดลงเพิ่มขึ้น">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[var(--ink-muted)]">
              <span>0%</span>
              <span className="font-bold text-[var(--accent)]">{improvement}%</span>
              <span>100%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={improvement}
              onChange={(e) => setImprovement(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
            <div className="relative h-1.5 overflow-hidden rounded-full bg-[var(--bg-deep)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--accent-deep)] to-[var(--accent)] transition-all"
                style={{ width: `${improvement}%` }}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="ข้อเสนอแนะเพิ่มเติม (ถ้ามี)">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="แสดงความคิดเห็น..."
            className="input-dark w-full"
            rows={3}
          />
        </SectionCard>

        <div className="glass-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--ink)]">อนุญาตให้ใช้ข้อมูลเพื่อพัฒนาบริการ</p>
              <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                ข้อมูลของคุณจะถูกเก็บรักษาตามมาตรฐาน PDPA
              </p>
            </div>
            <Toggle checked={consent} onChange={setConsent} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <FormHeader step={step} onBack={handleBack} />

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
          className="btn-primary w-full py-3.5 text-base flex justify-center items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
              กำลังประมวลผลอาการและบันทึก...
            </>
          ) : step < 4 ? (
            "ถัดไป"
          ) : (
            "บันทึก"
          )}
        </button>
        <p className="mt-2 text-center text-[10px] text-[var(--ink-muted)]">
          🔒 ข้อมูลของคุณปลอดภัยตามมาตรฐาน PDPA
        </p>
      </div>
    </div>
  );
}
