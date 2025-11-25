-- =====================================================
-- PROFILE PICTURES - FINAL FIX WITH WORKING POLICIES
-- =====================================================

-- Step 1: Drop ALL existing profile-related policies completely
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
    )
  ) 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Step 2: Create simple, permissive policies that WILL work
-- Public can view all profile pictures
CREATE POLICY "profile_pics_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Authenticated users can upload to profile-pictures bucket
CREATE POLICY "profile_pics_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

-- Authenticated users can update in profile-pictures bucket  
CREATE POLICY "profile_pics_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- Authenticated users can delete from profile-pictures bucket
CREATE POLICY "profile_pics_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures');

-- Ensure proper permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;