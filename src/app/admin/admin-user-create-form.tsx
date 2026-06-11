"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type CreateResponse = {
  ok: boolean;
  message?: string;
};

export function AdminUserCreateForm({
  canCreateAdmin,
}: {
  canCreateAdmin: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const payload = (await response.json()) as CreateResponse;
      if (!response.ok || !payload.ok) {
        setMessage(payload.message || "ไม่สามารถสร้างผู้ใช้ได้");
        setIsSuccess(false);
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setMessage("สร้างผู้ใช้สำเร็จ");
      setIsSuccess(true);
      router.refresh();
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Unknown error");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass-card p-5">
      <h3 className="font-heading text-2xl text-[var(--ink)]">สร้างผู้ใช้ระบบ</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-[var(--ink-soft)] sm:col-span-2">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-dark mt-2"
            required
          />
        </label>

        <label className="text-sm font-medium text-[var(--ink-soft)]">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-dark mt-2"
            required
          />
        </label>

        <label className="text-sm font-medium text-[var(--ink-soft)]">
          Password
          <input
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-dark mt-2"
            required
          />
        </label>

        <label className="text-sm font-medium text-[var(--ink-soft)] sm:col-span-2">
          Role
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "ADMIN" | "USER")}
            className="input-dark mt-2"
          >
            <option value="USER">USER</option>
            {canCreateAdmin && <option value="ADMIN">ADMIN</option>}
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="btn-primary mt-5"
        disabled={loading}
      >
        {loading ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
      </button>

      {message && (
        <p className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
          isSuccess
            ? "border-[var(--accent)]/30 bg-[var(--accent-subtle)] text-[var(--accent)]"
            : "border-[var(--danger)]/30 bg-[var(--danger-bg)] text-[var(--danger)]"
        }`}>
          {message}
        </p>
      )}
    </form>
  );
}
