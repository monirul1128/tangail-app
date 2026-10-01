"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const catColors: Record<string, string> = {
  "politics":   "bg-green-100 text-green-800",
  "literature": "bg-blue-100 text-blue-800",
  "social":     "bg-red-100 text-red-800",
  "art":        "bg-pink-100 text-pink-800",
  "sports":     "bg-orange-100 text-orange-800",
  "other":      "bg-gray-100 text-gray-700",
};

const catLabels: Record<string, string> = {
  politics: "রাজনীতি", literature: "সাহিত্য",
  social: "সমাজসেবা", art: "শিল্প-সংস্কৃতি",
  sports: "ক্রীড়া", other: "অন্যান্য",
};

interface Person {
  id: string; name: string; nameEn: string; title: string;
  category: string; upazilaId: string; bornYear: string;
  diedYear: string; bio: string; achievements: string[]; imageUrl: string;
}

export default function NotablePersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, "notable_persons"), orderBy("name")))
      .then(snap => setPersons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Person))))
      .catch(() => setPersons([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ServicePageLayout title="গুণিজন" subtitle="টাঙ্গাইলের বিশিষ্ট ব্যক্তিত্বগণ" emoji="🏅" accentColor="bg-emerald-700">

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-40 border border-gray-100" />)}
        </div>
      ) : persons.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🏅</p>
          <p>কোনো গুণিজনের তথ্য পাওয়া যায়নি।</p>
          <p className="text-sm mt-1">অ্যাডমিন প্যানেল থেকে যোগ করুন।</p>
        </div>
      ) : (
        <div className="space-y-5">
          {persons.map(p => (
            <div key={p.id} className={`rounded-2xl border p-5 ${catColors[p.category] ? "bg-white border-gray-100" : "bg-white border-gray-100"}`}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden shadow-sm">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    : "🏅"
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <div>
                      <h2 className="font-black text-gray-800 text-lg leading-tight">{p.name}</h2>
                      {p.nameEn && <p className="text-gray-400 text-xs">{p.nameEn}</p>}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${catColors[p.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {catLabels[p.category] ?? p.category}
                    </span>
                  </div>

                  <p className="text-emerald-700 font-semibold text-sm mb-2">{p.title}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    {p.bornYear && <span>🎂 জন্ম: {p.bornYear}</span>}
                    {p.diedYear && <span>✝️ মৃত্যু: {p.diedYear}</span>}
                  </div>

                  {p.bio && <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.bio}</p>}

                  {p.achievements && p.achievements.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-700 mb-2">উল্লেখযোগ্য অবদান</p>
                      <ul className="space-y-1">
                        {p.achievements.map((a, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-emerald-800 font-bold mb-1">আরও গুণিজনের তথ্য যোগ করুন</p>
        <p className="text-emerald-600 text-sm mb-3">অ্যাডমিন প্যানেল থেকে তথ্য যোগ করুন</p>
        <Link href="/admin/notable-persons"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors">
          অ্যাডমিন প্যানেল <ArrowRight size={14} />
        </Link>
      </div>
    </ServicePageLayout>
  );
}
