import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import ProfileForm from "@/components/ProfileForm";
import type { Profile } from "@/types/database";

export default async function ProfilePage() {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null; // proxy redirects unauthenticated visitors before this renders

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <div className="mx-auto max-w-lg px-4 sm:px-6 py-12">
      <Link href="/cabinet" className="text-sm text-[#9382ff] hover:underline">
        ← Личный кабинет
      </Link>
      <h1 className="text-2xl font-display glow-text mt-4 mb-8">Профиль</h1>
      <ProfileForm
        fullName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
        email={user.email ?? ""}
      />
    </div>
  );
}
