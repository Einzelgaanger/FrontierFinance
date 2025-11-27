-- Fix Launch+ Assessment submission policy to allow both authenticated and anonymous users

-- Drop existing policy
DROP POLICY IF EXISTS "Allow public insert on launch_plus_assessments" ON launch_plus_assessments;

-- Create new policy that allows both authenticated and anonymous users to insert
CREATE POLICY "Allow all users to insert assessments"
ON launch_plus_assessments
FOR INSERT
TO public
WITH CHECK (true);

-- Ensure admins can still view all assessments
DROP POLICY IF EXISTS "Allow admins to view all assessments" ON launch_plus_assessments;

CREATE POLICY "Allow admins to view all assessments"
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