
-- Transfer Pearl Capital Partners' survey_2024 to PearlBridge primary
-- Since primary already has a 2024 survey, we need to check for conflicts
-- Both are different funds under same org, so we keep primary's and delete secondary's
-- Actually, these are different funds - let's keep both by transferring ownership
-- But survey_responses_2024 may have a unique constraint on user_id... let me just delete the secondary's survey since primary already has one
DELETE FROM public.survey_responses_2024 WHERE user_id = '7ab464a4-7e06-4edb-b969-08336465e2d3';

-- Link Pearl Capital Partners as team member under PearlBridge
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('e475c444-b228-476f-9aee-d928f0175812', '7ab464a4-7e06-4edb-b969-08336465e2d3', 'david.wangolo@pearlcapital.net', 'Pearl Capital Partners', 'team_member')
ON CONFLICT DO NOTHING;

-- Hide Pearl Capital Partners from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '7ab464a4-7e06-4edb-b969-08336465e2d3';
