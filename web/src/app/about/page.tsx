import ServicePageLayout from "@/components/ui/ServicePageLayout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে — আমাদের টাঙ্গাইল",
  description: "ঐতিহ্য ও প্রযুক্তির বন্ধনে, সেবা পৌঁছাক প্রতি ঘরে ঘরে—স্মার্ট টাঙ্গাইল গড়ার প্রত্যয়ে।",
};

const services = [
  {
    emoji: "🚨",
    title: "জরুরি সেবা ও হটলাইন",
    desc: "ফায়ার সার্ভিস, পুলিশ, অ্যাম্বুলেন্স, বিদ্যুৎ অফিস এবং ২৪/৭ জরুরি ব্লাড ব্যাংকের নম্বর ও অবস্থান।",
    color: "bg-red-50 border-red-100",
    titleColor: "text-red-700",
  },
  {
    emoji: "🏥",
    title: "চিকিৎসা ও স্বাস্থ্যসেবা",
    desc: "জেলার অভিজ্ঞ ডাক্তারদের তালিকা, চেম্বার, সিরিয়াল বুকিংয়ের তথ্য, হাসপাতাল ও ডায়াগনস্টিক সেন্টারের বিস্তারিত।",
    color: "bg-green-50 border-green-100",
    titleColor: "text-green-700",
  },
  {
    emoji: "🏛️",
    title: "ঐতিহ্য ও ভ্রমণ গাইড",
    desc: "মহেড়া জমিদার বাড়ি, ধনবাড়ী নওয়াব প্যালেস, মধুপুরের গড়, আতিয়া মসজিদসহ দর্শনীয় স্থানগুলোর যাতায়াত ও ইতিহাস।",
    color: "bg-sky-50 border-sky-100",
    titleColor: "text-sky-700",
  },
  {
    emoji: "🥻",
    title: "তাঁত ও খাঁটি চমচম",
    desc: "বিখ্যাত টাঙ্গাইল শাড়ির নির্ভরযোগ্য হাট/দোকান এবং ঐতিহ্যবাহী আসল চমচমের দোকানের তথ্য।",
    color: "bg-pink-50 border-pink-100",
    titleColor: "text-pink-700",
  },
  {
    emoji: "🚌",
    title: "যাতায়াত সময়সূচী",
    desc: "টাঙ্গাইল থেকে ঢাকা ও দেশের বিভিন্ন রুটে চলাচলকারী ট্রেন এবং বাসের সঠিক সময়সূচী ও ভাড়া।",
    color: "bg-amber-50 border-amber-100",
    titleColor: "text-amber-700",
  },
  {
    emoji: "🏛️",
    title: "প্রশাসন ও ই-সেবা",
    desc: "জেলা ও উপজেলা প্রশাসনের যোগাযোগের ঠিকানা, ইউপি সেবা এবং বিভিন্ন সরকারি ই-সেবার দ্রুত লিঙ্ক।",
    color: "bg-purple-50 border-purple-100",
    titleColor: "text-purple-700",
  },
  {
    emoji: "🎓",
    title: "শিক্ষা ও ক্যারিয়ার",
    desc: "জেলার সেরা স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের তথ্য এবং স্থানীয় চাকরির সাম্প্রতিক আপডেট।",
    color: "bg-blue-50 border-blue-100",
    titleColor: "text-blue-700",
  },
  {
    emoji: "📰",
    title: "জরুরি তথ্য ও পত্রিকা",
    desc: "টাঙ্গাইল জেলার প্রতিদিনের টাটকা খবর এবং স্থানীয় পত্রিকা পড়ার সুবিধা।",
    color: "bg-teal-50 border-teal-100",
    titleColor: "text-teal-700",
  },
];

export default function AboutPage() {
  return (
    <ServicePageLayout
      title="আমাদের সম্পর্কে"
      subtitle="আমাদের টাঙ্গাইল — সেবা ও তথ্য পোর্টাল"
      emoji="ℹ️"
      accentColor="bg-primary"
    >
      {/* Tagline */}
      <div className="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-6 mb-6 text-center">
        <div className="text-4xl mb-3">🌿</div>
        <p className="text-white font-black text-lg md:text-xl leading-snug">
          ঐতিহ্য ও প্রযুক্তির বন্ধনে,
        </p>
        <p className="text-white font-black text-lg md:text-xl leading-snug mb-2">
          সেবা পৌঁছাক প্রতি ঘরে ঘরে
        </p>
        <p className="text-white/80 text-sm">— স্মার্ট টাঙ্গাইল গড়ার প্রত্যয়ে।</p>
      </div>

      {/* Main description */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          আমাদের পরিচিতি
        </h2>
        <p className="text-gray-600 leading-[1.9] text-sm md:text-base">
          ঐতিহ্যবাহী তাঁতের শাড়ি, সুস্বাদু চমচম আর সমৃদ্ধ ইতিহাসের জেলা{" "}
          <span className="font-bold text-primary">টাঙ্গাইলকে আপনার হাতের মুঠোয়</span>{" "}
          নিয়ে আসতে আমাদের এই বিশেষ প্রয়াস। ডিজিটাল বাংলাদেশ থেকে স্মার্ট বাংলাদেশে
          পদার্পণের এই সময়ে, টাঙ্গাইল জেলার নাগরিক সেবা, তথ্য এবং ঐতিহ্যকে এক সুতোয়
          গাঁথতেই তৈরি করা হয়েছে এই অ্যাপটি।
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { emoji: "🏥", value: "৫০+",  label: "হাসপাতাল ও ক্লিনিক"  },
          { emoji: "👨‍⚕️", value: "১০০+", label: "বিশেষজ্ঞ ডাক্তার"    },
          { emoji: "🚑", value: "৩০+",  label: "অ্যাম্বুলেন্স সার্ভিস"},
          { emoji: "🩸", value: "৫০০+", label: "রক্তদাতা"              },
        ].map(s => (
          <div key={s.label} className="bg-primary/5 border border-primary/15 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-1">{s.emoji}</div>
            <div className="font-black text-primary text-xl">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Services list */}
      <div className="mb-6">
        <h2 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full" />
          অ্যাপটির মাধ্যমে যা যা সেবা পাবেন
        </h2>
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.title} className={`rounded-2xl border p-4 ${s.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{s.emoji}</span>
                <div>
                  <h3 className={`font-bold text-sm mb-1 ${s.titleColor}`}>{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing message */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6 text-center">
        <div className="text-3xl mb-3">🤝</div>
        <p className="text-gray-700 leading-[1.9] text-sm md:text-base mb-3">
          টাঙ্গাইলের সাধারণ মানুষের দৈনন্দিন জীবনকে আরও{" "}
          <span className="font-bold text-primary">সহজ, আধুনিক ও ডিজিটাল</span>{" "}
          করতেই এই ক্ষুদ্র প্রচেষ্টা।
        </p>
        <p className="text-gray-800 font-black text-base">
          আপনার জেলা, আপনার হাতের মুঠোয়
        </p>
        <p className="text-gray-500 text-sm mt-1">
          আজই যুক্ত থাকুন <span className="text-primary font-bold">'আমাদের টাঙ্গাইল'</span>-এর সাথে!
        </p>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full" />
          যোগাযোগ করুন
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">📧 <span>info@amadeртangail.com</span></p>
          <p className="flex items-center gap-2">📞 <span>01711000000</span></p>
          <p className="flex items-center gap-2">📍 <span>টাঙ্গাইল জেলা সদর, টাঙ্গাইল, বাংলাদেশ</span></p>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/register-business"
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-full transition-colors text-sm">
          ব্যবসা যোগ করুন <ArrowRight size={15} />
        </Link>
        <Link href="/"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-primary text-primary font-bold px-6 py-3 rounded-full hover:bg-primary/5 transition-colors text-sm">
          হোমে ফিরুন
        </Link>
      </div>
    </ServicePageLayout>
  );
}
