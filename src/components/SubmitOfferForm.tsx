"use client";

import { useActionState } from "react";
import { OFFERS } from "@/data/offers";
import { submitOfferProof, type SubmitOfferState } from "@/app/cabinet/actions";

export default function SubmitOfferForm({
  initialSlug,
  claimedSlugs = [],
}: {
  initialSlug?: string;
  claimedSlugs?: string[];
}) {
  const [state, formAction, pending] = useActionState<SubmitOfferState, FormData>(
    submitOfferProof,
    { error: null, success: false }
  );
  const claimed = new Set(claimedSlugs);
  // A pre-selected offer (e.g. from an offer card's "Подтвердить" link) that
  // turns out to already be claimed can't be the form's default value —
  // disabled options aren't selectable, so the select would just fall back
  // to the placeholder anyway. Surfacing it as a clear notice instead of a
  // silently-ignored default avoids "I picked it and it didn't stick".
  const initialAlreadyClaimed = !!initialSlug && claimed.has(initialSlug);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="font-medium">Заявка отправлена на проверку.</p>
        <p className="text-sm shimmer-text-soft mt-1">
          Статус можно отслеживать в личном кабинете.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm shimmer-text-soft mb-1" htmlFor="offerSlug">
          Оффер
        </label>
        <select
          id="offerSlug"
          name="offerSlug"
          required
          defaultValue={initialAlreadyClaimed ? "" : initialSlug ?? ""}
          className="liquid-glass w-full rounded-[5px] px-4 py-2.5 outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
        >
          <option value="" disabled>
            Выберите оффер
          </option>
          {OFFERS.map((offer) => (
            <option key={offer.slug} value={offer.slug} disabled={claimed.has(offer.slug)}>
              {offer.name} — {offer.price.toLocaleString("ru-RU")} ₽
              {claimed.has(offer.slug) ? " — уже оформлено" : ""}
            </option>
          ))}
        </select>
        {initialAlreadyClaimed && (
          <p className="mt-1 text-xs text-yellow-400">
            Вы уже подали заявку по этому офферу — выберите другой.
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm shimmer-text-soft mb-1" htmlFor="screenshot">
          Скриншот подтверждения
        </label>
        <input
          id="screenshot"
          name="screenshot"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          className="liquid-glass w-full rounded-[5px] px-4 py-2.5 outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition file:mr-3 file:rounded-[5px] file:border-0 file:bg-[#5046e4] file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
        <p className="mt-1 text-xs shimmer-text-soft">PNG, JPEG или WEBP, до 8 МБ</p>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[5px] bg-[#5046e4] px-6 py-3 font-medium text-white hover:bg-[#10093a] transition disabled:opacity-50"
      >
        {pending ? "Отправка…" : "Отправить на проверку"}
      </button>
    </form>
  );
}
