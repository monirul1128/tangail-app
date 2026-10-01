"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
import type { BloodDonor } from "@/models/types";
import FilterChips from "@/components/ui/FilterChips";

// Widen readonly `as const` arrays to plain mutable arrays so TypeScript
// accepts them where { id: string; label: string }[] or string[] is expected.
const upazilaOptions: { id: string; label: string }[] = UPAZILAS.map((u) => ({
  id: u.id,
  label: u.name,
}));
const bloodGroupList: string[] = [...BLOOD_GROUPS];

interface Props {
  donors: BloodDonor[];
}

export default function BloodDonorClient({ donors }: Props) {
  const searchParams = useSearchParams();
  const [selectedGroup,   setSelectedGroup]   = useState(searchParams.get("group") ?? "");
  const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get("upazila") ?? "");

  const filtered = donors.filter((d) => {
    const matchesGroup   = !selectedGroup   || d.bloodGroup === selectedGroup;
    const matchesUpazila = !selectedUpazila || d.upazilaId  === selectedUpazila;
    return matchesGroup && matchesUpazila;
  });

  return (
    <>
      {/* Blood group filter */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">রক্তের গ্রুপ</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup("")}
            className={selectedGroup === "" ? "chip-active" : "chip"}
          >
            সব গ্রুপ
          </button>
          {bloodGroupList.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`${selectedGroup === bg ? "chip-active" : "chip"} font-bold`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Upazila filter */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-600 mb-2">উপজেলা</p>
        <FilterChips
          options={upazilaOptions}
          selected={selectedUpazila}
          onChange={setSelectedUpazila}
          allLabel="সব উপজেলা"
        />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {filtered.length}জন ডোনার পাওয়া গেছে
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🩸</p>
          <p>এই ফিল্টারে কোনো ডোনার পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DonorCard key={d.id} donor={d} />
          ))}
        </div>
      )}
    </>
  );
}

function DonorCard({ donor: d }: { donor: BloodDonor }) {
  const upazilaName =
    upazilaOptions.find((u) => u.id === d.upazilaId)?.label ?? d.upazilaId;

  return (
    <div className="card p-5 flex items-start gap-4">
      {/* Blood group circle */}
      <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white font-black text-base">{d.bloodGroup}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800 truncate">{d.name}</h3>
          <span
            className={`badge ${
              d.isAvailable ? "badge-verified" : "bg-gray-100 text-gray-500"
            }`}
          >
            {d.isAvailable ? "উপলব্ধ" : "অনুপলব্ধ"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <MapPin size={11} />
          <span>{upazilaName}</span>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          মোট দান: {d.totalDonations} বার
        </div>

        {d.isAvailable && (
          <a href={`tel:${d.phone}`} className="btn-call text-xs">
            <Phone size={13} />
            যোগাযোগ করুন
          </a>
        )}
      </div>
    </div>
  );
}
