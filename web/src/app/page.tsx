import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { getLatestNews } from "@/lib/firestore";
import SearchBar from "@/components/ui/SearchBar";
import type { NewsArticle } from "@/models/types";

export const revalidate = 60;

/* ─── Prayer times (static — replace with live API) ─── */
const prayerTimes = [
  { name: "ফজর",    time: "৪:৩০" },
  { name: "জোহর",   time: "১২:০০" },
  { name: "আসর",    time: "৪:১৫" },
  { name: "মাগরিব", time: "৬:৩০" },
  { name: "এশা",    time: "৭:৪৫" },
];

/* ─── Quick service buttons ─── */
const quickServices = [
  { href: "/ambulance",   label: "অ্যাম্বুলেন্স",   emoji: "🚑", bg: "bg-red-600"    },
  { href: "/blood-donor", label: "রক্তদান",          emoji: "🩸", bg: "bg-red-500"    },
  { href: "/emergency",   label: "ফায়ার সার্ভিস",   emoji: "🔥", bg: "bg-orange-500" },
  { href: "/emergency",   label: "পুলিশ",            emoji: "👮", bg: "bg-blue-700"   },
  { href: "/hospitals",   label: "হাসপাতাল",         emoji: "🏥", bg: "bg-primary"    },
  { href: "/emergency",   label: "৯৯৯ হটলাইন",      emoji: "📞", bg: "bg-green-600"  },
];

/* ─── All 12 Upazilas ─── */
const upazilas = [
  { id: "tangail_sadar", name: "সদর",       icon: "🏙️" },
  { id: "basail",        name: "বাসাইল",    icon: "🌾" },
  { id: "bhuapur",       name: "ভূয়াপুর",  icon: "🌿" },
  { id: "delduar",       name: "দেলদুয়ার", icon: "🏘️" },
  { id: "dhanbari",      name: "ধনবাড়ী",   icon: "🏛️" },
  { id: "ghatail",       name: "ঘাটাইল",    icon: "⛵" },
  { id: "gopalpur",      name: "গোপালপুর",  icon: "🌳" },
  { id: "kalihati",      name: "কালিহাতী",  icon: "🛖" },
  { id: "madhupur",      name: "মধুপুর",    icon: "🌲" },
  { id: "mirzapur",      name: "মির্জাপুর", icon: "🏗️" },
  { id: "nagarpur",      name: "নাগরপুর",   icon: "🌻" },
  { id: "sakhipur",      name: "সখিপুর",    icon: "🍃" },
];

/* ─── Blood groups ─── */
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

/* ─── Sample featured hospitals (replace with Firestore data) ─── */
const featuredHospitals = [
  { name: "শেখ হাসিনা মেডিকেল কলেজ", type: "সরকারি", rating: 4.2, reviews: "১,৫০০+", href: "/hospitals" },
  { name: "ইসলামী ব্যাংক হাসপাতাল",  type: "বেসরকারি",rating: 4.4, reviews: "৭০০+",  href: "/hospitals" },
  { name: "মির্জাপুর উপজেলা স্বাস্থ্য", type: "সরকারি", rating: 3.8, reviews: "৪০০+",  href: "/hospitals" },
];

/* ─── Helper ─── */
const toBanglaNum = (n: number) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);

export default async function HomePage() {
  const latestNews = await getLatestNews(4).catch(() => [] as NewsArticle[]);

  const now        = new Date();
  const banglaDay  = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"][now.getDay()];
  const banglaMonths = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  const banglaDate = `${banglaDay}, ${toBanglaNum(now.getDate())} ${banglaMonths[now.getMonth()]} ${toBanglaNum(now.getFullYear())}`;

  return (
    <div className="bg-[#f4f6f8]">

      {/* ══════════════════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=80')" }}
        />

        {/* Multi-layer gradient: strong bottom, light top, slight left vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* ── Main content ── */}
        <div className="relative z-10 flex flex-col justify-between h-full" style={{ minHeight: 340 }}>

          {/* Top: date + tagline */}
          <div className="px-4 md:px-8 pt-7 max-w-6xl mx-auto w-full">
            {/* Location pill */}
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="text-white/70 text-xs">📍</span>
              <span className="text-white/90 text-xs font-medium">টাঙ্গাইল জেলা, বাংলাদেশ</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              {/* Date & headline */}
              <div className="flex-1">
                <p className="text-white/60 text-xs tracking-widest uppercase mb-1.5 font-medium">
                  আজকের তারিখ
                </p>
                <h1 className="text-white font-black leading-tight drop-shadow-lg"
                    style={{ fontSize: "clamp(1.4rem, 4vw, 2.4rem)" }}>
                  {banglaDate}
                </h1>
                <p className="text-white/75 text-sm mt-2.5 max-w-sm leading-relaxed">
                  আপনার জেলার সকল দরকারি তথ্য একটি ডিজিটাল প্ল্যাটফর্মে
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link
                    href="/hospitals"
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    🏥 সেবা খুঁজুন
                  </Link>
                  <a
                    href="tel:999"
                    className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5"
                  >
                    📞 জরুরি: ৯৯৯
                  </a>
                </div>
              </div>

              {/* Weather card */}
              <div className="flex-shrink-0 hidden sm:block">
                <div className="bg-white/10 backdrop-blur-lg border border-white/25 rounded-2xl px-5 py-4 text-white text-center shadow-2xl min-w-[90px]">
                  <div className="text-4xl mb-1.5">🌤️</div>
                  <div className="text-2xl font-black leading-none">২৯°</div>
                  <div className="text-xs text-white/60 mt-0.5">সে.</div>
                  <div className="text-[11px] text-white/70 mt-1.5 font-medium">রোদচ্ছায়া</div>
                  <div className="mt-2 pt-2 border-t border-white/15 text-[10px] text-white/50">
                    টাঙ্গাইল
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: prayer times strip */}
          <div className="mt-auto">
            {/* Thin accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4 mb-0" />
            <div className="bg-black/60 backdrop-blur-md border-t border-white/10">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="flex items-center overflow-x-auto scrollbar-hide divide-x divide-white/10">
                  {/* Label */}
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

      {/* ══════════════════════════════════════════════════════
          QUICK SERVICE BUTTONS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {quickServices.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className={`${s.bg} flex-shrink-0 flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT WRAPPER
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

        {/* ── সেরা প্রতিষ্ঠান ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              সেরা প্রতিষ্ঠানসমূহ
            </h2>
            <Link href="/hospitals" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredHospitals.map((h) => (
              <div key={h.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">🏥</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <h3 className="font-bold text-gray-800 text-sm leading-snug">{h.name}</h3>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">
                        ✓ ভেরিফাইড
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{h.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-gray-700">{h.rating}</span>
                    <span>({h.reviews} ভিউ)</span>
                  </div>
                  <Link href={h.href} className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary-600 transition-colors">
                    বিস্তারিত
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── বিশেষজ্ঞ ডাক্তার ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              বিশেষজ্ঞ ডাক্তার
            </h2>
            <Link href="/doctors" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "ডা. রফিকুল ইসলাম", spec: "মেডিসিন বিশেষজ্ঞ",   qual: "MBBS, FCPS",  fee: "৫০০" },
              { name: "ডা. সুমাইয়া খানম", spec: "গাইনী বিশেষজ্ঞ",     qual: "MBBS, MS",    fee: "৬০০" },
              { name: "ডা. আবদুল করিম",   spec: "শিশু বিশেষজ্ঞ",      qual: "MBBS, DCH",   fee: "৪০০" },
            ].map((d) => (
              <div key={d.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">👨‍⚕️</div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{d.name}</div>
                    <div className="text-xs text-purple-600 font-semibold">{d.spec}</div>
                    <div className="text-xs text-gray-400">{d.qual}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">ভিজিট: ৳{d.fee}</span>
                  <Link href="/doctors" className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary-600 transition-colors">
                    অ্যাপয়েন্টমেন্ট
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── উপজেলা সমূহ ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              উপজেলা সমূহ
            </h2>
            <span className="text-sm text-gray-400">{toBanglaNum(12)}টি উপজেলা</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
            {upazilas.map((u) => (
              <Link
                key={u.id}
                href={`/hospitals?upazila=${u.id}`}
                className="bg-white rounded-xl p-2.5 flex flex-col items-center gap-1.5 shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{u.icon}</span>
                <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">{u.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── সর্বশেষ নোটিশ ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
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
              { title: "শেখ হাসিনা মেডিকেলে বিনামূল্যে স্বাস্থ্য সেবা",   date: "২০ সেপ্টেম্বর ২০২৬" },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-500 text-sm">📋</span>
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

        {/* ── রক্তদান widget ── */}
        <section>
          <div className="bg-gradient-to-br from-red-600 to-red-500 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold">রক্তের গ্রুপ খুঁজুন?</h2>
              <Link href="/blood-donor/register" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-semibold transition-colors">
                ডোনার হোন
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {bloodGroups.map((bg) => (
                <Link
                  key={bg}
                  href={`/blood-donor?group=${bg}`}
                  className="bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl py-2.5 text-center font-black text-sm transition-colors"
                >
                  {bg}
                </Link>
              ))}
            </div>
            <Link
              href="/blood-donor"
              className="block w-full text-center bg-white text-red-600 font-bold py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors"
            >
              সকল ডোনার দেখুন →
            </Link>
          </div>
        </section>

        {/* ── জরুরি সেবা ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-500 rounded-full inline-block" />
              জরুরি সেবা নম্বর
            </h2>
            <Link href="/emergency" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "জাতীয় জরুরি",    number: "999",  bg: "bg-red-600",    emoji: "🆘" },
              { label: "ফায়ার সার্ভিস",   number: "199",  bg: "bg-orange-500", emoji: "🚒" },
              { label: "পুলিশ",           number: "999",  bg: "bg-blue-700",   emoji: "👮" },
              { label: "মহিলা হেল্পলাইন", number: "109",  bg: "bg-pink-600",   emoji: "📞" },
            ].map((e) => (
              <a
                key={e.label}
                href={`tel:${e.number}`}
                className={`${e.bg} rounded-2xl p-4 flex flex-col items-center gap-2 text-white hover:opacity-90 transition-opacity`}
              >
                <span className="text-3xl">{e.emoji}</span>
                <div className="text-center">
                  <div className="text-xs opacity-80">{e.label}</div>
                  <div className="font-black text-xl">{e.number}</div>
                </div>
              </a>
            ))}
          </div>
        </section>



        {/* ── ফটো গ্যালারি ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full inline-block" />
              ফটো গ্যালারি
            </h2>
            <Link href="/gallery" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=70",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70",
              "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&q=70",
            ].map((src, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                <img src={src} alt={`গ্যালারি ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* ── অ্যাম্বুলেন্স সার্ভিস quick cards ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
              অ্যাম্বুলেন্স সার্ভিস
            </h2>
            <Link href="/ambulance" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "আবীর অ্যাম্বুলেন্স সার্ভিস", tag: "২৪ ঘণ্টা সার্ভিস", phone: "01711000020" },
              { name: "মামুন অ্যাম্বুলেন্স সার্ভিস", tag: "এসি ও ফ্রিজার ভ্যান", phone: "01711000030" },
            ].map((a) => (
              <div key={a.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🚑</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm">{a.name}</div>
                  <div className="text-xs text-amber-600 font-medium">{a.tag}</div>
                </div>
                <a href={`tel:${a.phone}`} className="flex-shrink-0 w-9 h-9 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                  <Phone size={15} className="text-white" />
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>{/* end max-w-6xl */}

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className="bg-primary mt-10">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            আপনার জেলায় ব্যবসা বা সেবা আছে?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm md:text-base">
            সম্পূর্ণ বিনামূল্যে আপনার প্রতিষ্ঠান যোগ করুন এবং হাজার হাজার টাঙ্গাইলবাসীর কাছে পৌঁছান।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register-business" className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
              এখনই যোগ করুন
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:border-white transition-colors">
              আরও জানুন
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          EMERGENCY STRIP (bottom of page, above footer)
      ══════════════════════════════════════════════════════ */}
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
          <span className="font-semibold">জাতীয় জরুরি সেবা:</span>
          <div className="flex items-center gap-4">
            <a href="tel:999" className="flex items-center gap-1.5 font-black text-lg hover:text-red-200 transition-colors">
              <Phone size={16} className="fill-white" /> ৯৯৯
            </a>
            <a href="tel:199" className="flex items-center gap-1.5 font-semibold hover:text-red-200 transition-colors">
              🚒 ১৯৯
            </a>
            <a href="tel:109" className="flex items-center gap-1.5 font-semibold hover:text-red-200 transition-colors">
              📞 ১০৯
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
