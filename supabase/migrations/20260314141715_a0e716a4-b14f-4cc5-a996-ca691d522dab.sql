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
    SELECT 
      up.id as company_id,
      up.company_name,
      up.profile_picture_url as company_logo,
      COALESCE(uc.total_points, 0) as points
    FROM user_profiles up
    LEFT JOIN user_credits uc ON uc.user_id = up.id
    WHERE up.show_in_directory = true
      AND EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = up.id AND ur.role = 'member')
      AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = up.id AND ur.role = 'admin')
    
    UNION ALL
    
    SELECT
      cm.company_user_id as company_id,
      (SELECT company_name FROM user_profiles WHERE id = cm.company_user_id) as company_name,
      (SELECT profile_picture_url FROM user_profiles WHERE id = cm.company_user_id) as company_logo,
      COALESCE(uc.total_points, 0) as points
    FROM company_members cm
    LEFT JOIN user_credits uc ON uc.user_id = cm.member_user_id
    WHERE cm.is_active = true
      AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = cm.company_user_id AND ur.role = 'admin')
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