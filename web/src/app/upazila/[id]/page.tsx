import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Phone } from "lucide-react";

interface UpazilaData {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  area: string;
  population: string;
  unions: number;
  mouzas: number;
  villages: number;
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
    id:"tangail_sadar", name:"টাঙ্গাইল সদর", nameEn:"Tangail Sadar", icon:"🏙️",
    area:"৩৬৮ বর্গকিমি", population:"৪,৫০,০০০+", unions:11, mouzas:195, villages:312,
    upazilaMedicine:"শেখ হাসিনা মেডিকেল কলেজ হাসপাতাল",
    unoPhone:"0921-62100", hospitalPhone:"0921-62500", policePhone:"0921-62200",
    description:"টাঙ্গাইল সদর উপজেলা টাঙ্গাইল জেলার প্রশাসনিক কেন্দ্র। এখানে জেলা সদর দপ্তর, বিশ্ববিদ্যালয়, মেডিকেল কলেজ এবং প্রধান বাণিজ্যিক কার্যক্রম পরিচালিত হয়।",
    notablePlace:["মাওলানা ভাসানীর মাজার, সন্তোষ","ধলেশ্বরী নদী তীর","টাঙ্গাইল পৌর পার্ক"],
    notablePerson:["মাওলানা আব্দুল হামিদ খান ভাসানী","হুমায়ূন আহমেদ"],
  },
  basail: {
    id:"basail", name:"বাসাইল", nameEn:"Basail", icon:"🌾",
    area:"১৫২ বর্গকিমি", population:"১,৮০,০০০+", unions:8, mouzas:98, villages:156,
    upazilaMedicine:"বাসাইল উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-56100", hospitalPhone:"09228-56200", policePhone:"09228-56300",
    description:"বাসাইল উপজেলা কৃষিপ্রধান একটি উপজেলা। এখানে ধান, পাট ও সবজি চাষ প্রধান জীবিকা।",
    notablePlace:["বাসাইল কেন্দ্রীয় মসজিদ","লৌহজং নদী তীর"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  bhuapur: {
    id:"bhuapur", name:"ভূয়াপুর", nameEn:"Bhuapur", icon:"🌿",
    area:"২২৩ বর্গকিমি", population:"২,২০,০০০+", unions:8, mouzas:127, villages:198,
    upazilaMedicine:"ভূয়াপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-75100", hospitalPhone:"09228-75200", policePhone:"09228-75300",
    description:"ভূয়াপুর উপজেলা যমুনা নদীর তীরে অবস্থিত। এটি একটি ঐতিহ্যবাহী এলাকা।",
    notablePlace:["যমুনা নদী তীর","ভূয়াপুর বাজার"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  delduar: {
    id:"delduar", name:"দেলদুয়ার", nameEn:"Delduar", icon:"🏘️",
    area:"১৭৭ বর্গকিমি", population:"১,৯০,০০০+", unions:8, mouzas:112, villages:178,
    upazilaMedicine:"দেলদুয়ার উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-56400", hospitalPhone:"09228-56500", policePhone:"09228-56600",
    description:"দেলদুয়ার উপজেলায় ঐতিহাসিক আতিয়া মসজিদ অবস্থিত, যা বাংলাদেশের অন্যতম প্রাচীন মসজিদ।",
    notablePlace:["আতিয়া মসজিদ (১৬০৯ খ্রি.)","পাকুটিয়া জমিদার বাড়ি","দেলদুয়ার রাজবাড়ি"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  dhanbari: {
    id:"dhanbari", name:"ধনবাড়ী", nameEn:"Dhanbari", icon:"🏛️",
    area:"১৭৫ বর্গকিমি", population:"১,৫০,০০০+", unions:4, mouzas:89, villages:142,
    upazilaMedicine:"ধনবাড়ী উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-56700", hospitalPhone:"09228-56800", policePhone:"09228-56900",
    description:"ধনবাড়ী উপজেলায় ঐতিহাসিক ধনবাড়ী নওয়াব প্যালেস অবস্থিত।",
    notablePlace:["ধনবাড়ী নওয়াব প্যালেস","ধনবাড়ী মসজিদ"],
    notablePerson:["নওয়াব আলী চৌধুরী (ঐতিহাসিক ব্যক্তিত্ব)"],
  },
  ghatail: {
    id:"ghatail", name:"ঘাটাইল", nameEn:"Ghatail", icon:"⛵",
    area:"৪৩০ বর্গকিমি", population:"৩,৫০,০০০+", unions:14, mouzas:234, villages:389,
    upazilaMedicine:"ঘাটাইল উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-57100", hospitalPhone:"09228-57200", policePhone:"09228-57300",
    description:"ঘাটাইল টাঙ্গাইলের বৃহত্তম উপজেলাগুলির একটি। এখানে মুক্তিযুদ্ধের স্মৃতিবিজড়িত অনেক স্থান রয়েছে।",
    notablePlace:["ঘাটাইল বাজার","লৌহজং নদী","মুক্তিযুদ্ধ স্মৃতিস্তম্ভ"],
    notablePerson:["স্থানীয় বীর মুক্তিযোদ্ধাগণ"],
  },
  gopalpur: {
    id:"gopalpur", name:"গোপালপুর", nameEn:"Gopalpur", icon:"🌳",
    area:"২৩৩ বর্গকিমি", population:"২,১০,০০০+", unions:9, mouzas:143, villages:229,
    upazilaMedicine:"গোপালপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-57400", hospitalPhone:"09228-57500", policePhone:"09228-57600",
    description:"গোপালপুর উপজেলা কৃষিপ্রধান এবং বনাঞ্চলে সমৃদ্ধ।",
    notablePlace:["গোপালপুর পার্ক","বংশী নদী"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  kalihati: {
    id:"kalihati", name:"কালিহাতী", nameEn:"Kalihati", icon:"🛖",
    area:"৩৮৫ বর্গকিমি", population:"৩,২০,০০০+", unions:15, mouzas:213, villages:352,
    upazilaMedicine:"কালিহাতী উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-57700", hospitalPhone:"09228-57800", policePhone:"09228-57900",
    description:"কালিহাতী টাঙ্গাইলের অন্যতম বৃহৎ উপজেলা। এখানে বস্ত্র শিল্প বিখ্যাত।",
    notablePlace:["এলেঙ্গা রিসোর্ট","বঙ্গবন্ধু সেতু (পশ্চিম)","ধলেশ্বরী নদী"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  madhupur: {
    id:"madhupur", name:"মধুপুর", nameEn:"Madhupur", icon:"🌲",
    area:"৪২৩ বর্গকিমি", population:"৩,০০,০০০+", unions:11, mouzas:187, villages:298,
    upazilaMedicine:"মধুপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-68100", hospitalPhone:"09228-68200", policePhone:"09228-68300",
    description:"মধুপুর উপজেলায় মধুপুর জাতীয় উদ্যান অবস্থিত — গারো পাহাড়ের পাদদেশে একটি বিখ্যাত বনাঞ্চল।",
    notablePlace:["মধুপুর জাতীয় উদ্যান","গারো পাহাড়","শালবন","পিরোজপুর আনারস বাগান"],
    notablePerson:["গারো উপজাতি সম্প্রদায়"],
  },
  mirzapur: {
    id:"mirzapur", name:"মির্জাপুর", nameEn:"Mirzapur", icon:"🏗️",
    area:"৩৭২ বর্গকিমি", population:"৩,৪০,০০০+", unions:14, mouzas:221, villages:367,
    upazilaMedicine:"মির্জাপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-75100", hospitalPhone:"09228-75200", policePhone:"09228-75300",
    description:"মির্জাপুর উপজেলায় বিখ্যাত ভারতেশ্বরী হোমস এবং কুমুদিনী হাসপাতাল অবস্থিত।",
    notablePlace:["ভারতেশ্বরী হোমস","কুমুদিনী হাসপাতাল ও কলেজ","মির্জাপুর ক্যাডেট কলেজ"],
    notablePerson:["রণদা প্রসাদ সাহা (কুমুদিনী প্রতিষ্ঠাতা)"],
  },
  nagarpur: {
    id:"nagarpur", name:"নাগরপুর", nameEn:"Nagarpur", icon:"🌻",
    area:"২৮৮ বর্গকিমি", population:"২,৪০,০০০+", unions:11, mouzas:156, villages:246,
    upazilaMedicine:"নাগরপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-56200", hospitalPhone:"09228-56300", policePhone:"09228-56400",
    description:"নাগরপুর উপজেলা লৌহজং নদীর তীরে অবস্থিত। কৃষি ও মৎস্য চাষ এখানকার প্রধান জীবিকা।",
    notablePlace:["নাগরপুর জমিদার বাড়ি","লৌহজং নদী","পাকুটিয়া নবাব প্যালেস"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
  sakhipur: {
    id:"sakhipur", name:"সখিপুর", nameEn:"Sakhipur", icon:"🍃",
    area:"২৯৬ বর্গকিমি", population:"২,০০,০০০+", unions:8, mouzas:134, villages:213,
    upazilaMedicine:"সখিপুর উপজেলা স্বাস্থ্য কমপ্লেক্স",
    unoPhone:"09228-56500", hospitalPhone:"09228-56600", policePhone:"09228-56700",
    description:"সখিপুর উপজেলা প্রাকৃতিক সৌন্দর্যে ভরপুর। এখানে পাহাড় ও বনাঞ্চল রয়েছে।",
    notablePlace:["সখিপুর বনাঞ্চল","বংশী নদী","মাধবপুর লেক"],
    notablePerson:["স্থানীয় বিশিষ্ট ব্যক্তিবর্গ"],
  },
};

interface Props { params: { id: string } }

export function generateStaticParams() {
  return Object.keys(upazilaData).map(id => ({ id }));
}

export async function generateMetadata({ params }: Props) {
  const u = upazilaData[params.id];
  if (!u) return { title: "উপজেলা পাওয়া যায়নি" };
  return { title: `${u.name} উপজেলা`, description: u.description };
}

export default function UpazilaDetailPage({ params }: Props) {
  const u = upazilaData[params.id];
  if (!u) notFound();

  const serviceLinks = [
    { emoji:"🏥", label:"হাসপাতাল",  href:`/hospitals?upazila=${u.id}` },
    { emoji:"👨‍⚕️", label:"ডাক্তার",  href:`/doctors?upazila=${u.id}`   },
    { emoji:"💊", label:"ফার্মেসি",   href:`/pharmacy`                  },
    { emoji:"🚑", label:"অ্যাম্বুলেন্স",href:`/ambulance`               },
    { emoji:"🏫", label:"শিক্ষা",     href:`/education`                  },
    { emoji:"🚌", label:"পরিবহন",     href:`/transport`                  },
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
            { label:"আয়তন",      value:u.area,                    icon:"📐" },
            { label:"জনসংখ্যা",   value:u.population,              icon:"👥" },
            { label:"ইউনিয়ন",     value:`${u.unions}টি`,           icon:"🏘️" },
            { label:"গ্রাম",       value:`${u.villages}টি+`,        icon:"🌾" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-primary text-lg leading-none">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />সংক্ষিপ্ত পরিচিতি
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">{u.description}</p>
        </div>

        {/* Emergency contacts */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
          <h2 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-red-500 rounded-full" />জরুরি যোগাযোগ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label:"UNO অফিস",   phone:u.unoPhone,      emoji:"🏛️", color:"bg-blue-600"  },
              { label:"স্বাস্থ্য কমপ্লেক্স",phone:u.hospitalPhone,emoji:"🏥", color:"bg-green-600"},
              { label:"থানা",        phone:u.policePhone,   emoji:"👮", color:"bg-indigo-600"},
            ].map(c => (
              <a key={c.label} href={`tel:${c.phone}`}
                className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className={`${c.color} w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                  {c.emoji}
                </div>
                <div>
                  <div className="text-xs text-gray-500">{c.label}</div>
                  <div className="font-bold text-gray-800 text-sm flex items-center gap-1">
                    <Phone size={12} className="text-green-600"/> {c.phone}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Services in this upazila */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />{u.name}-এর সেবাসমূহ
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
              <span className="w-1 h-5 bg-sky-500 rounded-full" />দর্শনীয় স্থান
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
              <span className="w-1 h-5 bg-emerald-500 rounded-full" />বিশিষ্ট ব্যক্তিত্ব
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

        {/* Back to all upazilas */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
            <ArrowLeft size={14}/> সব উপজেলা দেখুন
          </Link>
          <Link href={`/hospitals?upazila=${u.id}`} className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline">
            {u.name}-এর হাসপাতাল দেখুন <ArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
