
-- Create company_members table to link secondary users to a primary company account
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_user_id UUID NOT NULL,  -- the primary company account (user_profiles.id)
    member_user_id UUID NOT NULL,   -- the secondary member's auth user id
    member_email TEXT NOT NULL,
    member_name TEXT,
    role_in_company TEXT DEFAULT 'team_member',
    is_active BOOLEAN DEFAULT true,
    invited_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(member_user_id),
    UNIQUE(member_email)
);

-- Enable RLS
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;

-- Primary account holders can manage their own team members
CREATE POLICY "Primary users can manage their company members"
ON public.company_members
FOR ALL
TO authenticated
USING (company_user_id = (SELECT auth.uid()))
WITH CHECK (company_user_id = (SELECT auth.uid()));

-- Admins can manage all company members
CREATE POLICY "Admins can manage all company members"
ON public.company_members
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = (SELECT auth.uid())
        AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = (SELECT auth.uid())
        AND role = 'admin'
    )
);

-- Secondary members can view their own membership
CREATE POLICY "Members can view their own membership"
ON public.company_members
FOR SELECT
TO authenticated
USING (member_user_id = (SELECT auth.uid()));

-- Add index for lookups
CREATE INDEX idx_company_members_company ON public.company_members(company_user_id);
CREATE INDEX idx_company_members_member ON public.company_members(member_user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_company_members_updated_at
BEFORE UPDATE ON public.company_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
