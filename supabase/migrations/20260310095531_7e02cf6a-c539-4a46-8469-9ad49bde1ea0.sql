
-- Link Renew Strategies as team member under ReNew Capital
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('88275e63-4e66-4d8b-871b-7cf18938764a', '36c6918f-57c2-4bc4-a511-a85a1c490cc3', 'ldavis@renewstrategies.com', 'Renew Strategies', 'team_member')
ON CONFLICT DO NOTHING;

-- Hide secondary from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '36c6918f-57c2-4bc4-a511-a85a1c490cc3';
