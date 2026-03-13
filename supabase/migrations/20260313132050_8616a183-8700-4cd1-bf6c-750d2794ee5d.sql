
CREATE TABLE public.password_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  user_id uuid NOT NULL,
  user_email text NOT NULL,
  encrypted_password text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  viewed_at timestamptz,
  is_used boolean NOT NULL DEFAULT false
);

ALTER TABLE public.password_links ENABLE ROW LEVEL SECURITY;

-- Only admins can create and view password links
CREATE POLICY "Admins can manage password links"
ON public.password_links
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = (SELECT auth.uid()) AND user_roles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = (SELECT auth.uid()) AND user_roles.role = 'admin'));

-- Allow anon to read by token (for the view-password page)
CREATE POLICY "Anyone can read by token"
ON public.password_links
FOR SELECT
TO anon
USING (true);
