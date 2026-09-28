"use client";
import { Search, Plus } from "lucide-react";

interface Props {
  total: number;
  label: string;
  searchValue: string;
  onSearch: (v: string) => void;
  onAdd: () => void;
  addLabel?: string;
}

export default function AdminPageHeader({ total, label, searchValue, onSearch, onAdd, addLabel = "নতুন যোগ করুন" }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="খুঁজুন..."
          className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
        />
        {total > 0 && (
          <span className="text-xs text-gray-400 flex-shrink-0">{total}টি {label}</span>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}
