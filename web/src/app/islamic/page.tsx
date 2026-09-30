"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import FilterChips from "@/components/ui/FilterChips";
import { MapPin, Phone, ExternalLink } from "lucide-react";

const typeFilters = [
  { id: "mosque", label: "মসজিদ" },
  { id: "temple", label: "মন্দির" },
  { id: "namaz",  label: "নামাজ"  },
  { id: "roja",   label: "রোজা"   },
  { id: "hajj",   label: "হজ্জ"   },
  { id: "zakat",  label: "জাকাত"  },
];

const mosques = [
  { name: "টাঙ্গাইল কেন্দ্রীয় জামে মসজিদ",   address: "কেন্দ্রীয় মসজিদ রোড, টাঙ্গাইল সদর", phone: "0921-62001", upazila: "সদর"      },
  { name: "আতিয়া জামে মসজিদ (ঐতিহাসিক)",    address: "আতিয়া, দেলদুয়ার",                   phone: "",          upazila: "দেলদুয়ার", note: "১৬০৯ খ্রি. — মুঘল আমলে নির্মিত ঐতিহাসিক মসজিদ" },
  { name: "বায়তুল মোকাররম মসজিদ, টাঙ্গাইল",  address: "কলেজ রোড, টাঙ্গাইল সদর",            phone: "0921-62002", upazila: "সদর"      },
  { name: "মির্জাপুর জামে মসজিদ",             address: "মির্জাপুর বাজার, মির্জাপুর",        phone: "",           upazila: "মির্জাপুর" },
  { name: "মধুপুর কেন্দ্রীয় জামে মসজিদ",     address: "মধুপুর বাজার, মধুপুর",              phone: "",           upazila: "মধুপুর"    },
  { name: "ঘাটাইল জামে মসজিদ",               address: "ঘাটাইল বাজার, ঘাটাইল",             phone: "",           upazila: "ঘাটাইল"    },
];

const temples = [
  { name: "টাঙ্গাইল কেন্দ্রীয় মন্দির",       address: "মন্দির রোড, টাঙ্গাইল সদর",         phone: "01711900001", upazila: "সদর"      },
  { name: "কালী মন্দির, টাঙ্গাইল",           address: "পুরান টাঙ্গাইল, সদর",              phone: "",            upazila: "সদর"      },
  { name: "দুর্গা মন্দির, মির্জাপুর",         address: "মির্জাপুর বাজার, মির্জাপুর",      phone: "",            upazila: "মির্জাপুর" },
  { name: "রাধা গোবিন্দ মন্দির, নাগরপুর",    address: "নাগরপুর বাজার, নাগরপুর",          phone: "",            upazila: "নাগরপুর"  },
];

const islamicInfo = [
  {
    type: "namaz",
    title: "নামাজের সময়সূচি",
    emoji: "🙏",
    color: "bg-emerald-50 border-emerald-200",
    titleColor: "text-emerald-700",
    content: [
      { label: "ফজর",    time: "ভোর ৪:৩০ (আনুমানিক)" },
      { label: "জোহর",   time: "দুপুর ১২:০০"           },
      { label: "আসর",    time: "বিকেল ৪:১৫"             },
      { label: "মাগরিব", time: "সন্ধ্যা ৬:৩০"           },
      { label: "এশা",    time: "রাত ৭:৪৫"               },
    ],
    note: "* সময় ঋতু অনুযায়ী পরিবর্তন হয়। সঠিক সময়ের জন্য স্থানীয় মসজিদের নোটিশ বোর্ড দেখুন।",
    link: null,
  },
  {
    type: "roja",
    title: "রোজার তথ্য",
    emoji: "🌙",
    color: "bg-blue-50 border-blue-200",
    titleColor: "text-blue-700",
    content: [
      { label: "রমজান মাস",    time: "ইসলামিক ক্যালেন্ডার অনুযায়ী" },
      { label: "সেহরির সময়",  time: "ফজরের আযানের আগে"               },
      { label: "ইফতারের সময়", time: "মাগরিবের আযানের সাথে"           },
      { label: "তারাবির নামাজ",time: "এশার নামাজের পর"                 },
    ],
    note: "* রমজানের সময়সূচির জন্য ইসলামিক ফাউন্ডেশন বাংলাদেশের ওয়েবসাইট দেখুন।",
    link: "https://islamicfoundation.gov.bd",
  },
  {
    type: "hajj",
    title: "হজ্জ তথ্য ও নিবন্ধন",
    emoji: "🕋",
    color: "bg-amber-50 border-amber-200",
    titleColor: "text-amber-700",
    content: [
      { label: "হজ্জ নিবন্ধন",      time: "ইসলামিক ফাউন্ডেশন বাংলাদেশ" },
      { label: "টাঙ্গাইল কার্যালয়", time: "ইসলামিক ফাউন্ডেশন, টাঙ্গাইল" },
      { label: "যোগাযোগ",           time: "0921-62050"                       },
      { label: "হজ্জ প্যাকেজ",      time: "প্রতি বছর সরকারি ঘোষণা অনুযায়ী" },
    ],
    note: "* হজ্জ নিবন্ধনের জন্য ধর্ম মন্ত্রণালয়ের অনলাইন পোর্টালে আবেদন করুন।",
    link: "https://hajj.gov.bd",
  },
  {
    type: "zakat",
    title: "জাকাত তথ্য",
    emoji: "💰",
    color: "bg-purple-50 border-purple-200",
    titleColor: "text-purple-700",
    content: [
      { label: "জাকাতের নিসাব",   time: "৭.৫ তোলা সোনা বা ৫২.৫ তোলা রুপার সমতুল্য" },
      { label: "জাকাতের হার",      time: "মোট সম্পদের ২.৫%"                             },
      { label: "ফিতরার পরিমাণ",   time: "সরকারি ঘোষণা অনুযায়ী (রমজানে)"               },
      { label: "বিতরণ কেন্দ্র",   time: "ইসলামিক ফাউন্ডেশন, টাঙ্গাইল"                  },
    ],
    note: "* জাকাত হিসাব করতে ইসলামিক ফাউন্ডেশনের জাকাত ক্যালকুলেটর ব্যবহার করুন।",
    link: "https://islamicfoundation.gov.bd/zakat",
  },
];

export default function IslamicPage() {
  const [selected, setSelected] = useState("");

  return (
    <ServicePageLayout
      title="ধর্মীয় সেবা"
      subtitle="মসজিদ, মন্দির, নামাজ, রোজা, হজ্জ ও জাকাতের তথ্য"
      emoji="🕌"
      accentColor="bg-emerald-700"
    >
      <div className="mb-6">
        <FilterChips
          options={typeFilters}
          selected={selected}
          onChange={setSelected}
          allLabel="সব"
        />
      </div>

      {/* Mosques */}
      {(!selected || selected === "mosque") && (
        <section className="mb-8">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-emerald-500 rounded-full" />
            মসজিদ — {mosques.length}টি নিবন্ধিত
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mosques.map((m) => (
              <div key={m.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🕌</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{m.name}</h3>
                    <span className="inline-block text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full mb-1.5">{m.upazila}</span>
                    <div className="flex items-start gap-1 text-xs text-gray-500 mb-1">
                      <MapPin size={11} className="mt-0.5 flex-shrink-0" />{m.address}
                    </div>
                    {m.note && <p className="text-xs text-amber-600 font-medium mt-1">📜 {m.note}</p>}
                  </div>
                </div>
                {m.phone && (
                  <a href={`tel:${m.phone}`}
                    className="mt-3 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit transition-colors">
                    <Phone size={12} /> {m.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Temples */}
      {(!selected || selected === "temple") && (
        <section className="mb-8">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-orange-500 rounded-full" />
            মন্দির — {temples.length}টি নিবন্ধিত
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {temples.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🛕</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{t.name}</h3>
                    <span className="inline-block text-[10px] bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-full mb-1.5">{t.upazila}</span>
                    <div className="flex items-start gap-1 text-xs text-gray-500">
                      <MapPin size={11} className="mt-0.5 flex-shrink-0" />{t.address}
                    </div>
                  </div>
                </div>
                {t.phone && (
                  <a href={`tel:${t.phone}`}
                    className="mt-3 flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full w-fit transition-colors">
                    <Phone size={12} /> {t.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Namaz / Roja / Hajj / Zakat info cards */}
      {islamicInfo
        .filter((info) => !selected || selected === info.type)
        .map((info) => (
          <section key={info.type} className="mb-6">
            <div className={`rounded-2xl border p-5 ${info.color}`}>
              <h2 className={`font-black text-base mb-4 flex items-center gap-2 ${info.titleColor}`}>
                <span className="text-2xl">{info.emoji}</span>
                {info.title}
              </h2>
              <div className="space-y-2 mb-3">
                {info.content.map((item) => (
                  <div key={item.label} className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-500 text-right max-w-[60%]">{item.time}</span>
                  </div>
                ))}
              </div>
              {info.note && (
                <p className={`text-xs ${info.titleColor} opacity-80 mb-3`}>{info.note}</p>
              )}
              {info.link && (
                <a href={info.link} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold ${info.titleColor} hover:underline`}>
                  ওয়েবসাইট দেখুন <ExternalLink size={12} />
                </a>
              )}
            </div>
          </section>
        ))}

      {/* Islamic Foundation contact */}
      <div className="bg-emerald-700 rounded-2xl p-5 text-white mt-4">
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          🏛️ ইসলামিক ফাউন্ডেশন, টাঙ্গাইল
        </h3>
        <div className="space-y-2 text-sm text-white/80 mb-4">
          <div className="flex items-center gap-2"><MapPin size={14} className="text-white/60" /> ইসলামিক ফাউন্ডেশন ভবন, টাঙ্গাইল সদর</div>
          <div className="flex items-center gap-2"><Phone size={14} className="text-white/60" /> 0921-62050</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="tel:0921-62050"
            className="flex items-center gap-1.5 bg-white text-emerald-700 font-bold text-xs px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">
            <Phone size={13} /> কল করুন
          </a>
          <a href="https://islamicfoundation.gov.bd" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-full transition-colors">
            <ExternalLink size={13} /> ওয়েবসাইট
          </a>
        </div>
      </div>
    </ServicePageLayout>
  );
}
