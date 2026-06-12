import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSpaMedicalAdvice } from "@/modules/ai/medical-advice";
import { z } from "zod";

const customerFormSchema = z.object({
  merchantId: z.string().optional().nullable(),
  name: z.string().min(1).default("คุณลูกค้า"),
  age: z.number().int().min(1).max(120),
  gender: z.string(),
  nationality: z.string(),
  conditions: z.array(z.string()),
  surgeryStatus: z.string(),
  surgeryDetail: z.string().optional(),
  medStatus: z.string(),
  medDetail: z.string().optional(),
  cautions: z.string().optional(),
  bodyPoints: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      x: z.number(),
      y: z.number(),
      severity: z.string(),
    })
  ),
  overallRating: z.number().int().min(1).max(5),
  feelingAfter: z.number().int().min(1).max(5),
  improvement: z.number().int().min(0).max(100),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = customerFormSchema.parse(payload);

    // Get primary merchant to link
    const merchant = await prisma.merchant.findFirst();

    // Run AI Evaluation
    const aiRecommendation = await generateSpaMedicalAdvice({
      name: input.name,
      age: input.age,
      gender: input.gender,
      nationality: input.nationality,
      conditions: input.conditions,
      surgeryStatus: input.surgeryStatus,
      surgeryDetail: input.surgeryDetail,
      medStatus: input.medStatus,
      medDetail: input.medDetail,
      cautions: input.cautions,
      bodyPoints: input.bodyPoints,
    });

    // Save Customer Spa Record
    const record = await prisma.customerSpaRecord.create({
      data: {
        merchantId: input.merchantId || merchant?.id || null,
        name: input.name,
        age: input.age,
        gender: input.gender,
        nationality: input.nationality,
        conditions: input.conditions,
        surgeryStatus: input.surgeryStatus,
        surgeryDetail: input.surgeryDetail || null,
        medStatus: input.medStatus,
        medDetail: input.medDetail || null,
        cautions: input.cautions || null,
        bodyPoints: JSON.stringify(input.bodyPoints), // Store SelectedBodyPoint[]
        overallRating: input.overallRating,
        feelingAfter: input.feelingAfter,
        improvement: input.improvement,
        comment: input.comment || null,
        aiRecommendation,
      },
    });

    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    console.error("Customer Spa Form API Error:", error);
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
