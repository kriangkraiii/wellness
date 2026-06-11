"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserMenuProps {
  initialSession: {
    email: string;
    role: string;
  } | null;
}

export function UserMenu({ initialSession }: UserMenuProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.refresh();
      // Wait a bit for server refresh, then go home
      setTimeout(() => {
        window.location.href = "/";
      }, 150);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  }

  if (initialSession) {
    return (
      <div className="flex items-center gap-3 text-white">
        <span className="font-medium flex items-center gap-1">
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {initialSession.role}
          </span>
          <span className="hidden sm:inline opacity-90 max-w-[150px] truncate">
            {initialSession.email}
          </span>
        </span>
        <span className="text-white/40">|</span>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="hover:underline cursor-pointer font-semibold text-white/90 hover:text-white bg-transparent border-none p-0 flex items-center gap-1 transition disabled:opacity-50"
        >
          {loading ? "กำลังออก..." : "ออกจากระบบ"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <Link
        href="/admin/register"
        className="hover:underline transition duration-150 text-white/90 hover:text-white"
      >
        ลงทะเบียน
      </Link>
      <span className="text-white/40">|</span>
      <Link
        href="/admin/login"
        className="hover:underline transition duration-150 text-white/90 hover:text-white font-semibold"
      >
        เข้าสู่ระบบ
      </Link>
    </div>
  );
}
