"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type LoginResponse = {
  ok: boolean;
  message?: string;
  redirectTo?: string;
};

export function AdminLoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          redirectTo: searchParams.get("next") || undefined,
        }),
      });

      const payload = (await response.json()) as LoginResponse;
      if (!response.ok || !payload.ok) {
        setError(payload.message || "เข้าสู่ระบบไม่สำเร็จ");
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
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">✦ Member Login</p>
      <h1 className="mt-2 font-heading text-3xl text-[var(--ink)]">เข้าสู่ระบบผู้ใช้งาน</h1>

      <div className="mt-6 space-y-4">
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
            กำลังเข้าสู่ระบบ...
          </span>
        ) : "เข้าสู่ระบบ"}
      </button>

      {error && (
        <p className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-bg)] px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-sm text-[var(--ink-soft)]">
        ยังไม่มีบัญชี?{" "}
        <Link href="/admin/register" className="font-semibold text-[var(--accent)] hover:underline">
          ลงทะเบียน
        </Link>
      </p>
    </form>
  );
}
