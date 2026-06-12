import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SAMPLE_CUSTOMERS = [
  { name: "สมชาย ใจดี", age: 34, gender: "ชาย", nationality: "ไทย", segment: "Office Worker", visits: 12, spending: 18500, satisfaction: 5, comment: "บริการนวดอโรมาดีมาก ช่วยแก้ปัญหาออฟฟิศซินโดรมได้ดีเยี่ยม" },
  { name: "นภา สุขสันต์", age: 28, gender: "หญิง", nationality: "ไทย", segment: "Tourist", visits: 8, spending: 12400, satisfaction: 4, comment: "บรรยากาศดีมาก รู้สึกผ่อนคลาย คุ้มค่าเงิน" },
  { name: "วิชัย ร่มเย็น", age: 62, gender: "ชาย", nationality: "ไทย", segment: "Senior", visits: 15, spending: 24200, satisfaction: 5, comment: "ประคบสมุนไพรช่วยบรรเทาอาการปวดเข่าและข้อได้ดีมาก หมอนวดสุภาพ" },
  { name: "แก้ว มณีรัตน์", age: 31, gender: "หญิง", nationality: "ไทย", segment: "Office Worker", visits: 6, spending: 8700, satisfaction: 4, comment: "นวดคลายเส้นดีมาก พนักงานบริการประทับใจ" },
  { name: "ธนา พัฒนกุล", age: 25, gender: "ชาย", nationality: "ไทย", segment: "Athlete", visits: 20, spending: 35600, satisfaction: 5, comment: "นวดสปอร์ตน้ำมันช่วยฟื้นฟูกล้ามเนื้อหลังแข่งได้เร็วมาก แนะนำเลยครับ" },
  { name: "พรทิพย์ ดอกไม้", age: 45, gender: "หญิง", nationality: "ไทย", segment: "Tourist", visits: 4, spending: 5200, satisfaction: 4, comment: "นวดเท้าดี สบายตัวขึ้นเยอะเลยค่ะ" },
];

export async function GET() {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { slug: "sabaidee-spa-khonkaen" },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, message: "Merchant not found" }, { status: 404 });
    }

    // Check if customer records exist
    let records = await prisma.customerSpaRecord.findMany({
      where: { merchantId: merchant.id },
      orderBy: { createdAt: "desc" },
    });

    // If database is empty, seed sample records
    if (records.length === 0) {
      await Promise.all(
        SAMPLE_CUSTOMERS.map((c) =>
          prisma.customerSpaRecord.create({
            data: {
              merchantId: merchant.id,
              name: c.name,
              age: c.age,
              gender: c.gender,
              nationality: c.nationality,
              conditions: c.segment === "Office Worker" ? ["Office Syndrome", "Back pain"] : [],
              surgeryStatus: "NO",
              medStatus: "NO",
              bodyPoints: {},
              overallRating: c.satisfaction,
              feelingAfter: 5,
              improvement: 5,
              comment: c.comment,
              cautions: JSON.stringify({
                visits: c.visits,
                spending: c.spending,
                segment: c.segment,
              }),
            },
          })
        )
      );

      records = await prisma.customerSpaRecord.findMany({
        where: { merchantId: merchant.id },
        orderBy: { createdAt: "desc" },
      });
    }

    // Map database records to page structure
    const customersData = records.map((r, index) => {
      let visits = 1;
      let spending = 0;
      let segment = "General";

      if (r.cautions) {
        try {
          const parsed = JSON.parse(r.cautions);
          if (parsed && typeof parsed === "object") {
            visits = parsed.visits ?? 1;
            spending = parsed.spending ?? 0;
            segment = parsed.segment ?? "General";
          }
        } catch {
          const sample = SAMPLE_CUSTOMERS[index % SAMPLE_CUSTOMERS.length];
          visits = sample.visits;
          spending = sample.spending;
          segment = sample.segment;
        }
      } else {
        const sample = SAMPLE_CUSTOMERS[index % SAMPLE_CUSTOMERS.length];
        visits = sample.visits;
        spending = sample.spending;
        segment = sample.segment;
      }

      return {
        id: r.id,
        name: r.name,
        age: r.age,
        gender: r.gender,
        nationality: r.nationality,
        visits,
        lastVisit: new Date(r.createdAt).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        satisfaction: r.overallRating,
        segment,
        spending,
        comment: r.comment,
      };
    });

    // Calculate segments breakdown
    const segmentsMap: Record<string, number> = {};
    customersData.forEach((c) => {
      segmentsMap[c.segment] = (segmentsMap[c.segment] || 0) + 1;
    });

    const colors = ["#2D6A4F", "#52B788", "#D4A843", "#95D5B2", "#CBD5E1"];
    const customerSegments = Object.keys(segmentsMap).map((key, idx) => ({
      name: key,
      value: segmentsMap[key],
      color: colors[idx % colors.length],
    }));

    // Dynamic stats calculation
    const totalCustomers = customersData.length || 1;
    const returnRate = Math.round((customersData.filter(c => c.visits > 1).length / totalCustomers) * 100);
    const avgSpending = Math.round(customersData.reduce((acc, c) => acc + c.spending, 0) / totalCustomers);
    const satisfactionScore = Math.round((customersData.reduce((acc, c) => acc + c.satisfaction, 0) / (totalCustomers * 5)) * 100);

    return NextResponse.json({
      ok: true,
      data: {
        customers: customersData,
        segments: customerSegments,
        stats: {
          satisfactionScore: satisfactionScore || 86,
          returnRate: returnRate || 68,
          avgSpending: avgSpending || 1850,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, age, gender, nationality, satisfaction, comment, segment, visits, spending } = body;

    const merchant = await prisma.merchant.findUnique({
      where: { slug: "sabaidee-spa-khonkaen" },
    });

    if (!merchant) {
      return NextResponse.json({ ok: false, message: "Merchant not found" }, { status: 404 });
    }

    const cautionsJson = JSON.stringify({
      visits: Number(visits) || 1,
      spending: Number(spending) || 0,
      segment: segment || "General",
    });

    const newRecord = await prisma.customerSpaRecord.create({
      data: {
        merchantId: merchant.id,
        name,
        age: Number(age) || 30,
        gender: gender || "ไม่ระบุ",
        nationality: nationality || "ไทย",
        conditions: [],
        surgeryStatus: "NO",
        medStatus: "NO",
        bodyPoints: {},
        overallRating: Number(satisfaction) || 5,
        feelingAfter: 5,
        improvement: 5,
        comment: comment || "",
        cautions: cautionsJson,
      },
    });

    return NextResponse.json({ ok: true, data: newRecord });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, age, gender, nationality, satisfaction, comment, segment, visits, spending } = body;

    const cautionsJson = JSON.stringify({
      visits: Number(visits) || 1,
      spending: Number(spending) || 0,
      segment: segment || "General",
    });

    const updatedRecord = await prisma.customerSpaRecord.update({
      where: { id },
      data: {
        name,
        age: Number(age) || undefined,
        gender,
        nationality,
        overallRating: Number(satisfaction) || undefined,
        comment,
        cautions: cautionsJson,
      },
    });

    return NextResponse.json({ ok: true, data: updatedRecord });
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

    await prisma.customerSpaRecord.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
