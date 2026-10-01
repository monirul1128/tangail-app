"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Stethoscope } from "lucide-react";
import { SPECIALTIES, UPAZILAS } from "@/lib/constants";
import type { Doctor } from "@/models/types";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import StarRating from "@/components/ui/StarRating";
import FilterChips from "@/components/ui/FilterChips";
import CallButton from "@/components/ui/CallButton";

interface Props { doctors: Doctor[] }

export default function DoctorsClient({ doctors }: Props) {
  const searchParams = useSearchParams();
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("spec") ?? "");
  const [search, setSearch]                       = useState("");

  const filtered = doctors.filter((d) => {
    const matchesSpecialty = !selectedSpecialty || d.specialty === selectedSpecialty;
    const matchesSearch    = !search
      || d.name.includes(search)
      || d.hospitalName.includes(search)
      || d.chamberAddress.includes(search);
    return matchesSpecialty && matchesSearch;
  });

  return (
    <>
      <input
        type="search"
        placeholder="ডাক্তারের নাম বা হাসপাতাল খুঁজুন..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
      />

      <div className="mb-6">
        <FilterChips
          options={Object.entries(SPECIALTIES).map(([id, label]) => ({ id, label }))}
          selected={selectedSpecialty}
          onChange={setSelectedSpecialty}
          allLabel="সব বিশেষজ্ঞতা"
        />
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length}জন ডাক্তার পাওয়া গেছে</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">কোনো ডাক্তার পাওয়া যায়নি</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </>
  );
}

function DoctorCard({ doctor: d }: { doctor: Doctor }) {
  const specialtyName = SPECIALTIES[d.specialty] ?? d.specialty;

  return (
    <Link
      href={`/doctors/${d.id}`}
      className="card p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {d.imageUrl ? (
            <img src={d.imageUrl} alt={d.name} className="w-full h-full object-cover" />
          ) : (
            <Stethoscope size={24} className="text-purple-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800 text-sm">{d.name}</h3>
            {d.isVerified && <VerifiedBadge />}
          </div>
          <span className="text-xs font-semibold text-purple-600">{specialtyName}</span>
          <div className="text-xs text-gray-400 mt-0.5">
            {d.qualifications.join(", ")}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="flex-shrink-0" />
          <span className="truncate">{d.hospitalName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="flex-shrink-0" />
          <span>{d.visitingHours}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <StarRating rating={d.rating} reviewCount={d.reviewCount} size={12} />
        <span className="text-sm font-bold text-primary">৳{d.visitFee}</span>
      </div>

      <a
        href={`tel:${d.phone}`}
        onClick={(e) => e.stopPropagation()}
        className="btn-call text-xs justify-center"
      >
        📞 অ্যাপয়েন্টমেন্ট
      </a>
    </Link>
  );
}
