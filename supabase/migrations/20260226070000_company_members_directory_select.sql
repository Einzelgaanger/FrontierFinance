-- Allow all authenticated users (members, viewers, admins) to read company_members
-- so the network directory can filter to distinct primaries and show the same list everywhere.
-- Without this, members/viewers only see their own row (member_user_id = auth.uid()) and
-- secondaryMemberIds is incomplete, so the directory shows everyone instead of distinct companies.
CREATE POLICY "Authenticated can read company_members for directory"
ON public.company_members
FOR SELECT
TO authenticated
USING (true);
