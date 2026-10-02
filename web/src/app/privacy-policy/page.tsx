import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | আমাদের টাঙ্গাইল",
  description: "আমাদের টাঙ্গাইল অ্যাপের গোপনীয়তা নীতি — আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখা হয়।",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "১ জানুয়ারি, ২০২৫";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-primary hover:underline text-sm">
            ← হোমে ফিরে যান
          </Link>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          গোপনীয়তা নীতি
        </h1>
        <p className="text-gray-500 text-sm">
          সর্বশেষ আপডেট: {lastUpdated}
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">

        {/* Intro */}
        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
          <p className="text-gray-700 leading-relaxed">
            <strong>আমাদের টাঙ্গাইল</strong> অ্যাপ এবং ওয়েবসাইট ব্যবহার করার জন্য আপনাকে ধন্যবাদ।
            এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার,
            সংরক্ষণ এবং সুরক্ষিত রাখি। আমাদের সেবা ব্যবহার করে আপনি এই নীতিতে সম্মত হচ্ছেন।
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">১</span>
            আমরা কী তথ্য সংগ্রহ করি
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p className="font-semibold text-gray-700">ক) আপনি স্বেচ্ছায় যে তথ্য দেন:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>নাম, ফোন নম্বর, রক্তের গ্রুপ — রক্তদাতা হিসেবে নিবন্ধন করলে</li>
              <li>ব্যবসা বা প্রতিষ্ঠানের নাম, ঠিকানা, যোগাযোগ নম্বর — ব্যবসা নিবন্ধন করলে</li>
              <li>ইমেইল ঠিকানা — অ্যাডমিন প্যানেল লগইনের জন্য</li>
            </ul>
            <p className="font-semibold text-gray-700 mt-4">খ) স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>ডিভাইসের ধরন এবং অপারেটিং সিস্টেম</li>
              <li>অ্যাপ ব্যবহারের পরিসংখ্যান (Firebase Analytics-এর মাধ্যমে)</li>
              <li>ক্র্যাশ রিপোর্ট এবং পারফরম্যান্স ডেটা</li>
            </ul>
            <p className="font-semibold text-gray-700 mt-4">গ) আমরা যা সংগ্রহ করি না:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>আপনার অবস্থান (Location) তথ্য</li>
              <li>ক্যামেরা বা মাইক্রোফোনের অ্যাক্সেস</li>
              <li>পরিচিতি তালিকা (Contacts)</li>
              <li>পেমেন্ট বা ব্যাংকিং তথ্য</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">২</span>
            তথ্য কীভাবে ব্যবহার করা হয়
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
            <li>রক্তদাতার তালিকা সর্বসাধারণের কাছে প্রদর্শন করতে (শুধুমাত্র নাম, রক্তের গ্রুপ এবং উপজেলা)</li>
            <li>ব্যবসা, হাসপাতাল, ডাক্তার ইত্যাদির তথ্য প্রদর্শন করতে</li>
            <li>অ্যাপের মান উন্নয়ন এবং বাগ ঠিক করতে</li>
            <li>নিরাপত্তা নিশ্চিত করতে এবং অপব্যবহার রোধ করতে</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৩</span>
            তথ্য শেয়ারিং
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-3">
            <p>আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি, ভাড়া বা শেয়ার করি না।
            তবে নিম্নোক্ত ক্ষেত্রে তথ্য শেয়ার হতে পারে:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Firebase (Google):</strong> ডেটা সংরক্ষণ এবং অ্যানালিটিক্সের জন্য। Google-এর গোপনীয়তা নীতি প্রযোজ্য।</li>
              <li><strong>আইনি বাধ্যবাধকতা:</strong> আদালত বা সরকারি কর্তৃপক্ষের বৈধ অনুরোধে</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৪</span>
            তথ্য সুরক্ষা
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
            <li>সকল ডেটা Google Firebase-এ সংরক্ষিত এবং SSL/TLS এনক্রিপশন দ্বারা সুরক্ষিত</li>
            <li>Firestore Security Rules দ্বারা অননুমোদিত অ্যাক্সেস রোধ করা হয়</li>
            <li>অ্যাডমিন প্যানেল শুধুমাত্র অনুমোদিত ব্যক্তিরা ব্যবহার করতে পারেন</li>
            <li>নিয়মিত নিরাপত্তা পর্যালোচনা করা হয়</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৫</span>
            আপনার অধিকার
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
            <li><strong>অ্যাক্সেস:</strong> আপনি আপনার সম্পর্কে সংরক্ষিত তথ্য দেখতে পারেন</li>
            <li><strong>সংশোধন:</strong> ভুল তথ্য সংশোধনের অনুরোধ করতে পারেন</li>
            <li><strong>মুছে ফেলা:</strong> আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন</li>
            <li><strong>প্রত্যাহার:</strong> রক্তদাতা হিসেবে নিবন্ধন বাতিল করতে পারেন</li>
          </ul>
          <p className="mt-3 text-gray-600">
            এই অধিকারগুলো প্রয়োগ করতে নিচের যোগাযোগ তথ্যে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৬</span>
            শিশুদের গোপনীয়তা
          </h2>
          <p className="text-gray-600 leading-relaxed">
            আমাদের সেবা ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা জেনেশুনে শিশুদের
            ব্যক্তিগত তথ্য সংগ্রহ করি না। যদি আপনি মনে করেন কোনো শিশুর তথ্য সংগ্রহ
            হয়েছে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৭</span>
            নীতির পরিবর্তন
          </h2>
          <p className="text-gray-600 leading-relaxed">
            এই গোপনীয়তা নীতি সময়ে সময়ে আপডেট হতে পারে। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে
            অ্যাপের মাধ্যমে বা ওয়েবসাইটে নোটিশ দেওয়া হবে। সর্বশেষ আপডেটের তারিখ সর্বদা
            এই পাতার উপরে উল্লেখ থাকবে।
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">৮</span>
            তৃতীয় পক্ষের সেবা
          </h2>
          <div className="text-gray-600 leading-relaxed space-y-2">
            <p>আমাদের অ্যাপ নিম্নোক্ত তৃতীয় পক্ষের সেবা ব্যবহার করে:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Google Firebase</strong> — ডেটাবেস, অথেন্টিকেশন, অ্যানালিটিক্স</li>
              <li><strong>AlAdhan API</strong> — নামাজের সময় নির্ধারণ (কোনো ব্যক্তিগত তথ্য পাঠানো হয় না)</li>
              <li><strong>Google Fonts</strong> — ফন্ট লোড করার জন্য</li>
            </ul>
            <p className="mt-2">এই সেবাগুলোর নিজস্ব গোপনীয়তা নীতি রয়েছে।</p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📬 যোগাযোগ করুন
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>গোপনীয়তা সম্পর্কিত যেকোনো প্রশ্ন বা অনুরোধের জন্য:</p>
            <div className="mt-3 space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">নাম:</span>
                আমাদের টাঙ্গাইল
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">ওয়েবসাইট:</span>
                <a href="https://amadertangail.online"className="text-primary hover:underline">
                 amadertangail.online
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">ইমেইল:</span>
                <a href="mailto:monirul4213@gmail.com" className="text-primary hover:underline">
                  amadertangail.online@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">ঠিকানা:</span>
                টাঙ্গাইল জেলা, ঢাকা বিভাগ, বাংলাদেশ
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
