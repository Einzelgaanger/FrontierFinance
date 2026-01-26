-- =====================================================
-- DIAGNOSTIC SCRIPT - Check what's actually there
-- =====================================================

-- 1. Check if bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'profile-pictures';

-- 2. List ALL policies on storage.objects
SELECT 
  policyname,
  cmd,
  qual,
  with_check,
  roles
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- 4. Check for any profile-pictures related policies specifically
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects' 
AND (
  policyname ILIKE '%profile%' 
  OR policyname ILIKE '%picture%'
  OR policyname ILIKE '%avatar%'
  OR policyname ILIKE '%pp%'
)
ORDER BY policyname;

