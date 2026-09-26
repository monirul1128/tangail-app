"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";

const transports: ServiceItem[] = [
  // Bus
  { id:"1",  name:"হানিফ এন্টারপ্রাইজ",         subtitle:"ঢাকা-টাঙ্গাইল-ঢাকা",     address:"টাঙ্গাইল বাস টার্মিনাল",   phone:"01711333301", badge:"বাস কাউন্টার", badgeColor:"bg-blue-50 text-blue-700"    },
  { id:"2",  name:"শ্যামলী পরিবহন",               subtitle:"ঢাকা-টাঙ্গাইল সার্ভিস",  address:"পুরান বাস স্ট্যান্ড",       phone:"01711333302", badge:"বাস কাউন্টার", badgeColor:"bg-blue-50 text-blue-700"    },
  { id:"3",  name:"ইন্টারসিটি বাস সার্ভিস",      subtitle:"উত্তরবঙ্গ রুট",           address:"নতুন বাস টার্মিনাল",        phone:"01711333303", badge:"বাস কাউন্টার", badgeColor:"bg-blue-50 text-blue-700"    },
  // Train
  { id:"4",  name:"টাঙ্গাইল রেলওয়ে স্টেশন",     subtitle:"ঢাকা-ময়মনসিংহ লাইন",    address:"স্টেশন রোড, টাঙ্গাইল সদর", phone:"0921-62800",  badge:"ট্রেন",       badgeColor:"bg-red-50 text-red-700",    hours:"টিকেট কাউন্টার: সকাল ৭টা - রাত ৮টা" },
  { id:"5",  name:"মধুপুর রেলওয়ে স্টেশন",       subtitle:"উত্তরবঙ্গ রুট",           address:"মধুপুর, টাঙ্গাইল",          phone:"0921-68200",  badge:"ট্রেন",       badgeColor:"bg-red-50 text-red-700"     },
  // Rent a car
  { id:"6",  name:"টাঙ্গাইল কার রেন্টাল সার্ভিস",subtitle:"AC গাড়ি ভাড়া",          address:"শহীদ স্মরণী, টাঙ্গাইল",    phone:"01711333304", badge:"রেন্ট এ কার", badgeColor:"bg-green-50 text-green-700" },
  { id:"7",  name:"সিটি ক্যাব সার্ভিস",          subtitle:"২৪ ঘণ্টা ভাড়া",          address:"টাঙ্গাইল সদর",              phone:"01711333305", badge:"রেন্ট এ কার", badgeColor:"bg-green-50 text-green-700" },
  // CNG
  { id:"8",  name:"মিলেনিয়াম সিএনজি স্টেশন",    subtitle:"সিএনজি রিফুয়েলিং",       address:"ঢাকা-টাঙ্গাইল হাইওয়ে",   phone:"01711333306", badge:"সিএনজি",      badgeColor:"bg-teal-50 text-teal-700",  hours:"সকাল ৬টা - রাত ১১টা" },
  // Fuel
  { id:"9",  name:"পদ্মা ফিলিং স্টেশন",          subtitle:"পেট্রোল, ডিজেল, অকটেন",  address:"মির্জাপুর রোড, টাঙ্গাইল",  phone:"01711333307", badge:"ফুয়েল",      badgeColor:"bg-orange-50 text-orange-700", hours:"২৪ ঘণ্টা" },
  // Courier
  { id:"10", name:"সুন্দরবন কুরিয়ার সার্ভিস",   subtitle:"সারাদেশে ডেলিভারি",      address:"পাথালিয়া, টাঙ্গাইল সদর",  phone:"01711333308", badge:"কুরিয়ার",    badgeColor:"bg-amber-50 text-amber-700" },
  { id:"11", name:"এস.এ পরিবহন কুরিয়ার",        subtitle:"ডোর টু ডোর সার্ভিস",     address:"নিউ মার্কেট, টাঙ্গাইল",    phone:"01711333309", badge:"কুরিয়ার",    badgeColor:"bg-amber-50 text-amber-700" },
];

const typeFilters = [
  {id:"বাস কাউন্টার",label:"বাস কাউন্টার"}, {id:"ট্রেন",label:"ট্রেন সার্ভিস"},
  {id:"রেন্ট এ কার",label:"রেন্ট এ কার"},   {id:"সিএনজি",label:"সিএনজি স্টেশন"},
  {id:"ফুয়েল",label:"ফুয়েল স্টেশন"},       {id:"কুরিয়ার",label:"কুরিয়ার"},
];

export default function TransportPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = transports.filter(t =>
    (!search || t.name.includes(search) || t.address?.includes(search)) &&
    (!type || t.badge === type)
  );
  return (
    <ServicePageLayout title="পরিবহন সেবা" subtitle="টাঙ্গাইল জেলার যোগাযোগ ও পরিবহন সেবা" emoji="🚌" accentColor="bg-amber-600">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="পরিবহন সেবার নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সেবা পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(t => <ServiceCard key={t.id} item={t} accentColor="text-amber-600" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো সেবা পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
