"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";

interface TourismSpot {
  id: string;
  name: string;
  upazilaId: string;
  category: string;
}

export default function TourismPreview() {
  const [spots, setSpots] = useState<TourismSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "tourism"), orderBy("name"), limit(3))
        );
        setSpots(snap.docs.map(d => ({ id: d.id, ...d.data() } as TourismSpot)));
      } catch {
        try {
          const snap = await getDocs(query(collection(db, "tourism"), limit(3)));
          setSpots(snap.docs.map(d => ({ id: d.id, ...d.data() } as TourismSpot)));
        } catch { setSpots([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3">
        <h3 className="font-bold text-white flex items-center gap-2">🏞️ পর্যটন স্থান</h3>
        <p className="text-white/70 text-xs mt-0.5">টাঙ্গাইলের দর্শনীয় স্থানসমূহ</p>
      </div>
      <div className="divide-y divide-gray-50">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : spots.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 text-xs">
            অ্যাডমিন প্যানেল থেকে পর্যটন স্থান যোগ করুন
          </div>
        ) : (
          spots.map(t => {
            const uName = UPAZILAS.find(u => u.id === t.upazilaId)?.name ?? t.upazilaId;
            return (
              <Link key={t.id} href={`/tourism/${t.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{t.name}</p>
                  <p className="text-xs text-gray-400">{uName}</p>
                </div>
                <ArrowRight size={13} className="text-gray-300 flex-shrink-0" />
              </Link>
            );
          })
        )}
        <Link href="/tourism"
          className="flex items-center justify-center gap-1 py-3 text-sky-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
          সব দেখুন <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
