"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";

const finances: ServiceItem[] = [
  // Banks
  { id:"1",  name:"সোনালী ব্যাংক, টাঙ্গাইল",      subtitle:"সরকারি ব্যাংক",    address:"বঙ্গবন্ধু সড়ক, টাঙ্গাইল সদর", phone:"0921-62600", badge:"ব্যাংক",  badgeColor:"bg-blue-50 text-blue-700",   verified:true,  hours:"রবি-বৃহস্পতি, সকাল ১০টা - বিকেল ৪টা" },
  { id:"2",  name:"জনতা ব্যাংক, টাঙ্গাইল",         subtitle:"সরকারি ব্যাংক",    address:"ভিক্টোরিয়া রোড, টাঙ্গাইল",     phone:"0921-62601", badge:"ব্যাংক",  badgeColor:"bg-blue-50 text-blue-700",   verified:true  },
  { id:"3",  name:"ইসলামী ব্যাংক বাংলাদেশ",        subtitle:"ইসলামী ব্যাংকিং",  address:"কলেজ রোড, টাঙ্গাইল সদর",        phone:"0921-62602", badge:"ব্যাংক",  badgeColor:"bg-blue-50 text-blue-700",   verified:true  },
  { id:"4",  name:"ডাচ-বাংলা ব্যাংক, টাঙ্গাইল",   subtitle:"বেসরকারি ব্যাংক",  address:"শহীদ স্মরণী, টাঙ্গাইল",         phone:"0921-62603", badge:"ব্যাংক",  badgeColor:"bg-blue-50 text-blue-700",   verified:true  },
  { id:"5",  name:"ব্র্যাক ব্যাংক টাঙ্গাইল",       subtitle:"বেসরকারি ব্যাংক",  address:"পাথালিয়া, টাঙ্গাইল সদর",       phone:"01711444401", badge:"ব্যাংক", badgeColor:"bg-blue-50 text-blue-700",   verified:true  },
  // ATM
  { id:"6",  name:"ডাচ-বাংলা ব্যাংক ATM",          subtitle:"২৪ ঘণ্টা",         address:"বঙ্গবন্ধু সড়ক, টাঙ্গাইল",      badge:"এটিএম",   badgeColor:"bg-green-50 text-green-700", hours:"২৪ ঘণ্টা" },
  { id:"7",  name:"ব্র্যাক ব্যাংক ATM",             subtitle:"২৪ ঘণ্টা",         address:"নিউ মার্কেট, টাঙ্গাইল",         badge:"এটিএম",   badgeColor:"bg-green-50 text-green-700", hours:"২৪ ঘণ্টা" },
  { id:"8",  name:"বিকাশ পয়েন্ট — আল-আমিন স্টোর", subtitle:"মোবাইল ব্যাংকিং",  address:"বাজার রোড, মির্জাপুর",           phone:"01711444402", badge:"মোবাইল ব্যাংকিং", badgeColor:"bg-pink-50 text-pink-700" },
  // Market
  { id:"9",  name:"টাঙ্গাইল পৌর কাপড়ের বাজার",    subtitle:"পাইকারি ও খুচরা",  address:"পৌর মার্কেট, টাঙ্গাইল সদর",    badge:"ক্রয়-বিক্রয়", badgeColor:"bg-amber-50 text-amber-700" },
  { id:"10", name:"মধুপুর কাঁচাবাজার",              subtitle:"কাঁচামাল বাজার",   address:"মধুপুর বাজার",                   badge:"ক্রয়-বিক্রয়", badgeColor:"bg-amber-50 text-amber-700" },
];

const typeFilters = [
  {id:"ব্যাংক",label:"ব্যাংক"}, {id:"এটিএম",label:"এটিএম"},
  {id:"মোবাইল ব্যাংকিং",label:"মোবাইল ব্যাংকিং"}, {id:"ক্রয়-বিক্রয়",label:"ক্রয়-বিক্রয়"},
];

export default function FinancePage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = finances.filter(f =>
    (!search || f.name.includes(search) || f.address?.includes(search)) &&
    (!type || f.badge === type)
  );
  return (
    <ServicePageLayout title="আর্থিক সেবা" subtitle="টাঙ্গাইল জেলার ব্যাংক, এটিএম ও আর্থিক সেবা" emoji="🏦" accentColor="bg-teal-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ব্যাংক বা সেবার নাম..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সেবা পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(f => <ServiceCard key={f.id} item={f} accentColor="text-teal-700" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো সেবা পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
