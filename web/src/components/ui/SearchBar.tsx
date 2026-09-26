"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Phone } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/hospitals?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3"
        >
          {/* Search input */}
          <div className="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-full px-4 py-2.5 transition-all">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="হাসপাতাল, ডাক্তার, সেবা খুঁজুন..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 min-w-0"
            />
            {query && (
              <button
                type="submit"
                className="flex-shrink-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-primary-600 transition-colors"
              >
                খুঁজুন
              </button>
            )}
          </div>

          {/* 999 emergency call button */}
          <a
            href="tel:999"
            className="flex-shrink-0 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm text-sm whitespace-nowrap"
            aria-label="Call 999"
          >
            <Phone size={14} className="fill-white" />
            <span className="hidden sm:inline">৯৯৯</span>
          </a>
        </form>
      </div>
    </div>
  );
}
