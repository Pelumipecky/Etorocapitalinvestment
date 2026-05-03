-- Create payment-proofs storage bucket for deposit payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist (to allow re-running the script)
DROP POLICY IF EXISTS "Users can upload their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;

-- Set up RLS policies for payment-proofs bucket
-- Allow public uploads (required because we use custom auth, not Supabase Auth)
CREATE POLICY "Public Upload Access" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'payment-proofs'
);

-- Allow public read access (so admins and users can see the images)
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'payment-proofs'
);