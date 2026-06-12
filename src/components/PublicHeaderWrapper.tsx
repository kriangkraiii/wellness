"use client";

import { usePathname } from "next/navigation";

export default function PublicHeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide public navigation/header components when inside dashboard or form routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/form")) {
    return null;
  }

  return <>{children}</>;
}
