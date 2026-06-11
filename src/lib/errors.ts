export function toUserDbError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
  }

  if (error.message.includes("DATABASE_URL")) {
    return "ยังไม่ได้ตั้งค่า DATABASE_URL";
  }

  if (error.message.includes("Can't reach database server")) {
    return "ไม่พบ PostgreSQL server หรือยังไม่ได้เปิดบริการ";
  }

  return "ไม่สามารถเชื่อมต่อฐานข้อมูลได้";
}
