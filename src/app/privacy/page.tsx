import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Giøwayz Zøne",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 prose-invert">
      <h1 className="text-3xl font-display mb-2">Политика конфиденциальности</h1>
      <p className="shimmer-text-soft text-sm mb-10">Последнее обновление: {new Date().toLocaleDateString("ru-RU")}</p>

      <div className="space-y-8 text-[#f4f0ff] leading-relaxed">
        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">1. Общие положения</h2>
          <p>
            Настоящая Политика описывает, какие данные собирает сайт Giøwayz Zøne (далее — «Сайт»)
            при регистрации и использовании личного кабинета, а также как эти данные хранятся и
            используются. Используя Сайт, вы соглашаетесь с условиями настоящей Политики.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">2. Какие данные собираются</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email и имя, указанные при регистрации личного кабинета;</li>
            <li>Скриншоты, загружаемые в качестве подтверждения выполнения оффера;</li>
            <li>История заявок: какие офферы оформлены, статус, даты, суммы вознаграждения;</li>
            <li>Технические данные (IP-адрес, файлы cookie) — для работы авторизации.</li>
          </ul>
          <p className="mt-2">
            Сайт не запрашивает и не хранит номера банковских карт, CVV-коды или иные
            реквизиты платёжных средств.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">3. Как используются данные</h2>
          <p>
            Данные используются исключительно для ведения личного кабинета: подтверждения
            выполнения офферов, расчёта холда и выплат, связи с пользователем по вопросам его
            заявок. Данные не передаются третьим лицам, за исключением случаев, предусмотренных
            законодательством.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">4. Хранение и защита данных</h2>
          <p>
            Скриншоты и учётные данные хранятся в защищённом хранилище с доступом только у
            владельца аккаунта и администратора Сайта. Доступ к личному кабинету защищён паролем.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">5. Права пользователя</h2>
          <p>
            Вы можете запросить удаление своей учётной записи и связанных с ней данных, обратившись
            к администратору Сайта.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-display text-[#f4f0ff] mb-2">6. Контакты</h2>
          <p>По вопросам, связанным с настоящей Политикой, обращайтесь к администратору Сайта.</p>
        </section>
      </div>
    </div>
  );
}
