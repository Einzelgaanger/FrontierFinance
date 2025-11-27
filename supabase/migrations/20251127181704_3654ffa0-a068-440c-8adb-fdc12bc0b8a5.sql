-- Enable RLS on launch_plus_assessments if not already enabled
ALTER TABLE launch_plus_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (no authentication required)
CREATE POLICY "Allow public insert on launch_plus_assessments"
ON launch_plus_assessments
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow admins to view all assessments
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