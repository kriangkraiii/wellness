import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/modules/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/modules/auth/session";

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = registerSchema.parse(payload);
    const adminUserClient = (
      prisma as unknown as {
        adminUser: {
          create: (args: unknown) => Promise<{
            id: string;
            email: string;
            role: "ADMIN" | "USER";
          }>;
        };
      }
    ).adminUser;

    const created = await adminUserClient.create({
      data: {
        name: input.name,
        email: input.email.toLowerCase().trim(),
        role: "ADMIN",
        isActive: true,
        passwordHash: hashPassword(input.password),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const token = createSessionToken({
      userId: created.id,
      email: created.email,
      role: created.role,
    });

    const response = NextResponse.json({
      ok: true,
      redirectTo: "/admin",
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
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
