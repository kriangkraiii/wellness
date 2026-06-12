import { CustomerForm } from "./customer-form";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { prisma } from "@/lib/prisma";

export default async function CustomerFormPage() {
  const session = await getCurrentAdminSession();
  let initialName = "";

  if (session) {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: { name: true },
    });
    initialName = user?.name || "";
  }

  const merchants = await prisma.merchant.findMany({
    where: {
      NOT: {
        slug: "guest-custom-store",
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <CustomerForm initialName={initialName} merchants={merchants} />;
}
