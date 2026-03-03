
-- Allow admins to INSERT into profile-pictures bucket for any user
CREATE POLICY "Admins can insert any profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to UPDATE any profile picture
CREATE POLICY "Admins can update any profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to DELETE any profile picture
CREATE POLICY "Admins can delete any profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND public.has_role(auth.uid(), 'admin')
);
