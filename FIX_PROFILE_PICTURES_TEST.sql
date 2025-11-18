-- =====================================================
-- TEST SCRIPT - Temporarily allow ALL authenticated users
-- =====================================================
-- This will help us determine if RLS is the issue
-- =====================================================

-- Drop all existing profile-pictures policies
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
      OR policyname ILIKE '%pp%'
    )
  ) 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Create VERY permissive policies for testing
-- SELECT - anyone can view
CREATE POLICY "test_pp_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT - ANY authenticated user can insert (for testing)
CREATE POLICY "test_pp_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

-- UPDATE - ANY authenticated user can update (for testing)
CREATE POLICY "test_pp_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- DELETE - ANY authenticated user can delete (for testing)
CREATE POLICY "test_pp_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures');

-- If this works, then we know RLS was the issue and we can make it more restrictive
-- If this doesn't work, then the issue is something else (bucket config, permissions, etc.)

