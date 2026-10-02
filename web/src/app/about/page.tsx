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
      {/* Founder's Message */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-600 px-5 py-3">
          <h2 className="font-black text-white text-base flex items-center gap-2">
            💬 প্রতিষ্ঠাতার বার্তা
          </h2>
        </div>

        <div className="p-5">
          {/* Quote marks + message */}
          <div className="relative mb-5">
            <span className="text-6xl text-primary/10 font-black leading-none absolute -top-2 -left-1 select-none">"</span>
            <p className="text-gray-600 leading-[1.9] text-sm md:text-base pl-6 italic">
              প্রযুক্তির এই আধুনিক যুগে সঠিক সময়ে সঠিক তথ্য পাওয়া প্রতিটি নাগরিকের মৌলিক সুবিধা হওয়া উচিত। আমাদের প্রিয় টাঙ্গাইল জেলার প্রতিটি মানুষের কাছে প্রয়োজনীয় জেলাভিত্তিক তথ্য ও নাগরিক সেবা সহজে, দ্রুত এবং সম্পূর্ণ বিনামূল্যে হাতের মুঠোয় পৌঁছে দেওয়ার লক্ষ্য নিয়েই এই অ্যাপটির যাত্রা শুরু।
            </p>
            <p className="text-gray-600 leading-[1.9] text-sm md:text-base pl-6 italic mt-3">
              আমার বিশ্বাস, এই ডিজিটাল প্ল্যাটফর্মটি আমাদের জেলাবাসীর দৈনন্দিন জীবনকে আরও সহজ করবে এবং টাঙ্গাইলকে একটি মডেল স্মার্ট জেলা হিসেবে গড়ে তুলতে কার্যকর ভূমিকা রাখবে। আপনাদের শুভকামনা ও সুচিন্তিত মতামতই আমাদের এগিয়ে যাওয়ার প্রেরণা।
            </p>
            <span className="text-6xl text-primary/10 font-black leading-none absolute -bottom-4 right-0 select-none">"</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-5" />

          {/* Founder profile card — matches the design reference */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Photo with teal ring */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-primary to-teal-400 shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <img
                    src="/images/president.jpeg"
                    alt="মো: আরিফুল ইসলাম"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-black text-gray-800 text-xl leading-tight mb-0.5">
                মো: আরিফুল ইসলাম
              </h3>
              <p className="text-primary font-semibold text-sm mb-1">প্রতিষ্ঠাতা ও পরিচালক</p>
              <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-1 mb-4">
                <span className="text-red-500">📍</span> আমাদের টাঙ্গাইল
              </p>

              {/* Action buttons — phone, whatsapp, facebook */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                {/* Call */}
                <a
                  href="tel:+97452043903"
                  className="w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors shadow-sm border border-red-100"
                  title="+974 52043903"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 5.55 5.55l1.76-1.76a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/97452043903"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-50 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors shadow-sm border border-green-100"
                  title="WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/arifulislam365/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors shadow-sm border border-blue-100"
                  title="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>

              {/* App name signature */}
              <p className="text-xs text-gray-400 mt-4 font-medium">
                আমাদের টাঙ্গাইল | Amader Tangail
              </p>
            </div>
          </div>
        </div>
      </div>
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
          <p className="flex items-center gap-2">📧 <span>ariful.online365@gmail.com</span></p>
          <p className="flex items-center gap-2">📞 <span>+974 5204 3903</span></p>
          <p className="flex items-center gap-2">📍 <span>নাগরপুর, টাঙ্গাইল, বাংলাদেশ</span></p>
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
