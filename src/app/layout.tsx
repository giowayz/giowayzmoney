import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// The site's heading voice: a geometric, faintly technical display face with
// full Cyrillic support — the "premium SaaS" register (think Linear, Vercel)
// rather than a neon/gaming one, so headings read as confident and modern
// without shouting for attention on their own.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  weight: "500",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Giøwayz Zøne — банковские офферы",
  description: "Каталог банковских офферов: РКО, регистрация бизнеса, кредитные и дебетовые карты.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-[#030014] text-[#f4f0ff]">
        <StarField />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
