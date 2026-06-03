import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import BottomNav from "@/components/BottomNav";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Skooldiplex — Cinema",
  description:
    "Book movies and earn rewards at Skooldiplex — Thailand's mobile-first cinema, 38 branches nationwide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B101E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="bg-slate-100 font-sans text-slate-900 antialiased">
        {/* Mobile-first device frame: everything lives inside a ~420px column */}
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[420px] flex-col bg-slate-50">
          <main className="flex-1 pb-2">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
