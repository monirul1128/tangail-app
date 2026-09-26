import ServicePageLayout from "@/components/ui/ServicePageLayout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে — টাঙ্গাইল জেলা পোর্টাল",
};

export default function AboutPage() {
  return (
    <ServicePageLayout title="আমাদের সম্পর্কে" subtitle="টাঙ্গাইল জেলা সেবা ও তথ্য পোর্টাল" emoji="ℹ️" accentColor="bg-primary">

      {/* Mission */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-black text-gray-800 text-xl mb-3 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"/>আমাদের লক্ষ্য
        </h2>
        <p className="text-gray-600 leading-relaxed">
          টাঙ্গাইল জেলা পোর্টাল টাঙ্গাইলের ১২টি উপজেলার সকল নাগরিককে জরুরি সেবা, স্বাস্থ্য, শিক্ষা, পরিবহন ও অন্যান্য দরকারি তথ্য একটি ডিজিটাল প্ল্যাটফর্মে সহজলভ্য করার লক্ষ্যে নির্মিত।
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          {emoji:"🏥", value:"৫০+",  label:"হাসপাতাল ও ক্লিনিক"},
          {emoji:"👨‍⚕️", value:"১০০+", label:"বিশেষজ্ঞ ডাক্তার"},
          {emoji:"🚑", value:"৩০+",  label:"অ্যাম্বুলেন্স সার্ভিস"},
          {emoji:"🩸", value:"৫০০+", label:"রক্তদাতা"},
        ].map(s=>(
          <div key={s.label} className="bg-primary/5 border border-primary/15 rounded-2xl p-4 text-center">
            <div className="text-3xl mb-1">{s.emoji}</div>
            <div className="font-black text-primary text-xl">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
        <h2 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"/>আমাদের সেবাসমূহ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {emoji:"🏥",t:"হাসপাতাল ও ডাক্তার ডিরেক্টরি"},
            {emoji:"🚑",t:"অ্যাম্বুলেন্স সার্ভিস"},
            {emoji:"🩸",t:"রক্তদাতা অনুসন্ধান"},
            {emoji:"📞",t:"জরুরি সেবা নম্বর"},
            {emoji:"🎓",t:"শিক্ষা প্রতিষ্ঠানের তথ্য"},
            {emoji:"🏛️",t:"সরকারি সেবার গাইড"},
            {emoji:"🚌",t:"পরিবহন তথ্য"},
            {emoji:"🗺️",t:"উপজেলাভিত্তিক সেবা"},
          ].map(f=>(
            <div key={f.t} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <span className="text-xl">{f.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{f.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
        <h2 className="font-black text-gray-800 text-lg mb-3">যোগাযোগ করুন</h2>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>📧 info@tangailzilla.com</p>
          <p>📞 01711000000</p>
          <p>📍 টাঙ্গাইল জেলা সদর, টাঙ্গাইল</p>
        </div>
        <Link href="/register-business"
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors">
          ব্যবসা যোগ করুন <ArrowRight size={14}/>
        </Link>
      </div>
    </ServicePageLayout>
  );
}
