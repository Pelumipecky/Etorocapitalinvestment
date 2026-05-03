-- Create kyc-documents storage bucket for KYC verification files
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Upload Access KYC" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access KYC" ON storage.objects;

-- Set up RLS policies for kyc-documents bucket
-- Allow public uploads
CREATE POLICY "Public Upload Access KYC" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'kyc-documents'
);

-- Allow public read access
CREATE POLICY "Public Read Access KYC" ON storage.objects
FOR SELECT USING (
  bucket_id = 'kyc-documents'
);
