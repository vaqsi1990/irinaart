"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="admin-main">{children}</main>;
  }

  return (
    <div className="admin-layout">
      <main className="admin-main">{children}</main>
      <div className="admin-sidebar-wrap">
        <AdminSidebar />
      </div>
    </div>
  );
}
