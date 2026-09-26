import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">পাতা পাওয়া যায়নি</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        আপনি যে পাতাটি খুঁজছেন সেটি সরানো হয়েছে বা ঠিকানাটি ভুল।
      </p>
      <Link href="/" className="btn-primary px-8 py-3">
        হোমে ফিরুন
      </Link>
    </div>
  );
}
