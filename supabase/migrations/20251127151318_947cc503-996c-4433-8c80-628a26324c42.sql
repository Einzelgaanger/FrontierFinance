-- Create Launch+ Assessment Responses Table
CREATE TABLE public.launch_plus_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Section 1: Basic Information
  full_name TEXT NOT NULL,
  address TEXT,
  phone_whatsapp TEXT,
  email TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  fund_website TEXT,
  linkedin_profile TEXT,
  other_social_media TEXT,
  
  -- Section 2: Stage of Fund
  fund_stages TEXT[] DEFAULT '{}',
  stage_explanation TEXT,
  
  -- Section 3: Eligibility
  interested_services TEXT[] DEFAULT '{}',
  geographical_focus TEXT[] DEFAULT '{}',
  legal_status TEXT,
  operations_vs_domicile TEXT,
  capital_raised_grants NUMERIC,
  capital_raised_first_loss NUMERIC,
  capital_raised_equity NUMERIC,
  capital_raised_debt NUMERIC,
  capital_raised_senior NUMERIC,
  capital_raised_other NUMERIC,
  capital_raised_other_description TEXT,
  investments_count INTEGER,
  capital_committed NUMERIC,
  capital_disbursed NUMERIC,
  program_expectations TEXT,
  
  -- Metadata
  submission_status TEXT DEFAULT 'completed',
  ip_address TEXT,
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.launch_plus_assessments ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for the form submission)
CREATE POLICY "Allow public insert" 
  ON public.launch_plus_assessments
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Allow admins to view all assessments
CREATE POLICY "Admins can view all assessments" 
  ON public.launch_plus_assessments
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_launch_assessments_created_at ON public.launch_plus_assessments(created_at DESC);
CREATE INDEX idx_launch_assessments_email ON public.launch_plus_assessments(email);