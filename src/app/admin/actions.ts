"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/types/database";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden");

  return supabase;
}

export async function updateSubmissionStatus(formData: FormData) {
  const supabase = await requireAdmin();

  const submissionId = String(formData.get("submissionId") ?? "");
  const status = String(formData.get("status") ?? "") as SubmissionStatus;
  const payoutAmountRaw = formData.get("payoutAmount");
  const adminComment = formData.get("adminComment");

  if (!submissionId || !status) return;

  const update: Record<string, unknown> = { status };
  if (payoutAmountRaw) update.payout_amount = Number(payoutAmountRaw);
  if (adminComment) update.admin_comment = String(adminComment);
  if (status === "paid") update.paid_at = new Date().toISOString();

  const { error } = await supabase.from("submissions").update(update).eq("id", submissionId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
