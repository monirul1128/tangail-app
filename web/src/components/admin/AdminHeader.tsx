"use client";
import { Menu, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "./AdminAuthProvider";

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function AdminHeader({ title, onMenuClick }: Props) {
  const { user } = useAdminAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <h1 className="font-bold text-gray-800 text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">সাইট দেখুন</span>
        </Link>
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">A</span>
          </div>
          <span className="text-xs text-gray-600 hidden sm:inline font-medium">
            {user?.email?.split("@")[0] ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
