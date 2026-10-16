-- =====================================================================
-- PIPO JUEGA · Guardado en la nube (OPCIONAL)
-- Pega todo esto en Supabase → SQL Editor → New query → Run.
-- =====================================================================
create table if not exists public.pipo_progreso (
  codigo     text primary key,
  datos      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.pipo_progreso enable row level security;
-- Nadie puede leer la tabla directamente; solo a través de las funciones (con el código secreto).

create or replace function public.pipo_guardar(p_codigo text, p_datos jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if length(p_codigo) < 6 or length(p_codigo) > 16 then raise exception 'codigo invalido'; end if;
  if pg_column_size(p_datos) > 200000 then raise exception 'datos muy grandes'; end if;
  insert into pipo_progreso(codigo, datos, updated_at) values (upper(p_codigo), p_datos, now())
  on conflict (codigo) do update set datos = excluded.datos, updated_at = now();
end $$;

create or replace function public.pipo_cargar(p_codigo text)
returns jsonb language sql security definer set search_path = public as $$
  select datos from pipo_progreso where codigo = upper(p_codigo);
$$;

grant execute on function public.pipo_guardar(text, jsonb) to anon;
grant execute on function public.pipo_cargar(text) to anon;
