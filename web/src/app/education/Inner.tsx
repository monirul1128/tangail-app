"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import ServiceCard, { ServiceItem } from "@/components/ui/ServiceCard";
import FilterChips from "@/components/ui/FilterChips";
import { Search, ExternalLink } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";

const typeFilters = [
  { id: "school",     label: "স্কুল"          },
  { id: "college",    label: "কলেজ"           },
  { id: "university", label: "বিশ্ববিদ্যালয়"  },
  { id: "madrasa",    label: "মাদ্রাসা"        },
  { id: "coaching",   label: "কোচিং সেন্টার"  },
  { id: "tuition",    label: "টিউশন সেবা"     },
  { id: "library",    label: "লাইব্রেরি"       },
  { id: "training",   label: "ট্রেনিং সেন্টার" },
  { id: "result",     label: "রেজাল্ট"         },
];
const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

const badgeColors: Record<string, string> = {
  school:     "bg-blue-50 text-blue-700",
  college:    "bg-purple-50 text-purple-700",
  university: "bg-red-50 text-red-700",
  madrasa:    "bg-green-50 text-green-700",
  coaching:   "bg-sky-50 text-sky-700",
  tuition:    "bg-indigo-50 text-indigo-700",
  library:    "bg-teal-50 text-teal-700",
  training:   "bg-amber-50 text-amber-700",
  result:     "bg-teal-50 text-teal-700",
};

// ── Static result links — no Firestore needed ──────────────────────────────
const resultLinks = [
  {
    exam: "SSC / দাখিল",
    board: "ঢাকা শিক্ষাবোর্ড",
    description: "মাধ্যমিক স্কুল সার্টিফিকেট পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.educationboardresults.gov.bd", primary: true },
      { label: "মার্কশিট", url: "https://www.educationboardresults.gov.bd", primary: false },
    ],
    color: "bg-blue-50 border-blue-100",
    titleColor: "text-blue-700",
    emoji: "📘",
  },
  {
    exam: "HSC / আলিম",
    board: "ঢাকা শিক্ষাবোর্ড",
    description: "উচ্চ মাধ্যমিক সার্টিফিকেট পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.educationboardresults.gov.bd", primary: true },
      { label: "মার্কশিট", url: "https://www.educationboardresults.gov.bd", primary: false },
    ],
    color: "bg-purple-50 border-purple-100",
    titleColor: "text-purple-700",
    emoji: "📗",
  },
  {
    exam: "JSC / JDC",
    board: "ঢাকা শিক্ষাবোর্ড",
    description: "জুনিয়র স্কুল সার্টিফিকেট পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.educationboardresults.gov.bd", primary: true },
    ],
    color: "bg-green-50 border-green-100",
    titleColor: "text-green-700",
    emoji: "📒",
  },
  {
    exam: "PSC / EBT",
    board: "প্রাথমিক শিক্ষা অধিদপ্তর",
    description: "প্রাথমিক শিক্ষা সমাপনী পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.dpe.gov.bd", primary: true },
    ],
    color: "bg-amber-50 border-amber-100",
    titleColor: "text-amber-700",
    emoji: "📔",
  },
  {
    exam: "NU অনার্স / মাস্টার্স",
    board: "জাতীয় বিশ্ববিদ্যালয়",
    description: "ডিগ্রি, অনার্স ও মাস্টার্স পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.nu.ac.bd/results", primary: true },
      { label: "NU ওয়েবসাইট", url: "https://www.nu.ac.bd", primary: false },
    ],
    color: "bg-red-50 border-red-100",
    titleColor: "text-red-700",
    emoji: "🎓",
  },
  {
    exam: "মাদ্রাসা (দাখিল/আলিম/ফাজিল)",
    board: "বাংলাদেশ মাদ্রাসা শিক্ষাবোর্ড",
    description: "মাদ্রাসা শিক্ষাবোর্ডের সকল পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.educationboardresults.gov.bd", primary: true },
      { label: "মাদ্রাসা বোর্ড", url: "http://www.bmeb.gov.bd", primary: false },
    ],
    color: "bg-emerald-50 border-emerald-100",
    titleColor: "text-emerald-700",
    emoji: "📖",
  },
  {
    exam: "কারিগরি (SSC/HSC Voc)",
    board: "বাংলাদেশ কারিগরি শিক্ষাবোর্ড",
    description: "ভোকেশনাল ও কারিগরি পরীক্ষার ফলাফল",
    links: [
      { label: "ফলাফল দেখুন", url: "https://www.bteb.gov.bd", primary: true },
    ],
    color: "bg-indigo-50 border-indigo-100",
    titleColor: "text-indigo-700",
    emoji: "🔧",
  },
  {
    exam: "SMS-এ রেজাল্ট",
    board: "সকল বোর্ড",
    description: "মোবাইলে SMS পাঠিয়ে ফলাফল জানুন",
    links: [
      { label: "SMS পদ্ধতি জানুন", url: "https://www.educationboardresults.gov.bd", primary: true },
    ],
    color: "bg-pink-50 border-pink-100",
    titleColor: "text-pink-700",
    emoji: "📱",
    extra: "DPE/SSC/HSC <Roll> <Board> <Year> টাইপ করে 16222 নম্বরে SMS করুন",
  },
];

export default function EducationPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");
  const [upazila, setUpazila] = useState(searchParams.get("upazila") ?? "");

  useEffect(() => {
    getDocs(query(collection(db, "education"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          return {
            id: d.id, name: x.name,
            subtitle: x.principalName ?? x.nameEn ?? "",
            address: x.address, phone: x.phone ?? "",
            verified: x.isVerified,
            badge: x.type,
            badgeColor: badgeColors[x.type] ?? "bg-gray-100 text-gray-600",
            extra: x.isGovt ? "সরকারি প্রতিষ্ঠান" : "",
            _upazilaId: x.upazilaId,
          };
        }));
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(i =>
    (!search  || i.name.toLowerCase().includes(search.toLowerCase()) || i.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type    || i.badge === type) &&
    (!upazila || i._upazilaId === upazila)
  );

  return (
    <ServicePageLayout title="শিক্ষা প্রতিষ্ঠান" subtitle="টাঙ্গাইল জেলার শিক্ষা প্রতিষ্ঠান, কোচিং ও টিউশন সেবা" emoji="🎓" accentColor="bg-blue-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="প্রতিষ্ঠানের নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">ধরন</p>
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>

      {/* ── রেজাল্ট section — shown only when type=result ── */}
      {type === "result" ? (
        <div className="space-y-4 mt-2">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-2">
            <p className="text-blue-800 font-bold text-sm flex items-center gap-2">
              📊 পরীক্ষার ফলাফল পোর্টাল
            </p>
            <p className="text-blue-600 text-xs mt-1">
              নিচের লিংকগুলোতে ক্লিক করে সরাসরি অফিসিয়াল বোর্ড সাইটে যান
            </p>
          </div>
          {resultLinks.map(r => (
            <div key={r.exam} className={`rounded-2xl border p-4 ${r.color}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl flex-shrink-0">{r.emoji}</span>
                <div className="flex-1">
                  <h3 className={`font-bold text-base ${r.titleColor}`}>{r.exam}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{r.board}</p>
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                  {r.extra && (
                    <div className="mt-2 bg-white/70 rounded-lg px-3 py-1.5 text-xs text-gray-600 font-medium">
                      💡 {r.extra}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.links.map(l => (
                  <a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                      l.primary
                        ? "bg-blue-700 hover:bg-blue-800 text-white"
                        : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {l.label} <ExternalLink size={11} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-semibold mb-1.5">উপজেলা</p>
            <FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" />
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{filtered.length}টি পাওয়া গেছে</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(i => <ServiceCard key={i.id} item={i} accentColor="text-blue-700" />)}
                {filtered.length === 0 && (
                  <div className="col-span-2 text-center py-16 text-gray-400">
                    কোনো প্রতিষ্ঠান পাওয়া যায়নি।
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </ServicePageLayout>
  );
}

const typeFilters = [
  { id: "school",     label: "স্কুল"          },
  { id: "college",    label: "কলেজ"           },
  { id: "university", label: "বিশ্ববিদ্যালয়"  },
  { id: "madrasa",    label: "মাদ্রাসা"        },
  { id: "coaching",   label: "কোচিং সেন্টার"  },
  { id: "tuition",    label: "টিউশন সেবা"     },
  { id: "library",    label: "লাইব্রেরি"       },
  { id: "training",   label: "ট্রেনিং সেন্টার" },
  { id: "result",     label: "রেজাল্ট"         },
];
const upazilaFilters = [...UPAZILAS].map(u => ({ id: u.id, label: u.name }));

const badgeColors: Record<string, string> = {
  school:     "bg-blue-50 text-blue-700",
  college:    "bg-purple-50 text-purple-700",
  university: "bg-red-50 text-red-700",
  madrasa:    "bg-green-50 text-green-700",
  coaching:   "bg-sky-50 text-sky-700",
  tuition:    "bg-indigo-50 text-indigo-700",
  library:    "bg-teal-50 text-teal-700",
  training:   "bg-amber-50 text-amber-700",
  result:     "bg-teal-50 text-teal-700",
};

export default function EducationPage() {
  const searchParams = useSearchParams();
  const [all, setAll]         = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState(searchParams.get("type") ?? "");
  const [upazila, setUpazila] = useState(searchParams.get("upazila") ?? "");

  useEffect(() => {
    getDocs(query(collection(db, "education"), orderBy("name")))
      .then(snap => {
        setAll(snap.docs.map(d => {
          const x = d.data();
          return {
            id: d.id, name: x.name,
            subtitle: x.principalName ?? x.nameEn ?? "",
            address: x.address, phone: x.phone ?? "",
            verified: x.isVerified,
            badge: x.type,
            badgeColor: badgeColors[x.type] ?? "bg-gray-100 text-gray-600",
            extra: x.isGovt ? "সরকারি প্রতিষ্ঠান" : "",
            _upazilaId: x.upazilaId,
          };
        }));
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = all.filter(i =>
    (!search  || i.name.toLowerCase().includes(search.toLowerCase()) || i.address?.toLowerCase().includes(search.toLowerCase())) &&
    (!type    || i.badge === type) &&
    (!upazila || i._upazilaId === upazila)
  );

  return (
    <ServicePageLayout title="শিক্ষা প্রতিষ্ঠান" subtitle="টাঙ্গাইল জেলার শিক্ষা প্রতিষ্ঠান, কোচিং ও টিউশন সেবা" emoji="🎓" accentColor="bg-blue-700">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 mb-4">
        <Search size={15} className="text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="প্রতিষ্ঠানের নাম বা ঠিকানা..." className="flex-1 outline-none text-sm bg-transparent" />
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">ধরন</p>
        <FilterChips options={typeFilters} selected={type} onChange={setType} allLabel="সব ধরন" />
      </div>
      <div className="mb-5">
        <p className="text-xs text-gray-500 font-semibold mb-1.5">উপজেলা</p>
        <FilterChips options={upazilaFilters} selected={upazila} onChange={setUpazila} allLabel="সব উপজেলা" />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtered.length}টি পাওয়া গেছে</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(i => <ServiceCard key={i.id} item={i} accentColor="text-blue-700" />)}
            {filtered.length === 0 && <div className="col-span-2 text-center py-16 text-gray-400">কোনো প্রতিষ্ঠান পাওয়া যায়নি।</div>}
          </div>
        </>
      )}
    </ServicePageLayout>
  );
}
