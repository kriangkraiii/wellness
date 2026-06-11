import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/modules/auth/password";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/modules/auth/session";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
  redirectTo: z.string().optional(),
});

function sanitizeRedirect(redirectTo?: string): string {
  if (
    redirectTo &&
    (redirectTo.startsWith("/admin") || redirectTo.startsWith("/merchant"))
  ) {
    return redirectTo;
  }

  return "/admin";
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = loginSchema.parse(payload);

    const user = await prisma.adminUser.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    if (!user || !user.isActive || !verifyPassword(input.password, user.passwordHash)) {
      return NextResponse.json(
        { ok: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 },
      );
    }

    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      redirectTo: sanitizeRedirect(input.redirectTo),
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

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
