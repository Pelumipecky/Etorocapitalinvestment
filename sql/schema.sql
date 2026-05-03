-- SQL schema for Binance-clone sample backend (Postgres / Supabase)
-- Instructions: Paste this into the Supabase SQL editor (SQL workspace) or run with psql.
-- Note: Supabase manages auth in the `auth.users` table. Many tables reference auth.users(id).

-- Enable extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles: one row per authenticated user (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  country text,
  referral_code text UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Wallets: user balances for different currencies
CREATE TABLE IF NOT EXISTS public.wallets (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency text NOT NULL,
  balance numeric(30, 10) DEFAULT 0 NOT NULL,
  locked numeric(30, 10) DEFAULT 0 NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wallets_user_currency_idx ON public.wallets(user_id, currency);

-- Orders: limit/market orders placed by users
CREATE TABLE IF NOT EXISTS public.orders (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  market text NOT NULL, -- e.g. 'BTC-USD' or 'BNB-USDT'
  side text NOT NULL CHECK (side IN ('buy','sell')),
  type text NOT NULL CHECK (type IN ('limit','market','ioc','fok')),
  price numeric(30, 10), -- null for market orders
  amount numeric(30, 10) NOT NULL,
  filled numeric(30, 10) DEFAULT 0 NOT NULL,
  status text NOT NULL CHECK (status IN ('open','partially_filled','filled','cancelled')) DEFAULT 'open',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_user_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_market_idx ON public.orders(market);

-- Trades: executed trades between orders
CREATE TABLE IF NOT EXISTS public.trades (
  id bigserial PRIMARY KEY,
  market text NOT NULL,
  price numeric(30, 10) NOT NULL,
  amount numeric(30, 10) NOT NULL,
  buy_order_id bigint REFERENCES public.orders(id) ON DELETE SET NULL,
  sell_order_id bigint REFERENCES public.orders(id) ON DELETE SET NULL,
  buyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  executed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS trades_market_idx ON public.trades(market);

-- Transactions: deposits/withdrawals and transfers
CREATE TABLE IF NOT EXISTS public.transactions (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('deposit','withdrawal','trade','transfer','fee')),
  currency text NOT NULL,
  amount numeric(30, 10) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending','completed','failed','cancelled')) DEFAULT 'pending',
  reference text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_idx ON public.transactions(user_id);

-- Deposits: on-chain or fiat deposits
CREATE TABLE IF NOT EXISTS public.deposits (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  currency text NOT NULL,
  amount numeric(30,10) NOT NULL,
  tx_hash text,
  status text NOT NULL CHECK (status IN ('pending','confirmed','failed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Withdrawals: user withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  currency text NOT NULL,
  amount numeric(30,10) NOT NULL,
  destination text NOT NULL, -- address or bank reference
  status text NOT NULL CHECK (status IN ('pending','processing','completed','failed')) DEFAULT 'pending',
  tx_hash text,
  created_at timestamptz DEFAULT now()
);

-- Referrals
CREATE TABLE IF NOT EXISTS public.referrals (
  id bigserial PRIMARY KEY,
  referrer uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referee uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Audit log (simple)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id bigserial PRIMARY KEY,
  actor uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security examples (Supabase):
-- Enable RLS and create simple policies that allow users to operate only on their own rows.

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles: allow user to select their profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: allow user to insert their profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: allow user to update their profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Wallets RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallets: users can select their wallets" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Wallets: users can update their own wallets" ON public.wallets
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Wallets: users can insert their wallets" ON public.wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Orders RLS (users manage their own orders)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders: users can see their orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Orders: users can insert orders for themselves" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orders: users can update/cancel their orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Transactions RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Transactions: users can see their transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Transactions: users can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trades and other tables are typically backend-managed: restrict client write access.
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trades: allow select" ON public.trades FOR SELECT USING (true);
-- No insert/update/delete policies for trades (backend should insert using service role key)

-- End of schema

-- Contacts: store messages sent from the contact form
CREATE TABLE IF NOT EXISTS public.contacts (
  id bigserial PRIMARY KEY,
  name text,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);
