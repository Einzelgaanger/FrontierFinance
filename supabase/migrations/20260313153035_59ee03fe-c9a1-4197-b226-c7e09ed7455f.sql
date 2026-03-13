
-- Attachments table for blogs and learning resources (multiple media per post)
CREATE TABLE public.post_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id uuid REFERENCES public.blogs(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  attachment_type text NOT NULL DEFAULT 'link',
  url text NOT NULL,
  caption text,
  sort_order integer DEFAULT 0,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT one_parent CHECK (
    (blog_id IS NOT NULL AND resource_id IS NULL) OR
    (blog_id IS NULL AND resource_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.post_attachments ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read all attachments
CREATE POLICY "Authenticated can read attachments"
  ON public.post_attachments
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can insert attachments they create
CREATE POLICY "Users can insert own attachments"
  ON public.post_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));

-- Users can delete own attachments, admins can delete any
CREATE POLICY "Users can delete own or admins delete any"
  ON public.post_attachments
  FOR DELETE
  TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR public.has_role((SELECT auth.uid()), 'admin')
  );

-- Index for fast lookups
CREATE INDEX idx_post_attachments_blog ON public.post_attachments(blog_id) WHERE blog_id IS NOT NULL;
CREATE INDEX idx_post_attachments_resource ON public.post_attachments(resource_id) WHERE resource_id IS NOT NULL;
