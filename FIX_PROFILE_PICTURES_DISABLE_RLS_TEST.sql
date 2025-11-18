-- =====================================================
-- TEMPORARY: Disable RLS to test if that's the issue
-- =====================================================
-- WARNING: This disables RLS temporarily for testing
-- =====================================================

-- Step 1: Drop ALL policies on storage.objects for profile-pictures
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
      OR policyname ILIKE '%test%'
    )
  ) 
  LOOP
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
      RAISE NOTICE 'Dropped: %', r.policyname;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error dropping %: %', r.policyname, SQLERRM;
    END;
  END LOOP;
END $$;

-- Step 2: TEMPORARILY disable RLS on storage.objects
-- This will allow uploads to work if RLS is the issue
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify RLS is disabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND NOT rowsecurity
  ) THEN
    RAISE NOTICE '✓ RLS is DISABLED - uploads should work now';
  ELSE
    RAISE EXCEPTION 'RLS is still enabled!';
  END IF;
END $$;

-- =====================================================
-- TEST UPLOAD NOW - If it works, RLS was the issue
-- =====================================================
-- After testing, run the next script to re-enable RLS with proper policies
-- =====================================================

