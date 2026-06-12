"use client";

import { useEffect, useState } from "react";
import { Handshake, MapPin, Building2, Plane, Briefcase, Heart, Search, Loader2, Edit, Trash2, X, Plus } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

const iconMap = {
  "Hotels": Building2,
  "Hospitals": Heart,
  "Tour Companies": Plane,
  "Investors": Briefcase,
};

interface PartnerData {
  id: string;
  name: string;
  type: keyof typeof iconMap;
  location: string;
  score: number;
  desc: string;
  channel: string;
}

export default function PartnersPage() {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ค้นหา");
  const [activeType, setActiveType] = useState("ทั้งหมด");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<PartnerData | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({
    name: "",
    type: "Tour Companies",
    location: "ขอนแก่น",
    score: "80",
    desc: "",
    channel: "Co-branding",
  });

  const partnerTypes = ["ทั้งหมด", "Hotels", "Hospitals", "Tour Companies", "Investors"];
  const tabs = ["ค้นหา", "จับคู่แล้ว", "รอตอบรับ"];

  const fetchData = () => {
    setLoading(true);
    fetch("/api/dashboard/partners")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setPartners(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/dashboard/partners")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok) {
          setPartners(payload.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenAdd = () => {
    setSelectedPartner(null);
    setFormValues({
      name: "",
      type: "Tour Companies",
      location: "ขอนแก่น",
      score: "80",
      desc: "",
      channel: "Co-branding",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PartnerData) => {
    setSelectedPartner(p);
    setFormValues({
      name: p.name,
      type: p.type,
      location: p.location,
      score: p.score?.toString() || "80",
      desc: p.desc,
      channel: p.channel,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = "/api/dashboard/partners";
      const method = selectedPartner ? "PUT" : "POST";
      const payload = selectedPartner
        ? { id: selectedPartner.id, ...formValues }
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
        alert(result.message || "Failed to save partner");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/partners?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.ok) {
        setIsDeletingId(null);
        fetchData();
      } else {
        alert(result.message || "Failed to delete partner");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && partners.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  const filtered = partners.filter(p =>
    (activeType === "ทั้งหมด" || p.type === activeType) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t("พาร์ทเนอร์ & ตรวจหา", "Partners & Matching")}</h2>
          <p className="text-sm text-slate-500">{t("ค้นหาพันธมิตรทางธุรกิจที่เหมาะสมและสอดคล้องกับร้าน", "Partner Matching — Find compatible business partners")}</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-102 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          {t("เพิ่มพาร์ทเนอร์", "Add Partner")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === tab ? "bg-white text-[#2D6A4F] shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "ค้นหา" ? t("ค้นหา", "Find Partners") : tab === "จับคู่แล้ว" ? t("จับคู่แล้ว", "Matched") : t("รอตอบรับ", "Pending")}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("ค้นหาพาร์ทเนอร์...", "Search partners...")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#52B788] transition"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {partnerTypes.map(tType => (
            <button
              key={tType}
              onClick={() => setActiveType(tType)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                activeType === tType ? "bg-[#2D6A4F] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tType === "ทั้งหมด" ? t("ทั้งหมด", "All") : tType}
            </button>
          ))}
        </div>
      </div>

      {/* Partner Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(partner => {
            const Icon = iconMap[partner.type] || Building2;
            return (
              <div key={partner.id} className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:border-[#52B788]/30 hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 shrink-0">
                      <Icon className="h-5 w-5 text-[#2D6A4F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{partner.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{partner.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
                        <Handshake className="h-3 w-3 text-[#2D6A4F]" />
                        <span className="text-xs font-bold text-[#2D6A4F]">{partner.score}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5">Match Score</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-3 min-h-[48px]">{partner.desc}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 font-medium">{partner.type}</span>
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] text-slate-500 font-medium">{partner.channel}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <button className="flex-1 rounded-lg bg-[#2D6A4F] py-2 text-xs font-semibold text-white hover:bg-[#1B4332] transition">
                    {t("ติดต่อ", "Contact")}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(partner)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-[#2D6A4F] transition cursor-pointer"
                    title={t("แก้ไข", "Edit")}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setIsDeletingId(partner.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600 transition cursor-pointer"
                    title={t("ลบ", "Delete")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">
                {selectedPartner ? t("แก้ไขข้อมูลพันธมิตร", "Edit Partner Profile") : t("เพิ่มพันธมิตรใหม่", "Add New Business Partner")}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t("ชื่อพาร์ทเนอร์/หน่วยงาน", "Partner Name")}</label>
                <input
                  type="text"
                  required
                  value={formValues.name}
                  onChange={e => setFormValues({ ...formValues, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  placeholder="เช่น โรงแรมขอนแก่นแกรนด์"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("ประเภทธุรกิจ", "Business Type")}</label>
                  <select
                    value={formValues.type}
                    onChange={e => setFormValues({ ...formValues, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
                  >
                    <option value="Hotels">{t("โรงแรมและที่พัก", "Hotels")}</option>
                    <option value="Hospitals">{t("โรงพยาบาล/สถาบันสุขภาพ", "Hospitals")}</option>
                    <option value="Tour Companies">{t("บริษัทท่องเที่ยว/ไกด์", "Tour Companies")}</option>
                    <option value="Investors">{t("ผู้ร่วมทุน/การตลาด", "Investors")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("ช่องทางความร่วมมือ", "Partnership Channel")}</label>
                  <input
                    type="text"
                    required
                    value={formValues.channel}
                    onChange={e => setFormValues({ ...formValues, channel: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                    placeholder="เช่น Co-branding, Affiliate"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("พื้นที่บริการ", "Coverage Area")}</label>
                  <input
                    type="text"
                    required
                    value={formValues.location}
                    onChange={e => setFormValues({ ...formValues, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                    placeholder="เช่น ขอนแก่น, ภาคอีสาน"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{t("คะแนนความเหมาะสม (%)", "Compatibility Score (%)")}</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formValues.score}
                    onChange={e => setFormValues({ ...formValues, score: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">{t("สรุปรายละเอียด/ความร่วมมือ", "Partnership Summary")}</label>
                <textarea
                  required
                  value={formValues.desc}
                  onChange={e => setFormValues({ ...formValues, desc: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#52B788] transition text-slate-800 h-24 resize-none"
                  placeholder={t("อธิบายข้อตกลงและแผนธุรกิจสั้นๆ...", "Brief summary of agreements...")}
                />
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
            <p className="text-slate-500 mb-5">{t("คุณแน่ใจว่าต้องการลบพันธมิตรรายนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้", "Are you sure you want to delete this partner? This action cannot be undone.")}</p>
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
