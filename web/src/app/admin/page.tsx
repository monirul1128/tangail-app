"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Hospital, Stethoscope, Ambulance, Droplets, Newspaper,
  Phone, Pill, GraduationCap, Briefcase, Bus, Banknote,
  Wrench, Users, MapPin, Image, ShoppingBag, TrendingUp,
  ArrowRight, RefreshCw,
} from "lucide-react";

interface StatCard {
  label: string;
  collection: string;
  icon: React.ElementType;
  color: string;
  href: string;
}

const statCards: StatCard[] = [
  { label: "হাসপাতাল",         collection: "hospitals",          icon: Hospital,       color: "bg-blue-500",    href: "/admin/hospitals"         },
  { label: "ডাক্তার",          collection: "doctors",            icon: Stethoscope,    color: "bg-purple-500",  href: "/admin/doctors"           },
  { label: "অ্যাম্বুলেন্স",    collection: "ambulances",         icon: Ambulance,      color: "bg-amber-500",   href: "/admin/ambulances"        },
  { label: "রক্তদাতা",         collection: "blood_donors",       icon: Droplets,       color: "bg-red-500",     href: "/admin/blood-donors"      },
  { label: "খবর",              collection: "news",               icon: Newspaper,      color: "bg-green-500",   href: "/admin/news"              },
  { label: "জরুরি নম্বর",      collection: "emergency_contacts", icon: Phone,          color: "bg-rose-500",    href: "/admin/emergency"         },
  { label: "ফার্মেসি",         collection: "pharmacies",         icon: Pill,           color: "bg-teal-500",    href: "/admin/pharmacy"          },
  { label: "শিক্ষা প্রতিষ্ঠান",collection: "education",          icon: GraduationCap,  color: "bg-indigo-500",  href: "/admin/education"         },
  { label: "চাকরি",            collection: "jobs",               icon: Briefcase,      color: "bg-violet-500",  href: "/admin/jobs"              },
  { label: "পরিবহন",           collection: "transport",          icon: Bus,            color: "bg-orange-500",  href: "/admin/transport"         },
  { label: "আর্থিক সেবা",      collection: "finance",            icon: Banknote,       color: "bg-cyan-500",    href: "/admin/finance"           },
  { label: "পেশাদার সেবা",     collection: "professionals",      icon: Wrench,         color: "bg-slate-500",   href: "/admin/professionals"     },
  { label: "সংগঠন",            collection: "organizations",      icon: Users,          color: "bg-emerald-500", href: "/admin/organizations"     },
  { label: "পর্যটন",           collection: "tourism",            icon: MapPin,         color: "bg-sky-500",     href: "/admin/tourism"           },
  { label: "গ্যালারি",          collection: "gallery",            icon: Image,          color: "bg-pink-500",    href: "/admin/gallery"           },
  { label: "ব্যবসা আবেদন",     collection: "business_requests",  icon: ShoppingBag,    color: "bg-lime-600",    href: "/admin/business-requests" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCounts = async () => {
    setRefreshing(true);
    const results: Record<string, number> = {};
    await Promise.all(
      statCards.map(async (card) => {
        try {
          const snap = await getCountFromServer(collection(db, card.collection));
          results[card.collection] = snap.data().count;
        } catch {
          results[card.collection] = 0;
        }
      })
    );
    setCounts(results);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { loadCounts(); }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#1a2332] to-primary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">স্বাগতম, Admin 👋</h2>
            <p className="text-white/70 text-sm">আমাদের টাঙ্গাইল — কন্টেন্ট ম্যানেজমেন্ট সিস্টেম</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-3xl font-black">{loading ? "..." : total.toLocaleString()}</div>
            <div className="text-white/60 text-xs">মোট এন্ট্রি</div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "হাসপাতাল",  val: counts["hospitals"]    ?? 0 },
            { label: "ডাক্তার",   val: counts["doctors"]      ?? 0 },
            { label: "রক্তদাতা",  val: counts["blood_donors"] ?? 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{loading ? "—" : s.val}</div>
              <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-700 text-base">সকল কালেকশন</h3>
        <button
          onClick={loadCounts}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          রিফ্রেশ
        </button>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const count = counts[card.collection] ?? 0;
          return (
            <Link
              key={card.collection}
              href={card.href}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="text-2xl font-black text-gray-800 mb-0.5">
                {loading ? <div className="h-7 w-12 bg-gray-100 rounded animate-pulse" /> : count}
              </div>
              <div className="text-xs text-gray-500 font-medium">{card.label}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          দ্রুত কাজ করুন
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "নতুন হাসপাতাল যোগ করুন", href: "/admin/hospitals?action=new", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
            { label: "নতুন খবর প্রকাশ করুন",    href: "/admin/news?action=new",      color: "bg-green-50 text-green-700 hover:bg-green-100" },
            { label: "ব্যবসা আবেদন দেখুন",       href: "/admin/business-requests",    color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className={`${q.color} rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between transition-colors`}
            >
              {q.label}
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
