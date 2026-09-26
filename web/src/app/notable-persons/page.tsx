import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const persons = [
  {
    id: "1",
    name: "মাওলানা আব্দুল হামিদ খান ভাসানী",
    nameEn: "Maulana Abdul Hamid Khan Bhashani",
    title: "রাজনীতিবিদ, জননেতা",
    born: "১২ ডিসেম্বর ১৮৮০",
    died: "১৭ নভেম্বর ১৯৭৬",
    upazila: "সন্তোষ, টাঙ্গাইল সদর",
    category: "রাজনীতি",
    emoji: "🏅",
    color: "bg-green-50 border-green-100",
    titleColor: "text-green-700",
    bio: "মজলুম জননেতা নামে পরিচিত মাওলানা ভাসানী বাংলাদেশের অন্যতম প্রধান রাজনৈতিক ব্যক্তিত্ব। তিনি আওয়ামী লীগ এবং ন্যাশনাল আওয়ামী পার্টি প্রতিষ্ঠা করেন। কৃষক ও শ্রমিকদের অধিকার আদায়ে আজীবন সংগ্রাম করেছেন।",
    achievements: ["আওয়ামী মুসলিম লীগ প্রতিষ্ঠাতা (১৯৪৯)", "ন্যাপ প্রতিষ্ঠাতা (১৯৫৭)", "ফারাক্কা মিছিল (১৯৭৬)", "সন্তোষে ইসলামী বিশ্ববিদ্যালয় প্রতিষ্ঠা"],
  },
  {
    id: "2",
    name: "হুমায়ূন আহমেদ",
    nameEn: "Humayun Ahmed",
    title: "ঔপন্যাসিক, চলচ্চিত্র নির্মাতা",
    born: "১৩ নভেম্বর ১৯৪৮",
    died: "১৯ জুলাই ২০১২",
    upazila: "কুতুবদিয়া পাড়া, টাঙ্গাইল সদর",
    category: "সাহিত্য",
    emoji: "📚",
    color: "bg-blue-50 border-blue-100",
    titleColor: "text-blue-700",
    bio: "বাংলাদেশের সর্বাধিক পঠিত লেখক হুমায়ূন আহমেদ টাঙ্গাইলে জন্মগ্রহণ করেন। তাঁর লেখা তিন শতাধিক উপন্যাস ও গল্পগ্রন্থ বাংলাদেশে পাঠক-হৃদয় জয় করেছে। হিমু ও মিসির আলি তাঁর বিখ্যাত চরিত্র।",
    achievements: ["৩০০+ উপন্যাস ও গল্পগ্রন্থ রচনা", "বাংলা একাডেমি পুরস্কার (১৯৮১)", "একুশে পদক (১৯৯৪)", "নুহাশ পল্লী প্রতিষ্ঠা"],
  },
  {
    id: "3",
    name: "রণদা প্রসাদ সাহা",
    nameEn: "Rana Prasad Saha",
    title: "সমাজসেবক, কুমুদিনী ট্রাস্ট প্রতিষ্ঠাতা",
    born: "১৮৯৬",
    died: "১৯৭১",
    upazila: "মির্জাপুর, টাঙ্গাইল",
    category: "সমাজসেবা",
    emoji: "❤️",
    color: "bg-red-50 border-red-100",
    titleColor: "text-red-700",
    bio: "রণদা প্রসাদ সাহা মির্জাপুরে কুমুদিনী হাসপাতাল, ভারতেশ্বরী হোমস এবং কুমুদিনী মহিলা কলেজ প্রতিষ্ঠা করেন। মুক্তিযুদ্ধে পাকিস্তানি বাহিনী তাঁকে হত্যা করে।",
    achievements: ["কুমুদিনী হাসপাতাল প্রতিষ্ঠা (১৯৩৮)", "ভারতেশ্বরী হোমস প্রতিষ্ঠা", "কুমুদিনী মহিলা কলেজ প্রতিষ্ঠা", "মুক্তিযুদ্ধে শহীদ"],
  },
  {
    id: "4",
    name: "কবি শামসুর রাহমান",
    nameEn: "Shamsur Rahman",
    title: "জাতীয় কবি, সাহিত্যিক",
    born: "২৩ অক্টোবর ১৯২৯",
    died: "১৭ আগস্ট ২০০৬",
    upazila: "পাড়াতলী, টাঙ্গাইল সদর",
    category: "সাহিত্য",
    emoji: "✍️",
    color: "bg-purple-50 border-purple-100",
    titleColor: "text-purple-700",
    bio: "বাংলাদেশের অন্যতম প্রধান কবি শামসুর রাহমান স্বাধীনতা যুদ্ধের সময় মুক্তিযুদ্ধের পক্ষে অনেক কবিতা লিখেছেন। 'স্বাধীনতা তুমি' তাঁর বিখ্যাত কবিতা।",
    achievements: ["বাংলা একাডেমি পুরস্কার", "একুশে পদক (১৯৭৭)", "স্বাধীনতা পদক (১৯৯১)", "আনন্দ পুরস্কার"],
  },
  {
    id: "5",
    name: "আবুল মনসুর আহমদ",
    nameEn: "Abul Mansur Ahmad",
    title: "সাহিত্যিক, সাংবাদিক, রাজনীতিবিদ",
    born: "৩ সেপ্টেম্বর ১৮৯৮",
    died: "১৮ মার্চ ১৯৭৯",
    upazila: "ত্রিশাল, টাঙ্গাইল",
    category: "সাহিত্য",
    emoji: "📰",
    color: "bg-amber-50 border-amber-100",
    titleColor: "text-amber-700",
    bio: "আবুল মনসুর আহমদ বাংলাদেশের একজন বিশিষ্ট সাহিত্যিক ও রাজনীতিবিদ। তাঁর 'আয়না' ও 'ফুড কনফারেন্স' বিখ্যাত ব্যঙ্গ সাহিত্যকর্ম।",
    achievements: ["বাংলা একাডেমি পুরস্কার", "পাকিস্তান কেন্দ্রীয় মন্ত্রী (১৯৫৬)", "বিশিষ্ট সাংবাদিক"],
  },
  {
    id: "6",
    name: "খান আতাউর রহমান",
    nameEn: "Khan Ataur Rahman",
    title: "চলচ্চিত্র পরিচালক, অভিনেতা, সংগীতজ্ঞ",
    born: "১ মার্চ ১৯২৮",
    died: "১ ডিসেম্বর ১৯৯৭",
    upazila: "টাঙ্গাইল সদর",
    category: "শিল্প-সংস্কৃতি",
    emoji: "🎬",
    color: "bg-pink-50 border-pink-100",
    titleColor: "text-pink-700",
    bio: "খান আতাউর রহমান বাংলাদেশের চলচ্চিত্র শিল্পের পথিকৃৎ। তিনি পরিচালক, অভিনেতা ও সংগীতশিল্পী হিসেবে সুনাম অর্জন করেন।",
    achievements: ["জাতীয় চলচ্চিত্র পুরস্কার (বহুবার)", "একুশে পদক (১৯৮৪)", "বাংলাদেশ চলচ্চিত্রের কিংবদন্তি"],
  },
];

const categories = ["রাজনীতি","সাহিত্য","সমাজসেবা","শিল্প-সংস্কৃতি"];
const catColors: Record<string,string> = {
  "রাজনীতি":"bg-green-100 text-green-800",
  "সাহিত্য":"bg-blue-100 text-blue-800",
  "সমাজসেবা":"bg-red-100 text-red-800",
  "শিল্প-সংস্কৃতি":"bg-pink-100 text-pink-800",
};

export const metadata = {
  title: "গুণিজন — টাঙ্গাইলের বিশিষ্ট ব্যক্তিত্ব",
  description: "মাওলানা ভাসানী, হুমায়ূন আহমেদ সহ টাঙ্গাইলের বিখ্যাত ব্যক্তিত্বদের পরিচিতি",
};

export default function NotablePersonsPage() {
  return (
    <ServicePageLayout title="গুণিজন" subtitle="টাঙ্গাইলের বিশিষ্ট ব্যক্তিত্বগণ" emoji="🏅" accentColor="bg-emerald-700">

      {/* Category filter strip */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <span key={c} className={`px-3 py-1 rounded-full text-xs font-semibold ${catColors[c]}`}>{c}</span>
        ))}
      </div>

      <div className="space-y-5">
        {persons.map(p => (
          <div key={p.id} className={`rounded-2xl border p-5 ${p.color}`}>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
                {p.emoji}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + category */}
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <div>
                    <h2 className={`font-black text-gray-800 text-lg leading-tight`}>{p.name}</h2>
                    <p className="text-gray-500 text-xs">{p.nameEn}</p>
                  </div>
                  <span className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${catColors[p.category]}`}>
                    {p.category}
                  </span>
                </div>

                {/* Title */}
                <p className={`text-sm font-semibold ${p.titleColor} mb-2`}>{p.title}</p>

                {/* Birth/Death + Location */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                  <span>🎂 জন্ম: {p.born}</span>
                  {p.died && <span>✝️ মৃত্যু: {p.died}</span>}
                  <span>📍 {p.upazila}</span>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{p.bio}</p>

                {/* Achievements */}
                <div className="bg-white/70 rounded-xl p-3">
                  <p className="text-xs font-bold text-gray-700 mb-2">উল্লেখযোগ্য অবদান</p>
                  <ul className="space-y-1">
                    {p.achievements.map(a => (
                      <li key={a} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution CTA */}
      <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-emerald-800 font-bold mb-1">আরও গুণিজনের তথ্য যোগ করুন</p>
        <p className="text-emerald-600 text-sm mb-3">টাঙ্গাইলের কোনো বিশিষ্ট ব্যক্তিত্বের তথ্য যোগ করতে আমাদের জানান</p>
        <Link href="/register-business" className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors">
          তথ্য পাঠান <ArrowRight size={14}/>
        </Link>
      </div>
    </ServicePageLayout>
  );
}
