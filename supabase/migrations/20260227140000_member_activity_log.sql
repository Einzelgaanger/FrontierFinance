-- Optional: when primary creates a team member with a temp password, it expires after 24h (for display/UX)
ALTER TABLE public.company_members
ADD COLUMN IF NOT EXISTS temporary_password_expires_at TIMESTAMP WITH TIME ZONE;

-- Member activity log: primary account holders see what team members did (surveys, applications, posts, etc.)
CREATE TABLE IF NOT EXISTS public.member_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  member_user_id UUID NOT NULL,
  member_email TEXT NOT NULL,
  member_name TEXT,
  action_type TEXT NOT NULL,
  action_label TEXT,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_member_activity_log_company ON public.member_activity_log(company_user_id);
CREATE INDEX idx_member_activity_log_created ON public.member_activity_log(created_at DESC);

ALTER TABLE public.member_activity_log ENABLE ROW LEVEL SECURITY;

-- Primary (company owner) can read their company's log
CREATE POLICY "Primary can read own company activity log"
ON public.member_activity_log FOR SELECT
TO authenticated
USING (
  company_user_id = (SELECT auth.uid())
);

-- Only service/backend should insert (via Edge Function or RPC); restrict insert to authenticated and allow when user is logging their own action as member
CREATE POLICY "Allow insert for own company member actions"
ON public.member_activity_log FOR INSERT
TO authenticated
WITH CHECK (
  member_user_id = (SELECT auth.uid())
  AND company_user_id IN (
    SELECT company_user_id FROM public.company_members WHERE member_user_id = (SELECT auth.uid())
  )
);

-- Admins can read all
CREATE POLICY "Admins can read all activity log"
ON public.member_activity_log FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = (SELECT auth.uid()) AND role = 'admin')
);
