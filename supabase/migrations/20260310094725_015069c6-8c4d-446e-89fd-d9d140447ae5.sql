
-- Re-add the show_in_directory column that was lost in backup restore
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS show_in_directory boolean DEFAULT true;

-- Hide secondary Business Partners account
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '355386bf-263e-4d12-b2aa-3243365291e4';

-- Hide test accounts
UPDATE public.user_profiles SET show_in_directory = false WHERE email IN ('admin@cff.com', 'member@cff.com', 'viewer@cff.com');

-- Hide staff/test emails
UPDATE public.user_profiles SET show_in_directory = false WHERE email LIKE '%.test@escpnetwork.net';

-- Delete duplicate survey_2024 from secondary Business Partners
DELETE FROM public.survey_responses_2024 WHERE user_id = '355386bf-263e-4d12-b2aa-3243365291e4';

-- Link secondary as team member of primary
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('f499760d-465b-4521-951f-6f440d0261a2', '355386bf-263e-4d12-b2aa-3243365291e4', 'farynv@gmail.com', 'BUSINESS PARTNERS LTD', 'team_member')
ON CONFLICT DO NOTHING;

-- Re-delete test account data
DELETE FROM public.user_roles WHERE user_id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');
DELETE FROM public.user_profiles WHERE id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');
DELETE FROM public.activity_log WHERE user_id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');

-- Also hide the previously-handled accounts (Dome duplicate, Mirepa duplicate, Individual)
-- These were set before the backup wiped the column
UPDATE public.user_profiles SET show_in_directory = false WHERE email IN (
  'dome@dome.com',
  'individual@test.com'
);
