"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const typeOpts = [
  { id: "pbs",   label: "পল্লী বিদ্যুৎ"         },
  { id: "bpdb",  label: "বিদ্যুৎ উন্নয়ন বোর্ড"  },
  { id: "desco", label: "DESCO"                   },
  { id: "other", label: "অন্যান্য"                },
];
const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

const typeBadge: Record<string, string> = {
  pbs:   "bg-yellow-50 text-yellow-700",
  bpdb:  "bg-blue-50 text-blue-700",
  desco: "bg-purple-50 text-purple-700",
  other: "bg-gray-100 text-gray-600",
};

interface ElectricityOffice {
  id: string; name: string; type: string; upazilaId: string;
  address: string; phone: string; phone2: string;
  hours: string; complaintNumber: string; isVerified: boolean;
}

function ElectricityInner() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<ElectricityOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");
  const [upazila, setUpazila] = useState(searchParams.get("upazila") ?? "");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "electricity_offices"), orderBy("name")));
        setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as ElectricityOffice)));
      } catch {
        try {
          const snap = await getDocs(collection(db, "electricity_offices"));
          setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as ElectricityOffice)));
        } catch { setAll([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = all.filter(e =>
    (!search  || e.name.toLowerCase().includes(search.toLowerCase()) || e.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type    || e.type === type) &&
    (!upazila || e.upazilaId === upazila)
  );

  return (
    <ServicePageLayout title="বিদ্যুৎ অফিস" subtitle="টাঙ্গাইল জেলার বিদ্যুৎ সেবার অফিসগুলোর তথ্য" emoji="⚡" accentColor="bg-amber-600">

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: "বিদ্যুৎ বিল পরিশোধ", url: "https://prepaid.bpdb.gov.bd", color: "bg-blue-600" },
          { label: "নতুন সংযোগ আবেদন",   url: "https://newconn.bpdb.gov.bd", color: "bg-green-600" },
          { label: "অভিযোগ: 16999",       url: "tel:16999",                    color: "bg-red-600"  },
        ].map(q => (
          <a key={q.label} href={q.url} target={q.url.startsWith("tel") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className={`${q.color} text-white text-sm font-bold px-4 py-3 rounded-xl flex items-center justify-between hover:opacity-90 transition-opacity`}>
            {q.label}
            {!q.url.startsWith("tel") && <ExternalLink size={14} />}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="অফিসের নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">ধরন</p>
        <FilterChips options={typeOpts} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>
      <div className="mb-5">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">উপজেলা</p>
        <FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-32 border border-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">⚡</p>
          <p>কোনো বিদ্যুৎ অফিস পাওয়া যায়নি।</p>
          <p className="text-sm mt-1">অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি অফিস পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(e => {
              const uName = UPAZILAS.find(u => u.id === e.upazilaId)?.name ?? e.upazilaId;
              return (
                <div key={e.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-800 text-sm">{e.name}</h3>
                        {e.isVerified && <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓</span>}
                      </div>
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${typeBadge[e.type] ?? "bg-gray-100 text-gray-600"}`}>
                        {typeOpts.find(t => t.id === e.type)?.label ?? e.type} — {uName}
                      </span>
                      {e.address && (
                        <div className="flex items-start gap-1 text-xs text-gray-500">
                          <MapPin size={11} className="mt-0.5 flex-shrink-0" />{e.address}
                        </div>
                      )}
                      {e.hours && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Clock size={11} />{e.hours}
                        </div>
                      )}
                      {e.complaintNumber && (
                        <div className="text-xs text-amber-700 font-semibold mt-1">
                          অভিযোগ: {e.complaintNumber}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {e.phone && (
                      <a href={`tel:${e.phone}`}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                        <Phone size={12} /> {e.phone}
                      </a>
                    )}
                    {e.phone2 && (
                      <a href={`tel:${e.phone2}`}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                        <Phone size={12} /> {e.phone2}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}

export default function ElectricityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ElectricityInner />
    </Suspense>
  );
}
