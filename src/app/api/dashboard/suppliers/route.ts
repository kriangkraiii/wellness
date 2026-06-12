import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SAMPLE_INGREDIENTS = [
  { name: "ตะไคร้หอมเกรดเอ", category: "สมุนไพร", unit: "กิโลกรัม", marketPrice: 45, supplierName: "กลุ่มเกษตรกรบ้านฝาง" },
  { name: "น้ำมันหอมระเหยเปปเปอร์มินต์", category: "น้ำมันหอม", unit: "ขวด", marketPrice: 280, supplierName: "Isan Aroma Lab" },
  { name: "ลูกประคบสมุนไพรสูตรโบราณ", category: "อุปกรณ์สปา", unit: "ลูก", marketPrice: 85, supplierName: "สมุนไพรชุมชนน้ำพอง" },
  { name: "ไพลอบแห้งบดผง", category: "สมุนไพร", unit: "ถุง", marketPrice: 120, supplierName: "กลุ่มเกษตรกรบ้านฝาง" },
  { name: "ผ้าเช็ดตัวฝ้ายทอมือ", category: "ผ้าและเครื่องนุ่งห่ม", unit: "ผืน", marketPrice: 350, supplierName: "กลุ่มทอผ้าพื้นบ้านขอนแก่น" },
];

export async function GET() {
  try {
    let ingredients = await prisma.ingredient.findMany({});

    // Seed ingredients if empty
    if (ingredients.length === 0) {
      await Promise.all(
        SAMPLE_INGREDIENTS.map((ing) =>
          prisma.ingredient.create({
            data: {
              name: ing.name,
              category: ing.category,
              unit: ing.unit,
              marketPrice: ing.marketPrice,
              supplierName: ing.supplierName,
            },
          })
        )
      );
      ingredients = await prisma.ingredient.findMany({});
    }

    interface SupplierGroup {
      name: string;
      category: string;
      province: string;
      productsList: string[];
      ingredients: typeof ingredients;
    }

    const supplierMap: Record<string, SupplierGroup> = {};

    ingredients.forEach((ing) => {
      if (!supplierMap[ing.supplierName]) {
        supplierMap[ing.supplierName] = {
          name: ing.supplierName,
          category: ing.category,
          province: ing.supplierName.includes("บ้านฝาง") || ing.supplierName.includes("น้ำพอง") || ing.supplierName.includes("ขอนแก่น") ? "ขอนแก่น" : "ขอนแก่น",
          productsList: [],
          ingredients: [],
        };
      }
      supplierMap[ing.supplierName].productsList.push(ing.name);
      supplierMap[ing.supplierName].ingredients.push(ing);
    });

    const mapped = Object.keys(supplierMap).map((key, idx) => {
      const s = supplierMap[key];
      const productCount = s.productsList.length;
      return {
        id: key, // Use supplierName as primary ID for grouping
        name: s.name,
        category: s.category,
        province: s.province,
        products: productCount,
        rating: 4.5 + (idx % 5) * 0.1,
        minOrder: "500 บาท",
        contact: "089-xxx-xxxx",
        verified: idx % 2 === 0,
        productListText: s.productsList.join(", "),
        ingredients: s.ingredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          category: ing.category,
          unit: ing.unit,
          marketPrice: ing.marketPrice
        }))
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
    const { name, category, unit, marketPrice, supplierName } = body;

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        category: category || "สมุนไพร",
        unit: unit || "กิโลกรัม",
        marketPrice: Number(marketPrice) || 0,
        supplierName: supplierName || "ทั่วไป",
      },
    });

    return NextResponse.json({ ok: true, data: newIngredient });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, category, unit, marketPrice, supplierName, oldSupplierName } = body;

    // If a supplier was renamed, we update all its ingredients
    if (oldSupplierName && supplierName && oldSupplierName !== supplierName) {
      await prisma.ingredient.updateMany({
        where: { supplierName: oldSupplierName },
        data: { supplierName },
      });
    }

    let updated = null;
    if (id) {
      updated = await prisma.ingredient.update({
        where: { id },
        data: {
          name,
          category,
          unit,
          marketPrice: Number(marketPrice) || undefined,
          supplierName,
        },
      });
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const supplierName = searchParams.get("supplierName");

    if (id) {
      // Delete specific ingredient
      await prisma.ingredient.delete({
        where: { id },
      });
    } else if (supplierName) {
      // Delete all ingredients under this supplier name
      await prisma.ingredient.deleteMany({
        where: { supplierName },
      });
    } else {
      return NextResponse.json({ ok: false, message: "Missing id or supplierName" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
