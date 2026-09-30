"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";
import { FINANCE_TYPES } from "@/lib/constants";

const typeFilters = Object.entries(FINANCE_TYPES).map(([id, label]) => ({ id, label }));

const typeBadgeColor: Record<string, string> = {
  bank:           "bg-blue-50 text-blue-700",
  atm:            "bg-green-50 text-green-700",
  mobile_banking: "bg-pink-50 text-pink-700",
  market:         "bg-amber-50 text-amber-700",
};

export default function FinancePage() {
  const [all, setAll]         = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "finance"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          return {
            id: d.id, name: x.name,
            subtitle: x.isGovt ? "সরকারি" : FINANCE_TYPES[x.type] ?? x.type,
            address: x.address, phone: x.phone ?? "", hours: x.hours ?? "",
            verified: x.isVerified,
            badge: x.type,
            badgeColor: typeBadgeColor[x.type] ?? "bg-gray-100 text-gray-600",
          } as ServiceItem;
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(f =>
    (!search || f.name.toLowerCase().includes(search.toLowerCase()) || f.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type   || f.badge === type)
  );

  return (
    <ServicePageLayout title="আর্থিক সেবা" subtitle="টাঙ্গাইল জেলার ব্যাংক, এটিএম ও আর্থিক সেবা" emoji="🏦" accentColor="bg-teal-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ব্যাংক বা সেবার নাম..." className="flex-1 outline-none text-sm bg-transparent" />
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
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সেবা পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(f => <ServiceCard key={f.id} item={f} accentColor="text-teal-700" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো সেবা পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
