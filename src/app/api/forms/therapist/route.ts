import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const therapistFormSchema = z.object({
  customerRecordId: z.string().min(1),
  readinessChecks: z.array(
    z.object({
      label: z.string(),
      status: z.enum(["yes", "no", "na"]),
    })
  ),
  beforePainPoints: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
      severity: z.string(),
    })
  ),
  afterPainPoints: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
      severity: z.string(),
    })
  ),
  techniquesUsed: z.array(z.string()),
  selfCareTips: z.array(z.string()),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = therapistFormSchema.parse(payload);

    // Save Therapist Spa Record
    const record = await prisma.therapistSpaRecord.create({
      data: {
        customerRecordId: input.customerRecordId,
        readinessChecks: JSON.stringify(input.readinessChecks),
        beforePainPoints: JSON.stringify(input.beforePainPoints),
        afterPainPoints: JSON.stringify(input.afterPainPoints),
        techniquesUsed: input.techniquesUsed,
        selfCareTips: input.selfCareTips,
        notes: input.notes || null,
      },
    });

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    console.error("Therapist Spa Form API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "ข้อมูลฟอร์มไม่ถูกต้อง", issues: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
