
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insert by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles update by owner" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trips
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  destination text not null,
  start_date date,
  end_date date,
  budget_inr numeric not null default 0,
  vibe text,
  cover_emoji text default '🏔️',
  travelers int not null default 1,
  status text not null default 'planning',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.trips enable row level security;
create policy "Trips select own" on public.trips for select using (auth.uid() = user_id);
create policy "Trips insert own" on public.trips for insert with check (auth.uid() = user_id);
create policy "Trips update own" on public.trips for update using (auth.uid() = user_id);
create policy "Trips delete own" on public.trips for delete using (auth.uid() = user_id);

-- Trip stops
create table public.trip_stops (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day int not null default 1,
  position int not null default 0,
  title text not null,
  location text,
  time text,
  category text default 'sightseeing',
  cost_inr numeric not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.trip_stops enable row level security;
create policy "Stops select own" on public.trip_stops for select using (
  exists(select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
);
create policy "Stops insert own" on public.trip_stops for insert with check (
  exists(select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
);
create policy "Stops update own" on public.trip_stops for update using (
  exists(select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
);
create policy "Stops delete own" on public.trip_stops for delete using (
  exists(select 1 from public.trips t where t.id = trip_id and t.user_id = auth.uid())
);

create index trip_stops_trip_idx on public.trip_stops(trip_id, day, position);
create index trips_user_idx on public.trips(user_id, created_at desc);
