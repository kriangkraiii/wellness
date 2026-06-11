export type WellnessHighlight = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  focus: string;
  stops: number;
  accent: "brand" | "moss" | "indigo";
  href: string;
};

const highlights: WellnessHighlight[] = [
  {
    id: "nature-healing-loop",
    title: "ธรรมชาติฮีลใจ",
    subtitle: "Nature Rebalance Loop",
    duration: "2 วัน 1 คืน",
    focus: "ฟื้นพลังใจด้วยป่า น้ำ และนวดอโรมาท้องถิ่น",
    stops: 5,
    accent: "moss",
    href: "/discover/routes/nature-healing-loop",
  },
  {
    id: "isan-spa-ritual",
    title: "Isan Spa Ritual",
    subtitle: "สมุนไพรพื้นถิ่นและเสียงพิณบำบัด",
    duration: "ครึ่งวัน",
    focus: "จับคู่วัตถุดิบสปาและเทคนิคนวดเฉพาะบุคคล",
    stops: 3,
    accent: "brand",
    href: "/discover/routes/isan-spa-ritual",
  },
  {
    id: "stress-escape-city",
    title: "Stress Escape: Nature & Spa",
    subtitle: "ปล่อยความเครียดจากชีวิตเมือง",
    duration: "2 วัน 1 คืน",
    focus: "ผสานโยคะเบา เดินป่า และเมนูสุขภาพ",
    stops: 4,
    accent: "indigo",
    href: "/discover/routes/stress-escape-spa-retreat",
  },
  {
    id: "baan-phai-wellness",
    title: "ตะลุยบ้านไผ่",
    subtitle: "Community Wellness Journey",
    duration: "1 วัน",
    focus: "เรียนรู้ชุมชนสุขภาพและอาหารพื้นบ้านปรับสมดุล",
    stops: 4,
    accent: "brand",
    href: "/discover/routes/baan-phai-wellness",
  },
];

export function getHighlights(): WellnessHighlight[] {
  return highlights;
}
