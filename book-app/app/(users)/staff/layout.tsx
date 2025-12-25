"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const active = (path: string) =>
    pathname === path ? "bg-blue-600 text-white" : "";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 space-y-2">
        <Link
          href="/staff/medical-list"
          className={`block p-2 rounded ${active("/staff/medical-list")}`}
        >
          Danh sách phiếu khám
        </Link>

        <Link
          href="/staff/profile"
          className={`block p-2 rounded ${active("/staff/profile")}`}
        >
          Quản lý thông tin
        </Link>
      </aside>

      {/* Nội dung trang tương ứng */}
      <main className="flex-1 p-5 bg-white">{children}</main>
    </div>
  );
}
