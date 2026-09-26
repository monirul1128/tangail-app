import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "টাঙ্গাইল জেলা — সেবা ও তথ্য পোর্টাল",
    template: "%s | টাঙ্গাইল জেলা",
  },
  description:
    "টাঙ্গাইল জেলার হাসপাতাল, ডাক্তার, অ্যাম্বুলেন্স, রক্তদাতা, জরুরি সেবা এবং সর্বশেষ খবর এক জায়গায়।",
  keywords: [
    "টাঙ্গাইল",
    "Tangail",
    "হাসপাতাল",
    "hospital",
    "ডাক্তার",
    "doctor",
    "রক্ত",
    "blood donor",
    "অ্যাম্বুলেন্স",
    "ambulance",
    "জরুরি সেবা",
  ],
  openGraph: {
    title: "টাঙ্গাইল জেলা — সেবা ও তথ্য পোর্টাল",
    description: "টাঙ্গাইল জেলার সকল সেবা এক জায়গায়",
    locale: "bn_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
