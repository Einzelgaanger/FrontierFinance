-- =====================================================
-- FINAL PROFILE PICTURES FIX
-- =====================================================
-- Uses the EXACT pattern from working blog-media policies
-- =====================================================

-- Step 1: Ensure bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Step 2: Drop ALL existing profile-pictures policies (be thorough)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND (
      policyname ILIKE '%profile%' 
      OR policyname ILIKE '%picture%'
      OR policyname ILIKE '%avatar%'
      OR policyname ILIKE '%pp_%'
    )
  ) 
  LOOP
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END LOOP;
END $$;

-- Step 3: Create policies using EXACT pattern from working blog-media migration
-- This pattern is proven to work in 20251022122059_c5874870-8066-4d18-83eb-3067f0bf7936.sql

-- Public SELECT
DO $$ BEGIN
  CREATE POLICY "Public read profile-pictures"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- INSERT - EXACT pattern from working migration
DO $$ BEGIN
  CREATE POLICY "Users can insert their profile pictures"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- UPDATE - EXACT pattern from working migration
DO $$ BEGIN
  CREATE POLICY "Users can update their profile pictures"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- DELETE - EXACT pattern from working migration
DO $$ BEGIN
  CREATE POLICY "Users can delete their profile pictures"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 4: Verify
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname LIKE '%profile%';
  
  IF policy_count < 4 THEN
    RAISE EXCEPTION 'Expected 4 policies, found %', policy_count;
  END IF;
  
  RAISE NOTICE '✓ All policies created successfully';
END $$;
