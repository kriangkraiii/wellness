"use client";

import { useEffect, useState } from "react";
import { Search, Star, Loader2, Edit, Trash2, X, Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/components/dashboard/language-context";

interface CustomerData {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  visits: number;
  lastVisit: string;
  satisfaction: number;
  segment: string;
  spending: number;
  comment: string | null;
}

interface SegmentData {
  name: string;
  value: number;
  color: string;
}

interface CustomersPayload {
  customers: CustomerData[];
  segments: SegmentData[];
  stats: {
    satisfactionScore: number;
    returnRate: number;
    avgSpending: number;
  };
}

export default function CustomersPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<CustomersPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    age: "30",
    gender: "ชาย",
    nationality: "ไทย",
    satisfaction: "5",
    comment: "",
    segment: "Office Worker",
    visits: "1",
    spending: "500",
  });

  const fetchData = () => {
    setLoading(true);
    fetch("/api/dashboard/customers")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setData(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/dashboard/customers")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setData(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenAdd = () => {
    setSelectedCustomer(null);
    setFormValues({
      name: "",
      age: "30",
      gender: "ชาย",
      nationality: "ไทย",
      satisfaction: "5",
      comment: "",
      segment: "Office Worker",
      visits: "1",
      spending: "500",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CustomerData) => {
    setSelectedCustomer(c);
    setFormValues({
      name: c.name,
      age: c.age?.toString() || "30",
      gender: c.gender || "ชาย",
      nationality: c.nationality || "ไทย",
      satisfaction: c.satisfaction?.toString() || "5",
      comment: c.comment || "",
      segment: c.segment || "Office Worker",
      visits: c.visits?.toString() || "1",
      spending: c.spending?.toString() || "500",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = "/api/dashboard/customers";
      const method = selectedCustomer ? "PUT" : "POST";
      const payload = selectedCustomer
        ? { id: selectedCustomer.id, ...formValues }
        : formValues;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/customers?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.ok) {
        setIsDeletingId(null);
        fetchData();
      } else {
        alert(result.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  const { customers = [], segments = [], stats = { satisfactionScore: 86, returnRate: 68, avgSpending: 1850 } } = data || {};

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.segment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("ลูกค้า", "Customers")}</h2>
          <p className="text-sm text-slate-500">{t("ระบบวิเคราะห์และจัดการลูกค้า", "Customer Analytics & Management")}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Satisfaction Score Gauge */}
        <div className="col-span-2 flex items-center gap-5 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 lg:col-span-1">
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#2D6A4F" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${stats.satisfactionScore * 2.64} ${100 * 2.64}`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-slate-800">{stats.satisfactionScore}</span>
              <span className="text-[8px] text-slate-400">/100</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{t("คะแนนความพึงพอใจ", "Satisfaction Score")}</p>
            <p className="text-[10px] text-slate-400">Satisfaction Score</p>
          </div>
        </div>

        {/* Segment Donut */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-800 mb-2">{t("กลุ่มลูกค้า", "Customer Segments")}</p>
          <div className="h-[100px]">
            {segments.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={segments} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {segments.map(e => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">No segment data</div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-800">{t("ลูกค้ากลับมาใช้บริการ", "Customer Return Rate")}</p>
          <p className="text-2xl font-bold text-[#2D6A4F] mt-1">{stats.returnRate}%</p>
          <p className="text-[10px] text-emerald-500 font-medium">{t("+8.3% จากเดือนก่อน", "+8.3% MoM")}</p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-800">{t("รายจ่ายเฉลี่ย/คน", "Avg. Spending/Pax")}</p>
          <p className="text-2xl font-bold text-[#2D6A4F] mt-1">฿{stats.avgSpending.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-500 font-medium">{t("+12% จากเดือนก่อน", "+12% MoM")}</p>
        </div>
      </div>

      {/* Customer List */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">{t("รายชื่อลูกค้า", "Customer List")}</h3>
            <button
              onClick={handleOpenAdd}
              className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-102 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("เพิ่มลูกค้า", "Add Customer")}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t("ค้นหาลูกค้า...", "Search customers...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-600 outline-none focus:border-[#52B788] focus:bg-white transition w-full sm:w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#2D6A4F]" />
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-400">
                  <th className="pb-2 font-medium">{t("ชื่อ", "Name")}</th>
                  <th className="pb-2 font-medium">{t("กลุ่ม", "Segment")}</th>
                  <th className="pb-2 font-medium">{t("จำนวนครั้ง", "Visits")}</th>
                  <th className="pb-2 font-medium">{t("ยอดรวม", "Total Spending")}</th>
                  <th className="pb-2 font-medium">{t("ความพึงพอใจ", "Satisfaction")}</th>
                  <th className="pb-2 font-medium">{t("เข้าล่าสุด", "Last Visit")}</th>
                  <th className="pb-2 font-medium text-right">{t("จัดการ", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-[#2D6A4F] flex items-center justify-center text-[10px] text-white font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400 block">{c.gender} · {c.age} ปี · {c.nationality}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-[#2D6A4F]">{c.segment}</span></td>
                    <td className="text-slate-600">{c.visits} {t("ครั้ง", "times")}</td>
                    <td className="font-medium text-slate-700">฿{c.spending.toLocaleString()}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#D4A843] text-[#D4A843]" />
                        <span className="font-medium text-slate-700">{c.satisfaction}</span>
                      </div>
                    </td>
                    <td className="text-slate-400">{c.lastVisit}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:border-emerald-200 text-slate-500 hover:text-emerald-700 transition cursor-pointer"
                          title={t("แก้ไข", "Edit")}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setIsDeletingId(c.id)}
                          className="p-1.5 rounded-lg border border-slate-100 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition cursor-pointer"
                          title={t("ลบ", "Delete")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedCustomer ? t("แก้ไขข้อมูลลูกค้า", "Edit Customer Details") : t("เพิ่มลูกค้าใหม่", "Add New Customer")}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">{t("ชื่อ-นามสกุล", "Full Name")}</label>
                  <input
                    type="text"
                    required
                    value={formValues.name}
                    onChange={e => setFormValues({ ...formValues, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                    placeholder="เช่น สมชาย สบายดี"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("อายุ (ปี)", "Age (Years)")}</label>
                  <input
                    type="number"
                    required
                    value={formValues.age}
                    onChange={e => setFormValues({ ...formValues, age: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("เพศ", "Gender")}</label>
                  <select
                    value={formValues.gender}
                    onChange={e => setFormValues({ ...formValues, gender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
                  >
                    <option value="ชาย">{t("ชาย", "Male")}</option>
                    <option value="หญิง">{t("หญิง", "Female")}</option>
                    <option value="ทางเลือก">{t("ทางเลือก", "Other")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("สัญชาติ", "Nationality")}</label>
                  <input
                    type="text"
                    value={formValues.nationality}
                    onChange={e => setFormValues({ ...formValues, nationality: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("กลุ่มผู้ใช้บริการ", "Customer Segment")}</label>
                  <select
                    value={formValues.segment}
                    onChange={e => setFormValues({ ...formValues, segment: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
                  >
                    <option value="Office Worker">Office Worker</option>
                    <option value="Tourist">Tourist</option>
                    <option value="Senior">Senior</option>
                    <option value="Athlete">Athlete</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("จำนวนครั้งที่ใช้บริการ", "Number of Visits")}</label>
                  <input
                    type="number"
                    min="1"
                    value={formValues.visits}
                    onChange={e => setFormValues({ ...formValues, visits: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("ยอดรวมค่าบริการ (บาท)", "Total Spending (THB)")}</label>
                  <input
                    type="number"
                    min="0"
                    value={formValues.spending}
                    onChange={e => setFormValues({ ...formValues, spending: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="font-bold text-slate-700">{t("ความพึงพอใจ", "Satisfaction Rating")}</label>
                  <select
                    value={formValues.satisfaction}
                    onChange={e => setFormValues({ ...formValues, satisfaction: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">{t("ความเห็นเพิ่มเติม", "Additional Comment")}</label>
                  <textarea
                    value={formValues.comment}
                    onChange={e => setFormValues({ ...formValues, comment: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 h-20 resize-none"
                    placeholder={t("คำวิจารณ์การใช้บริการ...", "Customer feedback...")}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                >
                  {t("ยกเลิก", "Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#2D6A4F] px-4 py-2 hover:bg-[#1B4332] text-white font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  {t("บันทึก", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 border border-slate-100 text-xs">
            <h4 className="font-bold text-slate-800 text-sm mb-2">{t("ยืนยันการลบ", "Confirm Deletion")}</h4>
            <p className="text-slate-500 mb-5">{t("คุณแน่ใจว่าต้องการลบข้อมูลลูกค้ารายนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", "Are you sure you want to delete this customer? This action cannot be undone.")}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeletingId(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              >
                {t("ยกเลิก", "Cancel")}
              </button>
              <button
                onClick={() => handleDelete(isDeletingId)}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-white font-semibold transition cursor-pointer"
              >
                {t("ลบออก", "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
