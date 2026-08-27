-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run from scratch: everything this script owns is dropped first,
-- then recreated. Reset only touches the objects created below (nothing
-- Supabase manages itself, like auth.users, is ever dropped).

drop trigger if exists on_auth_user_created on auth.users;

drop policy if exists "avatars: lead updates own folder" on storage.objects;
drop policy if exists "avatars: lead writes own folder" on storage.objects;
drop policy if exists "avatars: anyone reads" on storage.objects;
drop policy if exists "screenshots: lead reads own, admin reads all" on storage.objects;
drop policy if exists "screenshots: lead uploads own folder" on storage.objects;

drop table if exists public.link_clicks cascade;
drop table if exists public.submissions cascade;
drop table if exists public.offers cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user cascade;
drop function if exists public.handle_submission_approved cascade;
drop function if exists public.is_admin cascade;

drop type if exists public.user_role cascade;
drop type if exists public.submission_status cascade;
drop type if exists public.offer_category cascade;

create type public.user_role as enum ('lead', 'admin');
create type public.submission_status as enum ('pending', 'approved', 'rejected', 'paid');
create type public.offer_category as enum ('rko', 'business_registration', 'credit_cards', 'debit_cards');

-- One row per registered lead (and admins), created automatically on signup.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'lead',
  created_at timestamptz not null default now()
);

-- Catalog of bank offers. Seeded from src/data/offers.ts (see supabase/seed_offers.sql).
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  bank text not null,
  category public.offer_category not null,
  action text not null,
  note text,
  price numeric(10, 2) not null,
  tracking_link text not null,
  action_deadline_days integer,
  default_hold_days integer not null default 30,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- A lead's claim that they completed an offer, with proof screenshot and hold/payout tracking.
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.profiles (id) on delete cascade,
  offer_id uuid not null references public.offers (id) on delete restrict,
  screenshot_path text not null,
  status public.submission_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  approved_at timestamptz,
  hold_days integer,
  hold_ends_at timestamptz,
  payout_amount numeric(10, 2),
  paid_at timestamptz,
  admin_comment text
);

create index submissions_lead_id_idx on public.submissions (lead_id);
create index submissions_offer_id_idx on public.submissions (offer_id);

-- A lead can have at most one active (non-rejected) claim per offer at a
-- time — this is what actually stops someone re-submitting proof for an
-- offer they've already claimed. A rejected claim doesn't count, so a lead
-- whose proof was rejected can try again with a better screenshot.
create unique index submissions_one_active_claim_per_offer
  on public.submissions (lead_id, offer_id)
  where status <> 'rejected';

-- One row per click on an offer's "Перейти к оформлению" link, logged by
-- the /go/[slug] redirect route before it bounces the visitor on to the
-- real tracking link. lead_id is null for visitors who aren't signed in yet.
create table public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.profiles (id) on delete set null,
  offer_id uuid not null references public.offers (id) on delete cascade,
  clicked_at timestamptz not null default now()
);

create index link_clicks_lead_id_idx on public.link_clicks (lead_id);
create index link_clicks_offer_id_idx on public.link_clicks (offer_id);

-- Keep profiles in sync with auth.users on signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- When a submission is approved, stamp the hold window automatically.
create function public.handle_submission_approved()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.approved_at := now();
    new.hold_days := coalesce(new.hold_days, (select default_hold_days from public.offers where id = new.offer_id));
    new.hold_ends_at := now() + make_interval(days => new.hold_days);
  end if;
  return new;
end;
$$;

create trigger on_submission_approved
  before update on public.submissions
  for each row execute procedure public.handle_submission_approved();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.offers enable row level security;
alter table public.submissions enable row level security;
alter table public.link_clicks enable row level security;

create function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "profiles: read own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles: update own" on public.profiles
  for update using (id = auth.uid());

create policy "offers: public read" on public.offers
  for select using (is_active or public.is_admin());

create policy "offers: admin write" on public.offers
  for all using (public.is_admin()) with check (public.is_admin());

create policy "submissions: lead reads own" on public.submissions
  for select using (lead_id = auth.uid() or public.is_admin());

create policy "submissions: lead inserts own" on public.submissions
  for insert with check (lead_id = auth.uid());

create policy "submissions: admin updates" on public.submissions
  for update using (public.is_admin());

create policy "link_clicks: lead reads own" on public.link_clicks
  for select using (lead_id = auth.uid() or public.is_admin());

-- Logged from the server-side /go/[slug] route with the visitor's own
-- session (or none, for anonymous clicks) — never with a service key.
create policy "link_clicks: anyone logs a click" on public.link_clicks
  for insert with check (lead_id = auth.uid() or lead_id is null);

-- Storage bucket for proof-of-completion screenshots. Private; each lead can only
-- read/write inside a folder named after their own user id ("<lead_id>/<file>").
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

create policy "screenshots: lead uploads own folder" on storage.objects
  for insert with check (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "screenshots: lead reads own, admin reads all" on storage.objects
  for select using (
    bucket_id = 'screenshots' and (
      (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
    )
  );

-- Storage bucket for profile avatars. Public (avatars are meant to be shown
-- freely, unlike proof screenshots), but a lead can only write inside their
-- own "<user_id>/<file>" folder — same folder-ownership pattern as screenshots.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: anyone reads" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars: lead writes own folder" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars: lead updates own folder" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );
