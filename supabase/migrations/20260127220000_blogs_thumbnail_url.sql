-- Optional thumbnail for video posts (cards use as preview; detail uses as poster)
ALTER TABLE public.blogs
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
