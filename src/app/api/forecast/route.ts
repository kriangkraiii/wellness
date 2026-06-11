import { NextResponse } from "next/server";
import { z } from "zod";
import { runForecast } from "@/modules/forecast/service";

const querySchema = z.object({
  merchantSlug: z.string().min(1),
  horizonDays: z.coerce.number().int().min(7).max(90).default(14),
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const merchantSlug = url.searchParams.get("merchantSlug") || "";
    const horizonDays = url.searchParams.get("horizonDays") || "14";

    const params = querySchema.parse({ merchantSlug, horizonDays });
    const result = await runForecast(params.merchantSlug, params.horizonDays);

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Invalid query", issues: error.issues },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
