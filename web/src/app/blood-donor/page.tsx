import type { Metadata } from "next";
import Link from "next/link";
import { Droplets } from "lucide-react";
import { getBloodDonors } from "@/lib/firestore";
import type { BloodDonor } from "@/models/types";
import BloodDonorClient from "./BloodDonorClient";
import { Suspense } from "react";
import { serializeFirestore } from "@/lib/serialize";

export const metadata: Metadata = {
  title: "রক্তদাতা খুঁজুন",
  description: "টাঙ্গাইল জেলার রক্তদাতাদের তালিকা। A+, B+, O+, AB+ সহ সকল গ্রুপের ডোনার।",
};

export const revalidate = 60;

export default async function BloodDonorPage() {
  const donors = serializeFirestore(await getBloodDonors().catch(() => [] as BloodDonor[]));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 text-white mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Droplets size={36} className="text-white" />
          <div>
            <h1 className="text-3xl font-bold">রক্তদাতা খুঁজুন</h1>
            <p className="text-red-100 text-sm">টাঙ্গাইলের {donors.length}জন নিবন্ধিত ডোনার</p>
          </div>
        </div>
        <p className="text-red-100 mb-6">
          আপনার প্রয়োজনীয় রক্তের গ্রুপ এবং উপজেলা অনুযায়ী ডোনার খুঁজুন
        </p>
        <Link
          href="/blood-donor/register"
          className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Droplets size={18} />
          ডোনার হিসেবে রেজিস্ট্রেশন করুন
        </Link>
      </div>

      <Suspense fallback={<div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>}>
        <BloodDonorClient donors={donors} />
      </Suspense>
    </div>
  );
}
