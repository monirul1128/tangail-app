"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search, PlusCircle } from "lucide-react";
import Link from "next/link";

const businesses: ServiceItem[] = [
  // Hotels
  { id:"1",  name:"হোটেল প্রিন্স",             subtitle:"আবাসিক হোটেল",     address:"সদর রোড, টাঙ্গাইল সদর",       phone:"0921-62700", badge:"হোটেল",      badgeColor:"bg-indigo-50 text-indigo-700", verified:true,  extra:"সিঙ্গেল থেকে ফ্যামিলি রুম উপলব্ধ" },
  { id:"2",  name:"হোটেল মিরাজ",               subtitle:"আবাসিক হোটেল",     address:"বাস টার্মিনাল, টাঙ্গাইল",     phone:"01711555501", badge:"হোটেল",     badgeColor:"bg-indigo-50 text-indigo-700"  },
  // Restaurants
  { id:"3",  name:"বিসমিল্লাহ রেস্তোরাঁ",      subtitle:"বাংলা খাবার",       address:"পুরান বাজার, টাঙ্গাইল সদর",   phone:"01711555502", badge:"রেস্টুরেন্ট",badgeColor:"bg-orange-50 text-orange-700", hours:"সকাল ৭টা - রাত ১১টা" },
  { id:"4",  name:"চাইনিজ গার্ডেন রেস্তোরাঁ",  subtitle:"চাইনিজ ও থাই ফুড", address:"বঙ্গবন্ধু সড়ক, টাঙ্গাইল",   phone:"01711555503", badge:"রেস্টুরেন্ট",badgeColor:"bg-orange-50 text-orange-700"  },
  // Beauty
  { id:"5",  name:"স্মার্ট বিউটি পার্লার",     subtitle:"লেডিস বিউটি সেবা", address:"নিউ মার্কেট, টাঙ্গাইল",       phone:"01711555504", badge:"বিউটি পার্লার",badgeColor:"bg-pink-50 text-pink-700", hours:"সকাল ১০টা - রাত ৮টা" },
  { id:"6",  name:"পার্লার গ্লোরি",            subtitle:"মেকআপ ও স্কিনকেয়ার",address:"কলেজ রোড, টাঙ্গাইল",        phone:"01711555505", badge:"বিউটি পার্লার",badgeColor:"bg-pink-50 text-pink-700"  },
  // Nursery
  { id:"7",  name:"সবুজ নার্সারি",             subtitle:"গাছপালা ও চারা",    address:"ঢাকা-টাঙ্গাইল হাইওয়ে",      phone:"01711555506", badge:"নার্সারি",   badgeColor:"bg-green-50 text-green-700"  },
  // Agriculture
  { id:"8",  name:"কৃষি সম্প্রসারণ অধিদপ্তর",  subtitle:"কৃষি পরামর্শ ও সার",address:"কৃষি ভবন, টাঙ্গাইল সদর",    phone:"0921-62800",  badge:"কৃষি সেবা",  badgeColor:"bg-lime-50 text-lime-700",    verified:true  },
  { id:"9",  name:"বাংলাদেশ কৃষি ব্যাংক",      subtitle:"কৃষি ঋণ",           address:"কৃষি ব্যাংক রোড, টাঙ্গাইল", phone:"0921-62801",  badge:"কৃষি সেবা",  badgeColor:"bg-lime-50 text-lime-700",    verified:true  },
  // Shops
  { id:"10", name:"টাঙ্গাইল সিল্ক হাউস",       subtitle:"টাঙ্গাইলের বিখ্যাত শাড়ি",address:"শাড়ি পট্টি, টাঙ্গাইল সদর",phone:"01711555507",badge:"দোকান/শোরুম", badgeColor:"bg-rose-50 text-rose-700", verified:true  },
  { id:"11", name:"ইলেকট্রনিক্স মার্ট",         subtitle:"ইলেকট্রনিক্স পণ্য", address:"নিউ মার্কেট, টাঙ্গাইল",       phone:"01711555508", badge:"দোকান/শোরুম",badgeColor:"bg-rose-50 text-rose-700"  },
];

const typeFilters = [
  {id:"হোটেল",label:"হোটেল"}, {id:"রেস্টুরেন্ট",label:"রেস্টুরেন্ট"},
  {id:"বিউটি পার্লার",label:"বিউটি পার্লার"}, {id:"নার্সারি",label:"নার্সারি"},
  {id:"কৃষি সেবা",label:"কৃষি সেবা"}, {id:"দোকান/শোরুম",label:"দোকান/শোরুম"},
];

export default function BusinessPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = businesses.filter(b =>
    (!search || b.name.includes(search) || b.address?.includes(search)) &&
    (!type || b.badge === type)
  );
  return (
    <ServicePageLayout title="ব্যবসা ও বাণিজ্য" subtitle="টাঙ্গাইল জেলার ব্যবসা প্রতিষ্ঠান ও সেবা" emoji="🏪" accentColor="bg-orange-600">
      {/* Add business CTA */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between mb-5">
        <div>
          <p className="font-bold text-orange-800 text-sm">আপনার ব্যবসা যোগ করুন</p>
          <p className="text-xs text-orange-600 mt-0.5">সম্পূর্ণ বিনামূল্যে — হাজার মানুষের কাছে পৌঁছান</p>
        </div>
        <Link href="/register-business" className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
          <PlusCircle size={13}/> যোগ করুন
        </Link>
      </div>
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ব্যবসার নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি ব্যবসা পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(b => <ServiceCard key={b.id} item={b} accentColor="text-orange-600" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো ব্যবসা পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
