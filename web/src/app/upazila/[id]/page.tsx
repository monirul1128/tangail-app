import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react";
import { promises as fs } from "fs";
import path from "path";

interface UpazilaData {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  area: string;
  population: string;
  unions: number;
  villages: number;
  txtFile: string;
  upazilaMedicine: string;
  unoPhone: string;
  hospitalPhone: string;
  policePhone: string;
  description: string;
  notablePlace: string[];
  notablePerson: string[];
}

const upazilaData: Record<string, UpazilaData> = {
  tangail_sadar: {
    id: "tangail_sadar", name: "টাঙ্গাইল সদর", nameEn: "Tangail Sadar", icon: "🏙️",
    area: "৩৬৮ বর্গকিমি", population: "৪,৫০,০০০+", unions: 11, villages: 257,
    txtFile: "tangail sadar.txt",
    upazilaMedicine: "শেখ হাসিনা মেডিকেল কলেজ হাসপাতাল",
    unoPhone: "0921-62100", hospitalPhone: "0921-62500", policePhone: "0921-62200",
    description: "টাঙ্গাইল সদর উপজেলা টাঙ্গাইল জেলার প্রশাসনিক কেন্দ্র। এখানে জেলা সদর দপ্তর, মাওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, মেডিকেল কলেজ এবং প্রধান বাণিজ্যিক কার্যক্রম পরিচালিত হয়।",
    notablePlace: ["মাওলানা ভাসানীর মাজার, সন্তোষ", "করটিয়া জমিদার বাড়ি", "ধলেশ্বরী নদী তীর"],
    notablePerson: ["মাওলানা আব্দুল হামিদ খান ভাসানী", "হুমায়ূন আহমেদ"],
  },
  basail: {
    id: "basail", name: "বাসাইল", nameEn: "Basail", icon: "🌾",
    area: "১৫২ বর্গকিমি", population: "১,৮০,০০০+", unions: 5, villages: 61,
    txtFile: "basail.txt",
    upazilaMedicine: "বাসাইল উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-56100", hospitalPhone: "09228-56200", policePhone: "09228-56300",
    description: "বাসাইল উপজেলা কৃষিপ্রধান একটি উপজেলা। এখানে ধান, পাট ও সবজি চাষ প্রধান জীবিকা। লৌহজং নদী উপজেলার পাশ দিয়ে প্রবাহিত।",
    notablePlace: ["বাসাইল কেন্দ্রীয় মসজিদ", "লৌহজং নদী তীর"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  bhuapur: {
    id: "bhuapur", name: "ভূয়াপুর", nameEn: "Bhuapur", icon: "🌿",
    area: "২২৩ বর্গকিমি", population: "২,২০,০০০+", unions: 8, villages: 120,
    txtFile: "vuapur.txt",
    upazilaMedicine: "ভূয়াপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-75100", hospitalPhone: "09228-75200", policePhone: "09228-75300",
    description: "ভূয়াপুর উপজেলা যমুনা নদীর তীরে অবস্থিত। এটি একটি ঐতিহ্যবাহী এলাকা এবং কৃষিপ্রধান।",
    notablePlace: ["যমুনা নদী তীর", "ভূয়াপুর বাজার"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  delduar: {
    id: "delduar", name: "দেলদুয়ার", nameEn: "Delduar", icon: "🏘️",
    area: "১৭৭ বর্গকিমি", population: "১,৯০,০০০+", unions: 8, villages: 95,
    txtFile: "deluar.txt",
    upazilaMedicine: "দেলদুয়ার উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-56400", hospitalPhone: "09228-56500", policePhone: "09228-56600",
    description: "দেলদুয়ার উপজেলায় ঐতিহাসিক আতিয়া মসজিদ অবস্থিত, যা বাংলাদেশের অন্যতম প্রাচীন মসজিদ (১৬০৯ খ্রি.)।",
    notablePlace: ["আতিয়া মসজিদ (১৬০৯ খ্রি.)", "পাকুটিয়া জমিদার বাড়ি", "দেলদুয়ার রাজবাড়ি"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  dhanbari: {
    id: "dhanbari", name: "ধনবাড়ী", nameEn: "Dhanbari", icon: "🏛️",
    area: "১৭৫ বর্গকিমি", population: "১,৫০,০০০+", unions: 4, villages: 97,
    txtFile: "dhonbari.txt",
    upazilaMedicine: "ধনবাড়ী উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-56700", hospitalPhone: "09228-56800", policePhone: "09228-56900",
    description: "ধনবাড়ী উপজেলায় ঐতিহাসিক ধনবাড়ী নওয়াব প্যালেস অবস্থিত। এটি নওয়াব আলী চৌধুরীর বাসস্থান ছিল।",
    notablePlace: ["ধনবাড়ী নওয়াব প্যালেস", "ধনবাড়ী মসজিদ"],
    notablePerson: ["নওয়াব আলী চৌধুরী (ঐতিহাসিক ব্যক্তিত্ব)"],
  },
  ghatail: {
    id: "ghatail", name: "ঘাটাইল", nameEn: "Ghatail", icon: "⛵",
    area: "৪৩০ বর্গকিমি", population: "৩,৫০,০০০+", unions: 14, villages: 212,
    txtFile: "ghatail.txt",
    upazilaMedicine: "ঘাটাইল উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-57100", hospitalPhone: "09228-57200", policePhone: "09228-57300",
    description: "ঘাটাইল টাঙ্গাইলের বৃহত্তম উপজেলাগুলির একটি। এখানে মুক্তিযুদ্ধের স্মৃতিবিজড়িত অনেক স্থান রয়েছে।",
    notablePlace: ["ঘাটাইল বাজার", "লৌহজং নদী", "মুক্তিযুদ্ধ স্মৃতিস্তম্ভ"],
    notablePerson: ["স্থানীয় বীর মুক্তিযোদ্ধাগণ"],
  },
  gopalpur: {
    id: "gopalpur", name: "গোপালপুর", nameEn: "Gopalpur", icon: "🌳",
    area: "২৩৩ বর্গকিমি", population: "২,১০,০০০+", unions: 9, villages: 112,
    txtFile: "goplapur.txt",
    upazilaMedicine: "গোপালপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-57400", hospitalPhone: "09228-57500", policePhone: "09228-57600",
    description: "গোপালপুর উপজেলা কৃষিপ্রধান এবং বনাঞ্চলে সমৃদ্ধ। বংশী নদী উপজেলার পাশ দিয়ে প্রবাহিত।",
    notablePlace: ["গোপালপুর পার্ক", "বংশী নদী"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  kalihati: {
    id: "kalihati", name: "কালিহাতী", nameEn: "Kalihati", icon: "🛖",
    area: "৩৮৫ বর্গকিমি", population: "৩,২০,০০০+", unions: 15, villages: 191,
    txtFile: "kalihati.txt",
    upazilaMedicine: "কালিহাতী উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-57700", hospitalPhone: "09228-57800", policePhone: "09228-57900",
    description: "কালিহাতী টাঙ্গাইলের অন্যতম বৃহৎ উপজেলা। এখানে বস্ত্র শিল্প বিখ্যাত। এলেঙ্গা রিসোর্ট ও বঙ্গবন্ধু সেতু পশ্চিম প্রান্ত এখানে অবস্থিত।",
    notablePlace: ["এলেঙ্গা রিসোর্ট", "বঙ্গবন্ধু সেতু (পশ্চিম)", "ধলেশ্বরী নদী"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  madhupur: {
    id: "madhupur", name: "মধুপুর", nameEn: "Madhupur", icon: "🌲",
    area: "৪২৩ বর্গকিমি", population: "৩,০০,০০০+", unions: 11, villages: 115,
    txtFile: "modhupur.txt",
    upazilaMedicine: "মধুপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-68100", hospitalPhone: "09228-68200", policePhone: "09228-68300",
    description: "মধুপুর উপজেলায় মধুপুর জাতীয় উদ্যান অবস্থিত — গারো পাহাড়ের পাদদেশে একটি বিখ্যাত বনাঞ্চল।",
    notablePlace: ["মধুপুর জাতীয় উদ্যান", "গারো পাহাড়", "শালবন", "পিরোজপুর আনারস বাগান"],
    notablePerson: ["গারো আদিবাসী সম্প্রদায়"],
  },
  mirzapur: {
    id: "mirzapur", name: "মির্জাপুর", nameEn: "Mirzapur", icon: "🏗️",
    area: "৩৭২ বর্গকিমি", population: "৩,৪০,০০০+", unions: 14, villages: 193,
    txtFile: "mirzapur.txt",
    upazilaMedicine: "কুমুদিনী হাসপাতাল, মির্জাপুর",
    unoPhone: "09228-75100", hospitalPhone: "09228-75200", policePhone: "09228-75300",
    description: "মির্জাপুর উপজেলায় বিখ্যাত ভারতেশ্বরী হোমস এবং কুমুদিনী হাসপাতাল অবস্থিত। মির্জাপুর ক্যাডেট কলেজও এখানে।",
    notablePlace: ["ভারতেশ্বরী হোমস", "কুমুদিনী হাসপাতাল ও কলেজ", "মির্জাপুর ক্যাডেট কলেজ"],
    notablePerson: ["রণদা প্রসাদ সাহা (কুমুদিনী প্রতিষ্ঠাতা)"],
  },
  nagarpur: {
    id: "nagarpur", name: "নাগরপুর", nameEn: "Nagarpur", icon: "🌻",
    area: "২৮৮ বর্গকিমি", population: "২,৪০,০০০+", unions: 11, villages: 130,
    txtFile: "nagorpur.txt",
    upazilaMedicine: "নাগরপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-56200", hospitalPhone: "09228-56300", policePhone: "09228-56400",
    description: "নাগরপুর উপজেলা লৌহজং নদীর তীরে অবস্থিত। কৃষি ও মৎস্য চাষ এখানকার প্রধান জীবিকা।",
    notablePlace: ["নাগরপুর জমিদার বাড়ি", "লৌহজং নদী", "পাকুটিয়া নবাব প্যালেস"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  sakhipur: {
    id: "sakhipur", name: "সখিপুর", nameEn: "Sakhipur", icon: "🍃",
    area: "২৯৬ বর্গকিমি", population: "২,০০,০০০+", unions: 8, villages: 100,
    txtFile: "sokhipur.txt",
    upazilaMedicine: "সখিপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone: "09228-56500", hospitalPhone: "09228-56600", policePhone: "09228-56700",
    description: "সখিপুর উপজেলা প্রাকৃতিক সৌন্দর্যে ভরপুর। এখানে পাহাড় ও বনাঞ্চল রয়েছে।",
    notablePlace: ["সখিপুর বনাঞ্চল", "বংশী নদী", "মাধবপুর লেক"],
    notablePerson: ["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
};

interface Props { params: { id: string } }

export function generateStaticParams() {
  return Object.keys(upazilaData).map(id => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const u = upazilaData[params.id];
  if (!u) return { title: "উপজেলা পাওয়া যায়নি" };
  return { title: `${u.name} উপজেলা — ইউনিয়ন ও গ্রামের তালিকা` };
}

async function getVillageData(txtFile: string): Promise<{ villages: string[]; unions: Record<string, string[]> }> {
  try {
    const filePath = path.join(process.cwd(), "public", "upazilla", txtFile);
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.split("\n").map(l => l.trim()).filter(l => l && l.includes(" — ") && l.includes("ইউনিয়ন"));

    const villages: string[] = [];
    const unions: Record<string, string[]> = {};

    for (const line of lines) {
      const parts = line.split(" — ");
      if (parts.length >= 2) {
        const village = parts[0].trim();
        const union = parts[1].replace(" ইউনিয়ন", "").trim();
        villages.push(village);
        if (!unions[union]) unions[union] = [];
        unions[union].push(village);
      }
    }

    return { villages, unions };
  } catch {
    return { villages: [], unions: {} };
  }
}

export default async function UpazilaDetailPage({ params }: Props) {
  const u = upazilaData[params.id];
  if (!u) notFound();

  const { villages, unions } = await getVillageData(u.txtFile);
  const unionNames = Object.keys(unions).sort();

  const serviceLinks = [
    { emoji: "🏥", label: "হাসপাতাল",    href: `/hospitals?upazila=${u.id}` },
    { emoji: "👨‍⚕️", label: "ডাক্তার",   href: `/doctors?upazila=${u.id}`   },
    { emoji: "💊", label: "ফার্মেসি",    href: `/pharmacy`                  },
    { emoji: "🚑", label: "অ্যাম্বুলেন্স", href: `/ambulance`               },
    { emoji: "🏫", label: "শিক্ষা",       href: `/education`                 },
    { emoji: "🚌", label: "পরিবহন",       href: `/transport`                 },
  ];

  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> হোমে ফিরুন
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{u.icon}</span>
            <div>
              <h1 className="text-3xl font-black">{u.name} উপজেলা</h1>
              <p className="text-white/70 text-sm mt-0.5">{u.nameEn} Upazila • টাঙ্গাইল জেলা</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "আয়তন",      value: u.area,                     icon: "📐" },
            { label: "জনসংখ্যা",   value: u.population,               icon: "👥" },
            { label: "ইউনিয়ন",     value: `${unionNames.length || u.unions}টি`, icon: "🏘️" },
            { label: "গ্রাম",       value: `${villages.length || u.villages}টি`, icon: "🌾" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-primary text-lg leading-none">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══ ইউনিয়ন ও গ্রামের তালিকা — RIGHT AFTER STATS ══ */}
        {unionNames.length > 0 && (
          <div id="union-list" className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-4">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-primary to-primary-600 px-5 py-4">
              <h2 className="font-black text-white text-base flex items-center gap-2">
                🏘️ ইউনিয়ন ও গ্রামের তালিকা
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                {u.name} উপজেলার {unionNames.length}টি ইউনিয়ন — মোট {villages.length}টি গ্রাম
              </p>
            </div>

            {/* Info bar */}
            <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5 flex items-center gap-2">
              <span className="text-amber-600 text-sm">👆</span>
              <span className="text-amber-700 text-xs font-semibold">যেকোনো ইউনিয়নে ক্লিক করুন → সেই ইউনিয়নের সব গ্রাম দেখুন</span>
            </div>

            <div className="divide-y divide-gray-100">
              {unionNames.map((unionName, idx) => {
                const villageList = unions[unionName] ?? [];
                return (
                  <details key={unionName} className="group">
                    {/* Union row — clearly clickable */}
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-primary/5 active:bg-primary/10 transition-colors list-none select-none">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 text-sm">{unionName} ইউনিয়ন</span>
                          <div className="text-xs text-gray-400 mt-0.5">{villageList.length}টি গ্রাম</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full hidden sm:inline">
                          {villageList.length}টি গ্রাম
                        </span>
                        <span className="text-primary text-lg font-bold group-open:rotate-180 transition-transform inline-block leading-none">
                          ▾
                        </span>
                      </div>
                    </summary>

                    {/* Village grid */}
                    <div className="px-5 pb-4 pt-2 bg-gray-50/70 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2 font-medium">📍 {unionName} ইউনিয়নের গ্রামসমূহ:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                        {villageList.map(village => (
                          <div key={village}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 font-medium flex items-center gap-1.5 shadow-sm">
                            <span className="text-primary flex-shrink-0">•</span>
                            {village}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>

            {/* Footer */}
            <div className="bg-primary/5 border-t border-primary/10 px-5 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">সর্বমোট</span>
              <span className="text-sm font-black text-primary">
                {villages.length}টি গ্রাম · {unionNames.length}টি ইউনিয়ন
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" /> সংক্ষিপ্ত পরিচিতি
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{u.description}</p>
        </div>

        {/* Emergency contacts */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <h2 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-red-500 rounded-full" /> জরুরি যোগাযোগ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "UNO অফিস",          phone: u.unoPhone,       emoji: "🏛️", color: "bg-blue-600"   },
              { label: "স্বাস্থ্য কমপ্লেক্স", phone: u.hospitalPhone, emoji: "🏥", color: "bg-green-600" },
              { label: "থানা",               phone: u.policePhone,    emoji: "👮", color: "bg-indigo-600" },
            ].map(c => (
              <a key={c.label} href={`tel:${c.phone}`}
                className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${c.color} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                  {c.emoji}
                </div>
                <div>
                  <div className="text-xs text-gray-500">{c.label}</div>
                  <div className="font-bold text-gray-800 text-sm flex items-center gap-1">
                    <Phone size={12} className="text-green-600" /> {c.phone}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" /> {u.name}-এর সেবাসমূহ
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {serviceLinks.map(s => (
              <Link key={s.label} href={s.href}
                className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:bg-primary/10 hover:-translate-y-0.5 transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                <span className="text-[11px] font-semibold text-primary text-center leading-tight">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Notable places */}
        {u.notablePlace.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-sky-500 rounded-full" /> দর্শনীয় স্থান
            </h2>
            <div className="space-y-2">
              {u.notablePlace.map(p => (
                <div key={p} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sky-500 text-lg">📍</span>
                  <span className="text-sm text-gray-700 font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable persons */}
        {u.notablePerson.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full" /> বিশিষ্ট ব্যক্তিত্ব
            </h2>
            <div className="space-y-2">
              {u.notablePerson.map(p => (
                <div key={p} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className="text-emerald-500 text-lg">🏅</span>
                  <span className="text-sm text-gray-700 font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
            <ArrowLeft size={14} /> সব উপজেলা দেখুন
          </Link>
          <Link href={`/hospitals?upazila=${u.id}`} className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
            {u.name}-এর হাসপাতাল <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
