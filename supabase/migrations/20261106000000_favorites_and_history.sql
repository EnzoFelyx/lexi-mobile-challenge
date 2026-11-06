-- Favoritos e histórico por usuário. Cada pessoa só lê e escreve as próprias linhas (RLS).

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  word text not null check (char_length(word) > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, word)
);

create table public.history (
  user_id uuid not null references auth.users (id) on delete cascade,
  word text not null check (char_length(word) > 0),
  viewed_at timestamptz not null default now(),
  primary key (user_id, word)
);

alter table public.favorites enable row level security;
alter table public.history enable row level security;

grant select, insert, update, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.history to authenticated;

create policy "Users read their own favorites"
  on public.favorites for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users add their own favorites"
  on public.favorites for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update their own favorites"
  on public.favorites for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete their own favorites"
  on public.favorites for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users read their own history"
  on public.history for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users add to their own history"
  on public.history for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update their own history"
  on public.history for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete their own history"
  on public.history for delete to authenticated
  using ((select auth.uid()) = user_id);
