"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search, PlusCircle } from "lucide-react";
import { BUSINESS_CATEGORIES, UPAZILAS } from "@/lib/constants";
import Link from "next/link";

const typeFilters = Object.entries(BUSINESS_CATEGORIES).map(([id, label]) => ({ id, label }));

const typeBadgeColor: Record<string, string> = {
  hotel:       "bg-indigo-50 text-indigo-700",
  restaurant:  "bg-orange-50 text-orange-700",
  beauty:      "bg-pink-50 text-pink-700",
  nursery:     "bg-green-50 text-green-700",
  agriculture: "bg-lime-50 text-lime-700",
  shop:        "bg-rose-50 text-rose-700",
  other:       "bg-gray-100 text-gray-600",
};

export default function BusinessPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");

  useEffect(() => {
    getDocs(query(collection(db, "businesses"), where("isVerified", "==", true), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          const uName = UPAZILAS.find(u => u.id === x.upazilaId)?.name ?? x.upazilaId ?? "";
          return {
            id: d.id, name: x.name,
            subtitle: BUSINESS_CATEGORIES[x.category] ?? x.category,
            address: `${x.address}${uName ? `, ${uName}` : ""}`,
            phone: x.phone,
            verified: x.isVerified,
            badge: x.category,
            badgeColor: typeBadgeColor[x.category] ?? "bg-gray-100 text-gray-600",
            extra: x.description ?? "",
          } as ServiceItem;
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(b =>
    (!search || b.name.toLowerCase().includes(search.toLowerCase()) || b.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type   || b.badge === type)
  );

  return (
    <ServicePageLayout title="ব্যবসা ও বাণিজ্য" subtitle="টাঙ্গাইল জেলার ব্যবসা প্রতিষ্ঠান ও সেবা" emoji="🏪" accentColor="bg-orange-600">
      {/* Add business CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between mb-5">
        <div>
          <p className="font-bold text-orange-800 text-sm">আপনার ব্যবসা যোগ করুন</p>
          <p className="text-xs text-orange-600 mt-0.5">সম্পূর্ণ বিনামূল্যে</p>
        </div>
        <Link href="/register-business" className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
          <PlusCircle size={13} /> যোগ করুন
        </Link>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ব্যবসার নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5">
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি ব্যবসা পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(b => <ServiceCard key={b.id} item={b} accentColor="text-orange-600" />)}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-16 text-gray-400">
                কোনো ব্যবসা পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।
              </div>
            )}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
