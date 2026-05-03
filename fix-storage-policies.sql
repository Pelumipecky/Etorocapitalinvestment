-- Fix storage policies for payment-proofs bucket to work with custom auth
-- Run this in your Supabase SQL Editor

-- 1. Ensure bucket exists and is public (for easier read access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing restrictive policies that require Supabase Auth
DROP POLICY IF EXISTS "Users can upload their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;

-- 3. Create new policies that work with custom authentication (anon role)

-- Allow uploads from application (authenticated via custom logic, but appearing as 'anon' to Supabase)
CREATE POLICY "Public Upload Access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs'
);

-- Allow reading files (admin verification + user review)
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-proofs'
);

-- Allow updates (if needed, e.g. replacing a proof)
CREATE POLICY "Public Update Access" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'payment-proofs'
);
