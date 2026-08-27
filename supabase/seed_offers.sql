-- Run after schema.sql to populate the offers catalog with the current offer list.
-- Safe to re-run: existing rows are matched by slug and updated in place.

insert into public.offers
  (slug, name, bank, category, action, note, price, tracking_link, action_deadline_days, default_hold_days)
values
  ('alfa-bank-rko', 'Альфа-Банк — РКО', 'Альфа-Банк', 'rko', 'Открытие счёта', null, 3700, 'https://t.fincpanetwork.ru/click/52072/338?erid=2W5zFJhpPwv', null, 30),
  ('tochka-bank-rko', 'Точка Банк — РКО', 'Точка Банк', 'rko', 'Открытие счёта на тарифе «Развитие»', 'Тариф: Развитие', 3000, 'https://rko-group.ru/s/6kiSR0lO', null, 30),
  ('sdm-bank-rko', 'СДМ Банк — РКО', 'СДМ Банк', 'rko', 'Открытие счёта', null, 2900, 'https://t.fincpanetwork.ru/click/52072/914?erid=2W5zFGcE1e9', null, 30),
  ('ubrir-bank-rko', 'УБРиР Банк — РКО', 'УБРиР Банк', 'rko', 'Открытие расчётного счёта новым клиентом (тариф «Селлер»)', 'Тариф: Селлер', 2900, 'https://t.fincpanetwork.ru/click/52072/631?erid=2W5zFHvrcYQ', null, 30),
  ('psb-rko', 'ПСБ — РКО', 'ПСБ', 'rko', 'Открытие счёта на тарифе «Ноль»', 'Тариф: Ноль', 2300, 'https://t.fincpanetwork.ru/click/52072/360?erid=2W5zFK8dcHf', null, 30),
  ('vtb-rko', 'ВТБ — РКО', 'ВТБ', 'rko', 'Открытие счёта', null, 1800, 'https://rko-group.ru/s/ci7txcuF', null, 30),
  ('sovcombank-rko', 'Совкомбанк — РКО', 'Совкомбанк', 'rko', 'Покупка от 2500 ₽', null, 1250, 'https://rko-group.ru/s/zOZmJEIS', null, 30),
  ('kontur-bank-rko', 'Контур Банк — РКО', 'Контур Банк', 'rko', 'Покупка от 650 ₽', null, 1000, 'https://rko-group.ru/s/0gha5lb4', null, 30),
  ('rshb-rko', 'РСХБ — РКО', 'РСХБ', 'rko', 'Подключение к тарифному плану «Агростарт»', null, 700, 'https://t.fincpanetwork.ru/click/52072/521?erid=2W5zFHssE24', null, 30),

  ('ozon-business-registration-rko', 'Озон — Регистрация бизнеса + РКО', 'Озон', 'business_registration', 'Регистрация бизнеса, открытие и активация счёта от 3000 руб. в течение 45 дней после заполнения заявки', null, 4000, 'https://t.fincpanetwork.ru/click/52072/955?erid=2W5zFHPj8YH', 45, 45),

  ('zaymer-virtual-card', 'Займер — Виртуальная карта', 'Займер', 'credit_cards', 'Выдача займа посредством виртуальной карты', null, 1585, 'https://t.fincpanetwork.ru/click/52072/922?erid=2VtzqvJnkWA', null, 30),
  ('uralsib-credit-card', 'Уралсиб Банк — Кредитная карта', 'Уралсиб Банк', 'credit_cards', 'Выдача + активация от 500 руб. в течение 30 дней после выдачи', null, 1500, 'https://t.fincpanetwork.ru/click/52072/407?erid=2W5zFH4Ww45', 30, 30),
  ('alfa-bank-credit-card', 'Альфа-Банк — Кредитная карта', 'Альфа-Банк', 'credit_cards', 'Активированная карта (снятие годового обслуживания; при бесплатном обслуживании — любая покупка, кроме переводов и снятия наличных)', null, 1500, 'https://t.fincpanetwork.ru/click/52072/339?erid=2W5zFJjJPEG', null, 30),
  ('t-bank-credit-card', 'Т-Банк — Кредитная карта', 'Т-Банк', 'credit_cards', 'Активация карты и транзакция от 1000 руб. по ней после встречи с представителем', null, 1250, 'https://t.fincpanetwork.ru/click/52072/27?erid=2W5zFKAWohb', null, 30),
  ('sovcombank-halva-credit-card', 'Совкомбанк — Карта Халва (кредитная)', 'Совкомбанк', 'credit_cards', 'Выданная карта (одобрение кредитной заявки и открытие кредитного счёта)', null, 1100, 'https://t.fincpanetwork.ru/click/52072/456?erid=2W5zFJuEp7a', null, 30),

  ('otp-bank-premium-debit-card', 'ОТП Банк — Дебетовая карта Premium', 'ОТП Банк', 'debit_cards', 'Получение карты + покупка (сумма от 1000 руб.) в течение 30 дней с момента выдачи', null, 1450, 'https://t.fincpanetwork.ru/click/52072/472?erid=2W5zFGCKW1F', 30, 30),
  ('otp-bank-cashback-debit-card', 'ОТП Банк — Дебетовая карта («Кешбэк 1000 за 1000»)', 'ОТП Банк', 'debit_cards', 'Выдача + покупка от 1000 руб. в течение 30 дней с даты активации (уникальный клиент)', null, 850, 'https://t.fincpanetwork.ru/click/52072/923?erid=2W5zFHNWvy7', 30, 30),
  ('psb-cashback-debit-card', 'ПСБ — Дебетовая карта «Твой кешбэк»', 'ПСБ', 'debit_cards', 'Активация карты — покупка от 1000 руб. (кроме пополнения) в течение 3 месяцев после заявки', null, 800, 'https://t.fincpanetwork.ru/click/52072/639?erid=2W5zFFyDoLU', 90, 30),
  ('ubrir-my-life-debit-card', 'УБРиР Банк — Дебетовая карта «Моя жизнь»', 'УБРиР Банк', 'debit_cards', 'Выдача + POS-активация (покупка от 1000 руб.) в течение 60 дней', null, 750, 'https://t.fincpanetwork.ru/click/52072/630?erid=2W5zFGqZFCm', 60, 30),
  ('ak-bars-debit-card', 'Ак Барс Банк — Дебетовая карта', 'Ак Барс Банк', 'debit_cards', 'Выдача + активация + покупка от 1000 руб. в течение 30 дней (клиент не был активен в банке последние 6 мес.)', null, 720, 'https://t.fincpanetwork.ru/click/52072/397?erid=2VfnxvVWi3a', 30, 30),
  ('mts-bank-debit-card', 'МТС Банк — Дебетовая карта «МТС Деньги»', 'МТС Банк', 'debit_cards', 'Активация + покупка от 500 руб. в течение 90 дней с момента заявки (уникальный клиент, доставка курьером)', null, 720, 'https://t.fincpanetwork.ru/click/52072/618?erid=2W5zFHxULji', 90, 30),
  ('alfa-bank-orange-debit-card', 'Альфа-Банк — Дебетовая Апельсиновая карта', 'Альфа-Банк', 'debit_cards', 'Активированная карта — покупка картой в течение 60 дней после получения', null, 650, 'https://t.fincpanetwork.ru/click/52072/556?erid=2W5zFGy1aGQ', 60, 30),
  ('rshb-unionpay-debit-card', 'Россельхозбанк — Дебетовая карта UnionPay', 'Россельхозбанк', 'debit_cards', 'Покупка от 100 руб. в течение 30 дней с момента открытия', null, 650, 'https://t.fincpanetwork.ru/click/52072/930?erid=2W5zFGdgfuj', 30, 30)
on conflict (slug) do update set
  name = excluded.name,
  bank = excluded.bank,
  category = excluded.category,
  action = excluded.action,
  note = excluded.note,
  price = excluded.price,
  tracking_link = excluded.tracking_link,
  action_deadline_days = excluded.action_deadline_days,
  default_hold_days = excluded.default_hold_days;
