-- Learning resource likes and comments (in-app view, like blog posts)

CREATE TABLE IF NOT EXISTS public.learning_resource_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT learning_resource_likes_unique UNIQUE (resource_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.learning_resource_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_resource_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resource_comments ENABLE ROW LEVEL SECURITY;

-- Likes: authenticated can read all (for counts), insert/delete own
CREATE POLICY "Authenticated can read learning resource likes"
  ON public.learning_resource_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own learning resource like"
  ON public.learning_resource_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own learning resource like"
  ON public.learning_resource_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments: authenticated can read all, insert own, update/delete own
CREATE POLICY "Authenticated can read learning resource comments"
  ON public.learning_resource_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create learning resource comment"
  ON public.learning_resource_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning resource comment"
  ON public.learning_resource_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own learning resource comment"
  ON public.learning_resource_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_learning_resource_likes_resource_id ON public.learning_resource_likes(resource_id);
CREATE INDEX IF NOT EXISTS idx_learning_resource_comments_resource_id ON public.learning_resource_comments(resource_id);

CREATE TRIGGER update_learning_resource_comments_updated_at
  BEFORE UPDATE ON public.learning_resource_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
