
-- Transfer all survey responses from old primary (e.arthur: 42a47d5b) to new primary (t.wiredu: 43415fb3)
UPDATE survey_responses_2021 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE survey_responses_2022 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE survey_responses_2023 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE survey_responses_2024 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';

-- Transfer team member (k.owusu-sarfo) to new primary
UPDATE company_members SET company_user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE company_user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';

-- Add e.arthur as a secondary member under new primary
INSERT INTO company_members (company_user_id, member_user_id, member_email, role_in_company)
VALUES ('43415fb3-cd45-4c37-8d8e-8f945eaf89b2', '42a47d5b-3e27-4bdd-a2ed-045d23151874', 'e.arthur@wangaracapital.com', 'team_member')
ON CONFLICT DO NOTHING;

-- Update directory visibility: new primary visible, old primary hidden
UPDATE user_profiles SET show_in_directory = true WHERE id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2';
UPDATE user_profiles SET show_in_directory = false WHERE id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
