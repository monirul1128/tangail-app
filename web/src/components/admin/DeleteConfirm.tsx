"use client";
import { Trash2, AlertTriangle } from "lucide-react";

interface Props {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirm({ itemName, onConfirm, onCancel, loading }: Props) {
  return (
    <div className="text-center py-2">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={28} className="text-red-600" />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">নিশ্চিত করুন</h3>
      <p className="text-gray-500 text-sm mb-1">আপনি কি সত্যিই মুছে ফেলতে চান?</p>
      <p className="text-gray-800 font-semibold text-sm mb-6 bg-gray-50 rounded-xl px-4 py-2 inline-block">
        "{itemName}"
      </p>
      <p className="text-red-500 text-xs mb-6">⚠️ এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।</p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          বাতিল
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
          মুছুন
        </button>
      </div>
    </div>
  );
}
