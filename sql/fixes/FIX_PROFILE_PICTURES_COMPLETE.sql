-- =====================================================
-- COMPLETE PROFILE PICTURES STORAGE FIX
-- =====================================================
-- This script completely fixes the profile-pictures storage bucket
-- and ensures proper RLS policies for all operations
-- =====================================================

-- Step 1: Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures',
  'profile-pictures',
  true, -- Public bucket so images can be viewed
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Step 2: Drop ALL existing policies on storage.objects for profile-pictures
DO $$ 
DECLARE
  r RECORD;
BEGIN
  -- Drop all policies that might be related to profile-pictures
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND (
      policyname LIKE '%profile%' 
      OR policyname LIKE '%picture%'
      OR policyname LIKE '%avatar%'
      OR policyname LIKE '%pp_%'
    )
  ) 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Step 3: Create clean, working RLS policies

-- Policy 1: Public SELECT (anyone can view profile pictures)
DO $$ BEGIN
  CREATE POLICY "profile_pictures_public_select"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policy 2: Authenticated users can INSERT their own profile pictures
-- File path format: {user_id}/avatar.{ext}
DO $$ BEGIN
  CREATE POLICY "profile_pictures_user_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE (auth.uid()::text || '/%')
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policy 3: Authenticated users can UPDATE their own profile pictures
DO $$ BEGIN
  CREATE POLICY "profile_pictures_user_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE (auth.uid()::text || '/%')
    )
  )
  WITH CHECK (
    bucket_id = 'profile-pictures' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE (auth.uid()::text || '/%')
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Policy 4: Authenticated users can DELETE their own profile pictures
DO $$ BEGIN
  CREATE POLICY "profile_pictures_user_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-pictures' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE (auth.uid()::text || '/%')
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Step 4: Verify bucket configuration
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profile-pictures') THEN
    RAISE NOTICE 'Profile-pictures bucket exists and is configured';
  ELSE
    RAISE EXCEPTION 'Profile-pictures bucket was not created';
  END IF;
END $$;

-- Step 5: Grant necessary permissions (if not already granted)
DO $$ 
BEGIN
  -- These are usually already granted by Supabase, but ensure they exist
  GRANT USAGE ON SCHEMA storage TO authenticated;
  GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
EXCEPTION WHEN OTHERS THEN 
  -- Permissions might already be granted, which is fine
  NULL;
END $$;

-- =====================================================
-- VERIFICATION QUERIES (run these to verify setup)
-- =====================================================
-- SELECT * FROM storage.buckets WHERE id = 'profile-pictures';
-- SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%profile%';
-- =====================================================

