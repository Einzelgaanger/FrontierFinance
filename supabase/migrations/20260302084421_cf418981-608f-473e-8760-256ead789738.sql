-- Fix infinite recursion in user_roles UPDATE policy
DROP POLICY IF EXISTS "Admins can update any user role" ON public.user_roles;

CREATE POLICY "Admins can update any user role"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Also fix storage policies that reference user_roles directly (can cause same recursion)
-- Fix blog-media INSERT policy
DROP POLICY IF EXISTS "Members can upload blog media" ON storage.objects;
CREATE POLICY "Members can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-media'
  AND auth.uid() = ((storage.foldername(name))[1])::uuid
  AND public.has_role(auth.uid(), 'member') OR public.has_role(auth.uid(), 'admin')
);

-- Fix learning-media policies
DROP POLICY IF EXISTS "learning_media_admin_insert" ON storage.objects;
CREATE POLICY "learning_media_admin_insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'learning-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "learning_media_admin_update" ON storage.objects;
CREATE POLICY "learning_media_admin_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'learning-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'learning-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "learning_media_admin_delete" ON storage.objects;
CREATE POLICY "learning_media_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'learning-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND public.has_role(auth.uid(), 'admin')
);

-- Fix application documents admin view
DROP POLICY IF EXISTS "Admins can view all application documents" ON storage.objects;
CREATE POLICY "Admins can view all application documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents'
  AND public.has_role(auth.uid(), 'admin')
);