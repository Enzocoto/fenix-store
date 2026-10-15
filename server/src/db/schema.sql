create table if not exists stores (
  id text primary key,
  slug text unique not null,
  name text not null,
  domain text,
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  store_id text,
  slug text not null,
  name text not null,
  price_cents integer not null,
  cost_cents integer,
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  store_id text,
  status text not null default 'pending',
  email text,
  customer_name text,
  product_id text,
  variant_id text,
  quantity integer not null default 1,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  provider text not null default 'demo',
  provider_ref text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists visits (
  id text primary key,
  store_id text,
  product_slug text,
  ts timestamptz not null default now(),
  path text,
  referrer text,
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  session_id text
);

create table if not exists admin_users (
  id text primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table products add column if not exists store_id text;
alter table products add column if not exists variants jsonb;
alter table products drop constraint if exists products_slug_key;
alter table orders add column if not exists store_id text;
alter table orders add column if not exists address text;
alter table orders add column if not exists city text;
alter table orders add column if not exists region text;
alter table orders add column if not exists postal_code text;
alter table orders add column if not exists group_id text;
alter table visits add column if not exists store_id text;
alter table visits add column if not exists product_slug text;
create unique index if not exists products_store_slug_idx on products (store_id, slug);
