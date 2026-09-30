"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";
import { PROFESSIONAL_TYPES } from "@/lib/constants";

// Teacher is also in professionals
const typeFilters = [
  ...Object.entries(PROFESSIONAL_TYPES).map(([id, label]) => ({ id, label })),
  { id: "teacher", label: "শিক্ষক" },
];

const typeBadgeColor: Record<string, string> = {
  lawyer:     "bg-red-50 text-red-700",
  journalist: "bg-blue-50 text-blue-700",
  technician: "bg-purple-50 text-purple-700",
  kazi:       "bg-pink-50 text-pink-700",
  teacher:    "bg-rose-50 text-rose-700",
  other:      "bg-gray-100 text-gray-600",
};

export default function ProfessionalsPage() {
  const [all, setAll]         = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "professionals"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          const typeName = PROFESSIONAL_TYPES[x.type] ?? (x.type === "teacher" ? "শিক্ষক" : x.type);
          return {
            id: d.id, name: x.name, subtitle: x.specialization ?? typeName,
            address: x.address, phone: x.phone ?? "", hours: x.hours ?? "",
            verified: x.isVerified,
            badge: x.type,
            badgeColor: typeBadgeColor[x.type] ?? "bg-gray-100 text-gray-600",
            extra: x.experience ? `অভিজ্ঞতা: ${x.experience}` : "",
          } as ServiceItem;
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.subtitle?.toLowerCase().includes(search.toLowerCase())) &&
    (!type   || p.badge === type)
  );

  return (
    <ServicePageLayout title="পেশাদার সেবা" subtitle="টাঙ্গাইল জেলার আইনজীবী, সাংবাদিক, শিক্ষক ও অন্যান্য" emoji="🔧" accentColor="bg-indigo-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="নাম বা পেশা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5">
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব পেশা" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}জন পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(p => <ServiceCard key={p.id} item={p} accentColor="text-indigo-700" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কেউ পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
