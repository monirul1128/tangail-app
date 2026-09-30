"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Phone, MapPin } from "lucide-react";
import { ORGANIZATION_TYPES } from "@/lib/constants";

const typeFilters = Object.entries(ORGANIZATION_TYPES).map(([id, label]) => ({ id, label }));

const typeBadge: Record<string, string> = {
  govt:     "bg-blue-50 text-blue-700",
  ngo:      "bg-green-50 text-green-700",
  business: "bg-amber-50 text-amber-700",
  cultural: "bg-purple-50 text-purple-700",
  sports:   "bg-orange-50 text-orange-700",
  social:   "bg-pink-50 text-pink-700",
  service:  "bg-red-50 text-red-700",
};

interface Org { id:string; name:string; type:string; description:string; address:string; phone:string; email:string; isVerified:boolean; }

export default function OrganizationsPage() {
  const [all, setAll]         = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "organizations"), orderBy("name")))
      .then(snap => setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as Org))))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(o =>
    (!search || o.name.toLowerCase().includes(search.toLowerCase()) || o.description?.toLowerCase().includes(search.toLowerCase())) &&
    (!type   || o.type === type)
  );

  return (
    <ServicePageLayout title="সংগঠন ও সম্প্রদায়" subtitle="টাঙ্গাইল জেলার সংগঠন, প্রতিষ্ঠান ও এনজিও" emoji="🤝" accentColor="bg-emerald-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="সংগঠনের নাম..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5">
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-24 border border-gray-100" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সংগঠন পাওয়া গেছে</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">কোনো সংগঠন পাওয়া যায়নি। অ্যাডমিন প্যানেল থেকে যোগ করুন।</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(o => (
                <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🤝</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h3 className="font-bold text-gray-800 text-sm">{o.name}</h3>
                        {o.isVerified && <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓ ভেরিফাইড</span>}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[o.type] ?? ""}`}>
                        {ORGANIZATION_TYPES[o.type] ?? o.type}
                      </span>
                      {o.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{o.description}</p>}
                      {o.address && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <MapPin size={10} />{o.address}
                        </div>
                      )}
                    </div>
                  </div>
                  {o.phone && (
                    <a href={`tel:${o.phone}`} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit mt-2 transition-colors">
                      <Phone size={12} /> {o.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </ServicePageLayout>
  );
}
