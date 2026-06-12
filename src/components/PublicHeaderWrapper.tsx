"use client";

import { usePathname } from "next/navigation";

export default function PublicHeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide public navigation/header components when inside dashboard, form, or try routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/form") ||
    pathname.startsWith("/try")
  ) {
    return null;
  }

  return <>{children}</>;
}
