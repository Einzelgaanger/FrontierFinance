
-- Transfer 2021 survey from Opes-Lcef Fund (8cf5) to Opens-Lcef (59e3)
UPDATE survey_responses_2021 SET user_id = '59e39d98-57c7-4ce5-9544-4c31d2704577' WHERE user_id = '8cf584b0-abbe-4f5d-a213-b764773babce';

-- Add secondary as team member under primary
INSERT INTO company_members (company_user_id, member_user_id, member_email, role_in_company)
VALUES ('59e39d98-57c7-4ce5-9544-4c31d2704577', '8cf584b0-abbe-4f5d-a213-b764773babce', 'arthi.ramasubramanian@opesfund.eu', 'team_member')
ON CONFLICT DO NOTHING;

-- Make primary visible in directory
UPDATE user_profiles SET show_in_directory = true WHERE id = '59e39d98-57c7-4ce5-9544-4c31d2704577';
UPDATE user_profiles SET show_in_directory = false WHERE id = '8cf584b0-abbe-4f5d-a213-b764773babce';
