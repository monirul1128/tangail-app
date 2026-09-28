import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: { default: "Admin Panel — আমাদের টাঙ্গাইল", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AdminAuthProvider>
  );
}
