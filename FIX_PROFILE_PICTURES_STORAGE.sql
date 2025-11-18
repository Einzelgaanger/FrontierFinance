-- SIMPLE FIX: Drop and recreate profile-pictures storage policies
-- This uses a simpler approach that should definitely work

-- First, drop all existing policies for profile-pictures
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%profile%') 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Create simple, working policies
-- SELECT: Public read access
CREATE POLICY "profile_pictures_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT: Authenticated users can upload files in their own folder
-- File path format: {user_id}/avatar.{ext}
CREATE POLICY "profile_pictures_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- UPDATE: Authenticated users can update files in their own folder
CREATE POLICY "profile_pictures_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
)
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

-- DELETE: Authenticated users can delete files in their own folder
CREATE POLICY "profile_pictures_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (name ~ ('^' || auth.uid()::text || '/'))
);

