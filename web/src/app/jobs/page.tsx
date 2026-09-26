"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Calendar, MapPin, ExternalLink } from "lucide-react";

interface Job {
  id: string;
  title: string;
  org: string;
  type: string;
  deadline: string;
  location: string;
  link?: string;
  isGovt: boolean;
}

const jobs: Job[] = [
  { id:"1", title:"উপজেলা স্বাস্থ্য সহকারী",          org:"স্বাস্থ্য অধিদপ্তর",             type:"govt",    deadline:"৩০ অক্টোবর ২০২৬", location:"টাঙ্গাইল", link:"https://dghs.teletalk.com.bd", isGovt:true  },
  { id:"2", title:"প্রাথমিক বিদ্যালয় সহকারী শিক্ষক",  org:"প্রাথমিক শিক্ষা অধিদপ্তর",       type:"govt",    deadline:"১৫ নভেম্বর ২০২৬", location:"টাঙ্গাইল", link:"https://dpe.teletalk.com.bd",  isGovt:true  },
  { id:"3", title:"ব্যাংক অফিসার",                     org:"সোনালী ব্যাংক, টাঙ্গাইল শাখা",   type:"bank",    deadline:"২০ অক্টোবর ২০২৬", location:"টাঙ্গাইল সদর", isGovt:false },
  { id:"4", title:"সেলস এক্সিকিউটিভ",                  org:"গ্রামীণফোন ডিলার, টাঙ্গাইল",    type:"private", deadline:"চলমান",            location:"টাঙ্গাইল সদর", isGovt:false },
  { id:"5", title:"এনজিও ফিল্ড অফিসার",                org:"ব্র্যাক, টাঙ্গাইল",              type:"ngo",     deadline:"চলমান",            location:"মধুপুর",       isGovt:false },
  { id:"6", title:"হিসাবরক্ষক",                        org:"টাঙ্গাইল টেক্সটাইল মিল",         type:"private", deadline:"৩১ অক্টোবর ২০২৬", location:"কালিহাতী",     isGovt:false },
  { id:"7", title:"পুলিশ কনস্টেবল",                   org:"বাংলাদেশ পুলিশ",                  type:"govt",    deadline:"১০ নভেম্বর ২০২৬", location:"টাঙ্গাইল", link:"https://police.teletalk.com.bd", isGovt:true },
  { id:"8", title:"মাঠকর্মী",                          org:"আশা এনজিও, টাঙ্গাইল",            type:"ngo",     deadline:"চলমান",            location:"গোপালপুর",     isGovt:false },
];

const typeFilters = [
  {id:"govt",label:"সরকারি"}, {id:"private",label:"বেসরকারি"},
  {id:"bank",label:"ব্যাংক"},  {id:"ngo",label:"এনজিও"},
];

const typeBadge: Record<string, string> = {
  govt:"bg-blue-50 text-blue-700", private:"bg-purple-50 text-purple-700",
  bank:"bg-green-50 text-green-700", ngo:"bg-amber-50 text-amber-700",
};
const typeLabel: Record<string, string> = {
  govt:"সরকারি", private:"বেসরকারি", bank:"ব্যাংক", ngo:"এনজিও",
};

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = jobs.filter(j =>
    (!search || j.title.includes(search) || j.org.includes(search)) &&
    (!type || j.type === type)
  );
  return (
    <ServicePageLayout title="চাকরির বিজ্ঞাপন" subtitle="টাঙ্গাইল জেলার সরকারি ও বেসরকারি চাকরির তথ্য" emoji="💼" accentColor="bg-violet-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="পদের নাম বা প্রতিষ্ঠান..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি বিজ্ঞাপন পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(j => (
          <div key={j.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{j.title}</h3>
                <p className="text-xs text-violet-600 font-semibold">{j.org}</p>
              </div>
              <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadge[j.type]}`}>
                {typeLabel[j.type]}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1"><MapPin size={11}/>{j.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11}/>শেষ: {j.deadline}</span>
            </div>
            {j.link ? (
              <a href={j.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold py-2 rounded-full transition-colors">
                আবেদন করুন <ExternalLink size={12}/>
              </a>
            ) : (
              <div className="w-full bg-gray-100 text-gray-500 text-xs font-semibold py-2 rounded-full text-center">
                সরাসরি যোগাযোগ করুন
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো বিজ্ঞাপন পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
