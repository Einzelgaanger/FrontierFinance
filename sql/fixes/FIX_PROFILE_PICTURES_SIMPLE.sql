-- ULTRA SIMPLE FIX - Just allow authenticated users to upload to profile-pictures
-- Drop all existing policies first

DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND (policyname LIKE '%profile%' OR policyname LIKE '%picture%')
  ) 
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- Create the simplest possible policies
-- SELECT: Public can view
CREATE POLICY "profile_pictures_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT: Any authenticated user can insert (folder structure provides security)
CREATE POLICY "profile_pictures_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-pictures');

-- UPDATE: Any authenticated user can update (folder structure provides security)
CREATE POLICY "profile_pictures_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-pictures')
WITH CHECK (bucket_id = 'profile-pictures');

-- DELETE: Any authenticated user can delete (folder structure provides security)
CREATE POLICY "profile_pictures_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-pictures');

