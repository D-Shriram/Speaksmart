-- Run once in Supabase SQL Editor. Safe to run more than once.
alter table public.participants
  add column if not exists retry_allowed boolean not null default false;
