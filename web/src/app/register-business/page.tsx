"use client";
import { useState } from "react";
import ServicePageLayout from "@/components/ui/ServicePageLayout";
import { CheckCircle } from "lucide-react";

const categories = [
  "হাসপাতাল / ক্লিনিক","ডাক্তার","ফার্মেসি","শিক্ষা প্রতিষ্ঠান",
  "হোটেল (আবাসিক)","রেস্টুরেন্ট","ব্যাংক / আর্থিক সেবা","পরিবহন",
  "দোকান / শোরুম","বিউটি পার্লার","কৃষি সেবা","টেকনিশিয়ান","অন্যান্য",
];
const upazilas = [
  "টাঙ্গাইল সদর","বাসাইল","ভূয়াপুর","দেলদুয়ার","ধনবাড়ী",
  "ঘাটাইল","গোপালপুর","কালিহাতী","মধুপুর","মির্জাপুর","নাগরপুর","সখিপুর",
];

export default function RegisterBusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name:"", category:"", upazila:"", address:"", phone:"", description:"", ownerName:"", ownerPhone:"" });
  const set = (k: string, v: string) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return (
    <ServicePageLayout title="আবেদন সম্পন্ন" emoji="✅" accentColor="bg-green-600">
      <div className="text-center py-16">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-2">ধন্যবাদ!</h2>
        <p className="text-gray-500 max-w-sm mx-auto">আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যাচাই করে প্রকাশ করব।</p>
      </div>
    </ServicePageLayout>
  );

  return (
    <ServicePageLayout title="ব্যবসা যোগ করুন" subtitle="সম্পূর্ণ বিনামূল্যে আপনার প্রতিষ্ঠান তালিকাভুক্ত করুন" emoji="🏪" accentColor="bg-primary">
      {/* Benefits */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{e:"✅",t:"সম্পূর্ণ বিনামূল্যে"},{e:"👥",t:"হাজার মানুষের কাছে"},{e:"📱",t:"মোবাইল ও ওয়েব"}].map(b=>(
          <div key={b.t} className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{b.e}</div>
            <div className="text-xs font-semibold text-primary">{b.t}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">প্রতিষ্ঠানের নাম *</label>
          <input required value={form.name} onChange={e=>set("name",e.target.value)}
            placeholder="প্রতিষ্ঠানের পূর্ণ নাম"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        {/* Category + Upazila */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ক্যাটাগরি *</label>
            <select required value={form.category} onChange={e=>set("category",e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">ক্যাটাগরি বেছে নিন</option>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">উপজেলা *</label>
            <select required value={form.upazila} onChange={e=>set("upazila",e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">উপজেলা বেছে নিন</option>
              {upazilas.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">পূর্ণ ঠিকানা *</label>
          <input required value={form.address} onChange={e=>set("address",e.target.value)}
            placeholder="গ্রাম/এলাকা, রাস্তা, উপজেলা"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">যোগাযোগ নম্বর *</label>
          <input required value={form.phone} onChange={e=>set("phone",e.target.value)}
            placeholder="01XXXXXXXXX" type="tel"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">বিবরণ</label>
          <textarea value={form.description} onChange={e=>set("description",e.target.value)}
            placeholder="আপনার প্রতিষ্ঠান সম্পর্কে সংক্ষিপ্ত বিবরণ..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </div>

        {/* Owner info */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold text-gray-700">মালিকের তথ্য</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={form.ownerName} onChange={e=>set("ownerName",e.target.value)}
              placeholder="মালিকের নাম"
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            <input value={form.ownerPhone} onChange={e=>set("ownerPhone",e.target.value)}
              placeholder="মালিকের মোবাইল" type="tel"
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
        </div>

        <button type="submit"
          className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-full transition-colors text-sm">
          আবেদন জমা দিন
        </button>
        <p className="text-xs text-gray-400 text-center">আবেদন যাচাই করার পর আপনার প্রতিষ্ঠান প্রকাশ করা হবে</p>
      </form>
    </ServicePageLayout>
  );
}
