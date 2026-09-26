import type { Metadata } from "next";
import { Phone, Clock, Car } from "lucide-react";
import { getAmbulances } from "@/lib/firestore";
import { AMBULANCE_TYPES, UPAZILAS } from "@/lib/constants";
import type { Ambulance } from "@/models/types";
import AmbulanceClient from "./AmbulanceClient";

export const metadata: Metadata = {
  title: "অ্যাম্বুলেন্স সার্ভিস",
  description: "টাঙ্গাইল জেলার সকল অ্যাম্বুলেন্স সার্ভিসের তালিকা ও যোগাযোগ নম্বর",
};

export const revalidate = 300;

export default async function AmbulancePage() {
  const ambulances = await getAmbulances().catch(() => [] as Ambulance[]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero / emergency call */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Car size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">অ্যাম্বুলেন্স সার্ভিস</h1>
            <p className="text-gray-500 text-sm">
              টাঙ্গাইলের {ambulances.length}টি অ্যাম্বুলেন্স সার্ভিস
            </p>
          </div>
        </div>
        <a
          href="tel:999"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors whitespace-nowrap"
        >
          <Phone size={20} />
          জরুরি: ৯৯৯
        </a>
      </div>

      <AmbulanceClient ambulances={ambulances} />
    </div>
  );
}
