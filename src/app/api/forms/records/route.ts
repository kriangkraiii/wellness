import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const records = await prisma.customerSpaRecord.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        therapistRecord: true,
      },
    });

    return NextResponse.json({ ok: true, records });
  } catch (error) {
    console.error("GET Spa Records API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
