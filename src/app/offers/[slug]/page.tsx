import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABELS, getOfferBySlug, OFFERS } from "@/data/offers";
import { getBankLogo } from "@/data/bankLogos";
import FadeIn from "@/components/FadeIn";

export function generateStaticParams() {
  return OFFERS.map((offer) => ({ slug: offer.slug }));
}

export default async function OfferDetailPage(props: PageProps<"/offers/[slug]">) {
  const { slug } = await props.params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  const logo = getBankLogo(offer.bankKey);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <Link href="/offers" className="text-sm shimmer-text-soft hover:text-[#f4f0ff] transition">
        ← Все офферы
      </Link>

      <FadeIn>
        <div className="mt-6 flex items-center gap-3">
          <div className="glow-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2">
            {logo ? (
              <img src={logo} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-sm font-bold text-black">{offer.bank.slice(0, 1)}</span>
            )}
          </div>
          <div>
            <span className="badge-glow inline-block rounded-[32px] px-3 py-1 text-[10px] uppercase tracking-wider text-[#c9b7ff]">
              {CATEGORY_LABELS[offer.category]} · {offer.bank}
            </span>
            <h1 className="font-display glow-text mt-1.5 text-2xl sm:text-3xl text-[#f4f0ff] leading-tight">
              {offer.name}
            </h1>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <p className="mt-4 max-w-xl text-sm leading-relaxed shimmer-text-soft sm:text-base">
          Чтобы получить <span className="text-[#f4f0ff] font-medium">{offer.price.toLocaleString("ru-RU")} ₽</span> по
          этому офферу от банка «{offer.bank}», нужно выполнить целевое действие: {offer.action.toLowerCase()}
          {offer.note ? ` (${offer.note.toLowerCase()})` : ""}. После того как заявка будет
          подтверждена, начнётся холд — {offer.defaultHoldDays} дней, и как только он закончится,
          деньги придут на баланс личного кабинета.
        </p>
      </FadeIn>

      <FadeIn delay={0.16}>
        <div className="glow-ring liquid-glass mt-6 rounded-2xl p-6 space-y-4">
          <Row label="Цена">
            <span
              className="text-2xl font-display tabular-nums text-white"
              style={{ textShadow: "0 0 16px rgba(125,211,255,0.5)" }}
            >
              {offer.price.toLocaleString("ru-RU")} ₽
            </span>
          </Row>
          <Row label="Целевое действие">{offer.action}</Row>
          {offer.note && <Row label="Примечание">{offer.note}</Row>}
          {offer.actionDeadlineDays && (
            <Row label="Срок на выполнение">{offer.actionDeadlineDays} дней</Row>
          )}
          <Row label="Холд до выплаты">{offer.defaultHoldDays} дней после подтверждения</Row>
        </div>
      </FadeIn>

      <FadeIn delay={0.24}>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={`/go/${offer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[5px] bg-[#5046e4] px-6 py-3 text-center font-medium text-white hover:bg-[#10093a] transition"
          >
            Перейти к оформлению →
          </a>
          <Link
            href={`/cabinet/submit?offer=${offer.slug}`}
            className="liquid-glass rounded-[5px] px-6 py-3 text-center font-medium text-[#f4f0ff] hover:brightness-125 transition"
          >
            Я оформил — прикрепить скрин
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#10093a] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm shimmer-text-soft">{label}</span>
      <span className="text-sm sm:text-base text-[#f4f0ff]">{children}</span>
    </div>
  );
}
