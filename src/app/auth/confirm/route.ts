import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Supabase's own confirmation/magic-link emails point here — "{{ .SiteURL
// }}/auth/confirm?token_hash=...&type=signup" is the default template.
// Without this route, that link had nowhere real to land: the token was
// valid but never got exchanged for a session, so every confirmation click
// just failed to load instead of signing the lead in.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/cabinet";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=confirm_failed`);
}
