import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSubmissionStatus } from "@/app/admin/actions";
import type { Submission } from "@/types/database";

interface AdminSubmission extends Submission {
  profiles?: { full_name: string | null } | null;
}

export default async function AdminPage() {
  if (!isSupabaseConfigured) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/");

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, offers(name, bank, category, price, slug), profiles(full_name)")
    .order("submitted_at", { ascending: false })
    .returns<AdminSubmission[]>();

  const list = submissions ?? [];

  const screenshotUrls = new Map<string, string>();
  for (const s of list) {
    const { data } = await supabase.storage
      .from("screenshots")
      .createSignedUrl(s.screenshot_path, 60 * 60);
    if (data?.signedUrl) screenshotUrls.set(s.id, data.signedUrl);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-display glow-text mb-8">Заявки лидов</h1>

      {list.length === 0 ? (
        <p className="shimmer-text-soft text-sm">Заявок пока нет.</p>
      ) : (
        <div className="space-y-4">
          {list.map((submission) => (
            <div key={submission.id} className="liquid-glass rounded-2xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-medium">{submission.offers?.name ?? "Оффер удалён"}</p>
                  <p className="text-xs shimmer-text-soft">
                    Лид: {submission.profiles?.full_name || submission.lead_id} ·{" "}
                    {new Date(submission.submitted_at).toLocaleDateString("ru-RU")}
                  </p>
                </div>
                {screenshotUrls.get(submission.id) && (
                  <a
                    href={screenshotUrls.get(submission.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#9382ff] hover:underline"
                  >
                    Открыть скриншот →
                  </a>
                )}
              </div>

              <form action={updateSubmissionStatus} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="submissionId" value={submission.id} />

                <div>
                  <label className="block text-xs shimmer-text-soft mb-1">Статус</label>
                  <select
                    name="status"
                    defaultValue={submission.status}
                    className="liquid-glass rounded-[5px] px-3 py-2 text-sm outline-none focus:shadow-[inset_0_0_0_1px_#9382ff]"
                  >
                    <option value="pending">На проверке</option>
                    <option value="approved">Одобрено (запустить холд)</option>
                    <option value="rejected">Отклонено</option>
                    <option value="paid">Выплачено</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs shimmer-text-soft mb-1">Сумма, ₽</label>
                  <input
                    type="number"
                    name="payoutAmount"
                    defaultValue={submission.payout_amount ?? submission.offers?.price ?? ""}
                    className="w-28 liquid-glass rounded-[5px] px-3 py-2 text-sm outline-none focus:shadow-[inset_0_0_0_1px_#9382ff]"
                  />
                </div>

                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs shimmer-text-soft mb-1">Комментарий</label>
                  <input
                    type="text"
                    name="adminComment"
                    defaultValue={submission.admin_comment ?? ""}
                    className="w-full liquid-glass rounded-[5px] px-3 py-2 text-sm outline-none focus:shadow-[inset_0_0_0_1px_#9382ff]"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-[5px] bg-[#5046e4] px-4 py-2 text-sm font-medium text-white hover:bg-[#10093a] transition"
                >
                  Сохранить
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
