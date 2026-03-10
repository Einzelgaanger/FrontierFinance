
-- Transfer 2021 survey from secondary (arthi) to primary (Aarthi)
UPDATE public.survey_responses_2021 SET user_id = '59e39d98-57c7-4ce5-9544-4c31d2704577' WHERE user_id = '8cf584b0-abbe-4f5d-a213-b764773babce';

-- Link secondary as team member
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('59e39d98-57c7-4ce5-9544-4c31d2704577', '8cf584b0-abbe-4f5d-a213-b764773babce', 'arthi.ramasubramanian@opesfund.eu', 'Opes-Lcef Fund', 'team_member')
ON CONFLICT DO NOTHING;

-- Hide secondary from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '8cf584b0-abbe-4f5d-a213-b764773babce';
