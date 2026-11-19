-- Plataforma do Direito — banco no Supabase.
-- Como usar: Supabase → SQL Editor → New query → colar tudo → Run.

-- Quem pode entrar no painel (preenchido depois do 1º login, ver o fim do arquivo).
create table if not exists public.admins (uid uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;  -- sem políticas: ninguém lê nem grava pelo site

create or replace function public.eh_admin() returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admins where uid = auth.uid()) $$;
revoke execute on function public.eh_admin() from public, anon;
grant execute on function public.eh_admin() to authenticated;

-- Estado do painel do escritório (cada chave do painel vira uma linha).
create table if not exists public.estado (
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  chave text not null,
  valor text not null,
  em bigint not null,
  primary key (owner, chave)
);
alter table public.estado enable row level security;
drop policy if exists estado_so_advogada on public.estado;
create policy estado_so_advogada on public.estado for all to authenticated
  using (owner = auth.uid() and public.eh_admin()) with check (owner = auth.uid() and public.eh_admin());

-- Pedidos que chegam pelo site: qualquer visitante CRIA; só a advogada lê e marca como importado.
create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  pacote text not null check (length(pacote) < 60000),
  importado boolean not null default false,
  criado timestamptz not null default now()
);
alter table public.pedidos enable row level security;
drop policy if exists pedidos_visitante_cria on public.pedidos;
create policy pedidos_visitante_cria on public.pedidos for insert to anon, authenticated with check (importado = false);
drop policy if exists pedidos_advogada_le on public.pedidos;
create policy pedidos_advogada_le on public.pedidos for select to authenticated using (public.eh_admin());
drop policy if exists pedidos_advogada_marca on public.pedidos;
create policy pedidos_advogada_marca on public.pedidos for update to authenticated using (public.eh_admin()) with check (public.eh_admin());
drop policy if exists pedidos_advogada_apaga on public.pedidos;
create policy pedidos_advogada_apaga on public.pedidos for delete to authenticated using (public.eh_admin());

-- DEPOIS que a advogada criar a senha no painel ("Primeiro acesso"), liberar o acesso (trocar o e-mail):
-- update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where email = 'SEU_EMAIL_AQUI';
-- insert into public.admins (uid) select id from auth.users where email = 'SEU_EMAIL_AQUI' on conflict do nothing;

-- ===================== Equipe: advogados associados =====================
-- O associado vê SÓ os casos que a titular atribuiu a ele (ficha + prazos/tarefas). Não vê financeiro,
-- outros clientes, pedidos do site nem a lista de equipe. A titular pode desativar o acesso a qualquer momento.
create table if not exists public.associados (
  uid uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  oab text,
  ativo boolean not null default true,
  criado timestamptz not null default now()
);
alter table public.associados enable row level security;
drop policy if exists associados_titular on public.associados;
create policy associados_titular on public.associados for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
drop policy if exists associados_ve_a_si on public.associados;
create policy associados_ve_a_si on public.associados for select to authenticated using (uid = auth.uid());

create or replace function public.eh_associado() returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.associados where uid = auth.uid() and ativo) $$;
revoke execute on function public.eh_associado() from public, anon;
grant execute on function public.eh_associado() to authenticated;

-- Papel de quem entrou: 'titular', 'associado' ou null (sem acesso).
create or replace function public.meu_papel() returns text language sql stable security definer set search_path = public
as $$ select case when public.eh_admin() then 'titular' when public.eh_associado() then 'associado' end $$;
revoke execute on function public.meu_papel() from public, anon;
grant execute on function public.meu_papel() to authenticated;

-- Casos compartilhados: uma linha por cliente atribuído a um associado.
create table if not exists public.casos (
  id text primary key,                       -- id do cliente no painel (CL-…)
  titular uuid not null default auth.uid() references auth.users(id) on delete cascade,
  associado uuid not null references public.associados(uid) on delete cascade,
  ficha jsonb not null,                      -- dados do cliente (sem financeiro)
  itens jsonb not null default '[]',         -- prazos, compromissos e tarefas do cliente
  em bigint not null,                        -- última alteração (ms)
  por uuid default auth.uid()                -- quem alterou por último
);
alter table public.casos enable row level security;
drop policy if exists casos_titular on public.casos;
create policy casos_titular on public.casos for all to authenticated using (public.eh_admin()) with check (public.eh_admin());
drop policy if exists casos_associado_le on public.casos;
create policy casos_associado_le on public.casos for select to authenticated using (associado = auth.uid() and public.eh_associado());
drop policy if exists casos_associado_edita on public.casos;
create policy casos_associado_edita on public.casos for update to authenticated
  using (associado = auth.uid() and public.eh_associado()) with check (associado = auth.uid() and public.eh_associado());
-- O associado só altera ficha, itens e a marca de tempo (não troca titular nem responsável).
create or replace function public.casos_trava() returns trigger language plpgsql set search_path = public as $$
begin
  if not public.eh_admin() then
    new.id := old.id; new.titular := old.titular; new.associado := old.associado;
  end if;
  new.por := auth.uid();
  return new;
end $$;
drop trigger if exists casos_trava on public.casos;
create trigger casos_trava before update on public.casos for each row execute function public.casos_trava();

-- A titular cadastra o associado pelo e-mail, depois que ele criou a senha em "Primeiro acesso".
create or replace function public.adicionar_associado(p_email text, p_nome text, p_oab text default null) returns text
language plpgsql security definer set search_path = public, auth as $$
declare u uuid;
begin
  if not public.eh_admin() then raise exception 'Somente a titular pode cadastrar associados'; end if;
  select id into u from auth.users where lower(email) = lower(trim(p_email));
  if u is null then return 'sem-conta'; end if;
  update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where id = u;
  insert into public.associados (uid, nome, email, oab, ativo) values (u, p_nome, lower(trim(p_email)), p_oab, true)
    on conflict (uid) do update set nome = excluded.nome, oab = excluded.oab, ativo = true;
  return 'ok';
end $$;
revoke execute on function public.adicionar_associado(text, text, text) from public, anon;
grant execute on function public.adicionar_associado(text, text, text) to authenticated;
