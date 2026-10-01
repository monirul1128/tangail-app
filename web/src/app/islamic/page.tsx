"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import { UPAZILAS } from "@/lib/constants";
import { Suspense } from "react";

const typeFilters = [
  { id: "mosque",  label: "মসজিদ"   },
  { id: "temple",  label: "মন্দির"   },
  { id: "mazar",   label: "মাজার"    },
  { id: "church",  label: "চার্চ"    },
  { id: "namaz",   label: "নামাজ"   },
  { id: "roja",    label: "রোজা"    },
  { id: "hajj",    label: "হজ্জ"    },
  { id: "zakat",   label: "জাকাত"   },
];

const typeBadge: Record<string, string> = {
  mosque:  "bg-emerald-50 text-emerald-700",
  temple:  "bg-orange-50 text-orange-700",
  mazar:   "bg-purple-50 text-purple-700",
  church:  "bg-blue-50 text-blue-700",
};

const typeEmoji: Record<string, string> = {
  mosque: "🕌", temple: "🛕", mazar: "🪦", church: "⛪", other: "🏛️",
};

const islamicInfo = [
  {
    type: "namaz", title: "নামাজের সময়সূচি", emoji: "🙏",
    color: "bg-emerald-50 border-emerald-200", titleColor: "text-emerald-700",
    content: [
      { label: "ফজর",    time: "ভোর ৪:৩০ (আনুমানিক)" },
      { label: "জোহর",   time: "দুপুর ১২:০০"           },
      { label: "আসর",    time: "বিকেল ৪:১৫"             },
      { label: "মাগরিব", time: "সন্ধ্যা ৬:৩০"           },
      { label: "এশা",    time: "রাত ৭:৪৫"               },
    ],
    note: "* সময় ঋতু অনুযায়ী পরিবর্তন হয়।", link: null,
  },
  {
    type: "roja", title: "রোজার তথ্য", emoji: "🌙",
    color: "bg-blue-50 border-blue-200", titleColor: "text-blue-700",
    content: [
      { label: "রমজান মাস",    time: "ইসলামিক ক্যালেন্ডার অনুযায়ী" },
      { label: "সেহরির সময়",  time: "ফজরের আযানের আগে"              },
      { label: "ইফতারের সময়", time: "মাগরিবের আযানের সাথে"          },
      { label: "তারাবির নামাজ",time: "এশার নামাজের পর"                },
    ],
    note: "* রমজানের সময়সূচির জন্য ইসলামিক ফাউন্ডেশন বাংলাদেশ দেখুন।",
    link: "https://islamicfoundation.gov.bd",
  },
  {
    type: "hajj", title: "হজ্জ তথ্য ও নিবন্ধন", emoji: "🕋",
    color: "bg-amber-50 border-amber-200", titleColor: "text-amber-700",
    content: [
      { label: "হজ্জ নিবন্ধন",      time: "ইসলামিক ফাউন্ডেশন বাংলাদেশ" },
      { label: "টাঙ্গাইল কার্যালয়", time: "ইসলামিক ফাউন্ডেশন, টাঙ্গাইল" },
      { label: "যোগাযোগ",           time: "0921-62050"                     },
      { label: "হজ্জ প্যাকেজ",      time: "প্রতি বছর সরকারি ঘোষণা অনুযায়ী" },
    ],
    note: "* ধর্ম মন্ত্রণালয়ের অনলাইন পোর্টালে আবেদন করুন।",
    link: "https://hajj.gov.bd",
  },
  {
    type: "zakat", title: "জাকাত তথ্য", emoji: "💰",
    color: "bg-purple-50 border-purple-200", titleColor: "text-purple-700",
    content: [
      { label: "জাকাতের নিসাব",   time: "৭.৫ তোলা সোনা বা ৫২.৫ তোলা রুপার সমতুল্য" },
      { label: "জাকাতের হার",      time: "মোট সম্পদের ২.৫%"                           },
      { label: "ফিতরার পরিমাণ",   time: "সরকারি ঘোষণা অনুযায়ী (রমজানে)"             },
      { label: "বিতরণ কেন্দ্র",   time: "ইসলামিক ফাউন্ডেশন, টাঙ্গাইল"                },
    ],
    note: "* ইসলামিক ফাউন্ডেশনের জাকাত ক্যালকুলেটর ব্যবহার করুন।",
    link: "https://islamicfoundation.gov.bd/zakat",
  },
];

interface ReligiousPlace {
  id: string; name: string; type: string; upazilaId: string;
  address: string; phone: string; note: string;
  imageUrl: string; isVerified: boolean; isHistoric: boolean;
}

function IslamicInner() {
  const searchParams = useSearchParams();
  const [places, setPlaces]   = useState<ReligiousPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(searchParams.get("type") ?? "");

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(query(collection(db, "islamic_places"), orderBy("name")));
        setPlaces(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReligiousPlace)));
      } catch {
        try {
          const snap = await getDocs(collection(db, "islamic_places"));
          setPlaces(snap.docs.map(d => ({ id: d.id, ...d.data() } as ReligiousPlace)));
        } catch { setPlaces([]); }
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  // Places from Firestore filtered by type
  const placeTypes = ["mosque", "temple", "mazar", "church"];
  const isPlaceType = !selected || placeTypes.includes(selected);
  const filteredPlaces = places.filter(p => !selected || p.type === selected);

  return (
    <ServicePageLayout
      title="ধর্মীয় সেবা"
      subtitle="মসজিদ, মন্দির, নামাজ, রোজা, হজ্জ ও জাকাতের তথ্য"
      emoji="🕌"
      accentColor="bg-emerald-700"
    >
      <div className="mb-6">
        <FilterChips options={typeFilters} selected={selected} onChange={setSelected} allLabel="সব" />
      </div>

      {/* ── Firestore places (mosque/temple/mazar/church) ── */}
      {isPlaceType && (
        <section className="mb-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-4 animate-pulse h-28 border border-gray-100" />)}
            </div>
          ) : filteredPlaces.length === 0 && !selected ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100 mb-4">
              <p className="text-3xl mb-2">🕌</p>
              <p className="text-sm">অ্যাডমিন প্যানেল থেকে মসজিদ/মন্দির যোগ করুন</p>
            </div>
          ) : filteredPlaces.length === 0 && selected ? (
            <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-gray-100 mb-4">
              <p className="text-sm">এই ধরনের কোনো স্থান পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {filteredPlaces.map(p => {
                const uName = UPAZILAS.find(u => u.id === p.upazilaId)?.name ?? p.upazilaId;
                return (
                  <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-36 object-cover rounded-xl mb-3" />
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {typeEmoji[p.type] ?? "🏛️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-800 text-sm">{p.name}</h3>
                          {p.isVerified && <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓ ভেরিফাইড</span>}
                          {p.isHistoric && <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full">ঐতিহাসিক</span>}
                        </div>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1.5 ${typeBadge[p.type] ?? "bg-gray-100 text-gray-600"}`}>{uName}</span>
                        {p.address && (
                          <div className="flex items-start gap-1 text-xs text-gray-500 mb-1">
                            <MapPin size={11} className="mt-0.5 flex-shrink-0" />{p.address}
                          </div>
                        )}
                        {p.note && <p className="text-xs text-amber-600 font-medium mt-1">📜 {p.note}</p>}
                      </div>
                    </div>
                    {p.phone && (
                      <a href={`tel:${p.phone}`}
                        className="mt-3 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit transition-colors">
                        <Phone size={12} /> {p.phone}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── Islamic info cards (namaz/roja/hajj/zakat) ── */}
      {islamicInfo
        .filter(info => !selected || selected === info.type)
        .map(info => (
          <section key={info.type} className="mb-6">
            <div className={`rounded-2xl border p-5 ${info.color}`}>
              <h2 className={`font-black text-base mb-4 flex items-center gap-2 ${info.titleColor}`}>
                <span className="text-2xl">{info.emoji}</span>{info.title}
              </h2>
              <div className="space-y-2 mb-3">
                {info.content.map(item => (
                  <div key={item.label} className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500 text-right max-w-[60%]">{item.time}</span>
                  </div>
                ))}
              </div>
              {info.note && <p className={`text-xs ${info.titleColor} opacity-80 mb-3`}>{info.note}</p>}
              {info.link && (
                <a href={info.link} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${info.titleColor} hover:underline`}>
                  ওয়েবসাইট দেখুন <ExternalLink size={12} />
                </a>
              )}
            </div>
          </section>
        ))}

      {/* Islamic Foundation */}
      {(!selected || selected === "mosque" || selected === "namaz") && (
        <div className="bg-emerald-700 rounded-2xl p-5 text-white mt-2">
          <h3 className="font-bold text-base mb-3">🏛️ ইসলামিক ফাউন্ডেশন, টাঙ্গাইল</h3>
          <div className="space-y-2 text-sm text-white/80 mb-4">
            <div className="flex items-center gap-2"><MapPin size={14} className="text-white/60" /> ইসলামিক ফাউন্ডেশন ভবন, টাঙ্গাইল সদর</div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-white/60" /> 0921-62050</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <a href="tel:0921-62050" className="flex items-center gap-1.5 bg-white text-emerald-700 font-bold text-xs px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
              <Phone size={13} /> কল করুন
            </a>
            <a href="https://islamicfoundation.gov.bd" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors">
              <ExternalLink size={13} /> ওয়েবসাইট
            </a>
          </div>
        </div>
      )}
    </ServicePageLayout>
  );
}

export default function IslamicPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <IslamicInner />
    </Suspense>
  );
}
