-- ============================================================
-- Team admins, super admin, activity logging for accountability
-- ============================================================

-- 1. Add is_super_admin to user_roles (for Alfred and future super admins)
DO $$ BEGIN
  ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_roles_is_super_admin ON public.user_roles(is_super_admin) WHERE is_super_admin = true;

-- 2. RPC: get_user_is_super_admin (for frontend to show Accountability Tracker only to super admin)
CREATE OR REPLACE FUNCTION public.get_user_is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.user_roles WHERE user_id = _user_id LIMIT 1),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_user_is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_is_super_admin(UUID) TO service_role;

-- 3. Log blog post creation to activity_logs (for super admin accountability tracker)
CREATE OR REPLACE FUNCTION public.log_blog_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, action, details, created_at)
  VALUES (
    NEW.user_id,
    'blog_post_created',
    jsonb_build_object(
      'blog_id', NEW.id,
      'title', NEW.title,
      'media_type', NEW.media_type
    ),
    now()
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_blog_created_log ON public.blogs;
CREATE TRIGGER on_blog_created_log
  AFTER INSERT ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.log_blog_created();

-- 4. Allow super admin to view activity_logs (admins already can; ensure super_admin has same for accountability)
-- Existing policy "Admins can view all logs" already allows any admin. Super admin is a subset of admin.
-- No change needed unless we restrict regular admins to not see logs (we keep current: all admins can view).

-- 5. Optional: log learning resource creation if table exists and has created_by/user_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'learning_resources') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'learning_resources' AND column_name = 'created_by') THEN
      CREATE OR REPLACE FUNCTION public.log_learning_resource_created()
      RETURNS TRIGGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $fn$
      BEGIN
        INSERT INTO public.activity_logs (user_id, action, details, created_at)
        VALUES (
          NEW.created_by,
          'learning_resource_created',
          jsonb_build_object('resource_id', NEW.id, 'title', NEW.title),
          now()
        );
        RETURN NEW;
      END;
      $fn$;
      DROP TRIGGER IF EXISTS on_learning_resource_created_log ON public.learning_resources;
      CREATE TRIGGER on_learning_resource_created_log
        AFTER INSERT ON public.learning_resources
        FOR EACH ROW
        EXECUTE FUNCTION public.log_learning_resource_created();
    END IF;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
