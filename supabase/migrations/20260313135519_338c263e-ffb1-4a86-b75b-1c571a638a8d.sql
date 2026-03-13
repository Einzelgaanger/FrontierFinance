
-- Make Alfred the primary CFF team account, others become his team members
-- Step 1: Set Alfred as primary (show_in_directory = false since staff shouldn't appear in directory, but company_id = NULL as primary)
UPDATE public.user_profiles
SET company_id = NULL, updated_at = now()
WHERE email = 'alfred@frontierfinance.org';

-- Step 2: Link other CFF staff as team members under Alfred
UPDATE public.user_profiles up
SET company_id = (SELECT id FROM public.user_profiles WHERE email = 'alfred@frontierfinance.org'),
    updated_at = now()
FROM auth.users u
WHERE up.id = u.id
  AND LOWER(u.email) IN (
    'lisa@frontierfinance.org',
    'arnold@frontierfinance.org',
    'drew@frontierfinance.org',
    'gila@frontierfinance.org',
    'alexandra@frontierfinance.org'
  );

-- Step 3: Ensure company_members records exist for each non-Alfred staff member
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company, is_active)
SELECT 
  (SELECT id FROM public.user_profiles WHERE email = 'alfred@frontierfinance.org'),
  u.id,
  u.email,
  CASE u.email
    WHEN 'lisa@frontierfinance.org' THEN 'Lisa Mwende'
    WHEN 'arnold@frontierfinance.org' THEN 'Arnold Byarugaba'
    WHEN 'drew@frontierfinance.org' THEN 'Drew von Glahn'
    WHEN 'gila@frontierfinance.org' THEN 'Gila Norich'
    WHEN 'alexandra@frontierfinance.org' THEN 'Alexandra von Glahn'
  END,
  'team_member',
  true
FROM auth.users u
WHERE LOWER(u.email) IN (
  'lisa@frontierfinance.org',
  'arnold@frontierfinance.org',
  'drew@frontierfinance.org',
  'gila@frontierfinance.org',
  'alexandra@frontierfinance.org'
)
ON CONFLICT (company_user_id, member_user_id) DO UPDATE SET
  member_email = EXCLUDED.member_email,
  member_name = EXCLUDED.member_name,
  updated_at = now();

-- Remove any company_members record where Alfred is listed as a member (he's the primary)
DELETE FROM public.company_members
WHERE member_user_id = (SELECT id FROM public.user_profiles WHERE email = 'alfred@frontierfinance.org')
  AND company_user_id != (SELECT id FROM public.user_profiles WHERE email = 'alfred@frontierfinance.org');
