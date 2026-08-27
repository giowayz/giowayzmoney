"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface SubmitOfferState {
  error: string | null;
  success: boolean;
}

const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function submitOfferProof(
  _prevState: SubmitOfferState,
  formData: FormData
): Promise<SubmitOfferState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Нужно войти в личный кабинет", success: false };
  }

  const offerSlug = String(formData.get("offerSlug") ?? "");
  const screenshot = formData.get("screenshot");

  if (!offerSlug) {
    return { error: "Выберите оффер", success: false };
  }
  if (!(screenshot instanceof File) || screenshot.size === 0) {
    return { error: "Прикрепите скриншот", success: false };
  }
  if (screenshot.size > MAX_SCREENSHOT_BYTES) {
    return { error: "Файл слишком большой (максимум 8 МБ)", success: false };
  }
  if (!ALLOWED_TYPES.includes(screenshot.type)) {
    return { error: "Допустимы только PNG, JPEG или WEBP", success: false };
  }

  const { data: offer, error: offerError } = await supabase
    .from("offers")
    .select("id")
    .eq("slug", offerSlug)
    .single();

  if (offerError || !offer) {
    return { error: "Оффер не найден", success: false };
  }

  // A lead can only have one active (non-rejected) claim per offer — checked
  // here for a friendly error message, and enforced again at the database
  // level (submissions_one_active_claim_per_offer) in case of a race between
  // two near-simultaneous submits.
  const { data: existing } = await supabase
    .from("submissions")
    .select("id")
    .eq("lead_id", user.id)
    .eq("offer_id", offer.id)
    .neq("status", "rejected")
    .maybeSingle();

  if (existing) {
    return {
      error: "Вы уже подали заявку по этому офферу — она на проверке или уже одобрена.",
      success: false,
    };
  }

  const ext = screenshot.name.split(".").pop() ?? "png";
  const path = `${user.id}/${offerSlug}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("screenshots")
    .upload(path, screenshot, { contentType: screenshot.type });

  if (uploadError) {
    return { error: `Не удалось загрузить файл: ${uploadError.message}`, success: false };
  }

  const { error: insertError } = await supabase.from("submissions").insert({
    lead_id: user.id,
    offer_id: offer.id,
    screenshot_path: path,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      // Lost the race against another near-simultaneous submit for the same
      // offer — the friendly check above missed it, the DB constraint didn't.
      return {
        error: "Вы уже подали заявку по этому офферу — она на проверке или уже одобрена.",
        success: false,
      };
    }
    return { error: `Не удалось сохранить заявку: ${insertError.message}`, success: false };
  }

  revalidatePath("/cabinet");
  return { error: null, success: true };
}

export interface UpdateProfileState {
  error: string | null;
  success: boolean;
}

const MAX_AVATAR_BYTES = 4 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function updateProfile(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Нужно войти в личный кабинет", success: false };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const avatar = formData.get("avatar");
  const update: { full_name: string; avatar_url?: string } = { full_name: fullName };

  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > MAX_AVATAR_BYTES) {
      return { error: "Файл слишком большой (максимум 4 МБ)", success: false };
    }
    if (!ALLOWED_AVATAR_TYPES.includes(avatar.type)) {
      return { error: "Допустимы только PNG, JPEG или WEBP", success: false };
    }

    const ext = avatar.name.split(".").pop() ?? "png";
    // Fixed filename per user (not timestamped like screenshots) — a new
    // upload just overwrites the last one, so the avatar URL stays stable.
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { contentType: avatar.type, upsert: true });

    if (uploadError) {
      return { error: `Не удалось загрузить фото: ${uploadError.message}`, success: false };
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-bust so the new avatar shows immediately even though the path
    // (and therefore the previously-cached URL) is identical to the old one.
    update.avatar_url = `${data.publicUrl}?t=${Date.now()}`;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (updateError) {
    return { error: `Не удалось сохранить профиль: ${updateError.message}`, success: false };
  }

  revalidatePath("/cabinet");
  revalidatePath("/cabinet/profile");
  return { error: null, success: true };
}

export interface UpdateEmailState {
  error: string | null;
  success: boolean;
}

export async function updateEmail(
  _prevState: UpdateEmailState,
  formData: FormData
): Promise<UpdateEmailState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Нужно войти в личный кабинет", success: false };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Укажите email", success: false };
  }
  if (email === user.email) {
    return { error: "Это и есть текущий email", success: false };
  }

  const { error } = await supabase.auth.updateUser({ email });
  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}
