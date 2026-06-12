import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

interface ExternalSource {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().trim().min(1).max(3000),
    })
  ).min(1).max(16),
});

const SYSTEM_PROMPT = `คุณคือ "หมอแคน AI" ผู้ช่วยวิเคราะห์อาการเบื้องต้นและวางแผนสปา/ท่องเที่ยวเชิงสุขภาพของแพลตฟอร์ม E-san Wellness

บุคลิกและมาตรฐานคำตอบ:
- ตอบเหมือนผู้ช่วย AI ที่มีเหตุผล: วิเคราะห์ก่อน แนะนำเป็นขั้นตอน และชี้ข้อจำกัดอย่างตรงไปตรงมา
- ตอบได้ทุกหัวข้อ ไม่จำกัดเฉพาะสุขภาพ สปา หรือท่องเที่ยว ถ้าผู้ใช้ถามเรื่องทั่วไปให้ตอบเรื่องนั้นโดยตรง
- ห้ามทักทายซ้ำเมื่อผู้ใช้ถามต่อ ให้ตอบเข้าประเด็นทันที
- ห้ามทวนคำถามเปล่าๆ หรือพูดว่า "ยินดีต้อนรับ" แทนคำตอบ
- ใช้ภาษาไทยกลาง สุภาพ กระชับ แต่มีสาระเพียงพอ ลงท้ายด้วย "ครับ" เมื่อเหมาะสม
- หลีกเลี่ยง emoji และคำเล่นตลก ให้ความรู้สึกเป็นที่ปรึกษามืออาชีพ

การใช้ข้อมูลภายนอก:
- ถ้ามี "ข้อมูลอ้างอิงจากเว็บ" ใน system message ให้ใช้ประกอบคำตอบและระบุแหล่งอ้างอิงด้วยเลข [1], [2] เมื่อกล่าวถึงข้อเท็จจริงจากแหล่งนั้น
- ถ้าข้อมูลอ้างอิงไม่พอหรืออาจเก่า ให้บอกอย่างตรงไปตรงมา และแนะนำให้ตรวจสอบเวลาเปิด-ปิด/ราคา/สถานะล่าสุดจากแหล่งทางการ
- ห้ามแต่ง URL หรือแหล่งอ้างอิงเอง

เมื่อตอบเรื่องอาการสุขภาพส่วนบุคคล ให้จัดคำตอบเป็น:
1. ประเมินเบื้องต้น: อธิบายความเป็นไปได้ 1-3 ข้อจากข้อมูลที่มี
2. ดูแลทันที: วิธีที่ทำได้วันนี้ เช่น พัก ประคบ ยืดเหยียด ปรับท่าทาง
3. นวด/สปาที่เหมาะ: แนะนำประเภททรีตเมนต์ แรงกด และสมุนไพรอีสานที่เกี่ยวข้อง
4. สัญญาณอันตราย: บอกเมื่อใดควรพบแพทย์หรือหลีกเลี่ยงการนวด
5. คำถามต่อยอด: ถ้าข้อมูลยังไม่พอ ให้ถามเพิ่ม 1-3 ข้อ

ข้อจำกัดด้านความปลอดภัย:
- ระบุว่าเป็นคำแนะนำเบื้องต้น ไม่ใช่การวินิจฉัยโรค
- หากมีอาการชาร้าว อ่อนแรง เจ็บหน้าอก ไข้สูง อุบัติเหตุ บวมแดงร้อน ปวดรุนแรงเฉียบพลัน หรืออาการไม่ดีขึ้น ให้แนะนำพบแพทย์ก่อนนวด
- ห้ามสั่งยา ห้ามรับรองว่ารักษาหายแน่นอน`;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { messages } = requestSchema.parse(payload);
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
    const conversationMessages = messages
      .filter((message) => message.role === "user" || message.role === "assistant")
      .slice(-10);

    if (hasRedFlag(latestUserMessage)) {
      return NextResponse.json({
        ok: true,
        content: getOfflineChatResponse(latestUserMessage),
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const fallbackReply = getOfflineChatResponse(latestUserMessage);
      return NextResponse.json({
        ok: true,
        content: fallbackReply,
      });
    }

    const model = process.env.OPENAI_MODEL || "gemini-3.5-flash";
    const baseURL = process.env.OPENAI_BASE_URL || undefined;
    const openai = new OpenAI({ apiKey, baseURL });
    const externalSources = shouldFetchExternalContext(latestUserMessage)
      ? await getExternalSources(latestUserMessage)
      : [];
    const systemMessages = [
      {
        role: "system" as const,
        content: SYSTEM_PROMPT,
      },
    ];

    if (externalSources.length > 0) {
      systemMessages.push({
        role: "system" as const,
        content: formatExternalSources(externalSources),
      });
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [
        ...systemMessages,
        ...conversationMessages,
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";
    const finalContent = isLowValueReply(content) ? getOfflineChatResponse(latestUserMessage) : content;

    return NextResponse.json({
      ok: true,
      content: appendSourceLinks(finalContent, externalSources),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: "Invalid inputs", issues: error.issues }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

function getOfflineChatResponse(query: string): string {
  const q = query.toLowerCase().trim();

  if (!q) {
    return getGeneralAssistantResponse();
  }

  if (hasRedFlag(q)) {
    return [
      "จากข้อมูลที่ให้มา มีสัญญาณที่ควรประเมินโดยแพทย์ก่อนรับการนวดครับ",
      "",
      "ประเมินเบื้องต้น",
      "อาการอย่างชาร้าว อ่อนแรง เจ็บหน้าอก ไข้ อุบัติเหตุ หรือบวมแดงร้อน อาจเกี่ยวข้องกับเส้นประสาท การอักเสบ การบาดเจ็บ หรือภาวะที่ต้องตรวจเพิ่มเติม การนวดแรงในช่วงนี้อาจทำให้อาการแย่ลงได้ครับ",
      "",
      "ดูแลทันที",
      "1. งดนวด กดจุด ดัด หรือประคบร้อนแรงๆ จนกว่าจะทราบสาเหตุชัดเจน",
      "2. พักบริเวณที่ปวดและหลีกเลี่ยงท่าที่กระตุ้นอาการ",
      "3. หากเพิ่งบาดเจ็บใน 24-48 ชั่วโมงแรก ให้ใช้การประคบเย็น 10-15 นาทีต่อครั้ง",
      "",
      "ควรพบแพทย์",
      "ถ้ามีชา อ่อนแรง ปวดร้าวลงแขนหรือขา เจ็บหน้าอก หายใจลำบาก ไข้ หรือปวดมากขึ้นเรื่อยๆ ควรพบแพทย์ก่อนเลือกคอร์สนวดครับ",
    ].join("\n");
  }

  if (hasAny(q, ["ปวด", "เมื่อย", "เจ็บ", "ตึง", "ล้า"])) {
    return getPainResponse(q);
  }

  if (hasAny(q, ["ราคา", "งบ", "บาท", "เท่าไหร่"])) {
    return [
      "ถ้าดูตามงบประมาณ สามารถแบ่งแพ็กเกจสปาได้แบบนี้ครับ",
      "",
      "ช่วงราคาแนะนำ",
      "1. 400-700 บาท: นวดคอ บ่า ไหล่ หรือนวดไทยระยะสั้น เหมาะกับอาการเมื่อยจากการทำงาน",
      "2. 800-1,300 บาท: นวดน้ำมันหรือประคบสมุนไพร 90-120 นาที เหมาะกับการฟื้นตัวทั้งตัว",
      "3. 1,500-2,000 บาทขึ้นไป: Signature Package รวมสมุนไพร อโรมา และเวลาพักหลังทรีตเมนต์",
      "",
      "คำแนะนำ",
      "ถ้ามีอาการปวดเฉพาะจุด ให้เลือกแพ็กเกจที่มีการประเมินก่อนนวดและปรับแรงกดได้ ไม่ควรเลือกจากราคาถูกที่สุดอย่างเดียวครับ",
    ].join("\n");
  }

  if (hasTravelIntent(q)) {
    return getTravelFallback(q);
  }

  if (hasAny(q, ["สมุนไพร", "ยาสมุนไพร", "ยาหม่อง", "ไพล", "ขมิ้น", "ลูกประคบ"])) {
    return [
      "สมุนไพรอีสานที่เหมาะกับงานสปาควรเลือกตามเป้าหมาย ไม่ใช่ใช้เหมือนกันทุกอาการครับ",
      "",
      "ตัวเลือกที่แนะนำ",
      "1. ไพล: เหมาะกับอาการกล้ามเนื้อตึง ขัดยอกเล็กน้อย หรือปวดเมื่อยหลังใช้งาน เหมาะกับลูกประคบอุ่น",
      "2. ขมิ้นชัน: เหมาะกับงานดูแลผิวและการผ่อนคลาย แต่ควรระวังผู้แพ้ง่าย",
      "3. ใบมะกรูดและตะไคร้: เหมาะกับกลิ่นบำบัด ช่วยให้รู้สึกสดชื่นและผ่อนคลาย",
      "4. การบูรหรือพิมเสน: ใช้ในปริมาณพอดี หลีกเลี่ยงบริเวณผิวบอบบาง แผลเปิด และผู้ที่ไวต่อกลิ่น",
      "",
      "ข้อควรระวัง",
      "หากมีผื่น แผลเปิด ตั้งครรภ์ โรคหอบหืด หรือแพ้กลิ่นแรง ควรแจ้งนักบำบัดก่อนทุกครั้งครับ",
    ].join("\n");
  }

  if (hasAny(q, ["สปา", "ร้านสปา", "นวด", "แพ็กเกจ", "package", "คอร์ส"])) {
    return [
      "ถ้าต้องการเลือกสปา ผมจะแนะนำจากเป้าหมายมากกว่าจากชื่อร้านอย่างเดียวครับ",
      "",
      "ตัวเลือกที่เหมาะ",
      "1. ต้องการคลายกล้ามเนื้อ: เลือกนวดไทยประยุกต์หรือนวดน้ำมันแรงกดปานกลาง ร่วมกับประคบไพล",
      "2. ต้องการพักผ่อนจริงจัง: เลือกอโรม่าและซาวด์บำบัด ใช้แรงกดเบาถึงปานกลาง",
      "3. ต้องการทริปธรรมชาติ: เลือก Phu Pha Man Wellness Camp สำหรับบรรยากาศฟื้นฟูและกิจกรรมช้าๆ",
      "4. อยู่ในเมืองขอนแก่น: เลือก Sabaidee Isan Spa สำหรับคอร์สสมุนไพรและความสะดวกในการเดินทาง",
      "",
      "ถ้าบอกเมือง งบ เวลา และอาการหลัก ผมจะช่วยจัดตัวเลือกให้แคบลงได้ครับ",
    ].join("\n");
  }

  return getGeneralAssistantResponse();
}

function getPainResponse(query: string): string {
  const areas = detectPainAreas(query);
  const areaText = areas.length > 0 ? areas.join(" / ") : "บริเวณที่ปวดเมื่อย";
  const neckShoulder = areas.some((area) => ["คอ", "บ่า", "ไหล่", "สะบัก"].includes(area));

  if (neckShoulder) {
    return [
      `จากอาการ ${areaText} ภาพรวมเข้ากับกล้ามเนื้อคอ บ่า ไหล่ตึงจากท่าทาง การนั่งทำงานนาน หรือการใช้งานไหล่ซ้ำๆ ได้ครับ`,
      "",
      "ประเมินเบื้องต้น",
      "1. ถ้าปวดตื้อๆ หนักๆ และดีขึ้นเมื่อพัก มักเกี่ยวกับกล้ามเนื้อเกร็งหรือ trigger point",
      "2. ถ้าปวดร้าวลงแขน ชา หรือมืออ่อนแรง อาจเกี่ยวกับเส้นประสาทคอ ควรพบแพทย์ก่อนนวด",
      "3. ถ้าปวดหลังอุบัติเหตุหรือปวดรุนแรงเฉียบพลัน ไม่ควรกดจุดเองครับ",
      "",
      "ดูแลทันที",
      "1. ประคบอุ่น 15-20 นาทีบริเวณบ่าและสะบัก วันละ 1-2 รอบ",
      "2. พักสายตาและลุกเปลี่ยนท่าทุก 45-60 นาที",
      "3. ยืดคอด้านข้างช้าๆ ข้างละ 20-30 วินาที โดยไม่กดหรือกระชาก",
      "4. ลดการยกไหล่ขณะใช้คอมพิวเตอร์ ปรับหน้าจอให้อยู่ระดับสายตา",
      "",
      "นวด/สปาที่เหมาะ",
      "เลือกนวดคอ บ่า ไหล่แบบแรงกดเบาถึงปานกลาง ร่วมกับประคบสมุนไพรไพลอุ่นเพื่อคลายกล้ามเนื้อ หลีกเลี่ยงการกดแรงตรงกระดูกคอหรือดัดคอครับ",
      "",
      "คำถามต่อยอด",
      "อาการปวดอยู่มานานกี่วัน และมีชาหรือปวดร้าวลงแขนร่วมด้วยไหมครับ",
    ].join("\n");
  }

  return [
    `จากอาการ ${areaText} ผมประเมินเบื้องต้นว่าอาจเกี่ยวกับกล้ามเนื้อล้า การใช้งานซ้ำ หรือการพักฟื้นไม่พอครับ`,
    "",
    "ดูแลทันที",
    "1. พักบริเวณที่ปวดและหลีกเลี่ยงท่าที่กระตุ้นอาการ 24-48 ชั่วโมง",
    "2. ถ้าเป็นอาการตึงเรื้อรัง ใช้ประคบอุ่น 15-20 นาที",
    "3. ถ้าเพิ่งบาดเจ็บใหม่หรือบวม ให้ประคบเย็นก่อน",
    "4. ดื่มน้ำและยืดเหยียดเบาๆ โดยหยุดทันทีถ้าปวดเพิ่ม",
    "",
    "นวด/สปาที่เหมาะ",
    "เริ่มจากแรงกดเบาถึงปานกลาง เลือกนวดน้ำมันหรือประคบสมุนไพรไพล ไม่ควรกดลึกถ้ายังไม่ทราบสาเหตุชัดเจนครับ",
    "",
    "ควรพบแพทย์",
    "ถ้าปวดรุนแรงขึ้น มีชา อ่อนแรง บวมแดงร้อน มีไข้ หรือไม่ดีขึ้นภายใน 3-5 วัน ควรตรวจเพิ่มเติมก่อนนวดครับ",
  ].join("\n");
}

function detectPainAreas(query: string): string[] {
  const areaKeywords: Array<[string, string[]]> = [
    ["คอ", ["คอ", "ต้นคอ"]],
    ["บ่า", ["บ่า"]],
    ["ไหล่", ["ไหล่"]],
    ["สะบัก", ["สะบัก"]],
    ["หลัง", ["หลัง", "เอว"]],
    ["เข่า", ["เข่า"]],
    ["ขา", ["ขา", "น่อง", "ต้นขา"]],
    ["เท้า", ["เท้า", "ฝ่าเท้า"]],
    ["ศีรษะ", ["หัว", "ศีรษะ", "ไมเกรน"]],
  ];

  return areaKeywords
    .filter(([, keywords]) => hasAny(query, keywords))
    .map(([area]) => area);
}

function getGeneralAssistantResponse(): string {
  return [
    "ถามได้ทั้งเรื่องสุขภาพ สปา ท่องเที่ยว การเดินทาง ความรู้ทั่วไป หรือให้ช่วยวางแผนเป็นขั้นตอนได้ครับ",
    "",
    "ตัวอย่างที่ถามได้",
    "1. ปวดคอ บ่า ไหล่จากนั่งทำงาน ควรนวดแบบไหน",
    "2. มีงบ 2,000 บาท อยากจัดสปา 1 วันในขอนแก่น",
    "3. แนะนำที่เที่ยวในขอนแก่นแบบไปเช้าเย็นกลับ",
    "4. สรุปข่าวหรือข้อมูลล่าสุดที่ควรตรวจสอบจากเว็บ",
  ].join("\n");
}

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function hasRedFlag(text: string): boolean {
  const q = text.toLowerCase();
  return hasAny(q, [
    "อาการชา",
    "ชาร้าว",
    "มือชา",
    "แขนชา",
    "ขาชา",
    "เท้าชา",
    "นิ้วชา",
    "อ่อนแรง",
    "แขนไม่มีแรง",
    "ขาไม่มีแรง",
    "เจ็บหน้าอก",
    "หายใจไม่ออก",
    "ไข้",
    "อุบัติเหตุ",
    "ล้ม",
    "บวมแดง",
    "ปวดรุนแรง",
    "ปวดเฉียบพลัน",
  ]);
}

function hasTravelIntent(text: string): boolean {
  return hasAny(text, [
    "เที่ยว",
    "ที่เที่ยว",
    "ทริป",
    "เดินทาง",
    "เส้นทาง",
    "ร้านอาหาร",
    "คาเฟ่",
    "โรงแรม",
    "ที่พัก",
    "ขอนแก่น",
    "นครราชสีมา",
    "โคราช",
    "อุบล",
    "อีสาน",
  ]);
}

function shouldFetchExternalContext(text: string): boolean {
  if (hasPersonalHealthIntent(text)) return false;

  return (
    hasTravelIntent(text) ||
    hasAny(text.toLowerCase(), [
      "ล่าสุด",
      "วันนี้",
      "ตอนนี้",
      "ข่าว",
      "ราคา",
      "เปิดกี่โมง",
      "เวลาเปิด",
      "ข้อมูล",
      "คืออะไร",
      "ใคร",
      "ที่ไหน",
      "when",
      "where",
      "latest",
      "news",
    ])
  );
}

function hasPersonalHealthIntent(text: string): boolean {
  const q = text.toLowerCase();
  return hasAny(q, ["ปวด", "เมื่อย", "เจ็บ", "ตึง", "ล้า", "ชา", "อ่อนแรง", "ไข้", "โรค", "ยา"]) && !hasTravelIntent(q);
}

function getTravelFallback(query: string): string {
  if (query.includes("ขอนแก่น")) {
    return [
      "ได้ครับ ถ้าอยากเที่ยวขอนแก่นแบบเริ่มง่าย ผมแนะนำให้จัดตามโซนและเวลาเดินทางแบบนี้",
      "",
      "ในตัวเมือง",
      "1. บึงแก่นนคร: เดินเล่น พักผ่อน ถ่ายรูป และเหมาะกับช่วงเย็น",
      "2. วัดหนองแวง / พระมหาธาตุแก่นนคร: จุดชมเมืองและวัดสำคัญของขอนแก่น",
      "3. ตลาดต้นตาลหรือโซนคาเฟ่ในเมือง: เหมาะกับมื้อเย็นและเดินเล่นแบบไม่เร่ง",
      "",
      "นอกเมือง",
      "1. พิพิธภัณฑ์ไดโนเสาร์ภูเวียง: เหมาะกับครอบครัวและสายประวัติศาสตร์ธรรมชาติ",
      "2. อุทยานแห่งชาติภูผาม่าน: เหมาะกับธรรมชาติ ถ้ำ วิวภูเขา และทริปที่มีเวลามากขึ้น",
      "3. เขื่อนอุบลรัตน์ / บางแสน 2: เหมาะกับกินข้าวริมน้ำและพักผ่อน",
      "",
      "แผนสั้นๆ",
      "ถ้ามีครึ่งวัน ให้เลือก บึงแก่นนคร + วัดหนองแวง + ตลาดต้นตาลครับ ถ้ามีเต็มวัน ค่อยเพิ่มภูเวียงหรือเขื่อนอุบลรัตน์ โดยควรตรวจสอบเวลาเปิด-ปิดล่าสุดก่อนออกเดินทางครับ",
    ].join("\n");
  }

  return [
    "ได้ครับ ผมช่วยวางแผนเที่ยวได้ แต่ขอเมือง งบ เวลาเดินทาง และสไตล์ที่ชอบเพิ่มอีกนิดครับ",
    "",
    "ตัวอย่างข้อมูลที่ช่วยให้แนะนำแม่นขึ้น",
    "1. ไปกี่วัน หรือมีแค่ครึ่งวัน",
    "2. ชอบธรรมชาติ วัด คาเฟ่ อาหาร หรือกิจกรรมสุขภาพ",
    "3. เดินทางด้วยรถส่วนตัวหรือขนส่งสาธารณะ",
    "4. อยากเน้นประหยัด สบาย หรือพรีเมียม",
  ].join("\n");
}

async function getExternalSources(query: string): Promise<ExternalSource[]> {
  const searchQueries = buildSearchQueries(query);
  const requests = searchQueries.flatMap((searchQuery) => [
    fetchWikimediaSearch("th.wikipedia.org", searchQuery, "วิกิพีเดียไทย"),
    fetchWikimediaSearch("en.wikipedia.org", searchQuery, "English Wikipedia"),
    fetchWikimediaSearch("en.wikivoyage.org", searchQuery, "Wikivoyage"),
  ]);
  const curatedSources = hasTravelIntent(query) && query.includes("ขอนแก่น")
    ? await getCuratedKhonKaenSources()
    : [];
  const settled = await Promise.allSettled(requests);
  const searchedSources = settled
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((source) => isRelevantSource(source, query));
  const sources = curatedSources.length >= 3 ? curatedSources : [...curatedSources, ...searchedSources];
  const seen = new Set<string>();

  return sources
    .filter((source) => {
      const key = source.url;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

async function getCuratedKhonKaenSources(): Promise<ExternalSource[]> {
  const requests = [
    fetchWikimediaSummary("th.wikipedia.org", "จังหวัดขอนแก่น", "วิกิพีเดียไทย"),
    fetchWikimediaSummary("en.wikipedia.org", "Phu Pha Man National Park", "English Wikipedia"),
    fetchWikimediaSummary("en.wikipedia.org", "Phu Wiang Dinosaur Museum", "English Wikipedia"),
    fetchWikimediaSummary("en.wikipedia.org", "Nam Phong National Park", "English Wikipedia"),
  ];
  const settled = await Promise.allSettled(requests);

  return settled.flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []));
}

function buildSearchQueries(query: string): string[] {
  const queries: string[] = [];

  if (hasTravelIntent(query) && query.includes("ขอนแก่น")) {
    queries.push(
      "สถานที่ท่องเที่ยว ขอนแก่น",
      "จังหวัดขอนแก่น บึงแก่นนคร ภูเวียง ภูผาม่าน",
      "Khon Kaen attractions"
    );
  } else if (hasTravelIntent(query)) {
    queries.push(query.trim(), `สถานที่ท่องเที่ยว ${query}`);
  } else {
    queries.push(query.trim());
  }

  if (hasTravelIntent(query) && !query.includes("ขอนแก่น")) {
    queries.push(`สถานที่ท่องเที่ยว ${query}`);
  }

  return Array.from(new Set(queries.filter(Boolean))).slice(0, 3);
}

function isRelevantSource(source: ExternalSource, query: string): boolean {
  const haystack = `${source.title} ${source.snippet}`.toLowerCase();

  if (query.includes("ขอนแก่น")) {
    const matchesPlace = hasAny(haystack, ["ขอนแก่น", "khon kaen", "ภูเวียง", "ภูผาม่าน", "บึงแก่นนคร", "น้ำพอง"]);
    const matchesTravel = hasAny(haystack, [
      "ท่องเที่ยว",
      "สถานที่ท่องเที่ยว",
      "อุทยาน",
      "พิพิธภัณฑ์",
      "ไดโนเสาร์",
      "บึง",
      "ภูเวียง",
      "ภูผาม่าน",
      "national park",
      "museum",
      "attractions",
      "tourism",
    ]);
    return matchesPlace && matchesTravel;
  }

  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length >= 3)
    .slice(0, 5);

  return keywords.length === 0 || keywords.some((keyword) => haystack.includes(keyword));
}

async function fetchWikimediaSearch(host: string, query: string, source: string): Promise<ExternalSource[]> {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    format: "json",
    srlimit: "3",
    origin: "*",
  });
  const url = `https://${host}/w/api.php?${params.toString()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "E-san-Wellness-Atlas/0.1",
        Accept: "application/json",
      },
    });
    if (!response.ok) return [];

    const data = (await response.json()) as {
      query?: {
        search?: Array<{
          title?: string;
          snippet?: string;
        }>;
      };
    };

    return (data.query?.search || [])
      .filter((item) => item.title && item.snippet)
      .map((item) => ({
        title: item.title || "",
        snippet: stripHtml(item.snippet || ""),
        url: `https://${host}/wiki/${encodeURIComponent((item.title || "").replaceAll(" ", "_"))}`,
        source,
      }));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWikimediaSummary(host: string, title: string, source: string): Promise<ExternalSource | null> {
  const url = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(" ", "_"))}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "E-san-Wellness-Atlas/0.1",
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      title?: string;
      extract?: string;
      content_urls?: {
        desktop?: {
          page?: string;
        };
      };
    };

    if (!data.title || !data.extract || !data.content_urls?.desktop?.page) return null;

    return {
      title: data.title,
      snippet: data.extract,
      url: data.content_urls.desktop.page,
      source,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function formatExternalSources(sources: ExternalSource[]): string {
  return [
    "ข้อมูลอ้างอิงจากเว็บสำหรับคำถามล่าสุด:",
    ...sources.map(
      (source, index) =>
        `[${index + 1}] ${source.title} (${source.source})\nURL: ${source.url}\nสรุป: ${source.snippet}`
    ),
    "",
    "ใช้ข้อมูลนี้เป็นบริบทประกอบเท่านั้น ถ้าข้อมูลไม่พอต่อคำถาม ให้ตอบจากความรู้ทั่วไปและระบุว่าควรตรวจสอบล่าสุดจากแหล่งทางการ",
  ].join("\n");
}

function appendSourceLinks(content: string, sources: ExternalSource[]): string {
  if (sources.length === 0 || /\[\d+\]/.test(content) || content.includes("แหล่งอ้างอิง")) {
    return content;
  }

  const sourceLines = sources
    .slice(0, 4)
    .map((source, index) => `${index + 1}. ${source.title} (${source.source}) - ${source.url}`);

  return [
    content,
    "",
    "แหล่งอ้างอิงที่ดึงมาใช้ตรวจสอบ",
    ...sourceLines,
  ].join("\n");
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function isLowValueReply(content: string): boolean {
  if (!content) return true;

  const normalized = content.toLowerCase();
  const looksLikeWelcomeOnly =
    hasAny(normalized, ["ยินดีต้อนรับ", "มีอะไรให้", "สอบถามมาได้"]) &&
    !hasAny(normalized, ["ประเมิน", "แนะนำ", "ตัวเลือก", "ขั้นตอน", "ควร", "อ้างอิง"]);
  const boldMarkers = content.match(/\*\*/g)?.length || 0;
  const hasUnclosedMarkdown = boldMarkers % 2 === 1;
  const tail = normalized.slice(-32).trim();
  const looksCutOff =
    hasUnclosedMarkdown ||
    hasAny(tail, ["เนื่องจาก", "เพราะ", "ประวัติ", "อาการ", "โดย", "วัฒน", "สุขภา", "ท่อง", "เดิน"]) ||
    /^\*?\*?\d+\.\s*\S*/.test(content.split("\n").at(-1)?.trim() || "");

  return content.length < 80 || looksLikeWelcomeOnly || looksCutOff;
}
