"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Person {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
}

export default function NotablePersonsPreview() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "notable_persons"), orderBy("name"), limit(3))
        );
        setPersons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Person)));
      } catch {
        try {
          const snap = await getDocs(query(collection(db, "notable_persons"), limit(3)));
          setPersons(snap.docs.map(d => ({ id: d.id, ...d.data() } as Person)));
        } catch { setPersons([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3">
        <h3 className="font-bold text-white flex items-center gap-2">🏅 গুণিজন</h3>
        <p className="text-white/70 text-xs mt-0.5">টাঙ্গাইলের বিশিষ্ট ব্যক্তিত্ব</p>
      </div>
      <div className="divide-y divide-gray-50">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : persons.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 text-xs">
            অ্যাডমিন প্যানেল থেকে গুণিজন যোগ করুন
          </div>
        ) : (
          persons.map(p => (
            <Link key={p.id} href="/notable-persons"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  : <span className="text-sm">🧑</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-400 truncate">{p.title}</p>
              </div>
              <ArrowRight size={13} className="text-gray-300 flex-shrink-0" />
            </Link>
          ))
        )}
        <Link href="/notable-persons"
          className="flex items-center justify-center gap-1 py-3 text-emerald-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
          সব দেখুন <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
