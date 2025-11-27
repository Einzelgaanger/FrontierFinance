-- Fix RLS policy for anonymous submissions
DROP POLICY IF EXISTS "public_can_submit_assessment" ON launch_plus_assessments;

-- Create policy for anon role (unauthenticated users)
CREATE POLICY "anon_can_submit_assessment"
ON launch_plus_assessments
FOR INSERT
TO anon
WITH CHECK (true);

-- Also grant INSERT to anon role explicitly
GRANT INSERT ON launch_plus_assessments TO anon;