import type { Metadata } from "next";
import { getNews } from "@/lib/firestore";
import type { NewsArticle } from "@/models/types";
import { serializeFirestore } from "@/lib/serialize";
import NewsClient from "./NewsClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "খবর ও নোটিশ",
  description: "টাঙ্গাইল জেলার সর্বশেষ খবর, সরকারি নোটিশ এবং জেলা প্রশাসনের তথ্য",
};

export const revalidate = 60;

export default async function NewsPage() {
  const rawNews = await getNews(undefined, 40).catch(() => [] as NewsArticle[]);
  const newsList = serializeFirestore(rawNews);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">সর্বশেষ খবর ও নোটিশ</h1>
        <p className="text-gray-500">টাঙ্গাইল জেলার সর্বশেষ খবর এবং সরকারি নোটিশ</p>
      </div>
      <Suspense fallback={<div className="py-10 text-center text-gray-400">লোড হচ্ছে...</div>}>
        <NewsClient newsList={newsList} />
      </Suspense>
    </div>
  );
}
