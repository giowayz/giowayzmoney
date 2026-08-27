"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  updateProfile,
  updateEmail,
  type UpdateProfileState,
  type UpdateEmailState,
} from "@/app/cabinet/actions";

export default function ProfileForm({
  fullName,
  avatarUrl,
  email,
}: {
  fullName: string | null;
  avatarUrl: string | null;
  email: string;
}) {
  const [profileState, profileAction, profilePending] = useActionState<
    UpdateProfileState,
    FormData
  >(updateProfile, { error: null, success: false });
  const [emailState, emailAction, emailPending] = useActionState<UpdateEmailState, FormData>(
    updateEmail,
    { error: null, success: false }
  );
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <form action={profileAction} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full liquid-glass">
            {preview || avatarUrl ? (
              <Image
                src={preview ?? avatarUrl!}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-display text-[#9382ff]">
                {(fullName || email).slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm shimmer-text-soft mb-1" htmlFor="avatar">
              Фото профиля
            </label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full text-xs shimmer-text-soft file:mr-3 file:rounded-[5px] file:border-0 file:bg-[#5046e4] file:px-3 file:py-1.5 file:text-xs file:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm shimmer-text-soft mb-1" htmlFor="fullName">
            Никнейм
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={fullName ?? ""}
            required
            className="liquid-glass w-full rounded-[5px] px-4 py-2.5 text-[#f4f0ff] outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
          />
        </div>

        {profileState.error && <p className="text-sm text-red-400">{profileState.error}</p>}
        {profileState.success && (
          <p className="text-sm text-green-400">Профиль обновлён.</p>
        )}

        <button
          type="submit"
          disabled={profilePending}
          className="rounded-[5px] bg-[#5046e4] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#10093a] transition disabled:opacity-50"
        >
          {profilePending ? "Сохранение…" : "Сохранить"}
        </button>
      </form>

      <form action={emailAction} className="space-y-3 border-t border-white/10 pt-8">
        <div>
          <label className="block text-sm shimmer-text-soft mb-1" htmlFor="email">
            Почта
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            required
            className="liquid-glass w-full rounded-[5px] px-4 py-2.5 text-[#f4f0ff] outline-none focus:shadow-[inset_0_0_0_1px_#9382ff] transition"
          />
          <p className="mt-1 text-xs shimmer-text-soft">
            При смене почты на новый адрес придёт письмо для подтверждения.
          </p>
        </div>

        {emailState.error && <p className="text-sm text-red-400">{emailState.error}</p>}
        {emailState.success && (
          <p className="text-sm text-green-400">
            Письмо для подтверждения отправлено на новый адрес.
          </p>
        )}

        <button
          type="submit"
          disabled={emailPending}
          className="rounded-[5px] bg-[#5046e4] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#10093a] transition disabled:opacity-50"
        >
          {emailPending ? "Отправка…" : "Изменить почту"}
        </button>
      </form>
    </div>
  );
}
