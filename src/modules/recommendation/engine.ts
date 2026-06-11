import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getMerchantBySlug, getPartners } from "@/modules/repository/merchant-repository";
import type {
  RecommendationInput,
  RecommendationItem,
  RecommendationResult,
} from "@/modules/recommendation/types";

function computeRuleRecommendations(input: RecommendationInput, merchantName: string) {
  const items: RecommendationItem[] = [];

  const budgetScore =
    input.budgetLevel === "high" ? 35 : input.budgetLevel === "medium" ? 27 : 19;
  const audienceScore =
    input.targetAudience === "international"
      ? 32
      : input.targetAudience === "thai-traveler"
        ? 26
        : 21;

  if (input.objective.toLowerCase().includes("stress") || input.objective.includes("เครียด")) {
    items.push({
      title: "Stress Reset Signature",
      reason: "จับคู่ Aromatherapy + breathing ritual เพื่อรีเซ็ตระบบประสาท",
      score: 31,
      category: "menu",
    });
  }

  items.push({
    title: "นวดผสมประคบสมุนไพรอีสาน",
    reason: "ใช้ตะไคร้และใบมะกรูดลดความตึงกล้ามเนื้อ สื่ออัตลักษณ์ท้องถิ่น",
    score: 28,
    category: "massage-technique",
  });

  items.push({
    title: "สร้างแพ็กเกจ Wellness 2 วัน 1 คืน",
    reason: `ผูกข้อเสนอของ ${merchantName} กับเส้นทางธรรมชาติและอาหารคลีน`,
    score: 25,
    category: "promotion",
  });

  items.push({
    title: "ยกระดับอัตลักษณ์ 5 มิติ",
    reason: "คุมภาพรวม รูป-รส-กลิ่น-เสียง-สัมผัส ให้สอดคล้องบริการ",
    score: 22,
    category: "identity",
  });

  const score = Math.min(100, budgetScore + audienceScore + 22);
  return {
    score,
    items,
    summary:
      "ระบบ rule-based พบว่าเมนูคลายเครียดและแพ็กเกจผสมธรรมชาติเป็นจุดโตที่ชัดที่สุดในระยะสั้น",
  };
}

async function generateNarrativeWithLLM(
  input: RecommendationInput,
  ruleItems: RecommendationItem[],
  merchantName: string,
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { llmNarrative: undefined, llmModel: undefined };
  }

  const model = process.env.OPENAI_MODEL || "gemini-3.5-flash";
  const baseURL = process.env.OPENAI_BASE_URL || undefined;
  const openai = new OpenAI({ apiKey, baseURL });

  const prompt = [
    "คุณเป็นที่ปรึกษาธุรกิจสปาและท่องเที่ยวเชิงสุขภาพ",
    `ร้าน: ${merchantName}`,
    `เป้าหมาย: ${input.objective}`,
    `งบประมาณ: ${input.budgetLevel}`,
    `กลุ่มลูกค้า: ${input.targetAudience}`,
    "คำแนะนำจาก rule engine:",
    ...ruleItems.map((it, idx) => `${idx + 1}. ${it.title} - ${it.reason}`),
    "เขียนคำแนะนำฉบับสั้นภาษาไทย 4-6 บรรทัดที่ actionable",
  ].join("\n");

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: "คุณเป็นที่ปรึกษาธุรกิจสปาและท่องเที่ยวเชิงสุขภาพ",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
  });

  const llmNarrative = response.choices[0]?.message?.content || undefined;

  return {
    llmNarrative,
    llmModel: model,
  };
}

export async function runRecommendation(input: RecommendationInput): Promise<RecommendationResult> {
  const merchant = await getMerchantBySlug(input.merchantSlug);
  if (!merchant) {
    throw new Error("Merchant not found");
  }

  const partners = await getPartners();
  const topPartner = partners[0];
  const rule = computeRuleRecommendations(input, merchant.name);

  const itemsWithPartner = [
    ...rule.items,
    {
      title: `แนะนำพาร์ทเนอร์: ${topPartner?.name ?? "Gowabi for Business"}`,
      reason: topPartner
        ? `${topPartner.channel} เหมาะกับ objective นี้และมีคะแนนความสอดคล้องสูง`
        : "เพิ่มช่องทางเข้าถึงลูกค้าอย่างรวดเร็ว",
      score: 24,
      category: "partner" as const,
    },
  ];

  const llm = await generateNarrativeWithLLM(input, itemsWithPartner, merchant.name);

  const result: RecommendationResult = {
    ruleScore: rule.score,
    summary: rule.summary,
    items: itemsWithPartner,
    llmNarrative: llm.llmNarrative,
    llmModel: llm.llmModel,
  };

  await prisma.recommendationRun.create({
    data: {
      merchantId: merchant.id,
      objective: input.objective,
      budgetLevel: input.budgetLevel,
      targetAudience: input.targetAudience,
      ruleScore: result.ruleScore,
      ruleSummary: {
        summary: result.summary,
        items: result.items,
      },
      llmNarrative: result.llmNarrative,
      llmModel: result.llmModel,
    },
  });

  return result;
}
