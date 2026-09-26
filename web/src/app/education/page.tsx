"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search } from "lucide-react";

const institutions: ServiceItem[] = [
  { id:"1",  name:"টাঙ্গাইল সরকারি উচ্চ বিদ্যালয়",      subtitle:"মাধ্যমিক বিদ্যালয়",  address:"বিন্দুবাসিনী রোড, টাঙ্গাইল সদর", phone:"0921-62300", verified:true,  badge:"স্কুল",          badgeColor:"bg-blue-50 text-blue-700"    },
  { id:"2",  name:"বিন্দুবাসিনী সরকারি বালক উচ্চ বিদ্যালয়",subtitle:"মাধ্যমিক বিদ্যালয়",address:"টাঙ্গাইল সদর",                   phone:"0921-62301", verified:true,  badge:"স্কুল",          badgeColor:"bg-blue-50 text-blue-700"    },
  { id:"3",  name:"টাঙ্গাইল সরকারি কলেজ",                  subtitle:"উচ্চ মাধ্যমিক ও ডিগ্রি",address:"কলেজ রোড, টাঙ্গাইল সদর",       phone:"0921-62400", verified:true,  badge:"কলেজ",           badgeColor:"bg-purple-50 text-purple-700" },
  { id:"4",  name:"মাওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়",subtitle:"বিশ্ববিদ্যালয়",address:"সন্তোষ, টাঙ্গাইল সদর",  phone:"0921-62500", verified:true,  badge:"বিশ্ববিদ্যালয়", badgeColor:"bg-red-50 text-red-700"      },
  { id:"5",  name:"টাঙ্গাইল পলিটেকনিক ইনস্টিটিউট",         subtitle:"কারিগরি শিক্ষা",     address:"পলিটেকনিক রোড, টাঙ্গাইল",       phone:"0921-62600", verified:true,  badge:"ট্রেনিং",        badgeColor:"bg-amber-50 text-amber-700"  },
  { id:"6",  name:"দারুল উলুম মাদ্রাসা, টাঙ্গাইল",         subtitle:"আলিম মাদ্রাসা",      address:"টাঙ্গাইল সদর",                   phone:"01711222201", verified:false, badge:"মাদ্রাসা",       badgeColor:"bg-green-50 text-green-700"  },
  { id:"7",  name:"মির্জাপুর ক্যাডেট কলেজ",                subtitle:"উচ্চ মাধ্যমিক",      address:"মির্জাপুর, টাঙ্গাইল",            phone:"0921-75300", verified:true,  badge:"কলেজ",           badgeColor:"bg-purple-50 text-purple-700" },
  { id:"8",  name:"টাঙ্গাইল পাবলিক লাইব্রেরি",             subtitle:"সরকারি লাইব্রেরি",   address:"শহীদ স্মরণী, টাঙ্গাইল সদর",     phone:"0921-62700", verified:true,  badge:"লাইব্রেরি",      badgeColor:"bg-teal-50 text-teal-700"    },
  { id:"9",  name:"ব্রিটিশ কাউন্সিল টাঙ্গাইল",             subtitle:"ভাষা প্রশিক্ষণ",     address:"বাসস্ট্যান্ড রোড, টাঙ্গাইল",    phone:"01711222202", verified:false, badge:"ট্রেনিং",        badgeColor:"bg-amber-50 text-amber-700"  },
  { id:"10", name:"কাদির মোল্লা সিটি কলেজ",                subtitle:"উচ্চ মাধ্যমিক",      address:"ঘাটাইল, টাঙ্গাইল",              phone:"01711222203", verified:false, badge:"কলেজ",           badgeColor:"bg-purple-50 text-purple-700" },
];

const typeFilters = [
  {id:"স্কুল",label:"স্কুল"}, {id:"কলেজ",label:"কলেজ"},
  {id:"বিশ্ববিদ্যালয়",label:"বিশ্ববিদ্যালয়"}, {id:"মাদ্রাসা",label:"মাদ্রাসা"},
  {id:"লাইব্রেরি",label:"লাইব্রেরি"}, {id:"ট্রেনিং",label:"ট্রেনিং"},
];

export default function EducationPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = institutions.filter(i =>
    (!search || i.name.includes(search) || i.address?.includes(search)) &&
    (!type || i.badge === type)
  );
  return (
    <ServicePageLayout title="শিক্ষা প্রতিষ্ঠান" subtitle={`টাঙ্গাইল জেলার ${institutions.length}টি শিক্ষা প্রতিষ্ঠান`} emoji="🎓" accentColor="bg-blue-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="প্রতিষ্ঠানের নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি প্রতিষ্ঠান পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(i => <ServiceCard key={i.id} item={i} accentColor="text-blue-700" />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো প্রতিষ্ঠান পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
