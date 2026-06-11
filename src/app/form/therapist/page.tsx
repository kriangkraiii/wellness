import { TherapistForm } from "./therapist-form";
import { Suspense } from "react";

export default function TherapistFormPage() {
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
