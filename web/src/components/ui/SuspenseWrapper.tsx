import { Suspense, ReactNode } from "react";

export default function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
