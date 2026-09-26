"use client";

import { useState } from "react";
import { Phone, Clock, MapPin, User } from "lucide-react";
import { AMBULANCE_TYPES, UPAZILAS } from "@/lib/constants";
import type { Ambulance } from "@/models/types";
import FilterChips from "@/components/ui/FilterChips";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

interface Props { ambulances: Ambulance[] }

export default function AmbulanceClient({ ambulances }: Props) {
  const [selectedType,    setSelectedType]    = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");

  const filtered = ambulances.filter((a) => {
    const matchesType    = !selectedType    || a.type      === selectedType;
    const matchesUpazila = !selectedUpazila || a.upazilaId === selectedUpazila;
    return matchesType && matchesUpazila;
  });

  return (
    <>
      <div className="mb-3">
        <FilterChips
          options={Object.entries(AMBULANCE_TYPES).map(([id, label]) => ({ id, label }))}
          selected={selectedType}
          onChange={setSelectedType}
          allLabel="সব ধরন"
        />
      </div>
      <div className="mb-6">
        <FilterChips
          options={UPAZILAS.map((u) => ({ id: u.id, label: u.name }))}
          selected={selectedUpazila}
          onChange={setSelectedUpazila}
          allLabel="সব উপজেলা"
        />
      </div>

      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি অ্যাম্বুলেন্স পাওয়া গেছে</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">কোনো অ্যাম্বুলেন্স পাওয়া যায়নি</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((a) => <AmbulanceCard key={a.id} ambulance={a} />)}
        </div>
      )}
    </>
  );
}

function AmbulanceCard({ ambulance: a }: { ambulance: Ambulance }) {
  const typeName    = AMBULANCE_TYPES[a.type] ?? a.type;
  const upazilaName = UPAZILAS.find((u) => u.id === a.upazilaId)?.name ?? a.upazilaId;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-gray-800">{a.name}</h3>
            {a.isVerified && <VerifiedBadge />}
          </div>
          <span className="badge bg-amber-50 text-amber-700">{typeName}</span>
        </div>
        {a.isAvailable24Hours && (
          <span className="badge-24h flex items-center gap-1">
            <Clock size={11} /> ২৪ ঘণ্টা
          </span>
        )}
      </div>

      <div className="space-y-1.5 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <User size={14} className="flex-shrink-0" />
          <span>{a.ownerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="flex-shrink-0" />
          <span>{upazilaName}</span>
        </div>
        {a.rentalCostPerKm > 0 && (
          <div className="text-amber-700 font-semibold">
            ভাড়া: ৳{a.rentalCostPerKm}/কিমি
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <a href={`tel:${a.phone}`} className="btn-call flex-1 justify-center">
          <Phone size={15} /> {a.phone}
        </a>
        {a.alternatePhone && (
          <a href={`tel:${a.alternatePhone}`} className="btn-call flex-1 justify-center">
            <Phone size={15} /> {a.alternatePhone}
          </a>
        )}
      </div>
    </div>
  );
}
