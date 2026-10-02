import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Bed, Clock, Star } from "lucide-react";
import { getHospitals } from "@/lib/firestore";
import { UPAZILAS, HOSPITAL_TYPES } from "@/lib/constants";
import type { Hospital } from "@/models/types";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import StarRating from "@/components/ui/StarRating";
import HospitalsClient from "./HospitalsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "হাসপাতাল",
  description: "টাঙ্গাইল জেলার সকল সরকারি ও বেসরকারি হাসপাতালের তালিকা",
};

import { serializeFirestore } from "@/lib/serialize";

export const revalidate = 300;

export default async function HospitalsPage() {
  const raw = await getHospitals().catch(() => [] as Hospital[]);
  const hospitals = serializeFirestore(raw);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">হাসপাতালসমূহ</h1>
        <p className="text-gray-500">
          টাঙ্গাইল জেলার {hospitals.length}টি হাসপাতালের সম্পূর্ণ তালিকা
        </p>
      </div>

      {/* Client-side filters + list */}
      <Suspense fallback={<div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>}>
        <HospitalsClient hospitals={hospitals} />
      </Suspense>
    </div>
  );
}
