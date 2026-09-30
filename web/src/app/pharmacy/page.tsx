"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";

export default function PharmacyPage() {
  const [all, setAll]         = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [upazila, setUpazila] = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "pharmacies"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          const uName = UPAZILAS.find(u => u.id === x.upazilaId)?.name ?? x.upazilaId ?? "";
          return {
            id: d.id, name: x.name, subtitle: x.ownerName ?? "",
            address: x.address, phone: x.phone, hours: x.hours,
            verified: x.isVerified,
            badge: uName, badgeColor: "bg-blue-50 text-blue-700",
            extra: x.isOpen24Hours ? "২৪ ঘণ্টা খোলা" : "",
          } as ServiceItem;
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(p =>
    (!search  || p.name.toLowerCase().includes(search.toLowerCase()) || p.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!upazila || p.badge === UPAZILAS.find(u => u.id === upazila)?.name)
  );

  const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

  return (
    <ServicePageLayout title="ফার্মেসি" subtitle={`টাঙ্গাইল জেলার ফার্মেসির তালিকা`} emoji="💊" accentColor="bg-green-600">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ফার্মেসির নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5">
        <FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি ফার্মেসি পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(p => <ServiceCard key={p.id} item={p} accentColor="text-green-600" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো ফার্মেসি পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
