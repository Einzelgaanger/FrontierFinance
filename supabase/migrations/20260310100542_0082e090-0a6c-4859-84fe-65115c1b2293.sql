
-- Link Mirepa Capital as team member under MIREPA Investment Advisors
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('fe390a96-aad0-4b1c-aeab-293619f882e1', 'e6be68d4-76e7-4331-9528-3306c73c4aeb', 'sam@mirepacapital.com', 'Mirepa Capital', 'team_member')
ON CONFLICT DO NOTHING;

-- Hide Mirepa Capital from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = 'e6be68d4-76e7-4331-9528-3306c73c4aeb';
