-- Plataforma do Direito — banco no Supabase.
-- Como usar: Supabase → SQL Editor → New query → colar tudo → Run.

-- Quem pode entrar no painel (preenchido depois do 1º login, ver o fim do arquivo).
create table if not exists public.admins (uid uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;  -- sem políticas: ninguém lê nem grava pelo site

create or replace function public.eh_admin() returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where uid = auth.uid()) $$;

-- Estado do painel do escritório (cada chave do painel vira uma linha).
create table if not exists public.estado (
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chave text not null,
  valor text not null,
  em bigint not null,
  primary key (owner, chave)
);
alter table public.estado enable row level security;
drop policy if exists "estado: só a advogada" on public.estado;
create policy "estado: só a advogada" on public.estado for all to authenticated
  using (owner = auth.uid() and public.eh_admin()) with check (owner = auth.uid() and public.eh_admin());

-- Pedidos que chegam pelo site: qualquer visitante CRIA; só a advogada lê e marca como importado.
create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  pacote text not null check (length(pacote) < 60000),
  importado boolean not null default false,
  criado timestamptz not null default now()
);
alter table public.pedidos enable row level security;
drop policy if exists "pedidos: visitante cria" on public.pedidos;
create policy "pedidos: visitante cria" on public.pedidos for insert to anon, authenticated with check (importado = false);
drop policy if exists "pedidos: advogada lê" on public.pedidos;
create policy "pedidos: advogada lê" on public.pedidos for select to authenticated using (public.eh_admin());
drop policy if exists "pedidos: advogada marca" on public.pedidos;
create policy "pedidos: advogada marca" on public.pedidos for update to authenticated using (public.eh_admin()) with check (public.eh_admin());

-- DEPOIS do seu 1º login no painel, rode só a linha abaixo, trocando pelo seu e-mail:
-- insert into public.admins (uid) select id from auth.users where email = 'SEU_EMAIL_AQUI';
