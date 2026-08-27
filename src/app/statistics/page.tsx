import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import DateRangeFilter from "@/components/DateRangeFilter";
import FadeIn from "@/components/FadeIn";

interface ClickRow {
  offer_id: string;
  lead_id: string | null;
  offers: { name: string; bank: string; slug: string } | null;
}

interface SubmissionRow {
  offer_id: string;
  status: string;
  offers: { name: string; bank: string; slug: string } | null;
}

interface OfferStat {
  offerId: string;
  name: string;
  bank: string;
  slug: string;
  clicks: number;
  uniqueClicks: number;
  conversions: number;
}

function toDateInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default async function StatisticsPage(props: PageProps<"/statistics">) {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-lg px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-display glow-text mb-3">Статистика скоро откроется</h1>
        <p className="shimmer-text-soft text-sm">
          База данных ещё не подключена. Как только это произойдёт, здесь появятся клики и
          конверсии по каждому офферу за выбранный период.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // proxy redirects unauthenticated visitors before this renders

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.role === "admin";

  const searchParams = await props.searchParams;
  const now = new Date();
  const defaultFromDate = new Date();
  defaultFromDate.setDate(defaultFromDate.getDate() - 6);

  const fromParam = Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from;
  const toParam = Array.isArray(searchParams.to) ? searchParams.to[0] : searchParams.to;
  const fromStr = fromParam || toDateInput(defaultFromDate);
  const toStr = toParam || toDateInput(now);

  const fromIso = new Date(`${fromStr}T00:00:00.000Z`).toISOString();
  const toIso = new Date(`${toStr}T23:59:59.999Z`).toISOString();

  let clicksQuery = supabase
    .from("link_clicks")
    .select("offer_id, lead_id, offers(name, bank, slug)")
    .gte("clicked_at", fromIso)
    .lte("clicked_at", toIso);
  if (!isAdmin) clicksQuery = clicksQuery.eq("lead_id", user.id);
  const { data: clicks } = await clicksQuery.returns<ClickRow[]>();

  let subsQuery = supabase
    .from("submissions")
    .select("offer_id, status, offers(name, bank, slug)")
    .gte("submitted_at", fromIso)
    .lte("submitted_at", toIso);
  if (!isAdmin) subsQuery = subsQuery.eq("lead_id", user.id);
  const { data: submissions } = await subsQuery.returns<SubmissionRow[]>();

  const statsMap = new Map<string, OfferStat>();
  const ensureRow = (offerId: string, offer: ClickRow["offers"] | SubmissionRow["offers"]) => {
    if (!statsMap.has(offerId)) {
      statsMap.set(offerId, {
        offerId,
        name: offer?.name ?? "Оффер удалён",
        bank: offer?.bank ?? "",
        slug: offer?.slug ?? "",
        clicks: 0,
        uniqueClicks: 0,
        conversions: 0,
      });
    }
    return statsMap.get(offerId)!;
  };

  const seenLeadPerOffer = new Set<string>();
  for (const c of clicks ?? []) {
    const row = ensureRow(c.offer_id, c.offers);
    row.clicks += 1;
    // Anonymous clicks (no lead_id) can't be deduplicated against each
    // other, so each one counts as its own "unique" visitor by necessity —
    // only a repeat click from the *same signed-in lead* is collapsed.
    if (c.lead_id) {
      const pairKey = `${c.offer_id}:${c.lead_id}`;
      if (seenLeadPerOffer.has(pairKey)) continue;
      seenLeadPerOffer.add(pairKey);
    }
    row.uniqueClicks += 1;
  }
  for (const s of submissions ?? []) {
    if (s.status !== "approved" && s.status !== "paid") continue;
    const row = ensureRow(s.offer_id, s.offers);
    row.conversions += 1;
  }

  const rows = Array.from(statsMap.values()).sort((a, b) => b.clicks - a.clicks);
  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const totalUnique = rows.reduce((sum, r) => sum + r.uniqueClicks, 0);
  const totalConversions = rows.reduce((sum, r) => sum + r.conversions, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-display glow-text mb-1">Статистика</h1>
      <p className="shimmer-text-soft text-sm mb-8">
        {isAdmin ? "По всем лидам" : "По вашим переходам и заявкам"} за выбранный период.
      </p>

      <DateRangeFilter from={fromStr} to={toStr} />

      <FadeIn>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Stat label="Клики" value={totalClicks} />
          <Stat label="Уникальных" value={totalUnique} />
          <Stat label="Конверсии" value={totalConversions} />
        </div>
      </FadeIn>

      {rows.length === 0 ? (
        <p className="shimmer-text-soft text-sm">За этот период данных нет.</p>
      ) : (
        <div className="liquid-glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 font-medium shimmer-text-soft">Оффер</th>
                  <th className="px-4 py-3 text-right font-medium shimmer-text-soft">Клики</th>
                  <th className="px-4 py-3 text-right font-medium shimmer-text-soft">Уникальных</th>
                  <th className="px-4 py-3 text-right font-medium shimmer-text-soft">Конв.</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.offerId} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs shimmer-text-soft">{r.bank}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.clicks}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.uniqueClicks}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="liquid-glass rounded-2xl p-4">
      <div className="text-2xl font-display tabular-nums">{value}</div>
      <div className="text-xs shimmer-text-soft mt-1">{label}</div>
    </div>
  );
}
