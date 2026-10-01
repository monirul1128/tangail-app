"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Phone } from "lucide-react";
import { TRANSPORT_TYPES, UPAZILAS } from "@/lib/constants";

const typeFilters = Object.entries(TRANSPORT_TYPES).map(([id, label]) => ({ id, label }));
const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

const typeBadgeColor: Record<string, string> = {
  bus:     "bg-blue-50 text-blue-700",
  train:   "bg-red-50 text-red-700",
  rentcar: "bg-green-50 text-green-700",
  cng:     "bg-teal-50 text-teal-700",
  fuel:    "bg-orange-50 text-orange-700",
  courier: "bg-amber-50 text-amber-700",
};

export default function TransportPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");
  const [upazila, setUpazila] = useState(searchParams.get("upazila") ?? "");

  useEffect(() => {
    getDocs(query(collection(db, "transport"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          return {
            id: d.id, name: x.name,
            subtitle: x.route ?? TRANSPORT_TYPES[x.type] ?? x.type,
            address: x.address, phone: x.phone, hours: x.hours,
            verified: x.isVerified,
            badge: x.type,
            badgeColor: typeBadgeColor[x.type] ?? "bg-gray-100 text-gray-600",
            _upazilaId: x.upazilaId,
          };
        }));
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(t =>
    (!search  || t.name.toLowerCase().includes(search.toLowerCase()) || t.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type    || t.badge === type) &&
    (!upazila || t._upazilaId === upazila)
  );

  return (
    <ServicePageLayout title="পরিবহন সেবা" subtitle="টাঙ্গাইল জেলার যোগাযোগ ও পরিবহন সেবা" emoji="🚌" accentColor="bg-amber-600">
      <a href="tel:999" className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Phone size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-red-700 text-sm">জরুরি: জাতীয় সেবা নম্বর</p>
          <p className="text-red-500 text-xs">যেকোনো জরুরি পরিস্থিতিতে কল করুন</p>
        </div>
        <span className="font-black text-red-700 text-2xl">৯৯৯</span>
      </a>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="পরিবহন সেবার নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">সেবার ধরন</p>
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>
      <div className="mb-5">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">উপজেলা</p>
        <FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সেবা পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(t => <ServiceCard key={t.id} item={t} accentColor="text-amber-600" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো সেবা পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
