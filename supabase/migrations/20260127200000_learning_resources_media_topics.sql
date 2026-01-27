-- Learning resources: add topic (9 + other), topic_other, media_type; support uploads like posts
-- Topics from Learning Lab: Investment thesis, Fund economics, Capital raising, Team, Track record,
-- Investment process, Operations, ESG & Impact, SME support, plus "other" with custom description.

-- 1) Add new columns (nullable for backfill)
ALTER TABLE public.learning_resources
  ADD COLUMN IF NOT EXISTS topic TEXT,
  ADD COLUMN IF NOT EXISTS topic_other TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

-- 2) Constraints for topic (9 + 'other') and media_type
ALTER TABLE public.learning_resources DROP CONSTRAINT IF EXISTS learning_resources_topic_check;
ALTER TABLE public.learning_resources
  ADD CONSTRAINT learning_resources_topic_check
  CHECK (topic IS NULL OR topic IN (
    'investment_thesis','fund_economics','capital_raising','team','track_record',
    'investment_process','operations','esg_impact','sme_support','other'
  ));

ALTER TABLE public.learning_resources DROP CONSTRAINT IF EXISTS learning_resources_media_type_check;
ALTER TABLE public.learning_resources
  ADD CONSTRAINT learning_resources_media_type_check
  CHECK (media_type IS NULL OR media_type IN ('link','image','video'));

-- 4) Backfill existing rows
UPDATE public.learning_resources
SET
  topic = CASE
    WHEN category = 'investment' THEN 'investment_thesis'
    WHEN category = 'fundraising' THEN 'capital_raising'
    WHEN category = 'operations' THEN 'operations'
    WHEN category = 'impact' THEN 'esg_impact'
    WHEN category = 'networking' THEN 'team'
    WHEN category = 'legal' THEN 'operations'
    ELSE 'other'
  END,
  topic_other = CASE WHEN category NOT IN ('investment','fundraising','operations','impact','networking','legal','general') THEN category ELSE NULL END,
  media_type = CASE
    WHEN resource_type = 'video' THEN 'video'
    WHEN thumbnail_url IS NOT NULL AND resource_url IS NOT NULL THEN 'link'
    ELSE 'link'
  END
WHERE topic IS NULL;

-- 5) Default for new rows (optional; app will always set them)
-- No change to existing defaults; app sends topic and media_type.

-- 6) Create storage bucket for learning media (images/videos uploaded by admins)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learning-media',
  'learning-media',
  true,
  52428800,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'];

-- 7) Storage policies for learning-media: admins can upload; anyone can read
DROP POLICY IF EXISTS "learning_media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "learning_media_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "learning_media_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "learning_media_admin_delete" ON storage.objects;

CREATE POLICY "learning_media_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'learning-media');

CREATE POLICY "learning_media_admin_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'learning-media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "learning_media_admin_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'learning-media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'learning-media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "learning_media_admin_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'learning-media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 8) Index for topic filtering
CREATE INDEX IF NOT EXISTS idx_learning_resources_topic ON public.learning_resources(topic);
CREATE INDEX IF NOT EXISTS idx_learning_resources_media_type ON public.learning_resources(media_type);
