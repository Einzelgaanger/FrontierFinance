-- =====================================================
-- ULTIMATE PROFILE PICTURES FIX
-- =====================================================
-- This uses the simplest possible string matching
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

-- Step 2: Drop ALL existing profile-pictures policies
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

-- Step 3: Create policies using SIMPLE string matching (no foldername function)
-- This should definitely work

-- Public SELECT
CREATE POLICY "pp_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT - Simple string prefix check
CREATE POLICY "pp_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND name LIKE (auth.uid()::text || '/%')
);

-- UPDATE - Simple string prefix check
CREATE POLICY "pp_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND name LIKE (auth.uid()::text || '/%')
)
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND name LIKE (auth.uid()::text || '/%')
);

-- DELETE - Simple string prefix check
CREATE POLICY "pp_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND name LIKE (auth.uid()::text || '/%')
);

-- Verify policies exist
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies 
  WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname IN ('pp_select', 'pp_insert', 'pp_update', 'pp_delete');
  
  IF policy_count != 4 THEN
    RAISE EXCEPTION 'Expected 4 policies, found %', policy_count;
  END IF;
  
  RAISE NOTICE '✓ All 4 policies created successfully';
END $$;

