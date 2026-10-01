import type { Metadata } from "next";
import { getDoctors } from "@/lib/firestore";
import type { Doctor } from "@/models/types";
import DoctorsClient from "./DoctorsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "বিশেষজ্ঞ ডাক্তার",
  description: "টাঙ্গাইল জেলার বিশেষজ্ঞ ডাক্তারদের তালিকা, চেম্বার সময় ও যোগাযোগ",
};

export const revalidate = 300;

export default async function DoctorsPage() {
  const doctors = await getDoctors().catch(() => [] as Doctor[]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">বিশেষজ্ঞ ডাক্তার</h1>
        <p className="text-gray-500">
          টাঙ্গাইল জেলার {doctors.length}জন বিশেষজ্ঞ ডাক্তারের তালিকা
        </p>
      </div>
      <Suspense fallback={<div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>}>
        <DoctorsClient doctors={doctors} />
      </Suspense>
    </div>
  );
}
