"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { ArrowRight, ExternalLink } from "lucide-react";

interface GovtItem {
  name: string;
  link: string;
  type?: string;
  note?: string;
}

interface GovtCategory {
  cat: string;
  emoji: string;
  color: string;
  titleColor: string;
  items: GovtItem[];
}

const services: GovtCategory[] = [
  {
    cat: "জন্ম নিবন্ধন", emoji: "👶", color: "bg-blue-50 border-blue-100", titleColor: "text-blue-700",
    items: [
      { name:"অনলাইনে জন্ম নিবন্ধন আবেদন", link:"https://bdris.gov.bd", type:"external" },
      { name:"জন্ম নিবন্ধন সনদ যাচাই",       link:"https://everify.bdris.gov.bd", type:"external" },
      { name:"টাঙ্গাইল সদর ইউনিয়ন পরিষদ",    link:"/govt?type=birth", note:"0921-62001" },
    ],
  },
  {
    cat: "ই-নামজারি ও খতিয়ান", emoji: "🏡", color: "bg-green-50 border-green-100", titleColor: "text-green-700",
    items: [
      { name:"অনলাইন খতিয়ান (RS, SA, BS)",    link:"https://eporcha.gov.bd", type:"external" },
      { name:"নামজারি আবেদন",                  link:"https://land.gov.bd", type:"external" },
      { name:"ডিজিটাল ভূমি সেবা কেন্দ্র",     link:"/govt?type=land", note:"টাঙ্গাইল সদর" },
    ],
  },
  {
    cat: "ভোটার সেবা ও এনআইডি", emoji: "🗳️", color: "bg-purple-50 border-purple-100", titleColor: "text-purple-700",
    items: [
      { name:"জাতীয় পরিচয়পত্র যাচাই",        link:"https://services.nidw.gov.bd", type:"external" },
      { name:"নতুন ভোটার নিবন্ধন",             link:"https://voter.teletalk.com.bd", type:"external" },
      { name:"টাঙ্গাইল জেলা নির্বাচন অফিস",   link:"/govt?type=voter", note:"0921-62801" },
    ],
  },
  {
    cat: "বিদ্যুৎ সেবা", emoji: "⚡", color: "bg-amber-50 border-amber-100", titleColor: "text-amber-700",
    items: [
      { name:"বিদ্যুৎ বিল পরিশোধ (অনলাইন)",   link:"https://prepaid.bpdb.gov.bd", type:"external" },
      { name:"পল্লী বিদ্যুৎ, টাঙ্গাইল",        link:"/govt?type=electricity", note:"0921-63000" },
      { name:"নতুন সংযোগ আবেদন",               link:"https://newconn.bpdb.gov.bd", type:"external" },
    ],
  },
  {
    cat: "আদালত ও আইন", emoji: "⚖️", color: "bg-red-50 border-red-100", titleColor: "text-red-700",
    items: [
      { name:"টাঙ্গাইল জেলা ও দায়রা জজ আদালত", link:"/govt?type=court", note:"0921-62900" },
      { name:"চিফ জুডিশিয়াল ম্যাজিস্ট্রেট আদালত", link:"/govt?type=court", note:"0921-62901" },
      { name:"লিগ্যাল এইড সার্ভিস",             link:"/professionals?type=lawyer" },
    ],
  },
  {
    cat: "জেলা প্রশাসন", emoji: "🏛️", color: "bg-indigo-50 border-indigo-100", titleColor: "text-indigo-700",
    items: [
      { name:"টাঙ্গাইল জেলা প্রশাসকের কার্যালয়", link:"/govt?type=dc", note:"0921-62100" },
      { name:"সিভিল সার্জন অফিস",                link:"/govt?type=civil", note:"0921-62200" },
      { name:"জেলা তথ্য অফিস",                   link:"/govt?type=info", note:"0921-62300" },
    ],
  },
];

const typeFilters = [
  {id:"birth",label:"জন্ম নিবন্ধন"}, {id:"land",label:"ভূমি সেবা"},
  {id:"voter",label:"ভোটার সেবা"},   {id:"electricity",label:"বিদ্যুৎ"},
  {id:"court",label:"আদালত"},         {id:"dc",label:"জেলা প্রশাসন"},
];

export default function GovtPage() {
  const [type, setType] = useState("");
  return (
    <ServicePageLayout title="সরকারি সেবা" subtitle="টাঙ্গাইল জেলার সকল সরকারি সেবার তথ্য" emoji="🏛️" accentColor="bg-indigo-700">
      <div className="mb-6"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব সেবা" /></div>
      <div className="space-y-4">
        {services
          .filter(cat => !type || cat.items.some(i => i.link.includes(type) || cat.cat.toLowerCase().includes(type)))
          .map(cat => (
          <div key={cat.cat} className={`rounded-2xl border p-4 ${cat.color}`}>
            <h3 className={`font-bold text-sm mb-3 flex items-center gap-2 ${cat.titleColor}`}>
              <span>{cat.emoji}</span>{cat.cat}
            </h3>
            <div className="space-y-2">
              {cat.items.map(item => (
                <div key={item.name} className="bg-white rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                    {item.note && <p className="text-xs text-gray-400 mt-0.5">📞 {item.note}</p>}
                  </div>
                  {item.type === "external" ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline flex-shrink-0 ml-3">
                      ভিজিট করুন <ExternalLink size={12} />
                    </a>
                  ) : (
                    <ArrowRight size={14} className="text-gray-300 flex-shrink-0 ml-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ServicePageLayout>
  );
}
