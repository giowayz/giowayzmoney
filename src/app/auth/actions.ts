"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error: string | null;
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");

  if (!email || !password) {
    return { error: "Заполните email и пароль" };
  }
  if (password.length < 8) {
    return { error: "Пароль должен быть не короче 8 символов" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/cabinet");
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Surface the real reason instead of always saying "wrong password" —
    // an unconfirmed email is a completely different, self-fixable problem
    // (check inbox / have an admin confirm it) and deserves its own message.
    if (error.code === "email_not_confirmed") {
      return {
        error: "Почта не подтверждена — перейдите по ссылке из письма или попросите админа подтвердить вручную.",
      };
    }
    return { error: "Неверный email или пароль" };
  }

  revalidatePath("/", "layout");
  redirect("/cabinet");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
