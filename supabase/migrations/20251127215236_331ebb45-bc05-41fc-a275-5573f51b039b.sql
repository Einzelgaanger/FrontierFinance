-- Fix Launch+ Assessment RLS to allow public submissions
-- Drop all existing policies
DROP POLICY IF EXISTS "anyone_can_submit_assessment" ON launch_plus_assessments;
DROP POLICY IF EXISTS "admins_view_assessments" ON launch_plus_assessments;

-- Create policy allowing ANYONE (including unauthenticated users) to submit
CREATE POLICY "public_can_submit_assessment"
ON launch_plus_assessments
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for admins to view all submissions
CREATE POLICY "admins_can_view_assessments"
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