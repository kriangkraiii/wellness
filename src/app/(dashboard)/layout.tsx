import { redirect } from "next/navigation";
import { getCurrentAdminSession } from "@/modules/auth/server-session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { LanguageProvider } from "@/components/dashboard/language-context";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login?next=/dashboard");
  }

  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden bg-[#F4F6F0]">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader spaName="E-san Wellness Spa" userName={session.email} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
