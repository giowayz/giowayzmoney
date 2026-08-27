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
    <header className="sticky top-0 z-50 px-4 sm:px-6 pt-4 sm:pt-6">
      <nav className="chrome-frame liquid-glass mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full px-5 sm:px-6 py-2">
        <Link href="/" className="flex items-center shrink-0">
          <span className="chrome-frame relative h-9 w-9 shrink-0 rounded-[6px] sm:h-10 sm:w-10 overflow-hidden">
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

        <div className="hidden md:flex items-center gap-2 ml-3 min-w-0 overflow-hidden">
          <Link
            href="/offers"
            className="chrome-frame flex h-9 shrink-0 items-center gap-1.5 rounded-[32px] px-3.5 transition hover:brightness-125"
          >
            <LayoutGrid className="h-3.5 w-3.5 shrink-0 text-[#8bd2ff]" strokeWidth={1.75} />
            <span className="chrome-badge-text text-xs">Все офферы</span>
          </Link>
          <Link
            href="/cabinet"
            className="chrome-frame flex h-9 shrink-0 items-center gap-1.5 rounded-[32px] px-3.5 transition hover:brightness-125"
          >
            <UserRound className="h-3.5 w-3.5 shrink-0 text-[#8bd2ff]" strokeWidth={1.75} />
            <span className="chrome-badge-text text-xs">Личный кабинет</span>
          </Link>
          <Link
            href={user ? "/statistics" : "/#stats"}
            className="chrome-frame flex h-9 shrink-0 items-center gap-1.5 rounded-[32px] px-3.5 transition hover:brightness-125"
          >
            <BarChart3 className="h-3.5 w-3.5 shrink-0 text-[#8bd2ff]" strokeWidth={1.75} />
            <span className="chrome-badge-text text-xs">Статистика</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="chrome-frame flex h-9 shrink-0 items-center rounded-[32px] px-3.5 transition hover:brightness-125"
            >
              <span className="chrome-badge-text text-xs">Админ</span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link href="/cabinet" className="hidden sm:inline md:hidden hover:brightness-125 transition">
                <span className="chrome-badge-text text-xs">Кабинет</span>
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="chrome-frame flex h-9 items-center rounded-[32px] px-4 hover:brightness-125 transition"
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
                className="chrome-frame flex h-9 items-center rounded-[32px] bg-[#0b1a4a] px-4 hover:brightness-125 transition"
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
