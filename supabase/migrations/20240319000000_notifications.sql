-- Enable pgcrypto for UUID generation
create extension if not exists pgcrypto;

-- Create notifications table
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id),
  student_name text not null,
  student_email text not null,
  guardian_name text not null,
  guardian_email text not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz default now(),
  sent_at timestamptz,
  status text default 'pending'
);

-- Set up RLS policies
alter table public.notifications enable row level security;

create policy "Enable read for authenticated users"
  on public.notifications for select
  using (auth.uid() = student_id);

create policy "Enable insert for authenticated users"
  on public.notifications for insert
  with check (auth.uid() = student_id);