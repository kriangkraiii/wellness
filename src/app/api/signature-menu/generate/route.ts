import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const requestSchema = z.object({
  province: z.string().min(1),
  theme: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { province, theme } = requestSchema.parse(payload);

    const apiKey = process.env.OPENAI_API_KEY;
    
    // Fallback static rules if no API key is provided
    if (!apiKey) {
      return NextResponse.json({
        ok: true,
        data: getFallbackSignature(province, theme),
      });
    }

    const model = process.env.OPENAI_MODEL || "gemini-3.5-flash";
    const baseURL = process.env.OPENAI_BASE_URL || undefined;
    const openai = new OpenAI({ apiKey, baseURL });

    const prompt = `
คุณเป็นผู้เชี่ยวชาญด้านสปา อัตลักษณ์ท้องถิ่นอีสาน และการท่องเที่ยวเชิงสุขภาพ
ช่วยออกแบบแพ็กเกจทรีตเมนต์สปา (Signature Menu Package) ที่ดึงอัตลักษณ์ท้องถิ่นของจังหวัด "${province}" ภายใต้ธีมสปาแบบ "${theme}"
ออกแบบองค์ประกอบให้ครบ 5 ประสาทสัมผัส (5 Senses: รูป รส กลิ่น เสียง สัมผัส) และสร้าง Story เรื่องราวเชื่อมโยงวัฒนธรรม

ตอบกลับมาในรูปแบบ JSON วัตถุชิ้นเดียวเท่านั้น ห้ามมีคำนำหรือมาร์กดาวน์อื่นใด นอกเหนือจากรูปแบบ JSON นี้:
{
  "name": "ชื่อแพ็กเกจสปาภาษาไทยสั้นๆ กระชับและหรูหรา",
  "totalPrice": 1890,
  "story": "เรื่องราวมรดกวัฒนธรรมของจังหวัดนี้ที่นำมาเชื่อมกับธีมสปา (ความยาว 2-3 บรรทัด)",
  "visual": "การตกแต่งห้องสปา แสงไฟ หรือผ้าลายท้องถิ่นที่เป็นเอกลักษณ์ของจังหวัดนี้",
  "taste": "สูตรเครื่องดื่ม Welcome drink / tea หลังสปาที่ใช้สมุนไพรเด่นของจังหวัดนี้",
  "scent": "น้ำมันหอมระเหยบำบัดกลิ่นเด่น (เช่น ไพลผสมเปลือกส้ม หรือสมุนไพรพื้นบ้าน)",
  "sound": "เสียงดนตรีบำบัดที่สอดคล้อง (เช่น เสียงพิณบำบัด เสียงน้ำไหล เสียงแคนคลอเบาๆ)",
  "touch": "สัมผัสทางกาย เช่น ผ้าประคบร้อนจากผ้าฝ้ายทอมือ เทคนิคการนวดเฉพาะตัว",
  "breakdown": [
    { "item": "ขั้นตอนที่ 1 และเวลานวด", "price": "ระยะเวลาเป็นนาที เช่น 30 นาที" },
    { "item": "ขั้นตอนที่ 2 และเวลานวด", "price": "ระยะเวลาเป็นนาที เช่น 30 นาที" },
    { "item": "ขั้นตอนที่ 3 และเวลานวด", "price": "ระยะเวลาเป็นนาที เช่น 60 นาที" }
  ],
  "supplierCost": 450,
  "margin": 1440
}
    `;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "คุณเป็น AI ที่คอยแนะนำเมนูสปาบำบัด และต้องตอบกลับเป็นภาษาไทยในรูปแบบ JSON ที่ถูกต้องเสมอ",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "";
    const parsed = JSON.parse(content);
    
    return NextResponse.json({
      ok: true,
      data: parsed,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Invalid inputs", issues: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

function getFallbackSignature(province: string, theme: string) {
  return {
    name: `วิถีแห่งสมุนไพร ${province} (120 นาที)`,
    province,
    totalPrice: 1890,
    story: `นวดสปาบำบัดที่ผสมผสานจิตวิญญาณแห่งวัฒนธรรมเมือง ${province} ชูความอบอุ่นและสมุนไพรออร์แกนิกตามธีม ${theme}`,
    visual: `แสงไฟอำพันอบอุ่น ตกแต่งด้วยลายผ้าท้องถิ่นอันเลื่องชื่อของจังหวัด ${province}`,
    taste: "น้ำตะไคร้ผสมน้ำผึ้งป่าและมะนาวสด ปรับธาตุลมให้สมดุลหลังนวด",
    scent: "น้ำมันหอมระเหยสูตรพิเศษ ไพลหอม มะกรูดสด และดอกแก้วป่า",
    sound: "เสียงขลุ่ยไม้ไผ่คละเคล้าเสียงพิณเบาๆ และคลื่นธรรมชาติสากล",
    touch: `นวดกดจุดบำบัดร่วมกับการใช้ลูกประคบทำมืออันเป็นอัตลักษณ์ของ ${province}`,
    breakdown: [
      { item: "1. ล้างเท้าด้วยสมุนไพรเกลือสะตุ", price: "15 นาที" },
      { item: "2. นวดประคบร้อนสมุนไพรสด", price: "45 นาที" },
      { item: "3. นวดอโรมาปรับสมดุลแผ่นหลัง", price: "60 นาที" }
    ],
    supplierCost: 450,
    margin: 1440,
  };
}
