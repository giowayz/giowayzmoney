import { NextResponse } from "next/server";
import { getOfferBySlug } from "@/data/offers";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

// Every "Перейти к оформлению" link on the site routes through here first —
// it logs the click (best-effort, never blocks the redirect) and bounces
// the visitor on to the bank's real tracking link.
export async function GET(_request: Request, ctx: RouteContext<"/go/[slug]">) {
  const { slug } = await ctx.params;
  const offer = getOfferBySlug(slug);

  if (!offer) {
    return NextResponse.redirect(new URL("/offers", _request.url));
  }

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: offerRow } = await supabase
        .from("offers")
        .select("id")
        .eq("slug", slug)
        .single();

      if (offerRow) {
        await supabase.from("link_clicks").insert({
          lead_id: user?.id ?? null,
          offer_id: offerRow.id,
        });
      }
    } catch {
      // Never let click logging stand between a visitor and the offer.
    }
  }

  return NextResponse.redirect(offer.trackingLink);
}
