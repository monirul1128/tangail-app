import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getLatestNews } from "@/lib/firestore";
import SearchBar from "@/components/ui/SearchBar";
import type { NewsArticle } from "@/models/types";

export const revalidate = 60;

/* ─── Prayer times ─── */
const prayerTimes = [
  { name: "ফজর",    time: "৪:৩০"  },
  { name: "জোহর",   time: "১২:০০" },
  { name: "আসর",    time: "৪:১৫"  },
  { name: "মাগরিব", time: "৬:৩০"  },
  { name: "এশা",    time: "৭:৪৫"  },
];

/* ─── Quick service pills ─── */
const quickServices = [
  { href: "/ambulance",   label: "অ্যাম্বুলেন্স",  emoji: "🚑", bg: "bg-red-600"    },
  { href: "/blood-donor", label: "রক্তদান",         emoji: "🩸", bg: "bg-rose-500"   },
  { href: "/emergency",   label: "ফায়ার সার্ভিস",  emoji: "🔥", bg: "bg-orange-500" },
  { href: "/emergency",   label: "পুলিশ",           emoji: "👮", bg: "bg-blue-700"   },
  { href: "/hospitals",   label: "হাসপাতাল",        emoji: "🏥", bg: "bg-primary"    },
  { href: "/emergency",   label: "৯৯৯ হটলাইন",     emoji: "📞", bg: "bg-green-600"  },
];

/* ─── All 12 Upazilas with details ─── */
const upazilas = [
  { id: "tangail_sadar", name: "সদর",       icon: "🏙️", unions: 11, area: "৩৬৮ বর্গকিমি" },
  { id: "basail",        name: "বাসাইল",    icon: "🌾", unions:  8, area: "১৫২ বর্গকিমি" },
  { id: "bhuapur",       name: "ভূয়াপুর",  icon: "🌿", unions:  8, area: "২২৩ বর্গকিমি" },
  { id: "delduar",       name: "দেলদুয়ার", icon: "🏘️", unions:  8, area: "১৭৭ বর্গকিমি" },
  { id: "dhanbari",      name: "ধনবাড়ী",   icon: "🏛️", unions:  4, area: "১৭৫ বর্গকিমি" },
  { id: "ghatail",       name: "ঘাটাইল",   icon: "⛵", unions: 14, area: "৪৩০ বর্গকিমি" },
  { id: "gopalpur",      name: "গোপালপুর", icon: "🌳", unions:  9, area: "২৩৩ বর্গকিমি" },
  { id: "kalihati",      name: "কালিহাতী", icon: "🛖", unions: 15, area: "৩৮৫ বর্গকিমি" },
  { id: "madhupur",      name: "মধুপুর",   icon: "🌲", unions: 11, area: "৪২৩ বর্গকিমি" },
  { id: "mirzapur",      name: "মির্জাপুর",icon: "🏗️", unions: 14, area: "৩৭২ বর্গকিমি" },
  { id: "nagarpur",      name: "নাগরপুর",  icon: "🌻", unions: 11, area: "২৮৮ বর্গকিমি" },
  { id: "sakhipur",      name: "সখিপুর",   icon: "🍃", unions:  8, area: "২৯৬ বর্গকিমি" },
];

/* ─── Full service categories ─── */
const serviceCategories = [
  {
    title: "জরুরী সেবা",
    color: "bg-red-50 border-red-100",
    titleColor: "text-red-700",
    accent: "bg-red-500",
    items: [
      { label: "পুলিশ",         emoji: "👮", href: "/emergency?cat=police"    },
      { label: "ফায়ার সার্ভিস", emoji: "🚒", href: "/emergency?cat=fire"      },
      { label: "এ্যাম্বুলেন্স", emoji: "🚑", href: "/ambulance"               },
    ],
  },
  {
    title: "চিকিৎসা সেবা",
    color: "bg-green-50 border-green-100",
    titleColor: "text-green-700",
    accent: "bg-green-500",
    items: [
      { label: "ডেন্টিস্ট",           emoji: "🦷", href: "/doctors?spec=dentistry"  },
      { label: "ডাক্তার",              emoji: "👨‍⚕️", href: "/doctors"                },
      { label: "হোমিওপ্যাথি",         emoji: "🌿", href: "/doctors?spec=homeo"      },
      { label: "হাসপাতাল",            emoji: "🏥", href: "/hospitals"               },
      { label: "ফার্মেসি",            emoji: "💊", href: "/pharmacy"                },
    ],
  },
  {
    title: "শিক্ষা প্রতিষ্ঠান",
    color: "bg-blue-50 border-blue-100",
    titleColor: "text-blue-700",
    accent: "bg-blue-500",
    items: [
      { label: "স্কুল",          emoji: "🏫", href: "/education?type=school"      },
      { label: "কলেজ",           emoji: "🏛️", href: "/education?type=college"     },
      { label: "বিশ্ববিদ্যালয়", emoji: "🎓", href: "/education?type=university"  },
      { label: "মাদ্রাসা",       emoji: "📖", href: "/education?type=madrasa"     },
      { label: "টিউশন সেবা",     emoji: "✏️", href: "/education?type=tuition"     },
      { label: "লাইব্রেরি",      emoji: "📚", href: "/education?type=library"     },
      { label: "ট্রেনিং সেন্টার",emoji: "🖥️", href: "/education?type=training"   },
    ],
  },
  {
    title: "সরকারি সেবা",
    color: "bg-purple-50 border-purple-100",
    titleColor: "text-purple-700",
    accent: "bg-purple-500",
    items: [
      { label: "জন্ম নিবন্ধন",  emoji: "📋", href: "/govt?type=birth"      },
      { label: "ই-নামজারি",     emoji: "🏡", href: "/govt?type=land"       },
      { label: "ভোটার সেবা",    emoji: "🗳️", href: "/govt?type=voter"      },
      { label: "বিদ্যুৎ অফিস",  emoji: "⚡", href: "/govt?type=electricity"},
      { label: "আদালত",         emoji: "⚖️", href: "/govt?type=court"      },
      { label: "চাকরির বিজ্ঞাপন",emoji: "💼", href: "/jobs"                },
    ],
  },
  {
    title: "পরিবহন সেবা",
    color: "bg-amber-50 border-amber-100",
    titleColor: "text-amber-700",
    accent: "bg-amber-500",
    items: [
      { label: "বাস কাউন্টার",  emoji: "🚌", href: "/transport?type=bus"     },
      { label: "ট্রেন সার্ভিস", emoji: "🚂", href: "/transport?type=train"   },
      { label: "রেন্ট এ কার",   emoji: "🚗", href: "/transport?type=rentcar" },
      { label: "সিএনজি স্টেশন", emoji: "⛽", href: "/transport?type=cng"     },
      { label: "ফুয়েল স্টেশন", emoji: "🛢️", href: "/transport?type=fuel"    },
      { label: "কুরিয়ার সার্ভিস",emoji: "📦", href: "/transport?type=courier"},
    ],
  },
  {
    title: "আর্থিক সেবা",
    color: "bg-teal-50 border-teal-100",
    titleColor: "text-teal-700",
    accent: "bg-teal-500",
    items: [
      { label: "ব্যাংক",   emoji: "🏦", href: "/finance?type=bank" },
      { label: "এটিএম",    emoji: "💳", href: "/finance?type=atm"  },
      { label: "ক্রয়-বিক্রয়",emoji: "🛒", href: "/finance?type=market" },
    ],
  },
  {
    title: "ব্যবসা ও বাণিজ্য",
    color: "bg-orange-50 border-orange-100",
    titleColor: "text-orange-700",
    accent: "bg-orange-500",
    items: [
      { label: "দোকান/শো-রুম",   emoji: "🏪", href: "/business?type=shop"      },
      { label: "হোটেল (আবাসিক)", emoji: "🏨", href: "/business?type=hotel"     },
      { label: "রেস্টুরেন্ট",    emoji: "🍽️", href: "/business?type=restaurant"},
      { label: "বিউটি পার্লার",  emoji: "💅", href: "/business?type=beauty"    },
      { label: "নার্সারি",        emoji: "🌱", href: "/business?type=nursery"   },
      { label: "কৃষি সেবা",      emoji: "🌾", href: "/business?type=agri"      },
    ],
  },
  {
    title: "পেশাদার সেবা",
    color: "bg-indigo-50 border-indigo-100",
    titleColor: "text-indigo-700",
    accent: "bg-indigo-500",
    items: [
      { label: "আইনজীবী",     emoji: "⚖️", href: "/professionals?type=lawyer"     },
      { label: "সাংবাদিক",    emoji: "📰", href: "/professionals?type=journalist" },
      { label: "টেকনিশিয়ান", emoji: "🔧", href: "/professionals?type=technician" },
      { label: "কাজি অফিস",   emoji: "💍", href: "/professionals?type=kazi"       },
    ],
  },
  {
    title: "সংগঠন ও সম্প্রদায়",
    color: "bg-pink-50 border-pink-100",
    titleColor: "text-pink-700",
    accent: "bg-pink-500",
    items: [
      { label: "সংগঠন",    emoji: "🤝", href: "/organizations"          },
      { label: "গুণিজন",   emoji: "🏅", href: "/notable-persons"        },
      { label: "পর্যটন",   emoji: "🏞️", href: "/tourism"                },
      { label: "সর্বশেষ নোটিশ",emoji: "📋",href: "/news?category=notice"},
    ],
  },
];

/* ─── Blood groups ─── */
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

/* ─── Helper ─── */
const toBanglaNum = (n: number) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export default async function HomePage() {
  const latestNews = await getLatestNews(3).catch(() => [] as NewsArticle[]);

  const now          = new Date();
  const banglaDay    = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"][now.getDay()];
  const banglaMonths = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const banglaDate   = `${banglaDay}, ${toBanglaNum(now.getDate())} ${banglaMonths[now.getMonth()]} ${toBanglaNum(now.getFullYear())}`;

  return (
    <div className="bg-[#f4f6f8]">

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
        <div className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: 340 }}>
          <div className="px-4 md:px-8 pt-7 max-w-6xl mx-auto w-full">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="text-white/70 text-xs">📍</span>
              <span className="text-white/90 text-xs font-medium">টাঙ্গাইল জেলা, বাংলাদেশ</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-white/60 text-xs tracking-widest uppercase mb-1.5 font-medium">আজকের তারিখ</p>
                <h1 className="text-white font-black leading-tight drop-shadow-lg"
                    style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}>
                  {banglaDate}
                </h1>
                <p className="text-white/75 text-sm mt-2.5 max-w-sm leading-relaxed">
                  আপনার জেলার সকল দরকারি তথ্য একটি ডিজিটাল প্ল্যাটফর্মে
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link href="/hospitals"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-lg hover:-translate-y-0.5">
                    🏥 সেবা খুঁজুন
                  </Link>
                  <a href="tel:999"
                    className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-lg hover:-translate-y-0.5">
                    📞 জরুরি: ৯৯৯
                  </a>
                </div>
              </div>
              <div className="flex-shrink-0 hidden sm:block">
                <div className="bg-white/10 backdrop-blur-lg border border-white/25 rounded-2xl px-5 py-4 text-white text-center shadow-2xl min-w-[90px]">
                  <div className="text-4xl mb-1.5">🌤️</div>
                  <div className="text-2xl font-black leading-none">২৯°</div>
                  <div className="text-xs text-white/60 mt-0.5">সে.</div>
                  <div className="text-[11px] text-white/70 mt-1.5 font-medium">রোদচ্ছায়া</div>
                  <div className="mt-2 pt-2 border-t border-white/15 text-[10px] text-white/50">টাঙ্গাইল</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4" />
            <div className="bg-black/60 backdrop-blur-md border-t border-white/10">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="flex items-center overflow-x-auto scrollbar-hide divide-x divide-white/10">
                  <div className="flex-shrink-0 pr-4 py-3">
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-semibold">নামাজের</p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-semibold">সময়</p>
                  </div>
                  {prayerTimes.map((p) => (
                    <div key={p.name} className="flex-shrink-0 px-4 md:px-6 py-3 text-center group">
                      <div className="text-white/50 text-[10px] mb-1 group-hover:text-white/80 transition-colors">{p.name}</div>
                      <div className="text-white font-bold text-sm tabular-nums">{p.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search bar ── */}
      <SearchBar />

      {/* ══════════════════════════════════════════
          QUICK SERVICE PILLS
      ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickServices.map((s) => (
              <Link key={s.label} href={s.href}
                className={`${s.bg} flex-shrink-0 flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap`}>
                <span>{s.emoji}</span><span>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

        {/* ══════════════════════════════════════════
            সকল সেবা সমূহ — CATEGORISED GRID
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              সেবা সমূহ
            </h2>
          </div>
          <div className="space-y-4">
            {serviceCategories.map((cat) => (
              <div key={cat.title} className={`rounded-2xl border p-4 ${cat.color}`}>
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-1 h-4 ${cat.accent} rounded-full`} />
                  <h3 className={`font-bold text-sm ${cat.titleColor}`}>{cat.title}</h3>
                </div>
                {/* Items grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {cat.items.map((item) => (
                    <Link key={item.label} href={item.href}
                      className="bg-white rounded-xl p-2.5 flex flex-col items-center gap-1.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group border border-white">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            উপজেলা সমূহ — WITH DETAILS
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              উপজেলা সমূহ
            </h2>
            <span className="text-sm text-gray-400 font-medium">{toBanglaNum(12)}টি উপজেলা</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {upazilas.map((u) => (
              <Link key={u.id} href={`/upazila/${u.id}`}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border border-gray-100 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <span className="text-3xl group-hover:scale-110 transition-transform">{u.icon}</span>
                <span className="font-bold text-gray-800 text-sm text-center">{u.name}</span>
                <div className="w-full pt-2 border-t border-gray-50 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>ইউনিয়ন</span>
                    <span className="font-semibold text-gray-600">{toBanglaNum(u.unions)}টি</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>আয়তন</span>
                    <span className="font-semibold text-gray-600">{u.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tangail district info strip */}
          <div className="mt-4 bg-primary/5 border border-primary/15 rounded-2xl p-4">
            <h3 className="font-bold text-primary text-sm mb-3 flex items-center gap-2">
              🏛️ টাঙ্গাইল জেলার সংক্ষিপ্ত তথ্য
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "মোট আয়তন",     value: "৩,৪১৪ বর্গকিমি", icon: "📐" },
                { label: "মোট জনসংখ্যা",  value: "৩৫ লক্ষ+",       icon: "👥" },
                { label: "উপজেলা",        value: "১২টি",            icon: "🗺️" },
                { label: "ইউনিয়ন",        value: "১২১টি",           icon: "🏘️" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="font-black text-primary text-base">{stat.value}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            রক্তদান WIDGET
        ══════════════════════════════════════════ */}
        <section>
          <div className="bg-gradient-to-br from-red-600 to-rose-500 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold">🩸 রক্তের গ্রুপ খুঁজুন</h2>
                <p className="text-white/70 text-xs mt-0.5">টাঙ্গাইলের নিবন্ধিত রক্তদাতাদের তালিকা</p>
              </div>
              <Link href="/blood-donor/register"
                className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-semibold transition-colors whitespace-nowrap">
                + ডোনার হোন
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {bloodGroups.map((bg) => (
                <Link key={bg} href={`/blood-donor?group=${bg}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl py-3 text-center font-black text-sm transition-all hover:-translate-y-0.5">
                  {bg}
                </Link>
              ))}
            </div>
            <Link href="/blood-donor"
              className="block w-full text-center bg-white text-red-600 font-bold py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors">
              সকল ডোনার দেখুন →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            জরুরি সেবা নম্বর
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full inline-block" />
              জরুরি সেবা নম্বর
            </h2>
            <Link href="/emergency" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "জাতীয় জরুরি",    number: "999", bg: "bg-red-600",    emoji: "🆘" },
              { label: "ফায়ার সার্ভিস",   number: "199", bg: "bg-orange-500", emoji: "🚒" },
              { label: "পুলিশ",           number: "999", bg: "bg-blue-700",   emoji: "👮" },
              { label: "মহিলা হেল্পলাইন", number: "109", bg: "bg-pink-600",   emoji: "📞" },
            ].map((e) => (
              <a key={e.label} href={`tel:${e.number}`}
                className={`${e.bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-white hover:opacity-90 hover:-translate-y-0.5 transition-all`}>
                <span className="text-3xl">{e.emoji}</span>
                <div className="text-center">
                  <div className="text-xs opacity-80">{e.label}</div>
                  <div className="font-black text-xl">{e.number}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            সর্বশেষ নোটিশ
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
              সর্বশেষ নোটিশ
            </h2>
            <Link href="/news?category=notice" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {[
              { title: "জেলা প্রশাসন নোটিশ — ভূমি সেবা সপ্তাহ ২০২৬",   date: "২৬ সেপ্টেম্বর ২০২৬" },
              { title: "টাঙ্গাইল জেলা পরিষদের নতুন বাজেট ঘোষণা",         date: "২৪ সেপ্টেম্বর ২০২৬" },
              { title: "শেখ হাসিনা মেডিকেলে বিনামূল্যে স্বাস্থ্য সেবা",  date: "২০ সেপ্টেম্বর ২০২৬" },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📋</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 line-clamp-1">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            টাঙ্গাইলের গুণিজন ও পর্যটন
        ══════════════════════════════════════════ */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* গুণিজন */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3">
                <h3 className="font-bold text-white flex items-center gap-2">🏅 গুণিজন</h3>
                <p className="text-white/70 text-xs mt-0.5">টাঙ্গাইলের বিশিষ্ট ব্যক্তিত্ব</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: "মাওলানা আব্দুল হামিদ খান ভাসানী", title: "রাজনীতিবিদ ও জননেতা" },
                  { name: "হুমায়ূন আহমেদ",                   title: "বিখ্যাত লেখক ও চলচ্চিত্রকার" },
                  { name: "শামসুর রাহমান",                    title: "কবি ও সাহিত্যিক" },
                ].map((p) => (
                  <div key={p.name} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-sm flex-shrink-0">🧑</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.title}</p>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 flex-shrink-0" />
                  </div>
                ))}
                <Link href="/notable-persons" className="flex items-center justify-center gap-1 py-3 text-emerald-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  সব দেখুন <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* পর্যটন */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-3">
                <h3 className="font-bold text-white flex items-center gap-2">🏞️ পর্যটন স্থান</h3>
                <p className="text-white/70 text-xs mt-0.5">টাঙ্গাইলের দর্শনীয় স্থানসমূহ</p>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: "ভারতেশ্বরী হোমস",   loc: "মির্জাপুর"    },
                  { name: "আতিয়া মসজিদ",       loc: "দেলদুয়ার"   },
                  { name: "মধুপুর জাতীয় উদ্যান",loc: "মধুপুর"     },
                ].map((t) => (
                  <div key={t.name} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sm flex-shrink-0">📍</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.loc}</p>
                    </div>
                    <ArrowRight size={13} className="text-gray-300 flex-shrink-0" />
                  </div>
                ))}
                <Link href="/tourism" className="flex items-center justify-center gap-1 py-3 text-sky-600 text-sm font-semibold hover:bg-gray-50 transition-colors">
                  সব দেখুন <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            অ্যাম্বুলেন্স সার্ভিস
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-amber-500 rounded-full inline-block" />
              অ্যাম্বুলেন্স সার্ভিস
            </h2>
            <Link href="/ambulance" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "আবীর অ্যাম্বুলেন্স সার্ভিস", tag: "২৪ ঘণ্টা সার্ভিস",  phone: "01711000020", type: "এসি" },
              { name: "মামুন অ্যাম্বুলেন্স সার্ভিস", tag: "এসি ও ফ্রিজার ভ্যান",phone: "01711000030", type: "ফ্রিজার" },
            ].map((a) => (
              <div key={a.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🚑</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm">{a.name}</div>
                  <div className="text-xs text-amber-600 font-medium">{a.tag}</div>
                  <span className="inline-block mt-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{a.type}</span>
                </div>
                <a href={`tel:${a.phone}`}
                  className="flex-shrink-0 w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-sm">
                  <Phone size={16} className="text-white" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ফটো গ্যালারি
        ══════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              ফটো গ্যালারি
            </h2>
            <Link href="/gallery" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { src: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=70", caption: "টাঙ্গাইল সদর" },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",   caption: "মধুপুর বন" },
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70", caption: "যমুনা নদী" },
              { src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=70", caption: "আতিয়া মসজিদ" },
            ].map((photo, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                <img src={photo.src} alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>{/* end max-w-6xl */}

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="bg-primary mt-10">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            আপনার জেলায় ব্যবসা বা সেবা আছে?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base">
            সম্পূর্ণ বিনামূল্যে আপনার প্রতিষ্ঠান যোগ করুন এবং হাজার হাজার টাঙ্গাইলবাসীর কাছে পৌঁছান।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register-business"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              এখনই যোগ করুন
            </Link>
            <Link href="/about"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:border-white transition-colors">
              আরও জানুন
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EMERGENCY STRIP
      ══════════════════════════════════════════ */}
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="font-semibold">জাতীয় জরুরি সেবা:</span>
          <div className="flex items-center gap-4">
            <a href="tel:999" className="flex items-center gap-1.5 font-black text-lg hover:text-red-200 transition-colors">
              <Phone size={16} className="fill-white" /> ৯৯৯
            </a>
            <a href="tel:199" className="flex items-center gap-1.5 font-semibold hover:text-red-200 transition-colors">🚒 ১৯৯</a>
            <a href="tel:109" className="flex items-center gap-1.5 font-semibold hover:text-red-200 transition-colors">📞 ১০৯</a>
          </div>
        </div>
      </div>

    </div>
  );
}
