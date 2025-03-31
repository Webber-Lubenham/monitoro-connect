-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade,
    full_name text,
    cpf text unique,
    phone text,
    role text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- Create parents table
create table if not exists public.parents (
    id uuid default gen_random_uuid(),
    student_id uuid references public.profiles(id) on delete cascade,
    name text,
    email text,
    phone text,
    cpf text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.parents enable row level security;

-- Create policies
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Parents are viewable by student"
    on public.parents for select
    using (auth.uid() = student_id);
