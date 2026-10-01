"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";

const typeFilters = [
  { id: "school",     label: "স্কুল"          },
  { id: "college",    label: "কলেজ"           },
  { id: "university", label: "বিশ্ববিদ্যালয়"  },
  { id: "madrasa",    label: "মাদ্রাসা"        },
  { id: "coaching",   label: "কোচিং সেন্টার"  },
  { id: "tuition",    label: "টিউশন সেবা"     },
  { id: "library",    label: "লাইব্রেরি"       },
  { id: "training",   label: "ট্রেনিং সেন্টার" },
  { id: "result",     label: "রেজাল্ট"         },
];
const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

const badgeColors: Record<string, string> = {
  school:     "bg-blue-50 text-blue-700",
  college:    "bg-purple-50 text-purple-700",
  university: "bg-red-50 text-red-700",
  madrasa:    "bg-green-50 text-green-700",
  coaching:   "bg-sky-50 text-sky-700",
  tuition:    "bg-indigo-50 text-indigo-700",
  library:    "bg-teal-50 text-teal-700",
  training:   "bg-amber-50 text-amber-700",
  result:     "bg-teal-50 text-teal-700",
};

export default function EducationPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");
  const [upazila, setUpazila] = useState(searchParams.get("upazila") ?? "");

  useEffect(() => {
    getDocs(query(collection(db, "education"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          return {
            id: d.id, name: x.name,
            subtitle: x.principalName ?? x.nameEn ?? "",
            address: x.address, phone: x.phone ?? "",
            verified: x.isVerified,
            badge: x.type,
            badgeColor: badgeColors[x.type] ?? "bg-gray-100 text-gray-600",
            extra: x.isGovt ? "সরকারি প্রতিষ্ঠান" : "",
            _upazilaId: x.upazilaId,
          };
        }));
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(i =>
    (!search  || i.name.toLowerCase().includes(search.toLowerCase()) || i.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type    || i.badge === type) &&
    (!upazila || i._upazilaId === upazila)
  );

  return (
    <ServicePageLayout title="শিক্ষা প্রতিষ্ঠান" subtitle="টাঙ্গাইল জেলার শিক্ষা প্রতিষ্ঠান, কোচিং ও টিউশন সেবা" emoji="🎓" accentColor="bg-blue-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="প্রতিষ্ঠানের নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">ধরন</p>
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
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(i => <ServiceCard key={i.id} item={i} accentColor="text-blue-700" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো প্রতিষ্ঠান পাওয়া যায়নি।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
