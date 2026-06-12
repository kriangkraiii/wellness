import {
  AdminRole,
  BusinessType,
  PartnerType,
  PrismaClient,
  type Prisma,
} from "@prisma/client";
import { hashPassword } from "../src/modules/auth/password";

const prisma = new PrismaClient();

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function seedMerchants() {
  const merchant = await prisma.merchant.upsert({
    where: { slug: "sabaidee-spa-khonkaen" },
    update: {
      name: "Sabaidee Isan Spa",
      businessType: BusinessType.SPA,
      location: "เมืองขอนแก่น",
      description: "สปาและนวดเพื่อสุขภาพ เน้นอัตลักษณ์สมุนไพรอีสาน",
    },
    create: {
      slug: "sabaidee-spa-khonkaen",
      name: "Sabaidee Isan Spa",
      businessType: BusinessType.SPA,
      location: "เมืองขอนแก่น",
      description: "สปาและนวดเพื่อสุขภาพ เน้นอัตลักษณ์สมุนไพรอีสาน",
    },
  });

  const travelerMerchant = await prisma.merchant.upsert({
    where: { slug: "phuphaman-wellness-camp" },
    update: {
      name: "Phu Pha Man Wellness Camp",
      businessType: BusinessType.WELLNESS_TOURISM,
      location: "ภูผาม่าน ขอนแก่น",
      description: "ทริปธรรมชาติฟื้นฟูสุขภาพ ผสานกิจกรรมชุมชน",
    },
    create: {
      slug: "phuphaman-wellness-camp",
      name: "Phu Pha Man Wellness Camp",
      businessType: BusinessType.WELLNESS_TOURISM,
      location: "ภูผาม่าน ขอนแก่น",
      description: "ทริปธรรมชาติฟื้นฟูสุขภาพ ผสานกิจกรรมชุมชน",
    },
  });

  await prisma.offering.deleteMany({ where: { merchantId: merchant.id } });
  await prisma.offering.createMany({
    data: [
      {
        merchantId: merchant.id,
        title: "Isan Herbal Compression",
        category: "Spa Signature",
        basePrice: 890,
        wellnessFocus: "Stress relief and muscle recovery",
      },
      {
        merchantId: merchant.id,
        title: "Aroma Rice Bran Therapy",
        category: "Massage",
        basePrice: 690,
        wellnessFocus: "Deep relaxation and sleep quality",
      },
      {
        merchantId: merchant.id,
        title: "Mindful Foot Ritual",
        category: "Therapy",
        basePrice: 450,
        wellnessFocus: "Circulation and calmness",
      },
    ],
  });

  await prisma.offering.deleteMany({ where: { merchantId: travelerMerchant.id } });
  await prisma.offering.createMany({
    data: [
      {
        merchantId: travelerMerchant.id,
        title: "Nature Forest Bathing Tour",
        category: "Tour Signature",
        basePrice: 1500,
        wellnessFocus: "Mental clarity and fresh air immersion",
      },
      {
        merchantId: travelerMerchant.id,
        title: "Organic Isan Cooking Class",
        category: "Workshop",
        basePrice: 750,
        wellnessFocus: "Nutrition and local culinary experience",
      },
    ],
  });

  return { merchant, travelerMerchant };
}

async function seedIngredients(merchantId: string) {
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { name: "ตะไคร้" },
      update: {
        category: "สมุนไพร",
        unit: "kg",
        marketPrice: 68,
        supplierName: "Ban Fang Herb Cooperative",
      },
      create: {
        name: "ตะไคร้",
        category: "สมุนไพร",
        unit: "kg",
        marketPrice: 68,
        supplierName: "Ban Fang Herb Cooperative",
      },
    }),
    prisma.ingredient.upsert({
      where: { name: "ใบมะกรูด" },
      update: {
        category: "สมุนไพร",
        unit: "kg",
        marketPrice: 95,
        supplierName: "Nam Phong Organic Hub",
      },
      create: {
        name: "ใบมะกรูด",
        category: "สมุนไพร",
        unit: "kg",
        marketPrice: 95,
        supplierName: "Nam Phong Organic Hub",
      },
    }),
    prisma.ingredient.upsert({
      where: { name: "ข้าวหอมมะลิ" },
      update: {
        category: "อาหาร",
        unit: "kg",
        marketPrice: 52,
        supplierName: "Isan Wellness Grain Group",
      },
      create: {
        name: "ข้าวหอมมะลิ",
        category: "อาหาร",
        unit: "kg",
        marketPrice: 52,
        supplierName: "Isan Wellness Grain Group",
      },
    }),
  ]);

  await prisma.merchantIngredient.deleteMany({ where: { merchantId } });
  await prisma.merchantIngredient.createMany({
    data: [
      {
        merchantId,
        ingredientId: ingredients[0].id,
        monthlyVolume: 24,
        usageNote: "ใช้ในลูกประคบและน้ำมันนวด",
      },
      {
        merchantId,
        ingredientId: ingredients[1].id,
        monthlyVolume: 18,
        usageNote: "ใช้ในสูตรอโรมา",
      },
      {
        merchantId,
        ingredientId: ingredients[2].id,
        monthlyVolume: 30,
        usageNote: "เมนู signature drink",
      },
    ],
  });
}

async function seedPartners() {
  await Promise.all([
    prisma.partner.upsert({
      where: { slug: "grab-merchant" },
      update: {
        name: "Grab Merchant",
        type: PartnerType.MARKETING,
        channel: "Delivery & promotion",
        summary: "กระจายโปรโมชันและดีลแก่ลูกค้าในเมือง (ภาคอีสาน)",
        coverageArea: "ขอนแก่นและหัวเมืองอีสาน",
        score: 82,
      },
      create: {
        slug: "grab-merchant",
        name: "Grab Merchant",
        type: PartnerType.MARKETING,
        channel: "Delivery & promotion",
        summary: "กระจายโปรโมชันและดีลแก่ลูกค้าในเมือง (ภาคอีสาน)",
        coverageArea: "ขอนแก่นและหัวเมืองอีสาน",
        score: 82,
      },
    }),
    prisma.partner.upsert({
      where: { slug: "tiktok-shop-seller" },
      update: {
        name: "TikTok Shop Seller",
        type: PartnerType.MARKETING,
        channel: "Social commerce",
        summary: "ขายผลิตภัณฑ์สุขภาพพร้อมคอนเทนต์เล่าเรื่อง",
        coverageArea: "Thailand",
        score: 78,
      },
      create: {
        slug: "tiktok-shop-seller",
        name: "TikTok Shop Seller",
        type: PartnerType.MARKETING,
        channel: "Social commerce",
        summary: "ขายผลิตภัณฑ์สุขภาพพร้อมคอนเทนต์เล่าเรื่อง",
        coverageArea: "Thailand",
        score: 78,
      },
    }),
    prisma.partner.upsert({
      where: { slug: "gowabi-business" },
      update: {
        name: "Gowabi for Business",
        type: PartnerType.TRAVEL,
        channel: "Booking platform",
        summary: "ช่องทางจองบริการและเพิ่ม visibility",
        coverageArea: "Thailand",
        score: 80,
      },
      create: {
        slug: "gowabi-business",
        name: "Gowabi for Business",
        type: PartnerType.TRAVEL,
        channel: "Booking platform",
        summary: "ช่องทางจองบริการและเพิ่ม visibility",
        coverageArea: "Thailand",
        score: 80,
      },
    }),
    // Accommodations (ที่พัก)
    prisma.partner.upsert({
      where: { slug: "pullman-raja-orchid" },
      update: {
        name: "โรงแรมพูลแมน ขอนแก่น ราชา ออคิด",
        type: PartnerType.TRAVEL,
        channel: "โรงแรมและรีสอร์ท",
        summary: "โรงแรมหรูระดับ 5 ดาว ใจกลางเมืองขอนแก่น (ภาคอีสาน) พร้อมศูนย์สปาระดับพรีเมียม",
        coverageArea: "ขอนแก่น (ภาคอีสาน)",
        score: 95,
      },
      create: {
        slug: "pullman-raja-orchid",
        name: "โรงแรมพูลแมน ขอนแก่น ราชา ออคิด",
        type: PartnerType.TRAVEL,
        channel: "โรงแรมและรีสอร์ท",
        summary: "โรงแรมหรูระดับ 5 ดาว ใจกลางเมืองขอนแก่น (ภาคอีสาน) พร้อมศูนย์สปาระดับพรีเมียม",
        coverageArea: "ขอนแก่น (ภาคอีสาน)",
        score: 95,
      },
    }),
    prisma.partner.upsert({
      where: { slug: "baan-sila-homestay" },
      update: {
        name: "โฮมสเตย์ชุมชนบ้านศิลา",
        type: PartnerType.SUPPLIER,
        channel: "โฮมสเตย์",
        summary: "สัมผัสวิถีชีวิตดั้งเดิมของชาวอีสาน อาหารพื้นบ้านปรับสมดุล และการพำนักแบบสโลว์ไลฟ์",
        coverageArea: "ขอนแก่น (ภาคอีสาน)",
        score: 88,
      },
      create: {
        slug: "baan-sila-homestay",
        name: "โฮมสเตย์ชุมชนบ้านศิลา",
        type: PartnerType.SUPPLIER,
        channel: "โฮมสเตย์",
        summary: "สัมผัสวิถีชีวิตดั้งเดิมของชาวอีสาน อาหารพื้นบ้านปรับสมดุล และการพำนักแบบสโลว์ไลฟ์",
        coverageArea: "ขอนแก่น (ภาคอีสาน)",
        score: 88,
      },
    }),
    // Transports (การเดินทาง)
    prisma.partner.upsert({
      where: { slug: "khonkaen-carrent" },
      update: {
        name: "บริการรถเช่าท่องเที่ยวอีสาน (E-san Car Rent)",
        type: PartnerType.TRAVEL,
        channel: "บริการรถเช่า",
        summary: "บริการรถยนต์และรถตู้ให้เช่าพร้อมคนขับนำเที่ยวเส้นทางสุขภาพทั่วภาคอีสาน",
        coverageArea: "ทั่วภาคอีสาน",
        score: 90,
      },
      create: {
        slug: "khonkaen-carrent",
        name: "บริการรถเช่าท่องเที่ยวอีสาน (E-san Car Rent)",
        type: PartnerType.TRAVEL,
        channel: "บริการรถเช่า",
        summary: "บริการรถยนต์และรถตู้ให้เช่าพร้อมคนขับนำเที่ยวเส้นทางสุขภาพทั่วภาคอีสาน",
        coverageArea: "ทั่วภาคอีสาน",
        score: 90,
      },
    }),
    prisma.partner.upsert({
      where: { slug: "khonkaen-citybus" },
      update: {
        name: "ตารางรถโดยสารท่องเที่ยวภาคอีสาน (E-san Travel Bus)",
        type: PartnerType.TRAVEL,
        channel: "ตารางเวลาเดินรถ",
        summary: "บริการรถโดยสารอัจฉริยะในเส้นทางท่องเที่ยวหลักภาคอีสาน มีระบบ Wifi และ GPS เช็คตำแหน่งได้แบบเรียลไทม์",
        coverageArea: "เส้นทางท่องเที่ยวหลักในภาคอีสาน",
        score: 85,
      },
      create: {
        slug: "khonkaen-citybus",
        name: "ตารางรถโดยสารท่องเที่ยวภาคอีสาน (E-san Travel Bus)",
        type: PartnerType.TRAVEL,
        channel: "ตารางเวลาเดินรถ",
        summary: "บริการรถโดยสารอัจฉริยะในเส้นทางท่องเที่ยวหลักภาคอีสาน มีระบบ Wifi และ GPS เช็คตำแหน่งได้แบบเรียลไทม์",
        coverageArea: "เส้นทางท่องเที่ยวหลักในภาคอีสาน",
        score: 85,
      },
    }),
  ]);
}

async function seedRoutePlans(merchantId: string) {
  const plans = [
    {
      slug: "nature-healing-loop",
      title: "ธรรมชาติฮีลใจ",
      subtitle: "Nature Rebalance Loop",
      durationDays: 2,
      focus: "Stress relief",
      summary: "เส้นทางป่า น้ำตก และสปาชุมชนสำหรับรีเซ็ตร่างกาย",
      startingPoint: "สนามบินขอนแก่น",
      endingPoint: "ภูผาม่าน",
      tags: ["nature", "spa", "mindfulness"],
      stops: [
        {
          name: "อุทยานแห่งชาติน้ำพอง",
          category: "Nature",
          durationMinutes: 120,
          notes: "เดินเส้นทางศึกษาธรรมชาติสั้นๆ และฝึกทำสมาธิท่ามกลางเสียงป่า",
          sortOrder: 1,
        },
        {
          name: "Sabaidee Isan Spa",
          category: "Spa",
          durationMinutes: 90,
          notes: "ผ่อนคลายกล้ามเนื้อด้วยท่านวดเฉพาะบุคคล ร่วมกับลูกประคบสมุนไพรสด",
          sortOrder: 2,
        },
        {
          name: "ลานชมวิวภูผาม่าน",
          category: "Wellness Spot",
          durationMinutes: 75,
          notes: "ชมฝูงค้างคาวบินออกจากถ้ำยามเย็น และจิบชาสมุนไพรอุ่นๆ ปล่อยใจฟื้นฟู",
          sortOrder: 3,
        },
      ],
    },
    {
      slug: "stress-escape-spa-retreat",
      title: "Stress Escape: Nature & Spa",
      subtitle: "City Detox Program",
      durationDays: 2,
      focus: "Urban recovery",
      summary: "ดีท็อกซ์ความเครียดสะสมด้วยสปาบำบัด อาหารสุขภาพ และคอร์สโยคะยืดเหยียด",
      startingPoint: "ตัวเมืองขอนแก่น",
      endingPoint: "ตัวเมืองขอนแก่น",
      tags: ["spa", "food", "yoga"],
      stops: [
        {
          name: "Morning Mobility Studio",
          category: "Fitness & Yoga",
          durationMinutes: 60,
          notes: "โยคะตอนเช้าเพื่อฟื้นฟูข้อต่อและเพิ่มความกระปรี้กระเปร่า",
          sortOrder: 1,
        },
        {
          name: "Clean Isan Kitchen",
          category: "Food",
          durationMinutes: 90,
          notes: "เมนูผักพื้นบ้านออร์แกนิก ปรุงแบบลดโซเดียมและไขมันอิ่มตัว",
          sortOrder: 2,
        },
        {
          name: "Sabaidee Isan Spa (Aroma Treatment)",
          category: "Spa",
          durationMinutes: 120,
          notes: "สปาน้ำมันหอมระเหยสกัดจากรำข้าวหอมมะลิ บำบัดอาการนอนไม่หลับ",
          sortOrder: 3,
        },
      ],
    },
    {
      slug: "isan-spa-ritual",
      title: "Isan Spa Ritual",
      subtitle: "สมุนไพรพื้นถิ่นและเสียงพิณบำบัด",
      durationDays: 1,
      focus: "Personalized Massage",
      summary: "คอร์สบำบัดพิเศษครึ่งวัน ผสมผสานเสียงดนตรีบำบัดของพิณอีสานและสมุนไพรสดสูตรเฉพาะบุคคล",
      startingPoint: "ตัวเมืองขอนแก่น",
      endingPoint: "ตัวเมืองขอนแก่น",
      tags: ["spa", "music", "herbs"],
      stops: [
        {
          name: "สปาเสียงดนตรีบำบัด (Phin Sound Healing)",
          category: "Therapy",
          durationMinutes: 45,
          notes: "คลื่นเสียงความถี่ต่ำจากเครื่องดนตรีพิณ ช่วยปรับคลื่นสมองให้เข้าสู่ภาวะผ่อนคลายลึก",
          sortOrder: 1,
        },
        {
          name: "Sabaidee Isan Spa (Therapeutic)",
          category: "Spa & Massage",
          durationMinutes: 90,
          notes: "บำบัดจุดปวดเมื่อยด้วยน้ำมันสมุนไพรอุ่นสูตรไพล-ตะไคร้สะกิดเส้น",
          sortOrder: 2,
        },
      ],
    },
    {
      slug: "baan-phai-wellness",
      title: "ตะลุยบ้านไผ่",
      subtitle: "Community Wellness Journey",
      durationDays: 1,
      focus: "Community Learning",
      summary: "เส้นทางท่องเที่ยววิถีชุมชนที่อำเภอบ้านไผ่ เรียนรู้การปลูกสมุนไพร และการอบสมุนไพรสูตรโบราณ",
      startingPoint: "สถานีรถไฟขอนแก่น",
      endingPoint: "บ้านไผ่",
      tags: ["community", "herbal-steam", "local-food"],
      stops: [
        {
          name: "วิสาหกิจชุมชนสมุนไพรบ้านไผ่",
          category: "Learning Center",
          durationMinutes: 120,
          notes: "เก็บสมุนไพรสดในสวนออร์แกนิกและทดลองจัดทำลูกประคบทำมือ",
          sortOrder: 1,
        },
        {
          name: "โรงอบสมุนไพรโบราณวัดหลวง",
          category: "Herbal Steam",
          durationMinutes: 60,
          notes: "อบตัวบำบัดด้วยสมุนไพรอีสาน 9 ชนิด ช่วยขับสารพิษและกระตุ้นการไหลเวียนโลหิต",
          sortOrder: 2,
        },
        {
          name: "สำรับสุขภาพบ้านไผ่",
          category: "Food",
          durationMinutes: 90,
          notes: "ทานเมนูต้มส้มสมุนไพรและก้อยผักหวานป่าเพื่อปรับธาตุร่างกายตามฤดูกาล",
          sortOrder: 3,
        },
      ],
    },
  ];

  for (const plan of plans) {
    const routePlan = await prisma.routePlan.upsert({
      where: { slug: plan.slug },
      update: {
        merchantId,
        title: plan.title,
        subtitle: plan.subtitle,
        durationDays: plan.durationDays,
        focus: plan.focus,
        summary: plan.summary,
        startingPoint: plan.startingPoint,
        endingPoint: plan.endingPoint,
        tags: plan.tags,
      },
      create: {
        slug: plan.slug,
        merchantId,
        title: plan.title,
        subtitle: plan.subtitle,
        durationDays: plan.durationDays,
        focus: plan.focus,
        summary: plan.summary,
        startingPoint: plan.startingPoint,
        endingPoint: plan.endingPoint,
        tags: plan.tags,
      },
    });

    await prisma.routeStop.deleteMany({ where: { routePlanId: routePlan.id } });
    await prisma.routeStop.createMany({
      data: plan.stops.map((stop) => ({ ...stop, routePlanId: routePlan.id })),
    });
  }
}

async function seedDemand(merchantId: string) {
  await prisma.demandRecord.deleteMany({ where: { merchantId } });

  const rows: Prisma.DemandRecordCreateManyInput[] = [];
  for (let i = 30; i >= 1; i -= 1) {
    const base = 24;
    const seasonality = Math.sin(i / 6) * 4;
    const trend = (30 - i) * 0.18;
    rows.push({
      merchantId,
      recordDate: daysAgo(i),
      bookings: Math.round(base + seasonality + trend),
      avgTicket: 760 + Math.round((Math.cos(i / 5) + 1) * 35),
      costIndex: 1 + Math.round((Math.sin(i / 8) + 1) * 10) / 100,
    });
  }

  await prisma.demandRecord.createMany({ data: rows });
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@wellness.local";
  const password = process.env.ADMIN_PASSWORD || "Admin1234!";

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Wellness Platform Admin",
      role: AdminRole.ADMIN,
      isActive: true,
      passwordHash: hashPassword(password),
    },
    create: {
      email,
      name: "Wellness Platform Admin",
      role: AdminRole.ADMIN,
      isActive: true,
      passwordHash: hashPassword(password),
    },
  });
}

async function main() {
  const { merchant, travelerMerchant } = await seedMerchants();
  await seedIngredients(merchant.id);
  await seedIngredients(travelerMerchant.id);
  await seedPartners();
  await seedRoutePlans(merchant.id);
  await seedDemand(merchant.id);
  await seedDemand(travelerMerchant.id);
  await seedAdminUser();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
