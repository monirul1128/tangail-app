import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Newspaper, Calendar, User } from "lucide-react";
import { getNewsById, getNews } from "@/lib/firestore";
import { format } from "date-fns";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsById(params.id).catch(() => null);
  if (!news) return { title: "খবর পাওয়া যায়নি" };
  return {
    title: news.title,
    description: news.body.substring(0, 160),
    openGraph: {
      title: news.title,
      images: news.imageUrl ? [news.imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  const newsList = await getNews(undefined, 50).catch(() => []);
  return newsList.map((n) => ({ id: n.id }));
}

export const revalidate = 300;

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsById(params.id).catch(() => null);
  if (!news) notFound();

  const publishedDate = (() => {
    try {
      if (news.publishedAt?.toDate) return news.publishedAt.toDate();
      if ((news.publishedAt as any)?.seconds) return new Date((news.publishedAt as any).seconds * 1000);
      return new Date();
    } catch { return new Date(); }
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Cover image */}
      {news.imageUrl ? (
        <img
          src={news.imageUrl}
          alt={news.title}
          className="w-full h-72 object-cover rounded-2xl mb-8"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-2xl mb-8 flex items-center justify-center">
          <Newspaper size={60} className="text-gray-300" />
        </div>
      )}

      {/* Notice badge */}
      {news.isNotice && (
        <span className="badge bg-amber-100 text-amber-700 mb-4 inline-block">
          সরকারি নোটিশ
        </span>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 leading-snug mb-6">
        {news.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-100 mb-8">
        <span className="flex items-center gap-1.5">
          <User size={14} className="text-primary" />
          {news.source}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={14} className="text-primary" />
          {format(publishedDate, "dd MMMM yyyy")}
        </span>
        <span className="badge bg-primary-50 text-primary capitalize">
          {news.category}
        </span>
      </div>

      {/* Body */}
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
        {news.body}
      </div>
    </div>
  );
}
