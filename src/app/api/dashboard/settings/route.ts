import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BusinessType } from "@prisma/client";

export async function GET() {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { slug: "sabaidee-spa-khonkaen" },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, message: "Merchant not found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: {
        name: merchant.name,
        businessType: merchant.businessType,
        location: merchant.location,
        description: merchant.description || "",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name, businessType, location, description } = body;

    let bType: BusinessType = BusinessType.SPA;
    if (businessType === "Massage" || businessType === "MASSAGE") {
      bType = BusinessType.MASSAGE;
    } else if (businessType === "Wellness Tourism" || businessType === "WELLNESS_TOURISM") {
      bType = BusinessType.WELLNESS_TOURISM;
    }

    const updated = await prisma.merchant.update({
      where: { slug: "sabaidee-spa-khonkaen" },
      data: {
        name,
        businessType: bType,
        location,
        description,
      },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
