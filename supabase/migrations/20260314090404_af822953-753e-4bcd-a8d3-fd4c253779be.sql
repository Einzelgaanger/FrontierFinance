
-- 1. Create content_reads table to track which content users have read
CREATE TABLE public.content_reads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('blog', 'resource')),
  content_id uuid NOT NULL,
  read_at timestamp with time zone NOT NULL DEFAULT now(),
  is_marked_unread boolean NOT NULL DEFAULT false,
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE public.content_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own content reads" ON public.content_reads
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE INDEX idx_content_reads_user ON public.content_reads(user_id);
CREATE INDEX idx_content_reads_content ON public.content_reads(content_type, content_id);

-- 2. Create user_notifications table
CREATE TABLE public.user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('blog', 'resource', 'comment', 'badge', 'streak')),
  content_id uuid,
  title text NOT NULL,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON public.user_notifications
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE INDEX idx_notifications_user_unread ON public.user_notifications(user_id, is_read);

-- 3. Add new columns to user_credits
ALTER TABLE public.user_credits
  ADD COLUMN IF NOT EXISTS comments_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS content_reads_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments_received_count integer DEFAULT 0;

-- 4. Update activity_log CHECK constraint to allow new types
ALTER TABLE public.activity_log DROP CONSTRAINT IF EXISTS activity_log_activity_type_check;
ALTER TABLE public.activity_log ADD CONSTRAINT activity_log_activity_type_check
  CHECK (activity_type IN (
    'ai_usage', 'blog_post', 'daily_login', 'survey_completion',
    'network_interaction', 'learning_resource_created', 'blog_post_created',
    'content_read', 'comment_made', 'comment_received', 'streak_bonus'
  ));

-- 5. Update award_points function to handle new types
CREATE OR REPLACE FUNCTION public.award_points(p_user_id uuid, p_activity_type text, p_points integer, p_description text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.user_credits (user_id, total_points)
    VALUES (p_user_id, p_points)
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_points = user_credits.total_points + p_points,
        updated_at = NOW();
    
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (p_user_id, p_activity_type, p_points, p_description);
    
    IF p_activity_type = 'ai_usage' THEN
        UPDATE public.user_credits SET ai_usage_count = COALESCE(ai_usage_count, 0) + 1 WHERE user_id = p_user_id;
    ELSIF p_activity_type = 'blog_post' OR p_activity_type = 'blog_post_created' THEN
        UPDATE public.user_credits SET blog_posts_count = COALESCE(blog_posts_count, 0) + 1 WHERE user_id = p_user_id;
    ELSIF p_activity_type = 'comment_made' THEN
        UPDATE public.user_credits SET comments_count = COALESCE(comments_count, 0) + 1 WHERE user_id = p_user_id;
    ELSIF p_activity_type = 'comment_received' THEN
        UPDATE public.user_credits SET comments_received_count = COALESCE(comments_received_count, 0) + 1 WHERE user_id = p_user_id;
    ELSIF p_activity_type = 'content_read' THEN
        UPDATE public.user_credits SET content_reads_count = COALESCE(content_reads_count, 0) + 1 WHERE user_id = p_user_id;
    END IF;
END;
$function$;

-- 6. Create function to track daily login and streaks
CREATE OR REPLACE FUNCTION public.track_daily_login(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_last_login date;
  v_current_streak integer;
  v_longest_streak integer;
  v_points_awarded integer := 0;
  v_streak_bonus integer := 0;
  v_result jsonb;
BEGIN
  SELECT last_login_date::date, COALESCE(login_streak, 0), COALESCE(longest_streak, 0)
  INTO v_last_login, v_current_streak, v_longest_streak
  FROM public.user_credits
  WHERE user_id = p_user_id;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, total_points, login_streak, longest_streak, last_login_date)
    VALUES (p_user_id, 5, 1, 1, CURRENT_DATE);
    
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (p_user_id, 'daily_login', 5, 'Daily login bonus');
    
    RETURN jsonb_build_object('points', 5, 'streak', 1, 'streak_bonus', 0, 'is_new_day', true);
  END IF;

  -- Already logged in today
  IF v_last_login = CURRENT_DATE THEN
    RETURN jsonb_build_object('points', 0, 'streak', v_current_streak, 'streak_bonus', 0, 'is_new_day', false);
  END IF;

  -- Calculate streak
  IF v_last_login = CURRENT_DATE - 1 THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;

  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;

  v_points_awarded := 5; -- base daily login

  -- Streak bonuses
  IF v_current_streak = 7 THEN
    v_streak_bonus := 10;
  ELSIF v_current_streak = 14 THEN
    v_streak_bonus := 15;
  ELSIF v_current_streak = 30 THEN
    v_streak_bonus := 25;
  ELSIF v_current_streak > 0 AND v_current_streak % 30 = 0 THEN
    v_streak_bonus := 25;
  END IF;

  UPDATE public.user_credits
  SET total_points = COALESCE(total_points, 0) + v_points_awarded + v_streak_bonus,
      login_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_login_date = CURRENT_DATE,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
  VALUES (p_user_id, 'daily_login', v_points_awarded, 'Daily login bonus (Day ' || v_current_streak || ')');

  IF v_streak_bonus > 0 THEN
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (p_user_id, 'streak_bonus', v_streak_bonus, v_current_streak || '-day streak bonus!');
  END IF;

  RETURN jsonb_build_object(
    'points', v_points_awarded + v_streak_bonus,
    'streak', v_current_streak,
    'streak_bonus', v_streak_bonus,
    'is_new_day', true
  );
END;
$function$;

-- 7. Create function to get company leaderboard (aggregate team points)
CREATE OR REPLACE FUNCTION public.get_company_leaderboard(p_limit integer DEFAULT 10)
RETURNS TABLE(
  company_user_id uuid,
  company_name text,
  company_logo text,
  total_company_points bigint,
  member_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH company_points AS (
    -- Primary user points
    SELECT 
      up.id as company_id,
      up.company_name,
      up.profile_picture_url as company_logo,
      COALESCE(uc.total_points, 0) as points
    FROM user_profiles up
    LEFT JOIN user_credits uc ON uc.user_id = up.id
    WHERE up.show_in_directory = true
      AND EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = up.id AND ur.role IN ('member', 'admin'))
    
    UNION ALL
    
    -- Team member points attributed to company
    SELECT
      cm.company_user_id as company_id,
      (SELECT company_name FROM user_profiles WHERE id = cm.company_user_id) as company_name,
      (SELECT profile_picture_url FROM user_profiles WHERE id = cm.company_user_id) as company_logo,
      COALESCE(uc.total_points, 0) as points
    FROM company_members cm
    LEFT JOIN user_credits uc ON uc.user_id = cm.member_user_id
    WHERE cm.is_active = true
  )
  SELECT 
    cp.company_id as company_user_id,
    cp.company_name,
    cp.company_logo,
    SUM(cp.points)::bigint as total_company_points,
    COUNT(DISTINCT cp.company_id)::bigint as member_count
  FROM company_points cp
  WHERE cp.company_name IS NOT NULL
  GROUP BY cp.company_id, cp.company_name, cp.company_logo
  ORDER BY total_company_points DESC
  LIMIT p_limit;
$function$;

-- 8. Trigger to notify blog author when someone comments on their post
CREATE OR REPLACE FUNCTION public.notify_blog_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_blog_author_id uuid;
  v_blog_title text;
  v_commenter_name text;
BEGIN
  -- Get blog author
  SELECT user_id, title INTO v_blog_author_id, v_blog_title
  FROM public.blogs WHERE id = NEW.blog_id;

  -- Don't notify if commenting on own post
  IF v_blog_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT COALESCE(full_name, 'Someone') INTO v_commenter_name
  FROM public.user_profiles WHERE id = NEW.user_id;

  -- Award points to blog author for receiving a comment
  PERFORM public.award_points(v_blog_author_id, 'comment_received', 2, 
    v_commenter_name || ' commented on: ' || COALESCE(v_blog_title, 'your post'));

  -- Create notification for blog author
  INSERT INTO public.user_notifications (user_id, content_type, content_id, title, message)
  VALUES (v_blog_author_id, 'comment', NEW.blog_id, 
    v_commenter_name || ' commented on your post',
    'New comment on "' || COALESCE(v_blog_title, 'your post') || '"');

  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_blog_comment_notify
  AFTER INSERT ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_blog_comment();

-- 9. Trigger to create notifications for new blogs and resources
CREATE OR REPLACE FUNCTION public.notify_new_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert notifications for all members/admins (except the creator)
  INSERT INTO public.user_notifications (user_id, content_type, content_id, title, message)
  SELECT ur.user_id, 
    CASE TG_TABLE_NAME WHEN 'blogs' THEN 'blog' ELSE 'resource' END,
    NEW.id,
    'New ' || CASE TG_TABLE_NAME WHEN 'blogs' THEN 'blog post' ELSE 'learning resource' END || ': ' || 
      CASE TG_TABLE_NAME WHEN 'blogs' THEN NEW.title ELSE NEW.title END,
    'Check out the latest content added to the platform'
  FROM public.user_roles ur
  WHERE ur.role IN ('member', 'admin')
    AND ur.user_id != CASE TG_TABLE_NAME WHEN 'blogs' THEN NEW.user_id ELSE COALESCE(NEW.created_by, '00000000-0000-0000-0000-000000000000'::uuid) END;

  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_new_blog_notify
  AFTER INSERT ON public.blogs
  FOR EACH ROW
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION public.notify_new_content();

CREATE TRIGGER on_new_resource_notify
  AFTER INSERT ON public.learning_resources
  FOR EACH ROW
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION public.notify_new_content();
