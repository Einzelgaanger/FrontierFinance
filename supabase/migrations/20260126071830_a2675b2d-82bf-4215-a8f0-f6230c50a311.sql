
-- Reset password for vfraser@jengacapital.com
UPDATE auth.users
SET 
  encrypted_password = crypt('@ESCPNetwork2025#', gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  updated_at = NOW()
WHERE email = 'vfraser@jengacapital.com';

-- Update profile with correct company name
UPDATE user_profiles
SET 
  company_name = 'Jenga Capital',
  full_name = 'Valerie Fraser'
WHERE email = 'vfraser@jengacapital.com';

-- Update to member role
UPDATE user_roles
SET role = 'member'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'vfraser@jengacapital.com');

SELECT '✓ Password reset to: @ESCPNetwork2025# | Role: member' as result;
