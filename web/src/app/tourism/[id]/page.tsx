"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { UPAZILAS, TOURISM_CATEGORIES } from "@/lib/constants";

interface TourismSpot {
  id: string; name: string; nameEn?: string; category: string;
  upazilaId: string; address: string; description: string;
  imageUrl: string; openingHours: string; entryFee: string; tips: string;
}

const catColor: Record<string, string> = {
  historical:    "bg-amber-100 text-amber-800",
  nature:        "bg-green-100 text-green-800",
  entertainment: "bg-blue-100 text-blue-800",
  education:     "bg-purple-100 text-purple-800",
  modern:        "bg-indigo-100 text-indigo-800",
};

export default function TourismDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [spot, setSpot]     = useState<TourismSpot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "tourism", id))
      .then(d => { if (d.exists()) setSpot({ id: d.id, ...d.data() } as TourismSpot); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!spot) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6f8] gap-4">
      <p className="text-gray-500">পর্যটন স্থান পাওয়া যায়নি</p>
      <Link href="/tourism" className="text-sky-600 font-semibold hover:underline flex items-center gap-1">
        <ArrowLeft size={16} /> সব পর্যটন স্থান
      </Link>
    </div>
  );

  const uName = UPAZILAS.find(u => u.id === spot.upazilaId)?.name ?? spot.upazilaId;
  const catLabel = TOURISM_CATEGORIES[spot.category] ?? spot.category;
  const catCls = catColor[spot.category] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      {/* Back */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link href="/tourism" className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-sm font-semibold mb-4">
          <ArrowLeft size={16} /> সব পর্যটন স্থান
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10 space-y-5">
        {/* Image */}
        {spot.imageUrl ? (
          <img src={spot.imageUrl} alt={spot.name} className="w-full h-64 object-cover rounded-2xl shadow-sm" />
        ) : (
          <div className="w-full h-48 bg-sky-50 rounded-2xl flex items-center justify-center text-6xl">🏞️</div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-black text-gray-800">{spot.name}</h1>
              {spot.nameEn && <p className="text-gray-400 text-sm mt-0.5">{spot.nameEn}</p>}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${catCls}`}>{catLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={14} className="text-sky-500" /> {spot.address ? `${spot.address}, ` : ""}{uName}, টাঙ্গাইল
          </div>
        </div>

        {/* Description */}
        {spot.description && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-sky-500 rounded-full" /> বিবরণ
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">{spot.description}</p>
          </div>
        )}

        {/* Info */}
        {(spot.openingHours || spot.entryFee) && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-sky-500 rounded-full" /> তথ্য
            </h2>
            <div className="space-y-2">
              {spot.openingHours && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={15} className="text-sky-500 flex-shrink-0" />
                  <span className="text-gray-600">{spot.openingHours}</span>
                </div>
              )}
              {spot.entryFee && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-sky-500 flex-shrink-0">💰</span>
                  <span className="text-gray-600">প্রবেশ মূল্য: {spot.entryFee}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        {spot.tips && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-amber-800 font-bold text-sm mb-1">💡 ভ্রমণ টিপস</p>
            <p className="text-amber-700 text-sm">{spot.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}
