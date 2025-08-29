
-- Enable gen_random_uuid if needed
create extension if not exists pgcrypto;

-- 1) Scans (top-level, user-owned)
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  url text not null,
  status text not null default 'pending' check (status in ('pending','crawling','checking_links','analyzing','completed','failed')),
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists scans_set_updated_at on public.scans;
create trigger scans_set_updated_at
before update on public.scans
for each row execute function public.set_updated_at();

-- 2) Pages (from Firecrawl)
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  url text not null,
  title text,
  content text,
  status_code int,
  extracted_at timestamptz not null default now(),
  unique (scan_id, url)
);

create index if not exists idx_pages_scan_id on public.pages(scan_id);

-- 3) Page links (links extracted from each page)
create table if not exists public.page_links (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  target_url text not null,
  is_internal boolean,
  anchor_text text,
  created_at timestamptz not null default now(),
  unique (page_id, target_url)
);

create index if not exists idx_page_links_page_id on public.page_links(page_id);

-- 4) Link checks (results from link checker)
create table if not exists public.link_checks (
  id uuid primary key default gen_random_uuid(),
  page_link_id uuid not null references public.page_links(id) on delete cascade,
  status_code int,
  ok boolean,
  error text,
  checked_at timestamptz not null default now()
);

create index if not exists idx_link_checks_page_link_id on public.link_checks(page_link_id);

-- 5) Page suggestions (Gemini analysis per page)
create table if not exists public.page_suggestions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  model text,
  suggestions jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_suggestions_page_id on public.page_suggestions(page_id);

-- 6) Market insights (Tavily + Gemini for a scan)
create table if not exists public.market_insights (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  model text,
  insights jsonb not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_market_insights_scan_id on public.market_insights(scan_id);

-- Row Level Security
alter table public.scans enable row level security;
alter table public.pages enable row level security;
alter table public.page_links enable row level security;
alter table public.link_checks enable row level security;
alter table public.page_suggestions enable row level security;
alter table public.market_insights enable row level security;

-- Policies: scans (user-owned)
drop policy if exists "scans_select_own" on public.scans;
create policy "scans_select_own"
on public.scans for select
using (auth.uid() = user_id);

drop policy if exists "scans_insert_own" on public.scans;
create policy "scans_insert_own"
on public.scans for insert
with check (auth.uid() = user_id);

drop policy if exists "scans_update_own" on public.scans;
create policy "scans_update_own"
on public.scans for update
using (auth.uid() = user_id);

drop policy if exists "scans_delete_own" on public.scans;
create policy "scans_delete_own"
on public.scans for delete
using (auth.uid() = user_id);

-- Pages: scope via parent scan ownership
drop policy if exists "pages_select_by_owner" on public.pages;
create policy "pages_select_by_owner"
on public.pages for select
using (exists (
  select 1 from public.scans s
  where s.id = pages.scan_id and s.user_id = auth.uid()
));

drop policy if exists "pages_insert_by_owner" on public.pages;
create policy "pages_insert_by_owner"
on public.pages for insert
with check (exists (
  select 1 from public.scans s
  where s.id = pages.scan_id and s.user_id = auth.uid()
));

drop policy if exists "pages_update_by_owner" on public.pages;
create policy "pages_update_by_owner"
on public.pages for update
using (exists (
  select 1 from public.scans s
  where s.id = pages.scan_id and s.user_id = auth.uid()
));

drop policy if exists "pages_delete_by_owner" on public.pages;
create policy "pages_delete_by_owner"
on public.pages for delete
using (exists (
  select 1 from public.scans s
  where s.id = pages.scan_id and s.user_id = auth.uid()
));

-- Page links: scope via pages -> scans
drop policy if exists "page_links_select_by_owner" on public.page_links;
create policy "page_links_select_by_owner"
on public.page_links for select
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_links.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_links_insert_by_owner" on public.page_links;
create policy "page_links_insert_by_owner"
on public.page_links for insert
with check (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_links.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_links_update_by_owner" on public.page_links;
create policy "page_links_update_by_owner"
on public.page_links for update
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_links.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_links_delete_by_owner" on public.page_links;
create policy "page_links_delete_by_owner"
on public.page_links for delete
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_links.page_id and s.user_id = auth.uid()
));

-- Link checks: scope via page_links -> pages -> scans
drop policy if exists "link_checks_select_by_owner" on public.link_checks;
create policy "link_checks_select_by_owner"
on public.link_checks for select
using (exists (
  select 1 from public.page_links pl
  join public.pages p on p.id = pl.page_id
  join public.scans s on s.id = p.scan_id
  where pl.id = link_checks.page_link_id and s.user_id = auth.uid()
));

drop policy if exists "link_checks_insert_by_owner" on public.link_checks;
create policy "link_checks_insert_by_owner"
on public.link_checks for insert
with check (exists (
  select 1 from public.page_links pl
  join public.pages p on p.id = pl.page_id
  join public.scans s on s.id = p.scan_id
  where pl.id = link_checks.page_link_id and s.user_id = auth.uid()
));

drop policy if exists "link_checks_update_by_owner" on public.link_checks;
create policy "link_checks_update_by_owner"
on public.link_checks for update
using (exists (
  select 1 from public.page_links pl
  join public.pages p on p.id = pl.page_id
  join public.scans s on s.id = p.scan_id
  where pl.id = link_checks.page_link_id and s.user_id = auth.uid()
));

drop policy if exists "link_checks_delete_by_owner" on public.link_checks;
create policy "link_checks_delete_by_owner"
on public.link_checks for delete
using (exists (
  select 1 from public.page_links pl
  join public.pages p on p.id = pl.page_id
  join public.scans s on s.id = p.scan_id
  where pl.id = link_checks.page_link_id and s.user_id = auth.uid()
));

-- Page suggestions: scope via pages -> scans
drop policy if exists "page_suggestions_select_by_owner" on public.page_suggestions;
create policy "page_suggestions_select_by_owner"
on public.page_suggestions for select
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_suggestions.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_suggestions_insert_by_owner" on public.page_suggestions;
create policy "page_suggestions_insert_by_owner"
on public.page_suggestions for insert
with check (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_suggestions.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_suggestions_update_by_owner" on public.page_suggestions;
create policy "page_suggestions_update_by_owner"
on public.page_suggestions for update
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_suggestions.page_id and s.user_id = auth.uid()
));

drop policy if exists "page_suggestions_delete_by_owner" on public.page_suggestions;
create policy "page_suggestions_delete_by_owner"
on public.page_suggestions for delete
using (exists (
  select 1 from public.pages p
  join public.scans s on s.id = p.scan_id
  where p.id = page_suggestions.page_id and s.user_id = auth.uid()
));

-- Market insights: scope via scans
drop policy if exists "market_insights_select_by_owner" on public.market_insights;
create policy "market_insights_select_by_owner"
on public.market_insights for select
using (exists (
  select 1 from public.scans s
  where s.id = market_insights.scan_id and s.user_id = auth.uid()
));

drop policy if exists "market_insights_insert_by_owner" on public.market_insights;
create policy "market_insights_insert_by_owner"
on public.market_insights for insert
with check (exists (
  select 1 from public.scans s
  where s.id = market_insights.scan_id and s.user_id = auth.uid()
));

drop policy if exists "market_insights_update_by_owner" on public.market_insights;
create policy "market_insights_update_by_owner"
on public.market_insights for update
using (exists (
  select 1 from public.scans s
  where s.id = market_insights.scan_id and s.user_id = auth.uid()
));

drop policy if exists "market_insights_delete_by_owner" on public.market_insights;
create policy "market_insights_delete_by_owner"
on public.market_insights for delete
using (exists (
  select 1 from public.scans s
  where s.id = market_insights.scan_id and s.user_id = auth.uid()
));
