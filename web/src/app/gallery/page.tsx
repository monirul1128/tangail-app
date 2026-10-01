"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { MapPin } from "lucide-react";

const categories = ["শহর","ঐতিহাসিক","প্রকৃতি","স্থাপনা","শিক্ষা","বিনোদন"];
const catColor: Record<string,string> = {
  "শহর":"bg-blue-100 text-blue-800", "ঐতিহাসিক":"bg-amber-100 text-amber-800",
  "প্রকৃতি":"bg-green-100 text-green-800", "স্থাপনা":"bg-indigo-100 text-indigo-800",
  "শিক্ষা":"bg-purple-100 text-purple-800", "বিনোদন":"bg-pink-100 text-pink-800",
};

interface Photo {
  id: string;
  caption: string;
  category: string;
  upazilaId: string;
  imageUrl: string;
  isApproved: boolean;
}

export default function GalleryPage() {
  const [photos, setPhotos]   = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // Try with ordering first, fallback without if index missing
    const fetchPhotos = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "gallery"),
            where("isApproved", "==", true),
            orderBy("createdAt", "desc")
          )
        );
        setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo)));
      } catch {
        // Fallback: no ordering (works without composite index)
        try {
          const snap = await getDocs(
            query(collection(db, "gallery"), where("isApproved", "==", true))
          );
          setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo)));
        } catch {
          setPhotos([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const filtered = selected
    ? photos.filter(p => p.category === selected)
    : photos;

  return (
    <ServicePageLayout title="ফটো গ্যালারি" subtitle="টাঙ্গাইল জেলার ছবিসমূহ" emoji="📷" accentColor="bg-violet-700">

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelected("")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selected === "" ? "bg-violet-600 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-violet-50"
          }`}
        >
          সব
        </button>
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelected(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selected === c
                ? "bg-violet-600 text-white"
                : `${catColor[c] ?? "bg-gray-100 text-gray-600"} hover:opacity-80`
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📷</p>
          <p className="font-semibold">কোনো ছবি পাওয়া যায়নি</p>
          <p className="text-sm mt-1">অ্যাডমিন প্যানেল থেকে ছবি যোগ করুন</p>
        </div>
      )}

      {/* Photo grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-2xl shadow-sm group cursor-pointer ${
                i === 0 || i === 5 ? "col-span-2 row-span-2" : ""
              }`}
              style={{ aspectRatio: (i === 0 || i === 5) ? "1.5/1" : "1/1" }}
            >
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-bold text-sm">{photo.caption}</p>
                {photo.upazilaId && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-white/70" />
                    <span className="text-white/70 text-xs">{photo.upazilaId}</span>
                  </div>
                )}
              </div>
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catColor[photo.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit CTA */}
      <div className="mt-8 bg-violet-50 border border-violet-200 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">📸</p>
        <p className="text-violet-800 font-bold mb-1">আপনার ছবি শেয়ার করুন</p>
        <p className="text-violet-600 text-sm">টাঙ্গাইলের সুন্দর ছবি তুলে আমাদের গ্যালারিতে যোগ করুন</p>
      </div>
    </ServicePageLayout>
  );
}
