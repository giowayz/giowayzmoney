import type { Metadata } from "next";
import { Manrope, Geist_Mono, Unbounded } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import "./globals.css";

// Body voice: Geist was the neutral, safe default this replaced — clean but
// deliberately characterless, which read as "ordinary" once every other
// piece of the redesign (color, weight, glow) got more deliberate. Manrope
// keeps the same geometric-sans family feel (works well alongside Unbounded)
// but has real personality of its own — a bit of warmth in the curves — and
// ships variable weight, so headings-adjacent body copy can lean semibold
// without switching families.
const bodySans = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// The site's heading voice: a geometric, faintly technical display face with
// full Cyrillic support. Bumped from 500 to 700 alongside the rest of the
// redesign's "bolder, not ordinary" direction — 500 read as safe next to the
// new heavier body weight and glow treatment.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  weight: "700",
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
      className={`${bodySans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
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
