"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { NewsArticle } from "@/models/types";
import FilterChips from "@/components/ui/FilterChips";

const CATEGORIES = [
  { id: "health",     label: "স্বাস্থ্য" },
  { id: "district",   label: "জেলা" },
  { id: "notice",     label: "নোটিশ" },
  { id: "government", label: "সরকারি" },
  { id: "general",    label: "সাধারণ" },
];

interface Props { newsList: NewsArticle[] }

export default function NewsClient({ newsList }: Props) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");

  const filtered =
    selectedCategory === "notice"
      ? newsList.filter((n) => n.isNotice)
      : !selectedCategory
      ? newsList
      : newsList.filter((n) => n.category === selectedCategory);

  return (
    <>
      <div className="mb-6">
        <FilterChips
          options={CATEGORIES}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          allLabel="সব"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">কোনো খবর পাওয়া যায়নি</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((news) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="card overflow-hidden hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="relative">
                {news.imageUrl ? (
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                    <Newspaper size={40} className="text-gray-300" />
                  </div>
                )}
                {news.isNotice && (
                  <span className="absolute top-3 left-3 badge bg-amber-500 text-white">
                    নোটিশ
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
                  {news.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="text-primary font-medium">{news.source}</span>
                  <span>
                    {formatDistanceToNow(news.publishedAt.toDate(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
