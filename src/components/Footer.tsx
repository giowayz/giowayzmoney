import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative py-8 text-sm shimmer-text-soft">
      <div className="aurora-divider mx-4 sm:mx-6" />
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-[4px]">
            <Image
              src="/brand/logo-geekoffers.jpg"
              alt=""
              fill
              sizes="24px"
              className="object-cover"
            />
          </span>
          <p>© {new Date().getFullYear()} Giøwayz Zøne</p>
        </div>
        <div className="flex gap-5">
          <Link href="/offers" className="hover:text-[#f4f0ff] transition">
            Офферы
          </Link>
          <Link href="/privacy" className="hover:text-[#f4f0ff] transition">
            Политика конфиденциальности
          </Link>
          <a
            href="https://t.me/giowayz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#9382ff] hover:text-[#f4f0ff] transition"
          >
            Telegram — @giowayz
          </a>
        </div>
      </div>
    </footer>
  );
}
