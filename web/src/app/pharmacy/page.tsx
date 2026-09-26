"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";

const pharmacies: ServiceItem[] = [
  { id:"1", name:"ইসলামী ফার্মেসি",        subtitle:"জেনারেল মেডিসিন",    address:"বঙ্গবন্ধু সড়ক, টাঙ্গাইল সদর",  phone:"01711111101", hours:"সকাল ৮টা - রাত ১০টা", verified:true,  badge:"সদর",      badgeColor:"bg-blue-50 text-blue-700"   },
  { id:"2", name:"আল-আমিন ড্রাগ হাউস",     subtitle:"ডাক্তারি সরঞ্জাম",   address:"পুরান বাস স্ট্যান্ড, টাঙ্গাইল", phone:"01711111102", hours:"২৪ ঘণ্টা",             verified:true,  badge:"সদর",      badgeColor:"bg-blue-50 text-blue-700"   },
  { id:"3", name:"মডার্ন ফার্মেসি",         subtitle:"হোমিও ও এলোপ্যাথি", address:"মির্জাপুর বাজার",                phone:"01711111103", hours:"সকাল ৯টা - রাত ৯টা",  verified:false, badge:"মির্জাপুর", badgeColor:"bg-green-50 text-green-700" },
  { id:"4", name:"রহমান মেডিকেল হল",        subtitle:"জেনারেল মেডিসিন",    address:"মধুপুর বাজার",                   phone:"01711111104", hours:"সকাল ৮টা - রাত ৯টা",  verified:false, badge:"মধুপুর",   badgeColor:"bg-purple-50 text-purple-700"},
  { id:"5", name:"সিটি ফার্মেসি",           subtitle:"সকল ওষুধ",           address:"ঘাটাইল বাজার",                   phone:"01711111105", hours:"সকাল ৮টা - রাত ১০টা", verified:true,  badge:"ঘাটাইল",   badgeColor:"bg-amber-50 text-amber-700"  },
  { id:"6", name:"ঢাকা ফার্মেসি",           subtitle:"জেনারেল মেডিসিন",    address:"কালিহাতী বাজার",                 phone:"01711111106", hours:"সকাল ৮টা - রাত ৯টা",  verified:false, badge:"কালিহাতী", badgeColor:"bg-red-50 text-red-700"     },
];

const upazilaFilters = [
  {id:"tangail_sadar",label:"সদর"}, {id:"mirzapur",label:"মির্জাপুর"},
  {id:"madhupur",label:"মধুপুর"},   {id:"ghatail",label:"ঘাটাইল"},
  {id:"kalihati",label:"কালিহাতী"}, {id:"basail",label:"বাসাইল"},
];

export default function PharmacyPage() {
  const [search, setSearch] = useState("");
  const [upazila, setUpazila] = useState("");

  const filtered = pharmacies.filter(p =>
    (!search || p.name.includes(search) || p.address?.includes(search)) &&
    (!upazila || p.badge?.includes(upazila))
  );

  return (
    <ServicePageLayout title="ফার্মেসি" subtitle={`টাঙ্গাইল জেলার ${pharmacies.length}টি ফার্মেসির তালিকা`} emoji="💊" accentColor="bg-green-600">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ফার্মেসির নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি ফার্মেসি পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => <ServiceCard key={p.id} item={p} accentColor="text-green-600" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো ফার্মেসি পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
