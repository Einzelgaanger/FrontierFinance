-- ============================================================
-- CFF Team Admins Setup
-- ============================================================
-- STEP 1 - Create all 6 team accounts in Supabase Auth (one command):
--   From project root:  npm run create-team-admins
--   (Uses scripts/create-team-admins.js; requires .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
--   Default password for all: ChangeMe123!
--
-- STEP 2 - Run this SQL in Supabase SQL Editor (assigns admin role and user_profiles).
--
-- Team members created by the script:
--   Lisa Mwende        <lisa@frontierfinance.org>
--   Alfred Mulinge    <alfred@frontierfinance.org>  (super admin)
--   Arnold Byarugaba  <arnold@frontierfinance.org>
--   Drew von Glahn    <drew@frontierfinance.org>
--   Gila Norich       <gila@frontierfinance.org>
--   Alexandra von Glahn <alexandra@frontierfinance.org>
-- ============================================================

BEGIN;

-- 1a. Set role = admin in user_roles (source of truth for get_user_role / sidebar / RLS)
UPDATE public.user_roles ur
SET role = 'admin',
    updated_at = now()
FROM auth.users u
WHERE ur.user_id = u.id
  AND LOWER(u.email) IN (
    'lisa@frontierfinance.org',
    'alfred@frontierfinance.org',
    'arnold@frontierfinance.org',
    'drew@frontierfinance.org',
    'gila@frontierfinance.org',
    'alexandra@frontierfinance.org'
  );

-- 1b. Set is_super_admin for Alfred only (if column exists)
DO $$
BEGIN
  UPDATE public.user_roles ur
  SET is_super_admin = (u.email = 'alfred@frontierfinance.org'),
      updated_at = now()
  FROM auth.users u
  WHERE ur.user_id = u.id
    AND LOWER(u.email) IN (
      'lisa@frontierfinance.org',
      'alfred@frontierfinance.org',
      'arnold@frontierfinance.org',
      'drew@frontierfinance.org',
      'gila@frontierfinance.org',
      'alexandra@frontierfinance.org'
    );
EXCEPTION WHEN undefined_column THEN NULL;  -- skip if is_super_admin not in schema
END $$;

-- 2. Ensure user_profiles exist (so they can use PortIQ and My Profile)
INSERT INTO public.user_profiles (id, company_name, full_name, email)
SELECT u.id, 'CFF Team',
  CASE u.email
    WHEN 'lisa@frontierfinance.org' THEN 'Lisa Mwende'
    WHEN 'alfred@frontierfinance.org' THEN 'Alfred Mulinge'
    WHEN 'arnold@frontierfinance.org' THEN 'Arnold Byarugaba'
    WHEN 'drew@frontierfinance.org' THEN 'Drew von Glahn'
    WHEN 'gila@frontierfinance.org' THEN 'Gila Norich'
    WHEN 'alexandra@frontierfinance.org' THEN 'Alexandra von Glahn'
    ELSE 'CFF Team'
  END,
  u.email
FROM auth.users u
WHERE LOWER(u.email) IN (
  'lisa@frontierfinance.org',
  'alfred@frontierfinance.org',
  'arnold@frontierfinance.org',
  'drew@frontierfinance.org',
  'gila@frontierfinance.org',
  'alexandra@frontierfinance.org'
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  updated_at = now();

-- 3. Set user_role = 'admin' in user_profiles (so Admin list / network show correct badge)
DO $$
BEGIN
  UPDATE public.user_profiles up
  SET user_role = 'admin', updated_at = now()
  FROM auth.users u
  WHERE up.id = u.id
    AND LOWER(u.email) IN (
      'lisa@frontierfinance.org',
      'alfred@frontierfinance.org',
      'arnold@frontierfinance.org',
      'drew@frontierfinance.org',
      'gila@frontierfinance.org',
      'alexandra@frontierfinance.org'
    );
EXCEPTION WHEN undefined_column THEN NULL;  -- skip if user_role not in schema
END $$;

COMMIT;
