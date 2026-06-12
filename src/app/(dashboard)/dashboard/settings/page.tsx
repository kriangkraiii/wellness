"use client";

import { useEffect, useState } from "react";
import { User, Bell, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/dashboard/language-context";

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formValues, setFormValues] = useState({
    name: "",
    businessType: "Spa",
    location: "",
    description: "",
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== "undefined") {
      const savedNotifs = localStorage.getItem("dashboard_notifications");
      if (savedNotifs) {
        try {
          return JSON.parse(savedNotifs);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      newBooking: true,
      newReview: true,
      aiInsight: true,
      partnerMatch: false,
    };
  });

  useEffect(() => {
    // Load Spa Settings from API
    fetch("/api/dashboard/settings")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.ok && payload.data) {
          setFormValues({
            name: payload.data.name || "",
            businessType: payload.data.businessType === "MASSAGE" ? "Massage" : payload.data.businessType === "WELLNESS_TOURISM" ? "Wellness Tourism" : "Spa",
            location: payload.data.location || "",
            description: payload.data.description || "",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const result = await res.json();
      if (result.ok) {
        setSuccessMessage(t("บันทึกข้อมูลสำเร็จแล้ว!", "Settings saved successfully!"));
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(result.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("dashboard_notifications", JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D6A4F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl text-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{t("ตั้งค่า", "Settings")}</h2>
        <p className="text-sm text-slate-500">{t("Settings — จัดการข้อมูลร้านและการแจ้งเตือน", "Settings — Manage business profile and notifications")}</p>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-[#2D6A4F] px-4 py-3 font-semibold shadow-sm transition-all animate-pulse">
          {successMessage}
        </div>
      )}

      {/* Profile Section */}
      <form onSubmit={handleSaveSettings} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <User className="h-4 w-4 text-[#2D6A4F]" />
          <h3 className="text-sm font-bold text-slate-800">{t("ข้อมูลร้าน", "Spa Information")}</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">{t("ชื่อร้าน", "Spa Name")}</label>
            <input
              type="text"
              required
              value={formValues.name}
              onChange={e => setFormValues({ ...formValues, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#52B788] transition text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">{t("ประเภทธุรกิจ", "Business Type")}</label>
            <select
              value={formValues.businessType}
              onChange={e => setFormValues({ ...formValues, businessType: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#52B788] transition text-slate-800 bg-white"
            >
              <option value="Spa">{t("สปา", "Spa")}</option>
              <option value="Massage">{t("นวดแผนไทย", "Thai Massage")}</option>
              <option value="Wellness Tourism">{t("ท่องเที่ยวเชิงสุขภาพ", "Wellness Tourism")}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">{t("จังหวัด", "Province")}</label>
            <input
              type="text"
              required
              value={formValues.location}
              onChange={e => setFormValues({ ...formValues, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#52B788] transition text-slate-800"
            />
          </div>
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">{t("เบอร์โทร", "Phone Number")}</label>
            <input
              type="tel"
              defaultValue="043-xxx-xxxx"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#52B788] transition text-slate-800"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="block font-bold text-slate-700">{t("คำอธิบายร้าน", "Description")}</label>
            <textarea
              rows={3}
              required
              value={formValues.description}
              onChange={e => setFormValues({ ...formValues, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#52B788] transition resize-none text-slate-800"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] px-6 py-2 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
        >
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          {t("บันทึก", "Save Settings")}
        </button>
      </form>

      {/* Notifications */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="h-4 w-4 text-[#2D6A4F]" />
          <h3 className="text-sm font-bold text-slate-800">{t("การแจ้งเตือน", "Notifications")}</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: "newBooking", label: t("การจองใหม่", "New Booking"), desc: t("แจ้งเตือนเมื่อมีลูกค้าจองบริการ", "Notify when a customer books a service"), checked: notifications.newBooking },
            { key: "newReview", label: t("รีวิวใหม่", "New Reviews"), desc: t("แจ้งเตือนเมื่อมีรีวิวจากลูกค้า", "Notify when a customer leaves a review"), checked: notifications.newReview },
            { key: "aiInsight", label: t("AI Insight", "AI Insight"), desc: t("รับคำแนะนำจาก AI ทุกวัน", "Receive intelligence insights from AI daily"), checked: notifications.aiInsight },
            { key: "partnerMatch", label: t("Partner Match", "Partner Match"), desc: t("แจ้งเตือนเมื่อมี partner ที่เหมาะสม", "Notify when compatible partners are matched"), checked: notifications.partnerMatch },
          ].map(n => (
            <label key={n.key} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-700">{n.label}</p>
                <p className="text-[10px] text-slate-400">{n.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={n.checked}
                onChange={() => handleToggleNotification(n.key as keyof typeof notifications)}
                className="h-4 w-4 rounded border-slate-300 text-[#2D6A4F] focus:ring-[#52B788] cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <Globe className="h-4 w-4 text-[#2D6A4F]" />
          <h3 className="text-sm font-bold text-slate-800">{t("ภาษา / Language", "Language")}</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage("th")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              language === "th"
                ? "border-2 border-[#2D6A4F] bg-emerald-50 text-[#2D6A4F]"
                : "border border-slate-200 text-slate-500 hover:border-[#52B788]"
            }`}
          >
             ไทย
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              language === "en"
                ? "border-2 border-[#2D6A4F] bg-emerald-50 text-[#2D6A4F]"
                : "border border-slate-200 text-slate-500 hover:border-[#52B788]"
            }`}
          >
             English
          </button>
        </div>
      </div>
    </div>
  );
}
