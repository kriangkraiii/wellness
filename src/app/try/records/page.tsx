"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, Search, MessageSquare, Heart, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Severity = "severe" | "moderate" | "treatment";

interface BodyPoint {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface SelectedBodyPoint extends BodyPoint {
  severity: Severity;
}

interface TherapistRecord {
  id: string;
  readinessChecks: string; // JSON string of { label: string, status: string }[]
  beforePainPoints: string; // JSON string of SelectedBodyPoint[]
  afterPainPoints: string; // JSON string of SelectedBodyPoint[]
  techniquesUsed: string[];
  selfCareTips: string[];
  notes?: string | null;
  createdAt: string;
}

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
  bodyPoints: SelectedBodyPoint[] | string; // parsed JSON
  overallRating: number;
  feelingAfter: number;
  improvement: number;
  comment?: string | null;
  aiRecommendation?: string | null;
  createdAt: string;
  therapistRecord?: TherapistRecord | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
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
  { id: "l-hip", label: "สะโพกซ้าย", x: 37, y: 89 },
  { id: "r-hip", label: "สะโพกขวา", x: 63, y: 89 },
  { id: "l-thigh", label: "ต้นขาซ้าย", x: 37, y: 118 },
  { id: "r-thigh", label: "ต้นขาขวา", x: 63, y: 118 },
  { id: "l-knee", label: "เข่าซ้าย", x: 36, y: 149 },
  { id: "r-knee", label: "เข่าขวา", x: 64, y: 149 },
  { id: "l-shin", label: "แข้งซ้าย", x: 34, y: 176 },
  { id: "r-shin", label: "แข้งขวา", x: 65, y: 176 },
];

const BACK_POINTS: BodyPoint[] = [
  { id: "neck-back", label: "คอด้านหลัง", x: 50, y: 25 },
  { id: "l-upper-back", label: "บ่าซ้าย", x: 34, y: 40 },
  { id: "r-upper-back", label: "บ่าขวา", x: 66, y: 40 },
  { id: "mid-back-l", label: "หลังบนซ้าย", x: 38, y: 55 },
  { id: "mid-back-r", label: "หลังบนขวา", x: 62, y: 55 },
  { id: "lower-back-l", label: "หลังล่างซ้าย", x: 38, y: 73 },
  { id: "lower-back-r", label: "หลังล่างขวา", x: 62, y: 73 },
  { id: "l-glute", label: "ก้นซ้าย", x: 38, y: 89 },
  { id: "r-glute", label: "ก้นขวา", x: 62, y: 89 },
  { id: "l-back-thigh", label: "หลังขาซ้าย", x: 37, y: 118 },
  { id: "r-back-thigh", label: "หลังขาขวา", x: 63, y: 118 },
  { id: "l-calf", label: "น่องซ้าย", x: 35, y: 162 },
  { id: "r-calf", label: "น่องขวา", x: 65, y: 162 },
];

const SEV_COLOR: Record<Severity, string> = {
  severe: "#f87171",
  moderate: "#fbbf24",
  treatment: "#34d399",
};

const MASSAGE_TECHNIQUES: Record<string, { label: string; icon: string }> = {
  thai: { label: "นวดไทย", icon: "" },
  oil: { label: "นวดน้ำมัน", icon: "" },
  "hot-compress": { label: "ประคบสมุนไพร", icon: "" },
  acupressure: { label: "กดจุดบำบัด", icon: "" },
  other: { label: "นวดอื่นๆ", icon: "" },
};

function BodySVG() {
  return (
    <>
      <ellipse cx="50" cy="14" rx="11" ry="12" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M46 25 L54 25 L53 33 L47 33 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M30 33 C22 37 19 52 19 82 C19 87 24 89 50 89 C76 89 81 87 81 82 C81 52 78 37 70 33 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M29 35 Q18 41 13 68 L19 70 Q24 47 32 39 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M13 68 L10 83 L16 84 L19 70 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="12" cy="88" rx="5" ry="5" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M71 35 Q82 41 87 68 L81 70 Q76 47 68 39 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M87 68 L90 83 L84 84 L81 70 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="88" cy="88" rx="5" ry="5" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M36 89 C33 112 32 132 32 157 L41 157 C41 132 42 112 46 89 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M54 89 C58 112 58 132 59 157 L68 157 C68 132 67 112 64 89 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M32 157 C30 179 29 197 29 211 L38 211 C38 197 39 179 41 157 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M59 157 C61 179 62 197 62 211 L71 211 C70 197 68 179 68 157 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="34" cy="215" rx="9" ry="4" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="65" cy="215" rx="9" ry="4" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
    </>
  );
}

function BackBodySVG() {
  return (
    <>
      <ellipse cx="50" cy="14" rx="11" ry="12" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M46 25 L54 25 L53 33 L47 33 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M30 33 C22 37 19 52 19 82 C19 87 24 89 50 89 C76 89 81 87 81 82 C81 52 78 37 70 33 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <line x1="50" y1="33" x2="50" y2="85" stroke="rgba(100,116,139,0.3)" strokeWidth="0.8" strokeDasharray="3 2" />
      <path d="M29 35 Q18 41 13 68 L19 70 Q24 47 32 39 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M13 68 L10 83 L16 84 L19 70 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="12" cy="88" rx="5" ry="5" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M71 35 Q82 41 87 68 L81 70 Q76 47 68 39 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M87 68 L90 83 L84 84 L81 70 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="88" cy="88" rx="5" ry="5" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M36 89 C33 112 32 132 32 157 L41 157 C41 132 42 112 46 89 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M54 89 C58 112 58 132 59 157 L68 157 C68 132 67 112 64 89 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M32 157 C30 179 29 197 29 211 L38 211 C38 197 39 179 41 157 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <path d="M59 157 C61 179 62 197 62 211 L71 211 C70 197 68 179 68 157 Z" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="34" cy="215" rx="9" ry="4" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
      <ellipse cx="65" cy="215" rx="9" ry="4" fill="rgba(100,116,139,0.08)" stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
    </>
  );
}

function BodyDiagramDisplay({ selected, useFront }: { selected: SelectedBodyPoint[]; useFront: boolean }) {
  const points = useFront ? BODY_POINTS : BACK_POINTS;
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
      <svg viewBox="0 0 100 240" className="mx-auto w-full max-w-[140px]" style={{ overflow: "visible" }}>
        {useFront ? <BodySVG /> : <BackBodySVG />}
        {selected.map((point) => {
          const isPointInCurrentPerspective = points.some((p) => p.id === point.id);
          if (!isPointInCurrentPerspective) return null;

          const color = SEV_COLOR[point.severity] || "#2D6A4F";
          return (
            <g key={point.id}>
              <circle cx={point.x} cy={point.y} r="7" fill={color} opacity="0.2" />
              <circle cx={point.x} cy={point.y} r="3.5" fill={color} stroke={color} strokeWidth="1" />
              <text
                x={point.x}
                y={point.y - 7}
                fontSize="6"
                textAnchor="middle"
                fill="#334155"
                className="font-bold pointer-events-none drop-shadow-sm select-none"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function TryRecordsPage() {
  const [records, setRecords] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTherapist, setFilterTherapist] = useState<"all" | "pending" | "completed">("all");

  // Selected Record for Detail Drawer
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<"ai" | "therapist">("ai");

  useEffect(() => {
    async function loadRecords() {
      try {
        const res = await fetch("/api/forms/records");
        const data = await res.json();
        if (data.ok) {
          setRecords(data.records);
        } else {
          setError(data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        }
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, []);

  const selectedRecord = records.find((r) => r.id === selectedRecordId);

  const parseBodyPoints = (val: unknown): SelectedBodyPoint[] => {
    if (!val) return [];
    if (typeof val === "string") {
      try {
        return JSON.parse(val) as SelectedBodyPoint[];
      } catch {
        return [];
      }
    }
    if (Array.isArray(val)) {
      return val as SelectedBodyPoint[];
    }
    return [];
  };

  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.conditions.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.nationality && rec.nationality.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTherapist =
      filterTherapist === "all" ||
      (filterTherapist === "pending" && !rec.therapistRecord) ||
      (filterTherapist === "completed" && rec.therapistRecord);

    return matchesSearch && matchesTherapist;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            ระบบบันทึกประวัติการบำบัด & วิเคราะห์อาการ (Spa Records Sandbox)
          </h2>
          <p className="text-sm text-slate-500">
            ดูรายงานประวัติการนวด อาการเจ็บปวด และคำแนะนำดูแลสุขภาพของลูกค้ารวมถึงการตรวจสอบของนักบำบัด
          </p>
        </div>
        <Link
          href="/form/therapist"
          className="rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] px-5 py-2.5 text-xs font-bold flex items-center gap-2 max-w-max self-start sm:self-auto shadow-sm transition"
        >
           แบบฟอร์มบำบัด (Therapist)
        </Link>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="ค้นหาชื่อลูกค้า, โรคประจำตัว, สัญชาติ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#52B788] focus:bg-white transition"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {(["all", "pending", "completed"] as const).map((status) => {
            const labels = { all: "ทั้งหมด", pending: "รอประเมิน Therapist", completed: "เสร็จสิ้น" };
            const active = filterTherapist === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilterTherapist(status)}
                className={`flex-1 md:flex-none text-xs font-semibold px-4 py-2 rounded-xl border transition cursor-pointer ${
                  active
                    ? "border-[#52B788]/40 bg-[#52B788]/10 text-[#2D6A4F]"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {labels[status]}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 flex flex-col items-center justify-center space-y-3">
          <svg className="h-8 w-8 animate-spin text-[#2D6A4F]" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
          <p className="text-xs font-medium text-slate-500">กำลังโหลดประวัติลูกค้า...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-xs text-red-600">
           เกิดข้อผิดพลาด: {error}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-400">
          <span className="text-4xl block mb-2"></span>
          <p className="font-semibold text-slate-700">ไม่พบประวัติลูกค้าในขณะนี้</p>
          <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหา หรือใช้แบบฟอร์มลูกค้านวดหน้าหลักเพื่อเพิ่มข้อมูล</p>
        </div>
      ) : (
        /* Records Table */
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/50">
                <tr>
                  <th className="px-6 py-4">ลูกค้า</th>
                  <th className="px-6 py-4">อายุ/เพศ</th>
                  <th className="px-6 py-4">โรคประจำตัว</th>
                  <th className="px-6 py-4">จำนวนจุดปวด</th>
                  <th className="px-6 py-4">ประเมิน AI</th>
                  <th className="px-6 py-4">สถานะ Therapist</th>
                  <th className="px-6 py-4">วันที่กรอก</th>
                  <th className="px-6 py-4 text-right">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((rec) => {
                  const points = parseBodyPoints(rec.bodyPoints);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-800">{rec.name}</td>
                      <td className="px-6 py-4">
                        {rec.age} ปี / {rec.gender}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {rec.conditions.length > 0 && rec.conditions[0] !== "ไม่มีโรคประจำตัว" ? (
                            rec.conditions.slice(0, 2).map((c, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-medium"
                              >
                                {c}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                          {rec.conditions.length > 2 && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400 font-medium">
                              +{rec.conditions.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {points.length > 0 ? (
                          <span className="font-semibold text-amber-600">{points.length} จุด</span>
                        ) : (
                          <span className="text-emerald-500 font-medium font-bold">ไม่มี</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rec.aiRecommendation ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2D6A4F] bg-[#52B788]/15 rounded-full px-2.5 py-0.5">
                            ✦ มีบทวิเคราะห์
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">ไม่มี</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {rec.therapistRecord ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">
                            ✓ บำบัดแล้ว
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-0.5 animate-pulse">
                             รอประเมิน
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(rec.createdAt).toLocaleDateString("th-TH")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecordId(rec.id);
                            setDrawerTab("ai");
                          }}
                          className="text-xs font-bold text-[#2D6A4F] hover:underline bg-[#52B788]/10 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          เปิดดู ➜
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Side Drawer overlay */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-all duration-300">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col overflow-hidden relative animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <header className="border-b border-slate-150 bg-slate-50 px-6 py-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-slate-800">
                    ข้อมูลเชิงลึก: {selectedRecord.name}
                  </h3>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                    ID: {selectedRecord.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  ลงทะเบียนเมื่อ: {new Date(selectedRecord.createdAt).toLocaleString("th-TH")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecordId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition shadow-sm font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </header>

            {/* Tab navigation inside drawer */}
            <div className="border-b border-slate-100 px-6 bg-slate-50/50 flex gap-4">
              <button
                type="button"
                onClick={() => setDrawerTab("ai")}
                className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  drawerTab === "ai"
                    ? "border-[#2D6A4F] text-[#2D6A4F]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                ✦ ประวัติลูกค้า & บทวิเคราะห์ AI
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("therapist")}
                className={`py-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  drawerTab === "therapist"
                    ? "border-[#2D6A4F] text-[#2D6A4F]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                 ผลการบำบัดของ Therapist
                {!selectedRecord.therapistRecord && (
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerTab === "ai" ? (
                /* TAB 1: AI & Customer Survey */
                <div className="space-y-6">
                  {/* Grid for profile & pain map */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer demographics profile details */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ข้อมูลลูกค้า
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block">เพศ:</span>
                          <span className="text-slate-700 font-semibold">{selectedRecord.gender}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">อายุ:</span>
                          <span className="text-slate-700 font-semibold">{selectedRecord.age} ปี</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">สัญชาติ:</span>
                          <span className="text-slate-700 font-semibold">{selectedRecord.nationality}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">ระดับพึงพอใจสปา:</span>
                          <span className="text-amber-500 font-bold">★ {selectedRecord.overallRating}/5</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        <div>
                          <h5 className="text-xs font-semibold text-slate-500">ประวัติการแพทย์ / ความเสี่ยง</h5>
                          <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {selectedRecord.conditions.map((c, i) => (
                              <span
                                key={i}
                                className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold border ${
                                  c === "ไม่มีโรคประจำตัว"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-red-50 border-red-100 text-red-700"
                                  }`}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        {selectedRecord.surgeryStatus === "yes" && (
                          <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 text-xs">
                            <span className="font-semibold text-amber-800 block"> ประวัติผ่าตัด/อุปกรณ์โลหะ:</span>
                            <p className="text-slate-600 mt-0.5">{selectedRecord.surgeryDetail || "ไม่ได้ระบุรายละเอียด"}</p>
                          </div>
                        )}

                        {selectedRecord.medStatus === "yes" && (
                          <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 text-xs">
                            <span className="font-semibold text-amber-800 block"> ยาที่รับประทานเป็นประจำ:</span>
                            <p className="text-slate-600 mt-0.5">{selectedRecord.medDetail || "ไม่ได้ระบุรายละเอียด"}</p>
                          </div>
                        )}

                        {selectedRecord.cautions && (
                          <div className="bg-red-50/40 border border-red-100/30 rounded-xl p-3 text-xs">
                            <span className="font-semibold text-red-800 block"> ข้อควรระวังพิเศษ (ลูกค้าแจ้ง):</span>
                            <p className="text-slate-600 mt-0.5">{selectedRecord.cautions}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer reported pain points diagram */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        แผนผังอาการเจ็บปวด (ก่อนนวด)
                      </h4>
                      <BodyDiagramDisplay selected={parseBodyPoints(selectedRecord.bodyPoints)} useFront={true} />
                      <p className="text-[10px] text-slate-400 text-center">
                        * ลูกค้าแจ้งอาการด้านหน้า มีจุดปวดทั้งหมด {parseBodyPoints(selectedRecord.bodyPoints).length} จุด
                      </p>
                    </div>
                  </div>

                  {/* AI Wellness recommendation card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-[#2D6A4F]" />
                      <h4 className="font-heading text-sm font-bold text-[#2D6A4F]">
                        บทวิเคราะห์และคำแนะนำการบำบัดด้วย AI
                      </h4>
                    </div>
                    {selectedRecord.aiRecommendation ? (
                      <div className="text-xs leading-relaxed text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100/50 max-h-[350px] overflow-y-auto">
                        {selectedRecord.aiRecommendation}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">ไม่มีข้อมูลการวิเคราะห์ AI คาดว่าเกิดความผิดพลาดในการประมวลผล</p>
                    )}
                  </div>

                  {/* Customer feedback card */}
                  {selectedRecord.comment && (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs">
                      <span className="font-semibold text-slate-500 block"> ข้อคิดเห็นเพิ่มเติมจากลูกค้า:</span>
                      <p className="text-slate-600 mt-1 italic">&ldquo;{selectedRecord.comment}&rdquo;</p>
                    </div>
                  )}
                </div>
              ) : (
                /* TAB 2: Therapist records */
                <div className="space-y-6">
                  {selectedRecord.therapistRecord ? (
                    (() => {
                      const thRec = selectedRecord.therapistRecord;
                      const beforePoints = parseBodyPoints(thRec.beforePainPoints);
                      const afterPoints = parseBodyPoints(thRec.afterPainPoints);

                      // Parse readiness checks
                      let readinessList: { label: string; status: string }[] = [];
                      if (thRec.readinessChecks) {
                        try {
                          readinessList = typeof thRec.readinessChecks === "string"
                            ? JSON.parse(thRec.readinessChecks)
                            : thRec.readinessChecks;
                        } catch (e) {
                          console.error("Failed to parse readiness checks:", e);
                        }
                      }

                      return (
                        <div className="space-y-6">
                          {/* Readiness checks summary card */}
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              ความพร้อมในการรับบริการ (Therapist เช็คลิสต์)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {readinessList.map((item, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-1">
                                  <span className="text-slate-500">{item.label}</span>
                                  <span
                                    className={`font-semibold px-2 py-0.5 rounded-lg ${
                                      item.status === "yes"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : item.status === "no"
                                        ? "bg-red-50 text-red-600"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {item.status === "yes" ? "ผ่าน" : item.status === "no" ? "ไม่ผ่าน" : "N/A"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Before & After Pain Map Comparisons */}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 text-center">
                                อาการก่อนนวด (Therapist บันทึก)
                              </h4>
                              <BodyDiagramDisplay selected={beforePoints} useFront={true} />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-slate-500 text-center">
                                อาการหลังนวด (Therapist ประเมิน)
                              </h4>
                              <BodyDiagramDisplay selected={afterPoints} useFront={true} />
                            </div>
                          </div>

                          {/* Treatment Details Card */}
                          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                เทคนิคการนวดบำบัดที่ใช้
                              </h4>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {thRec.techniquesUsed && thRec.techniquesUsed.length > 0 ? (
                                  thRec.techniquesUsed.map((tech) => {
                                    const details = MASSAGE_TECHNIQUES[tech] || { label: tech, icon: "" };
                                    return (
                                      <span
                                        key={tech}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-150 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 font-semibold"
                                      >
                                        <span>{details.icon}</span>
                                        {details.label}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-slate-400 text-xs italic">ไม่ได้บันทึกเทคนิค</span>
                                )}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-150">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                คำแนะนำการปฏิบัติตัว (ที่มอบให้ลูกค้า)
                              </h4>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-700">
                                {thRec.selfCareTips && thRec.selfCareTips.length > 0 ? (
                                  thRec.selfCareTips.map((tip, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                                      <span className="text-emerald-500">✓</span>
                                      <span className="font-medium">{tip}</span>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-slate-400 italic">ไม่มีข้อมูล</span>
                                )}
                              </div>
                            </div>

                            {thRec.notes && (
                              <div className="pt-3 border-t border-slate-150">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                  หมายเหตุและแผนงานถัดไปของ Therapist
                                </h4>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                                  {thRec.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    /* Call To Action if therapist record does not exist */
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 text-center space-y-4">
                      <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto" />
                      <h4 className="font-heading text-base font-bold text-amber-800">
                        ยังไม่มีประวัติการบำบัดของ Therapist
                      </h4>
                      <p className="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
                        ลูกค้าท่านนี้กรอกฟอร์มประวัติส่วนตัวและแบบวิเคราะห์ AI เรียบร้อยแล้ว
                        แต่ยังไม่มีการบันทึกขั้นตอนตรวจประเมินทางกายภาพก่อน/หลัง และแผนประคบหรือจุดเน้นจากฝั่งนักนวด
                      </p>
                      <Link
                        href={`/form/therapist?recordId=${selectedRecord.id}`}
                        className="rounded-full bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 text-xs font-bold inline-block shadow-sm transition"
                      >
                         กรอกประเมินการบำบัด
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
