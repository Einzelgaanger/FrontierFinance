
-- 1. Link Africa Trust Group as team member under ATG Samata primary
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('187bee69-9706-4dac-8cc1-1b2a10d350a2', '98784e9a-6ab7-4d91-b50f-6a06cd9bdc7b', 'lelemba@africatrustgroup.com', 'Africa Trust Group', 'team_member');

-- 2. Hide Africa Trust Group from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '98784e9a-6ab7-4d91-b50f-6a06cd9bdc7b';
