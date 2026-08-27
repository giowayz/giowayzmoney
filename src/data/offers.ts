export type OfferCategory =
  | "rko"
  | "business_registration"
  | "credit_cards"
  | "debit_cards";

export const CATEGORY_LABELS: Record<OfferCategory, string> = {
  rko: "РКО",
  business_registration: "Регистрация бизнеса",
  credit_cards: "Кредитные карты",
  debit_cards: "Дебетовые карты",
};

export interface OfferSeed {
  slug: string;
  name: string;
  bank: string;
  bankKey: string;
  category: OfferCategory;
  action: string;
  note: string | null;
  price: number;
  trackingLink: string;
  /** Дней на выполнение целевого действия после регистрации, если указано в условиях оффера */
  actionDeadlineDays: number | null;
  /** Дефолтный холд (дней до выплаты после подтверждения целевого действия). Уточняется по каждому офферу отдельно. */
  defaultHoldDays: number;
}

export const OFFERS: OfferSeed[] = [
  // ---------- РКО ----------
  {
    slug: "alfa-bank-rko",
    name: "Альфа-Банк — РКО",
    bank: "Альфа-Банк",
    bankKey: "alfa-bank",
    category: "rko",
    action: "Открытие счёта",
    note: null,
    price: 3700,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/338?erid=2W5zFJhpPwv",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "tochka-bank-rko",
    name: "Точка Банк — РКО",
    bank: "Точка Банк",
    bankKey: "tochka-bank",
    category: "rko",
    action: "Открытие счёта на тарифе «Развитие»",
    note: "Тариф: Развитие",
    price: 3000,
    trackingLink: "https://rko-group.ru/s/6kiSR0lO",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "sdm-bank-rko",
    name: "СДМ Банк — РКО",
    bank: "СДМ Банк",
    bankKey: "sdm-bank",
    category: "rko",
    action: "Открытие счёта",
    note: null,
    price: 2900,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/914?erid=2W5zFGcE1e9",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "ubrir-bank-rko",
    name: "УБРиР Банк — РКО",
    bank: "УБРиР Банк",
    bankKey: "ubrir-bank",
    category: "rko",
    action: "Открытие расчётного счёта новым клиентом (тариф «Селлер»)",
    note: "Тариф: Селлер",
    price: 2900,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/631?erid=2W5zFHvrcYQ",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "psb-rko",
    name: "ПСБ — РКО",
    bank: "ПСБ",
    bankKey: "psb",
    category: "rko",
    action: "Открытие счёта на тарифе «Ноль»",
    note: "Тариф: Ноль",
    price: 2300,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/360?erid=2W5zFK8dcHf",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "vtb-rko",
    name: "ВТБ — РКО",
    bank: "ВТБ",
    bankKey: "vtb",
    category: "rko",
    action: "Открытие счёта",
    note: null,
    price: 1800,
    trackingLink: "https://rko-group.ru/s/ci7txcuF",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "sovcombank-rko",
    name: "Совкомбанк — РКО",
    bank: "Совкомбанк",
    bankKey: "sovcombank",
    category: "rko",
    action: "Покупка от 2500 ₽",
    note: null,
    price: 1250,
    trackingLink: "https://rko-group.ru/s/zOZmJEIS",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "kontur-bank-rko",
    name: "Контур Банк — РКО",
    bank: "Контур Банк",
    bankKey: "kontur-bank",
    category: "rko",
    action: "Покупка от 650 ₽",
    note: null,
    price: 1000,
    trackingLink: "https://rko-group.ru/s/0gha5lb4",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "rshb-rko",
    name: "РСХБ — РКО",
    bank: "РСХБ",
    bankKey: "rshb",
    category: "rko",
    action: "Подключение к тарифному плану «Агростарт»",
    note: null,
    price: 700,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/521?erid=2W5zFHssE24",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },

  // ---------- Регистрация бизнеса ----------
  {
    slug: "ozon-business-registration-rko",
    name: "Озон — Регистрация бизнеса + РКО",
    bank: "Озон",
    bankKey: "ozon",
    category: "business_registration",
    action:
      "Регистрация бизнеса, открытие и активация счёта от 3000 руб. в течение 45 дней после заполнения заявки",
    note: null,
    price: 4000,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/955?erid=2W5zFHPj8YH",
    actionDeadlineDays: 45,
    defaultHoldDays: 45,
  },

  // ---------- Кредитные карты ----------
  {
    slug: "zaymer-virtual-card",
    name: "Займер — Виртуальная карта",
    bank: "Займер",
    bankKey: "zaymer",
    category: "credit_cards",
    action: "Выдача займа посредством виртуальной карты",
    note: null,
    price: 1585,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/922?erid=2VtzqvJnkWA",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "uralsib-credit-card",
    name: "Уралсиб Банк — Кредитная карта",
    bank: "Уралсиб Банк",
    bankKey: "uralsib-bank",
    category: "credit_cards",
    action: "Выдача + активация от 500 руб. в течение 30 дней после выдачи",
    note: null,
    price: 1500,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/407?erid=2W5zFH4Ww45",
    actionDeadlineDays: 30,
    defaultHoldDays: 30,
  },
  {
    slug: "alfa-bank-credit-card",
    name: "Альфа-Банк — Кредитная карта",
    bank: "Альфа-Банк",
    bankKey: "alfa-bank",
    category: "credit_cards",
    action:
      "Активированная карта (снятие годового обслуживания; при бесплатном обслуживании — любая покупка, кроме переводов и снятия наличных)",
    note: null,
    price: 1500,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/339?erid=2W5zFJjJPEG",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "t-bank-credit-card",
    name: "Т-Банк — Кредитная карта",
    bank: "Т-Банк",
    bankKey: "t-bank",
    category: "credit_cards",
    action: "Активация карты и транзакция от 1000 руб. по ней после встречи с представителем",
    note: null,
    price: 1250,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/27?erid=2W5zFKAWohb",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },
  {
    slug: "sovcombank-halva-credit-card",
    name: "Совкомбанк — Карта Халва (кредитная)",
    bank: "Совкомбанк",
    bankKey: "sovcombank",
    category: "credit_cards",
    action: "Выданная карта (одобрение кредитной заявки и открытие кредитного счёта)",
    note: null,
    price: 1100,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/456?erid=2W5zFJuEp7a",
    actionDeadlineDays: null,
    defaultHoldDays: 30,
  },

  // ---------- Дебетовые карты ----------
  {
    slug: "otp-bank-premium-debit-card",
    name: "ОТП Банк — Дебетовая карта Premium",
    bank: "ОТП Банк",
    bankKey: "otp-bank",
    category: "debit_cards",
    action: "Получение карты + покупка (сумма от 1000 руб.) в течение 30 дней с момента выдачи",
    note: null,
    price: 1450,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/472?erid=2W5zFGCKW1F",
    actionDeadlineDays: 30,
    defaultHoldDays: 30,
  },
  {
    slug: "otp-bank-cashback-debit-card",
    name: "ОТП Банк — Дебетовая карта («Кешбэк 1000 за 1000»)",
    bank: "ОТП Банк",
    bankKey: "otp-bank",
    category: "debit_cards",
    action: "Выдача + покупка от 1000 руб. в течение 30 дней с даты активации (уникальный клиент)",
    note: null,
    price: 850,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/923?erid=2W5zFHNWvy7",
    actionDeadlineDays: 30,
    defaultHoldDays: 30,
  },
  {
    slug: "psb-cashback-debit-card",
    name: "ПСБ — Дебетовая карта «Твой кешбэк»",
    bank: "ПСБ",
    bankKey: "psb",
    category: "debit_cards",
    action: "Активация карты — покупка от 1000 руб. (кроме пополнения) в течение 3 месяцев после заявки",
    note: null,
    price: 800,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/639?erid=2W5zFFyDoLU",
    actionDeadlineDays: 90,
    defaultHoldDays: 30,
  },
  {
    slug: "ubrir-my-life-debit-card",
    name: "УБРиР Банк — Дебетовая карта «Моя жизнь»",
    bank: "УБРиР Банк",
    bankKey: "ubrir-bank",
    category: "debit_cards",
    action: "Выдача + POS-активация (покупка от 1000 руб.) в течение 60 дней",
    note: null,
    price: 750,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/630?erid=2W5zFGqZFCm",
    actionDeadlineDays: 60,
    defaultHoldDays: 30,
  },
  {
    slug: "ak-bars-debit-card",
    name: "Ак Барс Банк — Дебетовая карта",
    bank: "Ак Барс Банк",
    bankKey: "ak-bars-bank",
    category: "debit_cards",
    action:
      "Выдача + активация + покупка от 1000 руб. в течение 30 дней (клиент не был активен в банке последние 6 мес.)",
    note: null,
    price: 720,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/397?erid=2VfnxvVWi3a",
    actionDeadlineDays: 30,
    defaultHoldDays: 30,
  },
  {
    slug: "mts-bank-debit-card",
    name: "МТС Банк — Дебетовая карта «МТС Деньги»",
    bank: "МТС Банк",
    bankKey: "mts-bank",
    category: "debit_cards",
    action:
      "Активация + покупка от 500 руб. в течение 90 дней с момента заявки (уникальный клиент, доставка курьером)",
    note: null,
    price: 720,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/618?erid=2W5zFHxULji",
    actionDeadlineDays: 90,
    defaultHoldDays: 30,
  },
  {
    slug: "alfa-bank-orange-debit-card",
    name: "Альфа-Банк — Дебетовая Апельсиновая карта",
    bank: "Альфа-Банк",
    bankKey: "alfa-bank",
    category: "debit_cards",
    action: "Активированная карта — покупка картой в течение 60 дней после получения",
    note: null,
    price: 650,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/556?erid=2W5zFGy1aGQ",
    actionDeadlineDays: 60,
    defaultHoldDays: 30,
  },
  {
    slug: "rshb-unionpay-debit-card",
    name: "Россельхозбанк — Дебетовая карта UnionPay",
    bank: "Россельхозбанк",
    bankKey: "rshb",
    category: "debit_cards",
    action: "Покупка от 100 руб. в течение 30 дней с момента открытия",
    note: null,
    price: 650,
    trackingLink: "https://t.fincpanetwork.ru/click/52072/930?erid=2W5zFGdgfuj",
    actionDeadlineDays: 30,
    defaultHoldDays: 30,
  },
];

export function getOfferBySlug(slug: string): OfferSeed | undefined {
  return OFFERS.find((o) => o.slug === slug);
}

export function getOffersByCategory(category: OfferCategory): OfferSeed[] {
  return OFFERS.filter((o) => o.category === category);
}
