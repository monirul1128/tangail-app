import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { getNews } from "@/lib/firestore";
import type { NewsArticle } from "@/models/types";
import { formatDistanceToNow } from "date-fns";
import NewsClient from "./NewsClient";

export const metadata: Metadata = {
  title: "খবর ও নোটিশ",
  description: "টাঙ্গাইল জেলার সর্বশেষ খবর, সরকারি নোটিশ এবং জেলা প্রশাসনের তথ্য",
};

export const revalidate = 60;

export default async function NewsPage() {
  const newsList = await getNews(undefined, 40).catch(() => [] as NewsArticle[]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">সর্বশেষ খবর ও নোটিশ</h1>
        <p className="text-gray-500">টাঙ্গাইল জেলার সর্বশেষ খবর এবং সরকারি নোটিশ</p>
      </div>
      <NewsClient newsList={newsList} />
    </div>
  );
}
