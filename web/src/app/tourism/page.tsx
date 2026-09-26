import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { MapPin, Clock, Phone } from "lucide-react";

const spots = [
  {
    id:"1", name:"মাওলানা ভাসানীর মাজার ও সন্তোষ",
    category:"ঐতিহাসিক", upazila:"টাঙ্গাইল সদর",
    emoji:"🕌", color:"bg-green-50 border-green-100",
    image:"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=70",
    description:"মজলুম জননেতা মাওলানা আব্দুল হামিদ খান ভাসানীর মাজার সন্তোষে অবস্থিত। এখানে ইসলামী বিশ্ববিদ্যালয়ও রয়েছে। প্রতিদিন হাজারো মানুষ এখানে আসেন।",
    time:"সকাল ৬টা - রাত ৯টা",
    tips:"মাজার এলাকা সুসজ্জিত। কাছেই সন্তোষ বাজার।",
  },
  {
    id:"2", name:"আতিয়া মসজিদ",
    category:"ঐতিহাসিক", upazila:"দেলদুয়ার",
    emoji:"🏛️", color:"bg-amber-50 border-amber-100",
    image:"https://images.unsplash.com/photo-1585759591502-7cd701be2b2e?w=600&q=70",
    description:"১৬০৯ খ্রিস্টাব্দে নির্মিত আতিয়া মসজিদ বাংলাদেশের অন্যতম প্রাচীন মসজিদ। মুঘল স্থাপত্যের এই অনন্য নিদর্শনটি বাংলাদেশ সরকার সংরক্ষিত পুরাকীর্তি হিসেবে ঘোষণা করেছে।",
    time:"সকাল ৬টা - রাত ৯টা",
    tips:"নামাজের সময় পর্যটকদের প্রবেশ সীমিত। ক্যামেরা নিয়ে আসতে পারেন।",
  },
  {
    id:"3", name:"মধুপুর জাতীয় উদ্যান",
    category:"প্রকৃতি", upazila:"মধুপুর",
    emoji:"🌲", color:"bg-emerald-50 border-emerald-100",
    image:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=70",
    description:"মধুপুর জাতীয় উদ্যান বাংলাদেশের তৃতীয় বৃহত্তম জাতীয় উদ্যান। ২১,০০০ হেক্টর এলাকা জুড়ে বিস্তৃত এই বনে শাল গাছের আধিক্য। বনের ভেতরে গারো আদিবাসী সম্প্রদায়ের বসবাস।",
    time:"সকাল ৭টা - বিকেল ৫টা",
    tips:"ইকো ট্যুরিজম কটেজে রাত কাটাতে পারেন। শীতকাল ভ্রমণের উপযুক্ত সময়।",
  },
  {
    id:"4", name:"ভারতেশ্বরী হোমস, মির্জাপুর",
    category:"শিক্ষা ও সংস্কৃতি", upazila:"মির্জাপুর",
    emoji:"🏫", color:"bg-blue-50 border-blue-100",
    image:"https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=70",
    description:"রণদা প্রসাদ সাহা প্রতিষ্ঠিত ভারতেশ্বরী হোমস বাংলাদেশের অন্যতম ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠান। এখানে মুক্তিযুদ্ধের স্মৃতি জাদুঘরও রয়েছে।",
    time:"সকাল ৯টা - বিকেল ৫টা",
    tips:"কুমুদিনী হাসপাতাল ও কলেজও পাশেই। পূর্বে অনুমতি নিয়ে যান।",
  },
  {
    id:"5", name:"এলেঙ্গা রিসোর্ট",
    category:"বিনোদন", upazila:"কালিহাতী",
    emoji:"🏖️", color:"bg-sky-50 border-sky-100",
    image:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70",
    description:"ঢাকা-টাঙ্গাইল মহাসড়কের পাশে অবস্থিত এলেঙ্গা রিসোর্ট একটি জনপ্রিয় পর্যটন কেন্দ্র। এখানে কটেজ, রেস্তোরাঁ, সুইমিং পুল এবং বিনোদনের ব্যবস্থা রয়েছে।",
    time:"সকাল ৮টা - রাত ১০টা",
    tips:"সপ্তাহান্তে ভিড় বেশি। আগে থেকে বুকিং দিন। ফোন: 01711000099",
  },
  {
    id:"6", name:"পাকুটিয়া নওয়াব প্যালেস",
    category:"ঐতিহাসিক", upazila:"নাগরপুর",
    emoji:"🏰", color:"bg-rose-50 border-rose-100",
    image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
    description:"নাগরপুরের পাকুটিয়ায় অবস্থিত এই জমিদার বাড়িটি মুঘল ও ইউরোপীয় স্থাপত্যের সমন্বয়ে নির্মিত। ব্রিটিশ আমলে নির্মিত এই প্রাসাদটি ইতিহাসের সাক্ষী।",
    time:"সকাল ৯টা - বিকেল ৫টা",
    tips:"স্থানীয় গাইড নিন। ছবি তোলার জন্য চমৎকার লোকেশন।",
  },
  {
    id:"7", name:"ধনবাড়ী নওয়াব প্যালেস",
    category:"ঐতিহাসিক", upazila:"ধনবাড়ী",
    emoji:"🏯", color:"bg-purple-50 border-purple-100",
    image:"https://images.unsplash.com/photo-1548199569-9a4b26c5de93?w=600&q=70",
    description:"ধনবাড়ীর নওয়াব প্যালেস ঐতিহাসিক গুরুত্বের দিক থেকে টাঙ্গাইলের অন্যতম দর্শনীয় স্থান। বিশাল মাঠ ও পুকুর সহ এই প্রাচীন স্থাপনাটি পর্যটকদের আকর্ষণ করে।",
    time:"সকাল ৯টা - বিকেল ৫টা",
    tips:"স্থানীয় গাইডের সাহায্যে ইতিহাস জানুন।",
  },
  {
    id:"8", name:"বঙ্গবন্ধু সেতু পশ্চিম প্রান্ত",
    category:"আধুনিক স্থাপনা", upazila:"কালিহাতী",
    emoji:"🌉", color:"bg-indigo-50 border-indigo-100",
    image:"https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=70",
    description:"বঙ্গবন্ধু যমুনা সেতুর পশ্চিম পাড় কালিহাতীতে। যমুনা নদীর অপরূপ সৌন্দর্য এবং সেতুর বিশালতা দেখতে প্রতিদিন পর্যটকরা আসেন। সূর্যাস্তের দৃশ্য অসাধারণ।",
    time:"সর্বক্ষণ উন্মুক্ত",
    tips:"সন্ধ্যায় সূর্যাস্ত দেখার জন্য আদর্শ। নদীর পাড়ে বসার ব্যবস্থা আছে।",
  },
];

const categories = ["সব","ঐতিহাসিক","প্রকৃতি","বিনোদন","শিক্ষা ও সংস্কৃতি","আধুনিক স্থাপনা"];
const catColor: Record<string,string> = {
  "ঐতিহাসিক":"bg-amber-100 text-amber-800",
  "প্রকৃতি":"bg-green-100 text-green-800",
  "বিনোদন":"bg-blue-100 text-blue-800",
  "শিক্ষা ও সংস্কৃতি":"bg-purple-100 text-purple-800",
  "আধুনিক স্থাপনা":"bg-indigo-100 text-indigo-800",
};

export const metadata = {
  title: "পর্যটন — টাঙ্গাইলের দর্শনীয় স্থান",
  description: "মধুপুর বন, আতিয়া মসজিদ, ভারতেশ্বরী হোমস সহ টাঙ্গাইলের সকল পর্যটন স্থানের তথ্য",
};

export default function TourismPage() {
  return (
    <ServicePageLayout title="পর্যটন স্থান" subtitle="টাঙ্গাইলের দর্শনীয় ও ঐতিহাসিক স্থানসমূহ" emoji="🏞️" accentColor="bg-sky-700">

      {/* Category strip */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.slice(1).map(c => (
          <span key={c} className={`px-3 py-1 rounded-full text-xs font-semibold ${catColor[c]??""}`}>{c}</span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {spots.map(s => (
          <div key={s.id} className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${s.color}`}>
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${catColor[s.category]??""}`}>
                {s.category}
              </span>
              <span className="absolute bottom-3 right-3 text-2xl">{s.emoji}</span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-black text-gray-800 text-base mb-1">{s.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                <MapPin size={11} className="flex-shrink-0"/>
                <span>{s.upazila}, টাঙ্গাইল</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{s.description}</p>

              {/* Info row */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-white/60">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} className="flex-shrink-0"/>
                  <span>{s.time}</span>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-3 bg-white/70 rounded-xl px-3 py-2">
                <p className="text-[11px] font-bold text-gray-600 mb-0.5">💡 ভ্রমণ টিপস</p>
                <p className="text-xs text-gray-500">{s.tips}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Travel tips */}
      <div className="mt-8 bg-sky-50 border border-sky-200 rounded-2xl p-5">
        <h3 className="font-bold text-sky-800 mb-3">🚌 কীভাবে যাবেন</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-gray-800 mb-1">ঢাকা থেকে টাঙ্গাইল</p>
            <p className="text-xs">মহাখালী বা গুলিস্তান থেকে বাস — ২ ঘণ্টা। ট্রেনেও যাওয়া যায় কমলাপুর থেকে।</p>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="font-semibold text-gray-800 mb-1">স্থানীয় যোগাযোগ</p>
            <p className="text-xs">টাঙ্গাইল শহর থেকে সিএনজি ও অটোরিকশায় সব জায়গায় যাওয়া যায়।</p>
          </div>
        </div>
      </div>
    </ServicePageLayout>
  );
}
