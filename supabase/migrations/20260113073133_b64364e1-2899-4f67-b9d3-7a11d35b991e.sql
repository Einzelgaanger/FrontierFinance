-- Add new columns to applications table for the redesigned form

-- Add new fields for comprehensive application form
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS team_size TEXT,
ADD COLUMN IF NOT EXISTS information_sharing_topics TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS supporting_documents TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS rejection_cooldown_until TIMESTAMP WITH TIME ZONE;

-- Create storage bucket for application documents with increased file size
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('application-documents', 'application-documents', false, 52428800) -- 50MB limit
ON CONFLICT (id) DO UPDATE SET file_size_limit = 52428800;

-- Create RLS policies for application-documents bucket
CREATE POLICY "Users can upload their own application documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own application documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

CREATE POLICY "Users can delete their own application documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'application-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all application documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);