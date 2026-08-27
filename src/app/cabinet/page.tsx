import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import HoldStatus from "@/components/HoldStatus";
import FadeIn from "@/components/FadeIn";
import type { LinkClick, Profile, Submission } from "@/types/database";

export default async function CabinetPage() {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-display glow-text mb-3">Личный кабинет скоро откроется</h1>
        <p className="shimmer-text-soft text-sm">
          База данных ещё не подключена. Как только это произойдёт, здесь появится история
          заявок, статус холдов и переходы по офферам.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // proxy redirects unauthenticated visitors before this renders
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, offers(name, bank, category, price, slug)")
    .eq("lead_id", user.id)
    .order("submitted_at", { ascending: false })
    .returns<Submission[]>();

  const list = submissions ?? [];
  const approvedCount = list.filter((s) => s.status === "approved" || s.status === "paid").length;
  const paidTotal = list
    .filter((s) => s.status === "paid")
    .reduce((sum, s) => sum + (s.payout_amount ?? s.offers?.price ?? 0), 0);

  const screenshotUrls = new Map<string, string>();
  for (const s of list) {
    const { data } = await supabase.storage
      .from("screenshots")
      .createSignedUrl(s.screenshot_path, 60 * 60);
    if (data?.signedUrl) screenshotUrls.set(s.id, data.signedUrl);
  }

  const { data: clicks } = await supabase
    .from("link_clicks")
    .select("*, offers(name, bank, slug)")
    .eq("lead_id", user.id)
    .order("clicked_at", { ascending: false })
    .limit(10)
    .returns<LinkClick[]>();
  const clickList = clicks ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {profile?.avatar_url ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full liquid-glass">
              <Image src={profile.avatar_url} alt="" fill className="object-cover" unoptimized />
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl font-display glow-text">
              {profile?.full_name || user.email}
            </h1>
            <p className="text-sm shimmer-text-soft">
              Регистрация:{" "}
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("ru-RU")
                : "—"}{" "}
              · <Link href="/cabinet/profile" className="text-[#9382ff] hover:underline">Профиль</Link>
            </p>
          </div>
        </div>
        <Link
          href="/cabinet/submit"
          className="rounded-[5px] bg-[#5046e4] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#10093a] transition"
        >
          + Подтвердить оффер
        </Link>
      </div>

      <FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-3">
          <Stat label="Всего заявок" value={list.length} />
          <Stat label="Одобрено" value={approvedCount} />
          <Stat label="Выплачено" value={`${paidTotal.toLocaleString("ru-RU")} ₽`} />
        </div>
      </FadeIn>
      <p className="mb-10 text-xs shimmer-text-soft">
        «Одобрено» — заявки, которые банк подтвердил и по которым уже идёт или завершился холд.
        «Выплачено» — фактически поступившая сумма.
      </p>

      <h2 className="text-lg font-display glow-text mb-4">История заявок</h2>

      {list.length === 0 ? (
        <p className="shimmer-text-soft text-sm">
          Пока нет заявок.{" "}
          <Link href="/offers" className="text-[#9382ff] hover:underline">
            Посмотреть офферы
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((submission, i) => (
            <FadeIn key={submission.id} delay={Math.min(i, 6) * 0.05}>
              <div className="flex items-center gap-4 liquid-glass rounded-2xl p-4">
                {screenshotUrls.get(submission.id) && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[5px]">
                    <Image
                      src={screenshotUrls.get(submission.id)!}
                      alt="Скриншот подтверждения"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {submission.offers?.name ?? "Оффер удалён"}
                  </p>
                  <p className="text-xs shimmer-text-soft">
                    {new Date(submission.submitted_at).toLocaleDateString("ru-RU")} ·{" "}
                    {(submission.payout_amount ?? submission.offers?.price ?? 0).toLocaleString(
                      "ru-RU"
                    )}{" "}
                    ₽
                  </p>
                </div>
                <HoldStatus submission={submission} />
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      <h2 className="text-lg font-display glow-text mb-4 mt-12">Переходы по ссылкам</h2>
      {clickList.length === 0 ? (
        <p className="shimmer-text-soft text-sm">
          Пока нет переходов — они появятся здесь, как только вы нажмёте «Перейти к оформлению»
          на странице оффера.
        </p>
      ) : (
        <div className="space-y-2">
          {clickList.map((click, i) => (
            <FadeIn key={click.id} delay={Math.min(i, 6) * 0.04}>
              <div className="liquid-glass flex items-center justify-between rounded-2xl px-4 py-3">
                <span className="truncate text-sm text-[#f4f0ff]">
                  {click.offers?.name ?? "Оффер удалён"}
                </span>
                <span className="shrink-0 text-xs shimmer-text-soft">
                  {new Date(click.clicked_at).toLocaleString("ru-RU")}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="liquid-glass rounded-2xl p-4">
      <div className="text-2xl font-display tabular-nums">{value}</div>
      <div className="text-xs shimmer-text-soft mt-1">{label}</div>
    </div>
  );
}
