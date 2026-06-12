import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PartnerType } from "@prisma/client";

const SAMPLE_PARTNERS = [
  { name: "Pullman Khon Kaen Raja Orchid", type: PartnerType.TRAVEL, channel: "Co-branding", summary: "โรงแรมหรูระดับ 5 ดาวในเมืองขอนแก่น ร่วมมือทำแพ็คเกจพักผ่อนคู่สปาเพื่อดึงดูดลูกค้าเกรดพรีเมียม", coverageArea: "ขอนแก่น", score: 95 },
  { name: "โรงพยาบาลกรุงเทพ ขอนแก่น", type: PartnerType.SUPPLIER, channel: "Referral Program", summary: "สถาบันการแพทย์ชั้นนำ ร่วมมือส่งต่อคนไข้ฟื้นฟูหลังการผ่าตัดหรือการบำบัดด้วยการนวดสมุนไพรแบบแผนไทย", coverageArea: "ภาคอีสาน", score: 88 },
  { name: "ขอนแก่นทัวร์ริสท์ไกด์", type: PartnerType.TRAVEL, channel: "Affiliate Sales", summary: "กลุ่มมัคคุเทศก์ท้องถิ่น ช่วยพานักท่องเที่ยวต่างชาติและคณะทัวร์สุขภาพมาใช้บริการที่สปาพร้อมจัดเวิร์กชอปสุนทรียภาพ", coverageArea: "ขอนแก่น-จังหวัดใกล้เคียง", score: 82 },
  { name: "Isan Wellness Fund", type: PartnerType.INVESTOR, channel: "Equity Funding", summary: "กองทุนเพื่อการเติบโตธุรกิจบริการของภาคอีสาน ให้การสนับสนุนงบประมาณพัฒนาศูนย์นวัตกรรมสมุนไพรบำบัด", coverageArea: "ภาคอีสาน", score: 79 },
];

export async function GET() {
  try {
    let dbPartners = await prisma.partner.findMany({
      orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    });

    // Seed partners fallback if empty
    if (dbPartners.length === 0) {
      await Promise.all(
        SAMPLE_PARTNERS.map((p, idx) =>
          prisma.partner.create({
            data: {
              name: p.name,
              slug: `partner-slug-${Date.now()}-${idx}`,
              type: p.type,
              channel: p.channel,
              summary: p.summary,
              coverageArea: p.coverageArea,
              score: p.score,
            },
          })
        )
      );

      dbPartners = await prisma.partner.findMany({
        orderBy: [{ score: "desc" }, { createdAt: "asc" }],
      });
    }

    const mapped = dbPartners.map((p) => {
      // Map database types to UI filter categories:
      let uiType = "Tour Companies";
      if (p.type === "MARKETING") {
        uiType = "Investors";
      } else if (p.type === "TRAVEL") {
        if (p.summary.includes("โรงแรม") || p.summary.includes("ที่พัก") || p.slug.includes("pullman") || p.name.includes("Hotel") || p.name.includes("โรงแรม")) {
          uiType = "Hotels";
        } else {
          uiType = "Tour Companies";
        }
      } else if (p.type === "SUPPLIER") {
        uiType = "Hospitals";
      } else if (p.type === "INVESTOR") {
        uiType = "Investors";
      }

      return {
        id: p.id,
        name: p.name,
        type: uiType,
        location: p.coverageArea,
        score: p.score,
        desc: p.summary,
        channel: p.channel,
      };
    });

    return NextResponse.json({
      ok: true,
      data: mapped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, location, score, desc, channel } = body;

    // Map UI type back to DB enum
    let dbType: PartnerType = PartnerType.TRAVEL;
    if (type === "Investors") {
      dbType = PartnerType.INVESTOR;
    } else if (type === "Hospitals") {
      dbType = PartnerType.SUPPLIER;
    } else if (type === "Hotels" || type === "Tour Companies") {
      dbType = PartnerType.TRAVEL;
    }

    const newPartner = await prisma.partner.create({
      data: {
        name,
        slug: `partner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: dbType,
        channel: channel || "General Partner",
        summary: desc || "",
        coverageArea: location || "ไทย",
        score: Number(score) || 80,
      },
    });

    return NextResponse.json({ ok: true, data: newPartner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, type, location, score, desc, channel } = body;

    let dbType: PartnerType = PartnerType.TRAVEL;
    if (type === "Investors") {
      dbType = PartnerType.INVESTOR;
    } else if (type === "Hospitals") {
      dbType = PartnerType.SUPPLIER;
    } else if (type === "Hotels" || type === "Tour Companies") {
      dbType = PartnerType.TRAVEL;
    }

    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: {
        name,
        type: dbType,
        channel,
        summary: desc,
        coverageArea: location,
        score: Number(score) || undefined,
      },
    });

    return NextResponse.json({ ok: true, data: updatedPartner });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ ok: false, message: "Missing ID" }, { status: 400 });
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
