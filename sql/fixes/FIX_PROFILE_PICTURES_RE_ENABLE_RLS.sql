-- =====================================================
-- Re-enable RLS with working policies
-- =====================================================
-- Run this AFTER testing with RLS disabled
-- =====================================================

-- Step 1: Re-enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 2: Create working policies (using the EXACT pattern from blog-media)
-- Public SELECT
DO $$ BEGIN
  CREATE POLICY "Public read profile-pictures"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-pictures');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- INSERT - Using foldername pattern that works for blog-media
DO $$ BEGIN
  CREATE POLICY "Users can insert their profile pictures"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- UPDATE
DO $$ BEGIN
  CREATE POLICY "Users can update their profile pictures"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- DELETE
DO $$ BEGIN
  CREATE POLICY "Users can delete their profile pictures"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

RAISE NOTICE '✓ RLS re-enabled with policies';

