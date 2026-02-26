-- ============================================================
-- Set all users (except team admins and test accounts) to member
-- ============================================================
-- Run this in Supabase SQL Editor.
-- Team admins (unchanged): lisa, alfred, arnold, drew, gila, alexandra @ frontierfinance.org
-- Test accounts excluded: *.test@escpnetwork.net
-- Everyone else: role = 'member' (they can upload applications later via profile).
-- ============================================================

BEGIN;

-- 1. Update user_roles: set role = 'member' for everyone except team admins and test accounts
UPDATE public.user_roles ur
SET role = 'member',
    updated_at = now()
FROM auth.users u
WHERE ur.user_id = u.id
  AND LOWER(TRIM(u.email)) NOT IN (
    'lisa@frontierfinance.org',
    'alfred@frontierfinance.org',
    'arnold@frontierfinance.org',
    'drew@frontierfinance.org',
    'gila@frontierfinance.org',
    'alexandra@frontierfinance.org'
  )
  AND (u.email IS NULL OR u.email NOT ILIKE '%.test@escpnetwork.net');

-- 2. Insert user_roles for any auth users who don't have a row yet (e.g. created before trigger)
--    and are not team admins / test accounts → give them 'member'
--    (user_roles table has: user_id, role, created_at, updated_at — no email column)
INSERT INTO public.user_roles (user_id, role, created_at, updated_at)
SELECT u.id,
       'member',
       now(),
       now()
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id)
  AND LOWER(TRIM(u.email)) NOT IN (
    'lisa@frontierfinance.org',
    'alfred@frontierfinance.org',
    'arnold@frontierfinance.org',
    'drew@frontierfinance.org',
    'gila@frontierfinance.org',
    'alexandra@frontierfinance.org'
  )
  AND (u.email IS NULL OR u.email NOT ILIKE '%.test@escpnetwork.net')
ON CONFLICT (user_id) DO NOTHING;

-- 3. Sync user_profiles.user_role to 'member' for the same set (if column exists)
DO $$
BEGIN
  UPDATE public.user_profiles up
  SET user_role = 'member',
      updated_at = now()
  FROM auth.users u
  WHERE up.id = u.id
    AND LOWER(TRIM(u.email)) NOT IN (
      'lisa@frontierfinance.org',
      'alfred@frontierfinance.org',
      'arnold@frontierfinance.org',
      'drew@frontierfinance.org',
      'gila@frontierfinance.org',
      'alexandra@frontierfinance.org'
    )
    AND (u.email IS NULL OR u.email NOT ILIKE '%.test@escpnetwork.net');
EXCEPTION WHEN undefined_column THEN NULL;  -- skip if user_role not in schema
END $$;

COMMIT;

-- Optional: show counts
SELECT
  (SELECT count(*) FROM public.user_roles WHERE role = 'admin')   AS admins_unchanged,
  (SELECT count(*) FROM public.user_roles WHERE role = 'member') AS members_total,
  (SELECT count(*) FROM public.user_roles WHERE role = 'viewer') AS viewers_remaining;
