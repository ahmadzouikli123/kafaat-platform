-- =========================================================
-- Migration 002 — Auth support
-- Run this in the SQL Editor on your EXISTING Supabase project
-- (schema.sql already ran once; this only adds what's new)
-- =========================================================

-- Store the expert's email directly on the profile (useful for contact
-- and for linking a profile to an account after login).
alter table public.expert_profiles
  add column if not exists email text;

-- Allow an expert to update their profile once their email matches their
-- logged-in account, even if the profile was created anonymously
-- (user_id is null) before auth existed.
drop policy if exists "users can update their own expert profile" on public.expert_profiles;

create policy "users can update their own expert profile"
  on public.expert_profiles for update
  using (
    auth.uid() = user_id
    or (user_id is null and email = auth.jwt() ->> 'email')
  )
  with check (
    auth.uid() = user_id
    or (user_id is null and email = auth.jwt() ->> 'email')
  );
