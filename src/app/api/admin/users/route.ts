import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/modules/auth/password";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/modules/auth/session";

const createAdminSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

const adminUserClient = (
  prisma as unknown as Record<string, unknown>
)["adminUser"] as {
  findMany: (args: unknown) => Promise<
    Array<{
      id: string;
      email: string;
      name: string;
      role: "ADMIN" | "USER";
      isActive: boolean;
      createdAt: Date;
    }>
  >;
  create: (args: unknown) => Promise<{
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
    isActive: boolean;
    createdAt: Date;
  }>;
};

async function getSessionFromRequest() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  const session = await getSessionFromRequest();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const users = await adminUserClient.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, data: users });
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const input = createAdminSchema.parse(payload);

    if (input.role === "ADMIN" && session.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "เฉพาะ ADMIN เท่านั้นที่สร้าง ADMIN ได้" },
        { status: 403 },
      );
    }

    const created = await adminUserClient.create({
      data: {
        email: input.email.toLowerCase().trim(),
        name: input.name.trim(),
        role: input.role,
        isActive: true,
        passwordHash: hashPassword(input.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "ข้อมูลไม่ถูกต้อง", issues: error.issues },
        { status: 400 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { ok: false, message: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
