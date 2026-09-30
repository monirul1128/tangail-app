"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminSignIn } from "@/lib/adminAuth";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { user, isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && isAdmin) router.replace("/admin");
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminSignIn(email.trim(), password);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message ?? "লগইন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] to-[#0d1520] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/logo.png"
            alt="আমাদের টাঙ্গাইল"
            className="h-16 w-auto object-contain mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl font-black text-white">আমাদের টাঙ্গাইল</h1>
          <p className="text-white/50 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">অ্যাডমিন লগইন</h2>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">ইমেইল</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                "লগইন করুন"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            শুধুমাত্র অনুমোদিত অ্যাডমিনরা প্রবেশ করতে পারবেন
          </p>
        </div>
      </div>
    </div>
  );
}
