"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";

const professionals: ServiceItem[] = [
  // Lawyers
  { id:"1",  name:"অ্যাডভোকেট মো. আবদুল হক",    subtitle:"সিনিয়র আইনজীবী",      address:"জেলা আদালত, টাঙ্গাইল",          phone:"01711666601", badge:"আইনজীবী",     badgeColor:"bg-red-50 text-red-700",     extra:"ফৌজদারি ও দেওয়ানি মামলা" },
  { id:"2",  name:"অ্যাডভোকেট সুমাইয়া বেগম",    subtitle:"মহিলা আইনজীবী",        address:"আদালত পাড়া, টাঙ্গাইল সদর",     phone:"01711666602", badge:"আইনজীবী",     badgeColor:"bg-red-50 text-red-700",     extra:"পারিবারিক আইন বিশেষজ্ঞ" },
  { id:"3",  name:"অ্যাডভোকেট রফিকুল ইসলাম",    subtitle:"আইনি পরামর্শ",          address:"জেলা আদালত, টাঙ্গাইল",          phone:"01711666603", badge:"আইনজীবী",     badgeColor:"bg-red-50 text-red-700"     },
  // Journalists
  { id:"4",  name:"দৈনিক প্রথম আলো — টাঙ্গাইল", subtitle:"জাতীয় দৈনিক",          address:"প্রেস ক্লাব, টাঙ্গাইল সদর",    phone:"01711666604", badge:"সাংবাদিক",    badgeColor:"bg-blue-50 text-blue-700"   },
  { id:"5",  name:"দৈনিক কালের কণ্ঠ — টাঙ্গাইল",subtitle:"জাতীয় দৈনিক",          address:"প্রেস ক্লাব, টাঙ্গাইল সদর",    phone:"01711666605", badge:"সাংবাদিক",    badgeColor:"bg-blue-50 text-blue-700"   },
  { id:"6",  name:"টাঙ্গাইল প্রেস ক্লাব",         subtitle:"সাংবাদিক সংগঠন",        address:"শহীদ স্মরণী, টাঙ্গাইল",        phone:"0921-62500",  badge:"সাংবাদিক",    badgeColor:"bg-blue-50 text-blue-700",   verified:true },
  // Technicians
  { id:"7",  name:"মোবাইল সার্ভিসিং সেন্টার",     subtitle:"মোবাইল মেরামত",         address:"নিউ মার্কেট, টাঙ্গাইল সদর",    phone:"01711666606", badge:"টেকনিশিয়ান", badgeColor:"bg-purple-50 text-purple-700"},
  { id:"8",  name:"ইলেকট্রিক্যাল ওয়ার্কস",       subtitle:"বৈদ্যুতিক কাজ",         address:"বাজার রোড, মির্জাপুর",         phone:"01711666607", badge:"টেকনিশিয়ান", badgeColor:"bg-purple-50 text-purple-700"},
  { id:"9",  name:"AC সার্ভিসিং সেন্টার",         subtitle:"এসি মেরামত ও সার্ভিসিং",address:"টাঙ্গাইল সদর",                  phone:"01711666608", badge:"টেকনিশিয়ান", badgeColor:"bg-purple-50 text-purple-700"},
  // Kazi
  { id:"10", name:"টাঙ্গাইল সদর কাজি অফিস",      subtitle:"বিবাহ নিবন্ধন",         address:"সদর উপজেলা, টাঙ্গাইল",         phone:"0921-62600",  badge:"কাজি অফিস",   badgeColor:"bg-pink-50 text-pink-700",   verified:true, hours:"রবি-বৃহস্পতি, সকাল ৯টা - বিকেল ৫টা" },
  { id:"11", name:"মির্জাপুর কাজি অফিস",          subtitle:"বিবাহ নিবন্ধন",         address:"মির্জাপুর উপজেলা",             phone:"01711666609", badge:"কাজি অফিস",   badgeColor:"bg-pink-50 text-pink-700"   },
];

const typeFilters = [
  {id:"আইনজীবী",label:"আইনজীবী"}, {id:"সাংবাদিক",label:"সাংবাদিক"},
  {id:"টেকনিশিয়ান",label:"টেকনিশিয়ান"}, {id:"কাজি অফিস",label:"কাজি অফিস"},
];

export default function ProfessionalsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = professionals.filter(p =>
    (!search || p.name.includes(search) || p.subtitle?.includes(search)) &&
    (!type || p.badge === type)
  );
  return (
    <ServicePageLayout title="পেশাদার সেবা" subtitle="টাঙ্গাইল জেলার আইনজীবী, সাংবাদিক, টেকনিশিয়ান ও অন্যান্য" emoji="🔧" accentColor="bg-indigo-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="নাম বা পেশা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব পেশা" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}জন পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <ServiceCard key={p.id} item={p} accentColor="text-indigo-700" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কেউ পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
