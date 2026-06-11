import { CustomerForm } from "./customer-form";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function CustomerFormPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login?next=/form/customer");
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  return <CustomerForm initialName={user?.name || ""} />;
}

