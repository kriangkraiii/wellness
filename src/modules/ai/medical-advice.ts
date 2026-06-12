import OpenAI from "openai";

export interface CustomerDataForAI {
  name: string;
  age: number;
  gender: string;
  nationality: string;
  conditions: string[];
  surgeryStatus: string;
  surgeryDetail?: string;
  medStatus: string;
  medDetail?: string;
  cautions?: string;
  bodyPoints: Array<{ id: string; label: string; severity: string }>;
}

export function getOfflineMedicalAdvice(input: CustomerDataForAI): string {
  let advice = `[การประเมินอาการเบื้องต้น]\nวิเคราะห์พบอาการปวดเมื่อยบริเวณ ${
    input.bodyPoints.map((p) => p.label).join(", ") || "กล้ามเนื้อทั่วไป"
  } ในวัย ${input.age} ปี (${input.gender}) `;
  
  if (input.conditions.length > 0 && !input.conditions.includes("ไม่มีโรคประจำตัว")) {
    advice += `ร่วมกับมีประวัติทางสุขภาพคือ ${input.conditions.join(", ")}`;
  } else {
    advice += `ไม่มีประวัติโรคประจำตัวร้ายแรง`;
  }
  
  advice += `\n\n[ข้อควรระวังสำคัญสำหรับนักบำบัด]\n`;
  const cautions: string[] = [];
  if (input.conditions.includes("ความดันโลหิตสูง")) {
    cautions.push("หลีกเลี่ยงการนวดลงน้ำหนักกดจุดรุนแรงบริเวณคอ ขมับ และจุดหยุดเลือดใหญ่");
  }
  if (input.conditions.includes("โรคหัวใจ")) {
    cautions.push("จำกัดแรงกดให้อยู่ในระดับเบาถึงปานกลาง และหลีกเลี่ยงการอบสปาความร้อนสูงเป็นเวลานาน");
  }
  if (input.surgeryStatus === "yes") {
    cautions.push(`หลีกเลี่ยงการดัด ยืด หรือลงน้ำหนักกดทับแผลผ่าตัดบริเวณที่เคยทำการรักษา (${input.surgeryDetail || "ไม่ระบุ"})`);
  }
  if (input.bodyPoints.some((p) => p.severity === "severe")) {
    cautions.push("ระมัดระวังเป็นพิเศษสำหรับจุดปวดรุนแรง ให้ลงน้ำหนักเบาและประคบอุ่นนำร่องเพื่อคลายเส้นแทนการรีดกล้ามเนื้อหนัก");
  }
  if (cautions.length === 0) {
    cautions.push("นวดบำบัดตามแนวเส้นสรีระพื้นฐาน หลีกเลี่ยงการกดกระดูกโดยตรง");
  }
  advice += cautions.map((c, i) => `${i + 1}. ${c}`).join("\n");

  advice += `\n\n[เทคนิคการนวดที่แนะนำ]\n`;
  if (input.bodyPoints.some((p) => p.severity === "severe")) {
    advice += "แนะนำการนวดไทยราชสำนักเน้นจุดปวดเบามือ ผสมผสานกับการประคบสมุนไพรอุ่น (Hot Herbal Compress) เพื่อเปิดกระแสลมลดความตึงเกร็งสะสม";
  } else {
    advice += "แนะนำนวดน้ำมันอโรม่าสุคนธบำบัด (Aroma Oil Massage) ด้วยน้ำหนักปานกลางเพื่อผ่อนคลายและกระตุ้นระบบไหลเวียนโลหิต";
  }

  advice += `\n\n[สมุนไพรบำบัดท้องถิ่นขอนแก่นที่แนะนำ]\n`;
  advice += "แนะนำลูกประคบสมุนไพรสูตรท้องถิ่นขอนแก่น ได้แก่ ไพล (แก้ฟกช้ำและอาการขัดยอก), ขมิ้นชัน (ช่วยลดการอักเสบผิวหนัง), ใบมะกรูด (ช่วยแต่งกลิ่นบำรุงหัวใจและระบบทางเดินหายใจ)";

  advice += `\n\n[คำแนะนำการดูแลตัวเอง]\n1. ดื่มน้ำอุ่นมากๆ หลังนวดเพื่อช่วยขับของเสียออกจากเนื้อเยื่อกล้ามเนื้อ\n2. ยืดเหยียดร่างกายเบาๆ และหลีกเลี่ยงการยกของหนักหรือนั่งท่าเดิมติดต่อกันเกิน 1 ชั่วโมง`;

  return advice;
}

export async function generateSpaMedicalAdvice(input: CustomerDataForAI): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return getOfflineMedicalAdvice(input);
  }

  try {
    const model = process.env.OPENAI_MODEL || "gemini-3.5-flash";
    const baseURL = process.env.OPENAI_BASE_URL || undefined;
    const openai = new OpenAI({ apiKey, baseURL });

    const prompt = `
คุณเป็นแพทย์แผนไทยและผู้เชี่ยวชาญการนวดบำบัดรักษา/สปาเชิงสุขภาพของจังหวัดขอนแก่น
วิเคราะห์อาการและให้คำแนะนำเพื่อความปลอดภัยแก่ลูกค้าและนักบำบัดตามข้อมูลลูกค้าดังนี้:

- ชื่อ: ${input.name}
- อายุ: ${input.age} ปี
- เพศ: ${input.gender}
- สัญชาติ: ${input.nationality}
- โรคประจำตัว: ${input.conditions.join(", ") || "ไม่มี"}
- ประวัติการผ่าตัด: ${input.surgeryStatus === "yes" ? input.surgeryDetail : "ไม่มี"}
- ยาประจำตัว: ${input.medStatus === "yes" ? input.medDetail : "ไม่มี"}
- ข้อควรระวังเพิ่มเติม: ${input.cautions || "ไม่มี"}
- จุดที่มีความต้องการบำบัด/ปวดเมื่อย:
${
  input.bodyPoints
    .map(
      (p) =>
        `  * ${p.label} (ระดับอาการ: ${
          p.severity === "severe"
            ? "ปวดมาก/รุนแรง"
            : p.severity === "moderate"
            ? "ปวดปานกลาง"
            : "ต้องการผ่อนคลาย"
        })`
    )
    .join("\n") || "  * ไม่มีจุดเฉพาะเจาะจง"
}

โปรดเขียนคำแนะนำฉบับพรีเมียมภาษาไทย โดยแบ่งออกเป็นหัวข้อดังนี้ (เขียนแยกบรรทัดชัดเจนและใช้ Markdown เล็กน้อย):
1. [การประเมินอาการเบื้องต้น]: วิเคราะห์ว่าโรคประจำตัวสัมผัสกับความเมื่อยล้าอย่างไร
2. [ข้อควรระวังสำคัญสำหรับนักบำบัด]: ข้อห้าม/การลงน้ำหนักนวดที่ต้องระวังเป็นพิเศษเพื่อความปลอดภัย
3. [เทคนิคการนวดที่แนะนำ]: เช่น นวดราชสำนัก, อโรม่า, ประคบร้อน
4. [สมุนไพรบำบัดท้องถิ่นขอนแก่นที่แนะนำ]: เช่น การใช้สมุนไพรพื้นบ้าน เช่น ไพล, ขมิ้นชัน, ใบมะกรูด
5. [คำแนะนำการดูแลตัวเอง]: การดูแลฟื้นฟูหลังนวด
`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "คุณเป็นที่ปรึกษาการแพทย์แผนไทยและการท่องเที่ยวเชิงสุขภาพ ตอบคำถามโดยใช้ความคิด (Reasoning) สั้นที่สุดอย่างกระชับ และเขียนคำตอบในหัวข้อทั้ง 5 ข้อโดยทันที",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "";
    if (content.trim().length < 150) {
      console.warn("AI advice was too short, falling back to offline advice generator.");
      return getOfflineMedicalAdvice(input);
    }

    return content;
  } catch (error) {
    console.error("AI Generation failed:", error);
    return getOfflineMedicalAdvice(input);
  }
}
