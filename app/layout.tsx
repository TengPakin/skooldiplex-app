import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Rubik, IBM_Plex_Sans_Thai } from "next/font/google";
import BottomNav from "@/components/BottomNav";

// Brand-spec typography: Rubik (English) + IBM Plex Sans Thai (Thai).
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});
const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skooldiplex — โรงหนังในมือคุณ",
  description:
    "จองหนัง สะสมแต้ม รับสิทธิพิเศษที่ Skooldiplex — โรงภาพยนตร์บนมือถือ 38 สาขาทั่วไทย. Book movies and earn rewards at Skooldiplex.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B101E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${rubik.variable} ${plexThai.variable}`}>
      <body className="bg-[#0B101E] font-sans text-ink antialiased">
        {/* Ambient stage — soft cinema-lobby glow behind the device on wide screens */}
        <div className="ambient-stage flex min-h-[100dvh] w-full items-center justify-center sm:p-6">
          {/* Device frame: full-bleed on mobile, a phone-ratio mock on desktop.
              Column layout = scrollable <main> + sticky bottom <BottomNav>. */}
          <div className="device-frame relative flex h-[100dvh] w-full flex-col overflow-hidden bg-paper sm:h-[min(910px,calc(100dvh-3rem))] sm:aspect-[420/910] sm:w-auto sm:rounded-[2.6rem]">
            <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">{children}</main>
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
