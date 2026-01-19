"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const active = (path: string) =>
    pathname === path ? "bg-blue-600 text-white" : "";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 space-y-2">
        <Link
          href="/doctor/appointment"
          className={`block p-2 rounded ${active("/doctor/appointment")}`}
        >
          Danh sách lịch khám
        </Link>

        

        <Link
          href="/doctor/profile"
          className={`block p-2 rounded ${active("/doctor/profile")}`}
        >
          Quản lý hồ sơ
        </Link>

      </aside>

      <main className="flex-1 p-5 bg-white">{children}</main>
    </div>
  );
}
