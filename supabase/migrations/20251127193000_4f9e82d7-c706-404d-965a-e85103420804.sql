-- Emergency fix for Launch+ Assessment RLS
-- This ensures anonymous users can submit assessments in production

-- First, disable RLS temporarily to clean up
ALTER TABLE launch_plus_assessments DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'launch_plus_assessments') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON launch_plus_assessments', r.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE launch_plus_assessments ENABLE ROW LEVEL SECURITY;

-- Create a permissive policy for anonymous INSERT
CREATE POLICY "allow_anon_insert_assessments"
ON launch_plus_assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create admin SELECT policy
CREATE POLICY "allow_admin_select_assessments"
ON launch_plus_assessments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Verify the policies are created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'launch_plus_assessments'
ORDER BY policyname;