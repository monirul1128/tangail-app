"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Notice {
  id: string;
  title: string;
  isNotice: boolean;
  publishedAt: Timestamp;
  source: string;
}

const toBanglaDate = (ts: Timestamp) => {
  try {
    const d = ts.toDate();
    const months = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
    const toBn = (n: number) => String(n).replace(/\d/g, x => "০১২৩৪৫৬৭৮৯"[+x]);
    return `${toBn(d.getDate())} ${months[d.getMonth()]} ${toBn(d.getFullYear())}`;
  } catch { return ""; }
};

export default function NoticePreview() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // Try with isNotice filter + ordering
        const snap = await getDocs(
          query(collection(db, "news"), where("isNotice", "==", true), orderBy("publishedAt", "desc"), limit(3))
        );
        if (snap.docs.length > 0) {
          setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
        } else {
          // Fall back to latest news if no notices yet
          const snap2 = await getDocs(
            query(collection(db, "news"), orderBy("publishedAt", "desc"), limit(3))
          );
          setNotices(snap2.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
        }
      } catch {
        // Fallback without ordering
        try {
          const snap = await getDocs(query(collection(db, "news"), where("isNotice", "==", true), limit(3)));
          setNotices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Notice)));
        } catch { setNotices([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-2.5 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );

  if (notices.length === 0) return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-8 text-center text-gray-400 text-sm">
      কোনো নোটিশ নেই। অ্যাডমিন প্যানেল থেকে খবর যোগ করুন।
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
      {notices.map(n => (
        <Link key={n.id} href={`/news/${n.id}`}
          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">📋</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 line-clamp-1">{n.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {n.publishedAt ? toBanglaDate(n.publishedAt) : n.source}
            </p>
          </div>
          <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}
