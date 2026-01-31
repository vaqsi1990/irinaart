"use client";

import { usePathname } from "next/navigation";
import TransitionProvider from "@/providers/TransitionProvider";

export default function ConditionalTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return <TransitionProvider>{children}</TransitionProvider>;
}
