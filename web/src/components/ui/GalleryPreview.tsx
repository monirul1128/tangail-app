"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Photo {
  id: string;
  caption: string;
  imageUrl: string;
  isApproved: boolean;
}

export default function GalleryPreview() {
  const [photos, setPhotos]   = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const snap = await getDocs(
          query(
            collection(db, "gallery"),
            where("isApproved", "==", true),
            orderBy("createdAt", "desc"),
            limit(4)
          )
        );
        setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo)));
      } catch {
        // Fallback without ordering
        try {
          const snap = await getDocs(
            query(collection(db, "gallery"), where("isApproved", "==", true), limit(4))
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100">
        <p className="text-3xl mb-2">📷</p>
        <p className="text-sm">অ্যাডমিন থেকে ছবি যোগ করুন</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {photos.map((photo) => (
        <Link
          key={photo.id}
          href="/gallery"
          className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
        >
          <img
            src={photo.imageUrl}
            alt={photo.caption}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2">
            {photo.caption}
          </div>
        </Link>
      ))}
    </div>
  );
}
