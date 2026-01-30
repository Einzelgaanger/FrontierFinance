-- Allow admins to update user_roles and user_profiles when approving applications.
-- Without this, RLS blocks the admin from updating the applicant's row (auth.uid() != applicant id).

-- Ensure get_user_role_safe exists (SECURITY DEFINER so it bypasses RLS when checking admin).
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
    user_role_value TEXT;
BEGIN
    SELECT role INTO user_role_value
    FROM public.user_roles
    WHERE user_id = user_uuid
    LIMIT 1;
    RETURN COALESCE(user_role_value, 'viewer');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'viewer';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_role_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_safe(UUID) TO anon;

-- Admins can update any user's role (for application approval).
CREATE POLICY "Admins can update any user role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.get_user_role_safe(auth.uid()) = 'admin')
WITH CHECK (true);

-- Admins can update user_profiles (e.g. user_role) for application approval.
CREATE POLICY "Admins can update user_profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.get_user_role_safe(auth.uid()) = 'admin')
WITH CHECK (true);
