
-- Allow more image types in profile-pictures bucket
UPDATE storage.buckets 
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    file_size_limit = 10485760
WHERE id = 'profile-pictures';
