-- CRITICAL FIX: Allow anonymous Launch+ Assessment submissions in production
-- This migration ensures anon users can submit assessments without authentication

-- Step 1: Disable RLS temporarily
ALTER TABLE launch_plus_assessments DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies completely
DROP POLICY IF EXISTS "allow_anon_insert_assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "allow_admin_select_assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "allow_anon_insert_launch_plus" ON launch_plus_assessments;
DROP POLICY IF EXISTS "Public can submit assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "Admins can view assessments" ON launch_plus_assessments;

-- Step 3: Re-enable RLS
ALTER TABLE launch_plus_assessments ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, permissive INSERT policy for everyone (anon + authenticated)
CREATE POLICY "public_can_insert_assessments"
ON launch_plus_assessments
FOR INSERT
WITH CHECK (true);

-- Step 5: Create admin SELECT policy
CREATE POLICY "admins_can_view_assessments"
ON launch_plus_assessments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Verify policies
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'launch_plus_assessments';