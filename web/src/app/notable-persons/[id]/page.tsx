"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Person {
  id: string; name: string; nameEn?: string; title: string;
  category: string; upazilaId: string; bornYear?: string;
  diedYear?: string; bio: string; achievements: string[]; imageUrl?: string;
}

const catColors: Record<string, string> = {
  politics:   "bg-green-100 text-green-800",
  literature: "bg-blue-100 text-blue-800",
  social:     "bg-red-100 text-red-800",
  art:        "bg-pink-100 text-pink-800",
  sports:     "bg-orange-100 text-orange-800",
  other:      "bg-gray-100 text-gray-700",
};

const catLabels: Record<string, string> = {
  politics: "রাজনীতি", literature: "সাহিত্য",
  social: "সমাজসেবা", art: "শিল্প-সংস্কৃতি",
  sports: "ক্রীড়া", other: "অন্যান্য",
};

export default function PersonDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [person, setPerson]   = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "notable_persons", id))
      .then(d => { if (d.exists()) setPerson({ id: d.id, ...d.data() } as Person); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!person) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6f8] gap-4">
      <p className="text-gray-500">গুণিজনের তথ্য পাওয়া যায়নি</p>
      <Link href="/notable-persons" className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> সব গুণিজন
      </Link>
    </div>
  );

  const catLabel = catLabels[person.category] ?? person.category;
  const catCls   = catColors[person.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-10 space-y-5">
        {/* Back */}
        <Link href="/notable-persons" className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
          <ArrowLeft size={16} /> সব গুণিজন
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-5">
            {/* Photo */}
            <div className="w-24 h-24 rounded-2xl bg-emerald-50 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden shadow-sm">
              {person.imageUrl
                ? <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                : "🏅"
              }
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-black text-gray-800 leading-tight">{person.name}</h1>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${catCls}`}>{catLabel}</span>
              </div>
              {person.nameEn && <p className="text-gray-400 text-xs mb-1">{person.nameEn}</p>}
              <p className="text-emerald-700 font-semibold text-sm mb-2">{person.title}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {person.bornYear && <span>🎂 জন্ম: {person.bornYear}</span>}
                {person.diedYear && <span>✝️ মৃত্যু: {person.diedYear}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {person.bio && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full" /> জীবনী
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{person.bio}</p>
          </div>
        )}

        {/* Achievements */}
        {person.achievements && person.achievements.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full" /> উল্লেখযোগ্য অবদান
            </h2>
            <ul className="space-y-2">
              {person.achievements.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {a}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
