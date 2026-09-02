import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, UserRound, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/auth/actions";

export default async function Nav() {
  let user = null;
  let isAdmin = false;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      isAdmin = profile?.role === "admin";
    }
  }

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-4 sm:pt-6">
      <nav className="chrome-frame liquid-glass mx-auto flex max-w-6xl items-center justify-between gap-2 sm:gap-4 rounded-full px-3 sm:px-6 py-2">
        <Link href="/" className="flex items-center shrink-0">
          <span className="chrome-frame relative h-8 w-8 shrink-0 rounded-[6px] sm:h-10 sm:w-10 overflow-hidden">
            <Image
              src="/brand/logo-giowayz.jpg"
              alt="Giowayz"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </span>
        </Link>

        {/* Icon-badge + label on md+; label collapses away below md so the
            three tabs still fit (and stay tappable) on a phone-width bar —
            they used to be `hidden md:flex` here, invisible on mobile
            entirely, which is exactly the "веб версия для телефона" the
            site is built for first. */}
        <div className="flex items-center gap-1 sm:gap-2 ml-0.5 sm:ml-3 min-w-0 overflow-hidden">
          <Link
            href="/offers"
            className="chrome-frame flex h-8 sm:h-9 shrink-0 items-center gap-2 rounded-[32px] pl-1 pr-1 md:pl-1.5 md:pr-3.5 transition hover:brightness-125"
          >
            <span className="icon-badge h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-[8px]">
              <LayoutGrid className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#8c7aff]" strokeWidth={1.75} />
            </span>
            <span className="hidden md:inline chrome-badge-text text-xs">Все офферы</span>
          </Link>
          <Link
            href="/cabinet"
            className="chrome-frame flex h-8 sm:h-9 shrink-0 items-center gap-2 rounded-[32px] pl-1 pr-1 md:pl-1.5 md:pr-3.5 transition hover:brightness-125"
          >
            <span className="icon-badge h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-[8px]">
              <UserRound className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#8c7aff]" strokeWidth={1.75} />
            </span>
            <span className="hidden md:inline chrome-badge-text text-xs">Личный кабинет</span>
          </Link>
          <Link
            href={user ? "/statistics" : "/#stats"}
            className="chrome-frame flex h-8 sm:h-9 shrink-0 items-center gap-2 rounded-[32px] pl-1 pr-1 md:pl-1.5 md:pr-3.5 transition hover:brightness-125"
          >
            <span className="icon-badge h-5 w-5 sm:h-6 sm:w-6 shrink-0 rounded-[8px]">
              <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#8c7aff]" strokeWidth={1.75} />
            </span>
            <span className="hidden md:inline chrome-badge-text text-xs">Статистика</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="chrome-frame hidden md:flex h-9 shrink-0 items-center rounded-[32px] px-3.5 transition hover:brightness-125"
            >
              <span className="chrome-badge-text text-xs">Админ</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <form action={signOut}>
                <button
                  type="submit"
                  className="chrome-frame flex h-8 sm:h-9 items-center rounded-[32px] px-3 sm:px-4 hover:brightness-125 transition"
                >
                  <span className="chrome-badge-text text-xs">Выйти</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:inline hover:brightness-125 transition">
                <span className="chrome-badge-text text-xs">Вход</span>
              </Link>
              <Link
                href="/auth/register"
                className="chrome-frame flex h-8 sm:h-9 items-center rounded-[32px] bg-[#0b1a4a] px-3 sm:px-4 hover:brightness-125 transition"
              >
                <span className="chrome-badge-text text-xs">Регистрация</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
