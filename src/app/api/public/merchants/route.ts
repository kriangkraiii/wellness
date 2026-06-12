import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      where: {
        NOT: {
          slug: "guest-custom-store",
        },
      },
      select: {
        slug: true,
        name: true,
        businessType: true,
        location: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        merchants,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
