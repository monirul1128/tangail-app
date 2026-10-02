"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone } from "lucide-react";

// Quick category suggestions
const suggestions = [
  { label: "হাসপাতাল", href: "/hospitals" },
  { label: "ডাক্তার",   href: "/doctors"   },
  { label: "রক্তদান",   href: "/blood-donor"},
  { label: "অ্যাম্বুলেন্স", href: "/ambulance"},
  { label: "ফার্মেসি",  href: "/pharmacy"  },
  { label: "স্কুল",     href: "/education?type=school" },
];

export default function SearchBar() {
  const [query, setQuery]   = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Smart routing based on keyword
    const lower = q.toLowerCase();
    if (lower.includes("হাসপাতাল") || lower.includes("hospital"))
      return router.push(`/hospitals`);
    if (lower.includes("ডাক্তার") || lower.includes("doctor"))
      return router.push(`/doctors`);
    if (lower.includes("রক্ত") || lower.includes("blood"))
      return router.push(`/blood-donor`);
    if (lower.includes("অ্যাম্বুলেন্স") || lower.includes("ambulance"))
      return router.push(`/ambulance`);
    if (lower.includes("ফার্মেসি") || lower.includes("pharmacy"))
      return router.push(`/pharmacy`);
    if (lower.includes("স্কুল") || lower.includes("school"))
      return router.push(`/education?type=school`);
    if (lower.includes("কলেজ") || lower.includes("college"))
      return router.push(`/education?type=college`);
    if (lower.includes("মাদ্রাসা") || lower.includes("madrasa"))
      return router.push(`/education?type=madrasa`);
    if (lower.includes("কোচিং") || lower.includes("coaching"))
      return router.push(`/education?type=coaching`);
    if (lower.includes("বিদ্যুৎ") || lower.includes("electricity"))
      return router.push(`/electricity`);
    if (lower.includes("পুলিশ") || lower.includes("police") || lower.includes("থানা"))
      return router.push(`/police`);
    if (lower.includes("ফায়ার") || lower.includes("fire"))
      return router.push(`/emergency`);
    if (lower.includes("মসজিদ") || lower.includes("মন্দির") || lower.includes("mosque"))
      return router.push(`/islamic`);
    if (lower.includes("বাস") || lower.includes("bus") || lower.includes("ট্রেন") || lower.includes("train"))
      return router.push(`/transport`);
    if (lower.includes("ব্যাংক") || lower.includes("bank") || lower.includes("এটিএম"))
      return router.push(`/finance`);
    if (lower.includes("পর্যটন") || lower.includes("tourism") || lower.includes("দর্শন"))
      return router.push(`/tourism`);
    if (lower.includes("জরুরি") || lower.includes("emergency") || lower.includes("999"))
      return router.push(`/emergency`);
    if (lower.includes("খবর") || lower.includes("news") || lower.includes("নোটিশ"))
      return router.push(`/news`);
    if (lower.includes("চাকরি") || lower.includes("job"))
      return router.push(`/jobs`);
    if (lower.includes("রেস্টুরেন্ট") || lower.includes("হোটেল"))
      return router.push(`/business?type=restaurant`);

    // Default: search in hospitals
    router.push(`/hospitals`);
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-full px-4 py-2.5 transition-all">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="হাসপাতাল, ডাক্তার, সেবা খুঁজুন..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0"
              />
              {query && (
                <button type="submit"
                  className="flex-shrink-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-primary-600 transition-colors">
                  খুঁজুন
                </button>
              )}
            </div>

            {/* Suggestions dropdown — show when focused and no query */}
            {focused && !query && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <p className="text-[10px] text-gray-400 font-semibold px-4 pt-3 pb-1 uppercase tracking-wide">দ্রুত খুঁজুন</p>
                <div className="flex flex-wrap gap-2 px-4 pb-3">
                  {suggestions.map(s => (
                    <button key={s.href} type="button"
                      onClick={() => router.push(s.href)}
                      className="text-xs bg-gray-50 hover:bg-primary hover:text-white border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-full transition-colors">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 999 button */}
          <a href="tel:999"
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm text-sm whitespace-nowrap"
            aria-label="Call 999">
            <Phone size={14} className="fill-white" />
            <span className="hidden sm:inline">৯৯৯</span>
          </a>
        </form>
      </div>
    </div>
  );
}
