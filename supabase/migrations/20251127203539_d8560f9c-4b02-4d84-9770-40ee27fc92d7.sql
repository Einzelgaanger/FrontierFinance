-- COMPLETE REBUILD: Launch+ Assessment Table from Scratch
-- This migration drops everything and rebuilds with clean, simple policies

-- Step 1: Drop the existing table completely (CASCADE removes all dependencies)
DROP TABLE IF EXISTS public.launch_plus_assessments CASCADE;

-- Step 2: Recreate the table with all fields
CREATE TABLE public.launch_plus_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Contact Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_whatsapp TEXT,
  address TEXT,
  
  -- Fund Information
  fund_name TEXT NOT NULL,
  fund_website TEXT,
  linkedin_profile TEXT,
  other_social_media TEXT,
  
  -- Fund Stage
  fund_stages TEXT[],
  stage_explanation TEXT,
  
  -- Eligibility Information
  interested_services TEXT[],
  geographical_focus TEXT[],
  legal_status TEXT,
  operations_vs_domicile TEXT,
  
  -- Capital Information
  capital_raised_grants NUMERIC,
  capital_raised_first_loss NUMERIC,
  capital_raised_equity NUMERIC,
  capital_raised_debt NUMERIC,
  capital_raised_senior NUMERIC,
  capital_raised_other NUMERIC,
  capital_raised_other_description TEXT,
  
  -- Investment Information
  investments_count INTEGER,
  capital_committed NUMERIC,
  capital_disbursed NUMERIC,
  
  -- Program Expectations
  program_expectations TEXT,
  
  -- Metadata
  submission_status TEXT DEFAULT 'completed',
  ip_address TEXT,
  user_agent TEXT
);

-- Step 3: Enable RLS
ALTER TABLE public.launch_plus_assessments ENABLE ROW LEVEL SECURITY;

-- Step 4: Create ONE simple INSERT policy that allows ANYONE to submit (no auth required)
CREATE POLICY "anyone_can_submit_assessment"
ON public.launch_plus_assessments
FOR INSERT
TO public
WITH CHECK (true);

-- Step 5: Create ONE simple SELECT policy for admins only
CREATE POLICY "admins_view_assessments"
ON public.launch_plus_assessments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Step 6: Create index for better query performance
CREATE INDEX idx_launch_plus_email ON public.launch_plus_assessments(email);
CREATE INDEX idx_launch_plus_created ON public.launch_plus_assessments(created_at DESC);

-- Verify the setup
SELECT 
  'Table created successfully' as status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'launch_plus_assessments') as policy_count;