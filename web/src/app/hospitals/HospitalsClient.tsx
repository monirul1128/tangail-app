"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Bed, Clock } from "lucide-react";
import { UPAZILAS, HOSPITAL_TYPES } from "@/lib/constants";
import type { Hospital } from "@/models/types";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import StarRating from "@/components/ui/StarRating";
import FilterChips from "@/components/ui/FilterChips";

interface Props {
  hospitals: Hospital[];
}

export default function HospitalsClient({ hospitals }: Props) {
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedType, setSelectedType]       = useState("");
  const [search, setSearch]                   = useState("");

  const filtered = hospitals.filter((h) => {
    const matchesUpazila = !selectedUpazila || h.upazilaId === selectedUpazila;
    const matchesType    = !selectedType    || h.type      === selectedType;
    const matchesSearch  = !search
      || h.name.includes(search)
      || h.nameEn.toLowerCase().includes(search.toLowerCase())
      || h.address.includes(search);
    return matchesUpazila && matchesType && matchesSearch;
  });

  return (
    <>
      {/* Search */}
      <input
        type="search"
        placeholder="হাসপাতালের নাম বা ঠিকানা খুঁজুন..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
      />

      {/* Upazila filter */}
      <div className="mb-3">
        <FilterChips
          options={UPAZILAS.map((u) => ({ id: u.id, label: u.name }))}
          selected={selectedUpazila}
          onChange={setSelectedUpazila}
          allLabel="সব উপজেলা"
        />
      </div>

      <div className="mb-6">
        <FilterChips
          options={[
            {id:"government",label:"সরকারি"},
            {id:"private",label:"বেসরকারি"},
            {id:"clinic",label:"ক্লিনিক সেন্টার"},
            {id:"diagnostic",label:"ডায়াগনস্টিক"},
          ]}
          selected={selectedType}
          onChange={setSelectedType}
          allLabel="সব ধরন"
        />
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি হাসপাতাল পাওয়া গেছে</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">কোনো হাসপাতাল পাওয়া যায়নি</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((h) => (
            <HospitalCard key={h.id} hospital={h} />
          ))}
        </div>
      )}
    </>
  );
}

function HospitalCard({ hospital: h }: { hospital: Hospital }) {
  const typeName = HOSPITAL_TYPES[h.type] ?? h.type;
  const typeColor =
    h.type === "government"
      ? "bg-blue-50 text-blue-700"
      : h.type === "private"
      ? "bg-purple-50 text-purple-700"
      : "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/hospitals/${h.id}`}
      className="card p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          {h.imageUrl ? (
            <img src={h.imageUrl} alt={h.name} className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span className="text-blue-600 text-2xl">🏥</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800 text-sm leading-snug">{h.name}</h3>
            {h.isVerified && <VerifiedBadge />}
          </div>
          <span className={`badge ${typeColor}`}>{typeName}</span>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5 text-xs text-gray-500">
        <MapPin size={13} className="mt-0.5 flex-shrink-0" />
        <span>{h.address}</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <StarRating rating={h.rating} reviewCount={h.reviewCount} size={12} />
        {h.totalBeds > 0 && (
          <span className="flex items-center gap-1 text-gray-500">
            <Bed size={12} /> {h.totalBeds} শয্যা
          </span>
        )}
        {h.isOpen24Hours && (
          <span className="flex items-center gap-1 badge-24h">
            <Clock size={11} /> ২৪ ঘণ্টা
          </span>
        )}
      </div>

      {/* Phone */}
      {h.phone.length > 0 && (
        <a
          href={`tel:${h.phone[0]}`}
          onClick={(e) => e.stopPropagation()}
          className="btn-call text-xs mt-auto"
        >
          📞 {h.phone[0]}
        </a>
      )}
    </Link>
  );
}
