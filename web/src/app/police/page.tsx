import type { Metadata } from "next";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { Phone, MapPin, Shield } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "পুলিশ স্টেশন",
  description: "টাঙ্গাইল জেলার ১২টি উপজেলার সকল থানার ঠিকানা ও যোগাযোগ নম্বর",
};

const policeStations = [
  {
    id: "1",
    name: "টাঙ্গাইল সদর থানা",
    upazilaName: "টাঙ্গাইল সদর",
    oc: "পরিদর্শক (ওসি), টাঙ্গাইল সদর",
    address: "পুলিশ লাইন রোড, টাঙ্গাইল সদর",
    phone: "0921-62100",
    phone2: "01713373641",
    emergency: "999",
    jurisdiction: "টাঙ্গাইল পৌর এলাকা ও সদর উপজেলার অংশ",
    estd: "১৮৭৫ সাল",
  },
  {
    id: "2",
    name: "বাসাইল থানা",
    upazilaName: "বাসাইল",
    oc: "পরিদর্শক (ওসি), বাসাইল",
    address: "বাসাইল বাজার, বাসাইল",
    phone: "09228-56300",
    phone2: "01713373642",
    emergency: "999",
    jurisdiction: "বাসাইল উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "3",
    name: "ভূয়াপুর থানা",
    upazilaName: "ভূয়াপুর",
    oc: "পরিদর্শক (ওসি), ভূয়াপুর",
    address: "ভূয়াপুর বাজার, ভূয়াপুর",
    phone: "09228-75300",
    phone2: "01713373643",
    emergency: "999",
    jurisdiction: "ভূয়াপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "4",
    name: "দেলদুয়ার থানা",
    upazilaName: "দেলদুয়ার",
    oc: "পরিদর্শক (ওসি), দেলদুয়ার",
    address: "দেলদুয়ার বাজার, দেলদুয়ার",
    phone: "09228-56600",
    phone2: "01713373644",
    emergency: "999",
    jurisdiction: "দেলদুয়ার উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "5",
    name: "ধনবাড়ী থানা",
    upazilaName: "ধনবাড়ী",
    oc: "পরিদর্শক (ওসি), ধনবাড়ী",
    address: "ধনবাড়ী বাজার, ধনবাড়ী",
    phone: "09228-56900",
    phone2: "01713373645",
    emergency: "999",
    jurisdiction: "ধনবাড়ী উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "6",
    name: "ঘাটাইল থানা",
    upazilaName: "ঘাটাইল",
    oc: "পরিদর্শক (ওসি), ঘাটাইল",
    address: "ঘাটাইল বাজার, ঘাটাইল",
    phone: "09228-57300",
    phone2: "01713373646",
    emergency: "999",
    jurisdiction: "ঘাটাইল উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "7",
    name: "গোপালপুর থানা",
    upazilaName: "গোপালপুর",
    oc: "পরিদর্শক (ওসি), গোপালপুর",
    address: "গোপালপুর বাজার, গোপালপুর",
    phone: "09228-57600",
    phone2: "01713373647",
    emergency: "999",
    jurisdiction: "গোপালপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "8",
    name: "কালিহাতী থানা",
    upazilaName: "কালিহাতী",
    oc: "পরিদর্শক (ওসি), কালিহাতী",
    address: "কালিহাতী বাজার, কালিহাতী",
    phone: "09228-57900",
    phone2: "01713373648",
    emergency: "999",
    jurisdiction: "কালিহাতী উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "9",
    name: "মধুপুর থানা",
    upazilaName: "মধুপুর",
    oc: "পরিদর্শক (ওসি), মধুপুর",
    address: "মধুপুর বাজার, মধুপুর",
    phone: "09228-68300",
    phone2: "01713373649",
    emergency: "999",
    jurisdiction: "মধুপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "10",
    name: "মির্জাপুর থানা",
    upazilaName: "মির্জাপুর",
    oc: "পরিদর্শক (ওসি), মির্জাপুর",
    address: "মির্জাপুর বাজার, মির্জাপুর",
    phone: "09228-75300",
    phone2: "01713373650",
    emergency: "999",
    jurisdiction: "মির্জাপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "11",
    name: "নাগরপুর থানা",
    upazilaName: "নাগরপুর",
    oc: "পরিদর্শক (ওসি), নাগরপুর",
    address: "নাগরপুর বাজার, নাগরপুর",
    phone: "09228-56400",
    phone2: "01713373651",
    emergency: "999",
    jurisdiction: "নাগরপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
  {
    id: "12",
    name: "সখিপুর থানা",
    upazilaName: "সখিপুর",
    oc: "পরিদর্শক (ওসি), সখিপুর",
    address: "সখিপুর বাজার, সখিপুর",
    phone: "09228-56700",
    phone2: "01713373652",
    emergency: "999",
    jurisdiction: "সখিপুর উপজেলার সম্পূর্ণ এলাকা",
    estd: "—",
  },
];

export default function PolicePage() {
  return (
    <ServicePageLayout
      title="পুলিশ স্টেশন"
      subtitle="টাঙ্গাইল জেলার ১২টি থানার তথ্য ও যোগাযোগ"
      emoji="👮"
      accentColor="bg-blue-800"
    >
      {/* Emergency strip */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Phone size={22} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-red-700 text-base">জাতীয় জরুরি পুলিশ সেবা</p>
            <p className="text-red-500 text-xs">যেকোনো জরুরি পরিস্থিতিতে কল করুন</p>
          </div>
        </div>
        <a href="tel:999"
          className="bg-red-600 hover:bg-red-700 text-white font-black text-2xl px-6 py-3 rounded-xl transition-colors">
          ৯৯৯
        </a>
      </div>

      {/* District police HQ */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield size={22} className="text-blue-700 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-800 text-base mb-1">টাঙ্গাইল জেলা পুলিশ সুপারের কার্যালয়</h3>
            <p className="text-xs text-blue-600 mb-2">পুলিশ সুপার, টাঙ্গাইল জেলা</p>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 mb-3">
              <MapPin size={12} /> পুলিশ লাইন, টাঙ্গাইল সদর
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href="tel:0921-62101"
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                <Phone size={12} /> 0921-62101
              </a>
              <a href="tel:01320-100001"
                className="flex items-center gap-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors">
                <Phone size={12} /> 01320-100001
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* All 12 stations */}
      <p className="text-sm text-gray-500 mb-4">মোট ১২টি থানা</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policeStations.map((ps) => (
          <div key={ps.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="bg-blue-700 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-sm">{ps.id}</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{ps.name}</h3>
                <p className="text-blue-200 text-xs">{ps.upazilaName} উপজেলা</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <MapPin size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{ps.address}</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Shield size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>এখতিয়ার: {ps.jurisdiction}</span>
              </div>
            </div>

            {/* Call buttons */}
            <div className="px-4 pb-4 flex gap-2 flex-wrap">
              <a href={`tel:${ps.phone}`}
                className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors">
                <Phone size={12} /> {ps.phone}
              </a>
              {ps.phone2 && (
                <a href={`tel:${ps.phone2}`}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-full transition-colors">
                  <Phone size={12} /> {ps.phone2}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
          ⚠️ গুরুত্বপূর্ণ তথ্য
        </h3>
        <ul className="space-y-1.5 text-sm text-amber-700">
          <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>জরুরি অবস্থায় সবসময় <strong>999</strong> নম্বরে কল করুন</li>
          <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>মামলা দায়ের করতে সংশ্লিষ্ট থানায় যোগাযোগ করুন</li>
          <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>মহিলা ও শিশু নির্যাতনের জন্য <strong>109</strong> নম্বরে কল করুন</li>
          <li className="flex items-start gap-2"><span className="flex-shrink-0">•</span>পুলিশের বিরুদ্ধে অভিযোগ: পিবিআই হেল্পলাইন <strong>01320-110001</strong></li>
        </ul>
      </div>
    </ServicePageLayout>
  );
}
