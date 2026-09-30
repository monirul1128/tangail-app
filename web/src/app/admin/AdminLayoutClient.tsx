"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminGuard from "@/components/admin/AdminGuard";

const pageTitles: Record<string, string> = {
  "/admin":                    "ড্যাশবোর্ড",
  "/admin/hospitals":          "হাসপাতাল",
  "/admin/doctors":            "ডাক্তার",
  "/admin/ambulances":         "অ্যাম্বুলেন্স",
  "/admin/blood-donors":       "রক্তদাতা",
  "/admin/news":               "খবর ও নোটিশ",
  "/admin/emergency":          "জরুরি নম্বর",
  "/admin/pharmacy":           "ফার্মেসি",
  "/admin/education":          "শিক্ষা প্রতিষ্ঠান",
  "/admin/coaching":           "কোচিং ও টিউশন",
  "/admin/jobs":               "চাকরি বিজ্ঞাপন",
  "/admin/transport":          "পরিবহন",
  "/admin/finance":            "আর্থিক সেবা",
  "/admin/electricity":        "বিদ্যুৎ অফিস",
  "/admin/professionals":      "পেশাদার সেবা",
  "/admin/organizations":      "সংগঠন",
  "/admin/business":           "ব্যবসা ও বাণিজ্য",
  "/admin/islamic":            "মসজিদ/মন্দির",
  "/admin/tourism":            "পর্যটন",
  "/admin/gallery":            "গ্যালারি",
  "/admin/business-requests":  "ব্যবসা আবেদন",
};

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Login page — no sidebar/header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const title = pageTitles[pathname] ?? "Admin";

  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
