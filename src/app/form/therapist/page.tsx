import { TherapistForm } from "./therapist-form";
import { Suspense } from "react";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { redirect } from "next/navigation";

export default async function TherapistFormPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login?next=/form/therapist");
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center text-sm text-[var(--ink-muted)]">
        กำลังโหลดแบบฟอร์ม...
      </div>
    }>
      <TherapistForm />
    </Suspense>
  );
}

