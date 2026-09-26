"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { Search, Phone } from "lucide-react";

const orgs = [
  { id:"1",  name:"টাঙ্গাইল জেলা পরিষদ",               type:"সরকারি",   desc:"জেলা প্রশাসন ও উন্নয়ন পরিচালনা",             phone:"0921-62100", address:"জেলা পরিষদ ভবন, টাঙ্গাইল সদর" },
  { id:"2",  name:"টাঙ্গাইল পৌরসভা",                    type:"সরকারি",   desc:"পৌর এলাকার নাগরিক সেবা",                      phone:"0921-62200", address:"পৌরসভা ভবন, টাঙ্গাইল সদর"      },
  { id:"3",  name:"টাঙ্গাইল চেম্বার অব কমার্স",          type:"ব্যবসায়িক",desc:"ব্যবসায়িক সংগঠন ও উদ্যোক্তা উন্নয়ন",         phone:"0921-62300", address:"চেম্বার ভবন, টাঙ্গাইল সদর"     },
  { id:"4",  name:"টাঙ্গাইল প্রেস ক্লাব",                type:"সাংস্কৃতিক",desc:"সাংবাদিকদের পেশাদার সংগঠন",                  phone:"0921-62400", address:"শহীদ স্মরণী, টাঙ্গাইল"         },
  { id:"5",  name:"ব্র্যাক টাঙ্গাইল জোনাল অফিস",        type:"এনজিও",    desc:"স্বাস্থ্য, শিক্ষা ও দারিদ্র্য বিমোচন কার্যক্রম",phone:"01711777701", address:"টাঙ্গাইল সদর"               },
  { id:"6",  name:"আশা এনজিও, টাঙ্গাইল",                type:"এনজিও",    desc:"ক্ষুদ্রঋণ ও সামাজিক উন্নয়ন",                  phone:"01711777702", address:"বাজার রোড, টাঙ্গাইল"          },
  { id:"7",  name:"টাঙ্গাইল জেলা ক্রীড়া সংস্থা",       type:"ক্রীড়া",  desc:"ক্রীড়া উন্নয়ন ও প্রতিযোগিতা আয়োজন",          phone:"01711777703", address:"স্টেডিয়াম, টাঙ্গাইল সদর"     },
  { id:"8",  name:"টাঙ্গাইল মহিলা সমিতি",               type:"সামাজিক",  desc:"মহিলাদের ক্ষমতায়ন ও সেবা",                    phone:"01711777704", address:"মহিলা সমিতি ভবন, টাঙ্গাইল"   },
  { id:"9",  name:"রেড ক্রিসেন্ট, টাঙ্গাইল",            type:"সেবামূলক", desc:"দুর্যোগ ব্যবস্থাপনা ও রক্তদান কার্যক্রম",    phone:"01711777705", address:"টাঙ্গাইল সদর"                  },
  { id:"10", name:"টাঙ্গাইল সাহিত্য সংসদ",              type:"সাংস্কৃতিক",desc:"সাহিত্য ও সংস্কৃতি চর্চা",                   phone:"01711777706", address:"শহীদ স্মরণী, টাঙ্গাইল"         },
];

const typeBadge: Record<string, string> = {
  "সরকারি":"bg-blue-50 text-blue-700", "এনজিও":"bg-green-50 text-green-700",
  "ব্যবসায়িক":"bg-amber-50 text-amber-700", "সাংস্কৃতিক":"bg-purple-50 text-purple-700",
  "ক্রীড়া":"bg-orange-50 text-orange-700", "সামাজিক":"bg-pink-50 text-pink-700",
  "সেবামূলক":"bg-red-50 text-red-700",
};
const typeFilters = ["সরকারি","এনজিও","ব্যবসায়িক","সাংস্কৃতিক","ক্রীড়া","সামাজিক","সেবামূলক"]
  .map(t=>({id:t,label:t}));

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const filtered = orgs.filter(o =>
    (!search || o.name.includes(search) || o.desc.includes(search)) &&
    (!type || o.type === type)
  );
  return (
    <ServicePageLayout title="সংগঠন ও সম্প্রদায়" subtitle="টাঙ্গাইল জেলার সংগঠন, প্রতিষ্ঠান ও এনজিও" emoji="🤝" accentColor="bg-emerald-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="সংগঠনের নাম..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-5"><FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" /></div>
      <p className="text-sm text-gray-500 mb-4">{filtered.length}টি সংগঠন পাওয়া গেছে</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(o => (
          <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🤝</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-bold text-gray-800 text-sm">{o.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[o.type]??""}`}>{o.type}</span>
                </div>
                <p className="text-xs text-gray-500">{o.desc}</p>
                <p className="text-xs text-gray-400 mt-1">📍 {o.address}</p>
              </div>
            </div>
            {o.phone && (
              <a href={`tel:${o.phone}`} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors w-fit mt-2">
                <Phone size={12}/> {o.phone}
              </a>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো সংগঠন পাওয়া যায়নি</div>}
      </div>
    </ServicePageLayout>
  );
}
