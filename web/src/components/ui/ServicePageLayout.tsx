import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  emoji: string;
  accentColor?: string;
  children: React.ReactNode;
}

export default function ServicePageLayout({
  title, subtitle, emoji, accentColor = "bg-primary", children,
}: Props) {
  return (
    <div className="bg-[#f4f6f8] min-h-screen">
      {/* Header */}
      <div className={`${accentColor} text-white`}>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={16} /> হোমে ফিরুন
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            <div>
              <h1 className="text-2xl font-black">{title}</h1>
              {subtitle && <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
