CREATE OR REPLACE FUNCTION public.log_blog_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (
      NEW.user_id,
      'blog_post_created',
      0,
      'Created blog post: ' || COALESCE(NEW.title, 'Untitled')
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_learning_resource_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (
      NEW.created_by,
      'learning_resource_created',
      0,
      'Created learning resource: ' || COALESCE(NEW.title, 'Untitled')
    );
  END IF;

  RETURN NEW;
END;
$$;