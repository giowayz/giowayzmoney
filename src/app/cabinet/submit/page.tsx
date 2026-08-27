import SubmitOfferForm from "@/components/SubmitOfferForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SubmitOfferPage(props: PageProps<"/cabinet/submit">) {
  const searchParams = await props.searchParams;
  const offerParam = searchParams.offer;
  const initialSlug = Array.isArray(offerParam) ? offerParam[0] : offerParam;

  // Offers this lead already has an active (non-rejected) claim on — the
  // form disables them so a duplicate submission never even reaches the
  // server action (which enforces the same rule authoritatively).
  let claimedSlugs: string[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("submissions")
        .select("offers(slug)")
        .eq("lead_id", user.id)
        .neq("status", "rejected")
        .returns<{ offers: { slug: string } | null }[]>();
      claimedSlugs = (data ?? []).map((s) => s.offers?.slug).filter((s): s is string => !!s);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-display mb-1">Подтвердить оффер</h1>
      <p className="shimmer-text-soft text-sm mb-6">
        Прикрепите скриншот, подтверждающий выполнение целевого действия.
      </p>
      <SubmitOfferForm initialSlug={initialSlug} claimedSlugs={claimedSlugs} />
    </div>
  );
}
