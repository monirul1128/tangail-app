"use client";
import { ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  emptyMessage?: string;
}

export default function AdminTable<T extends { id: string }>({
  columns, data, loading, onEdit, onDelete, emptyMessage = "কোনো ডেটা নেই",
}: Props<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 border-b border-gray-50 animate-pulse">
            <div className="h-4 bg-gray-100 rounded flex-1" />
            <div className="h-4 bg-gray-100 rounded w-32" />
            <div className="h-4 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div className="text-5xl mb-3">📭</div>
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Desktop table */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide ${col.className ?? ""}`}>
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide w-24">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(row)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                      title="এডিট করুন"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(row)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="মুছুন"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-50">
        {data.map((row) => (
          <div key={row.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                {columns.slice(0, 3).map((col) => (
                  <div key={col.key} className="text-sm text-gray-700">
                    <span className="text-xs text-gray-400 mr-1">{col.label}:</span>
                    {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => onEdit(row)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(row)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
