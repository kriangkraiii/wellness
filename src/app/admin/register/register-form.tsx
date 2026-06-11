"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type RegisterResponse = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

export function AdminRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json()) as RegisterResponse;
      if (!response.ok || !payload.ok) {
        setError(payload.message || "ลงทะเบียนไม่สำเร็จ");
        return;
      }

      window.location.href = payload.redirectTo || "/admin";
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      autoComplete="off"
      className="glass-card p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.6)] fade-rise fade-rise-delay-1"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Member Register</p>
      <h1 className="mt-2 font-heading text-3xl text-[var(--ink)]">ลงทะเบียนสมาชิก</h1>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-[var(--ink-soft)]">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-dark mt-2"
            autoComplete="off"
            minLength={2}
            required
          />
        </label>

        <label className="block text-sm font-medium text-[var(--ink-soft)]">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-dark mt-2"
            autoComplete="off"
            required
          />
        </label>

        <label className="block text-sm font-medium text-[var(--ink-soft)]">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-dark mt-2"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        <label className="block text-sm font-medium text-[var(--ink-soft)]">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input-dark mt-2"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="btn-primary mt-6 w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
            </svg>
            กำลังลงทะเบียน...
          </span>
        ) : "ลงทะเบียน"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-sm text-[var(--ink-soft)]">
        มีบัญชีแล้ว?{" "}
        <Link href="/admin/login" className="font-semibold text-[var(--accent)] hover:underline">
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
