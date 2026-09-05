import type { CSSProperties } from "react";
import Link from "next/link";
import { Landmark, FileText, CreditCard, Wallet, Layers, Clock } from "lucide-react";
import CardCarousel from "@/components/CardCarousel";
import AboutSection from "@/components/AboutSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ServicesSection from "@/components/ServicesSection";
import FeaturedOfferSection from "@/components/FeaturedOfferSection";
import { OFFERS, CATEGORY_LABELS, type OfferCategory } from "@/data/offers";

const CATEGORY_ICONS: Record<OfferCategory, typeof Landmark> = {
  rko: Landmark,
  business_registration: FileText,
  credit_cards: CreditCard,
  debit_cards: Wallet,
};

const BANK_COUNT = new Set(OFFERS.map((o) => o.bankKey)).size;
const AVG_HOLD_DAYS = Math.round(
  OFFERS.reduce((sum, o) => sum + o.defaultHoldDays, 0) / OFFERS.length
);

// One per bank, spanning every category — the hero showcase.
const FEATURED_SLUGS = [
  "ozon-business-registration-rko",
  "alfa-bank-rko",
  "tochka-bank-rko",
  "vtb-rko",
  "zaymer-virtual-card",
  "t-bank-credit-card",
  "otp-bank-premium-debit-card",
  "sovcombank-halva-credit-card",
];
const FEATURED_OFFERS = FEATURED_SLUGS.map((slug) => OFFERS.find((o) => o.slug === slug)!);

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center gap-4 text-center px-4 pt-8 sm:pt-10 pb-2 sm:pb-4">
        <div className="flex items-center gap-3 sm:gap-5 w-full max-w-2xl">
          <span className="aurora-divider" />
          <span className="brand-smoke shrink-0">
            <span className="chrome-logo-wrap">
              <span className="chrome-logo">
                {/* Rendered as a CSS background image rather than <img> —
                    Chromium/Yandex-based browsers overlay a "search this
                    image" affordance on real <img> elements, which makes no
                    sense on a decorative wordmark. */}
                <span
                  role="img"
                  aria-label="GIØWAYZ"
                  className="relative w-[280px] sm:w-[440px] md:w-[560px] aspect-[2135/737] bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: "url(/brand/giowayz-chrome.png)" }}
                />
                <span
                  role="img"
                  aria-label="ZØNE"
                  className="relative w-[240px] sm:w-[370px] md:w-[470px] aspect-[1774/887] bg-contain bg-center bg-no-repeat -mt-6 sm:-mt-10 md:-mt-14"
                  style={{ backgroundImage: "url(/brand/zone-chrome.png)" }}
                />
              </span>
            </span>
          </span>
          <span className="aurora-divider" />
        </div>
      </section>

      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
        <CardCarousel offers={FEATURED_OFFERS} captureWheel={false} />
      </section>

      <section className="relative flex flex-col items-center gap-6 text-center px-4 pt-8 pb-20">
        <h1 className="font-display glow-text text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#f4f0ff] leading-[1.05]">
          Офферы, которым
          <br />
          можно <span className="shine-text">доверять</span>.
        </h1>

        <p className="max-w-2xl shimmer-text-vivid text-base sm:text-lg leading-relaxed">
          Каталог реальных банковских офферов — РКО, регистрация бизнеса, кредитные и
          дебетовые карты — с точной ценой и условиями по каждому банку. Оформляешь оффер,
          прикрепляешь скриншот подтверждения, а дальше просто следишь, как в личном
          кабинете отсчитывается холд до выплаты. Никаких скрытых условий и «уточню у
          менеджера» — всё видно сразу.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/offers" className="btn-glow-primary text-sm">
            <div className="card-sheen" style={{ "--sheen-delay": "0s" } as CSSProperties} />
            Смотреть все офферы
          </Link>
          <Link href="/cabinet" className="btn-glow-secondary text-sm">
            <div className="card-sheen" style={{ "--sheen-delay": "0.8s" } as CSSProperties} />
            Личный кабинет
          </Link>
        </div>

        <div className="mt-2 grid w-full max-w-3xl grid-cols-2 sm:grid-cols-4 liquid-glass rounded-2xl overflow-hidden">
          {Object.entries(CATEGORY_LABELS).map(([key, label], i) => {
            const Icon = CATEGORY_ICONS[key as OfferCategory];
            return (
              <Link
                key={key}
                href={`/offers#${key}`}
                className={`group flex flex-col items-center gap-2 px-3 py-4 text-center transition hover:bg-white/5 ${
                  i === 0 ? "bg-white/5" : ""
                }`}
              >
                <Icon className="h-5 w-5 text-[#8c7aff]" strokeWidth={1.75} />
                <span className="text-xs shimmer-text-vivid">{label}</span>
                <span
                  className={`mt-0.5 h-0.5 w-8 rounded-full bg-[#8c7aff] transition-opacity ${
                    i === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div id="stats" className="mt-6 grid grid-cols-3 gap-6 sm:gap-12 text-center scroll-mt-28">
          <Stat icon={Layers} value={OFFERS.length} label="активных офферов" />
          <Stat icon={Landmark} value={BANK_COUNT} label="банков-партнёров" />
          <Stat icon={Clock} value={`${AVG_HOLD_DAYS} дн.`} label="средний холд" />
        </div>
      </section>

      <FeaturedOfferSection />
      <ServicesSection />
      <AboutSection />
      <HowItWorksSection />
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Layers;
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8c7aff]" strokeWidth={1.75} />
        <div className="font-display text-2xl sm:text-3xl text-[#f4f0ff] tabular-nums">{value}</div>
      </div>
      <div className="mt-1 text-xs shimmer-text-vivid">{label}</div>
    </div>
  );
}
