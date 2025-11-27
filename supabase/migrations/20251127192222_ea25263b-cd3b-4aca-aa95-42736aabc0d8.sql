-- Fix Launch+ Assessment RLS policies for anonymous submissions
-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view all assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "Allow admins to view all assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "Allow all users to insert assessments" ON launch_plus_assessments;
DROP POLICY IF EXISTS "Allow public insert" ON launch_plus_assessments;

-- Create clean policies
-- Allow anonymous (unauthenticated) users to submit assessments
CREATE POLICY "Anyone can submit assessments"
ON launch_plus_assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all assessments
CREATE POLICY "Admins can view all assessments"
ON launch_plus_assessments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);