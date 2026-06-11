import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/modules/auth/session";

export async function getCurrentAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
