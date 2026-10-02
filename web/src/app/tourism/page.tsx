"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { MapPin, Clock } from "lucide-react";
import { UPAZILAS, TOURISM_CATEGORIES } from "@/lib/constants";

const typeFilters = Object.entries(TOURISM_CATEGORIES).map(([id, label]) => ({ id, label }));

const catColor: Record<string, string> = {
  historical:   "bg-amber-100 text-amber-800",
  nature:       "bg-green-100 text-green-800",
  entertainment:"bg-blue-100 text-blue-800",
  education:    "bg-purple-100 text-purple-800",
  modern:       "bg-indigo-100 text-indigo-800",
};

interface Spot { id:string; name:string; category:string; upazilaId:string; address:string; description:string; imageUrl:string; openingHours:string; entryFee:string; tips:string; }

export default function TourismPage() {
  const [all, setAll]         = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [cat, setCat]         = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "tourism"), orderBy("name")))
      .then(snap => setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as Spot))))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (!cat    || s.category === cat)
  );

  return (
    <ServicePageLayout title="পর্যটন স্থান" subtitle="টাঙ্গাইলের দর্শনীয় ও ঐতিহাসিক স্থানসমূহ" emoji="🏞️" accentColor="bg-sky-700">
      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChips options={typeFilters} selected={cat} onChange={setCat} allLabel="সব" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl animate-pulse h-64 border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">কোনো পর্যটন স্থান পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(s => {
            const upazilaName = UPAZILAS.find(u => u.id === s.upazilaId)?.name ?? s.upazilaId;
            return (
              <Link key={s.id} href={`/tourism/${s.id}`}
                className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.name} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-5xl">🏞️</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-gray-800">{s.name}</h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${catColor[s.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {TOURISM_CATEGORIES[s.category] ?? s.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                    <MapPin size={11} />{upazilaName}, টাঙ্গাইল
                  </div>
                  {s.description && <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">{s.description}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    {s.openingHours && <span className="flex items-center gap-1"><Clock size={11}/>{s.openingHours}</span>}
                    {s.entryFee && <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">{s.entryFee}</span>}
                  </div>
                  {s.tips && (
                    <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500">
                      <span className="font-bold text-gray-600">💡 </span>{s.tips}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </ServicePageLayout>
  );
}
