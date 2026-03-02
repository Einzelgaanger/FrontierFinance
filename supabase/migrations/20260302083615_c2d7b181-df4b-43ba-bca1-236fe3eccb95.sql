
-- Drop and recreate profile-pictures storage policies with explicit ownership checks
DROP POLICY IF EXISTS "profile_pics_auth_insert" ON storage.objects;
DROP POLICY IF EXISTS "profile_pics_auth_update" ON storage.objects;
DROP POLICY IF EXISTS "profile_pics_auth_delete" ON storage.objects;
DROP POLICY IF EXISTS "profile_pics_public_select" ON storage.objects;

-- Public read
CREATE POLICY "profile_pics_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Insert: authenticated users can upload to their own folder
CREATE POLICY "profile_pics_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update: authenticated users can update their own files
CREATE POLICY "profile_pics_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Delete: authenticated users can delete their own files
CREATE POLICY "profile_pics_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
