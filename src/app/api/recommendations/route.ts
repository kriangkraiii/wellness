import { NextResponse } from "next/server";
import { z } from "zod";
import { runRecommendation } from "@/modules/recommendation/engine";

const requestSchema = z.object({
  merchantSlug: z.string().min(1),
  objective: z.string().min(3),
  budgetLevel: z.enum(["low", "medium", "high"]),
  targetAudience: z.enum(["local", "thai-traveler", "international"]),
  customName: z.string().optional(),
  customBusinessType: z.enum(["MASSAGE", "SPA", "WELLNESS_TOURISM"]).optional(),
  customLocation: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = requestSchema.parse(payload);
    const result = await runRecommendation(input);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Invalid input", issues: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
