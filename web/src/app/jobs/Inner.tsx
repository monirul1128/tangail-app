"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Job {
  id: string;
  title: string;
  organization: string;
  type: string;
  deadline: string;
  location: string;
  applyLink?: string;
  description?: string;
  salary?: string;
  isActive: boolean;
  publishedAt?: Timestamp | string;
}

const typeOpts = [
  { id: "govt",    label: "সরকারি"    },
  { id: "private", label: "বেসরকারি"  },
  { id: "bank",    label: "ব্যাংক"    },
  { id: "ngo",     label: "এনজিও"     },
];

const typeBadge: Record<string, string> = {
  govt:    "bg-blue-50 text-blue-700",
  private: "bg-purple-50 text-purple-700",
  bank:    "bg-green-50 text-green-700",
  ngo:     "bg-amber-50 text-amber-700",
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "jobs"), orderBy("publishedAt", "desc"))
        );
        setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
      } catch {
        // Fallback without ordering if index missing
        try {
          const snap = await getDocs(collection(db, "jobs"));
          setAll(snap.docs.map(d => ({ id: d.id, ...d.data() } as Job)));
        } catch { setAll([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = all.filter(j =>
    (!search || j.title?.toLowerCase().includes(search.toLowerCase()) ||
     j.organization?.toLowerCase().includes(search.toLowerCase())) &&
    (!type   || j.type === type)
  );

  return (
    <ServicePageLayout
      title="চাকরির বিজ্ঞাপন"
      subtitle="টাঙ্গাইল জেলার সরকারি ও বেসরকারি চাকরির তথ্য"
      emoji="💼"
      accentColor="bg-violet-700"
    >
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="পদের নাম বা প্রতিষ্ঠান..."
          className="flex-1 outline-none text-sm bg-transparent"
        />
      </div>

      <div className="mb-5">
        <FilterChips options={typeOpts} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-36 border border-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">💼</p>
          <p>কোনো বিজ্ঞাপন পাওয়া যায়নি।</p>
          <p className="text-sm mt-1">অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি বিজ্ঞাপন পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(j => (
              <div key={j.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm mb-1 leading-snug">{j.title}</h3>
                    <p className="text-xs text-violet-600 font-semibold">{j.organization}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadge[j.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {typeOpts.find(t => t.id === j.type)?.label ?? j.type}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {j.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {j.location}
                    </span>
                  )}
                  {j.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> শেষ: {j.deadline}
                    </span>
                  )}
                  {j.salary && (
                    <span className="text-green-700 font-semibold">{j.salary}</span>
                  )}
                </div>

                {j.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{j.description}</p>
                )}

                {j.applyLink ? (
                  <a
                    href={j.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold py-2 rounded-full transition-colors mt-auto"
                  >
                    আবেদন করুন <ExternalLink size={12} />
                  </a>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-500 text-xs font-semibold py-2 rounded-full text-center mt-auto">
                    সরাসরি যোগাযোগ করুন
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
