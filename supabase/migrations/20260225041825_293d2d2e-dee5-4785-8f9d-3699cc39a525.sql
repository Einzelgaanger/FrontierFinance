
-- =====================================================
-- FIX ALL "Not provided" company names from survey data
-- AND consolidate Agri Frontier duplicates
-- =====================================================

-- Step 1: Update company_name and full_name from survey_responses_2024 (most recent first)
UPDATE user_profiles up
SET 
  company_name = sr.organisation_name,
  full_name = CASE WHEN up.full_name IS NULL OR up.full_name = '' OR up.full_name = 'Not provided' THEN sr.fund_name ELSE up.full_name END
FROM survey_responses_2024 sr
WHERE up.id = sr.user_id
  AND (up.company_name = 'Not provided' OR up.company_name IS NULL);

-- Step 2: Fill remaining from survey_responses_2023
UPDATE user_profiles up
SET 
  company_name = sr.organisation_name,
  full_name = CASE WHEN up.full_name IS NULL OR up.full_name = '' OR up.full_name = 'Not provided' THEN sr.fund_name ELSE up.full_name END
FROM survey_responses_2023 sr
WHERE up.id = sr.user_id
  AND (up.company_name = 'Not provided' OR up.company_name IS NULL);

-- Step 3: Fill remaining from survey_responses_2022
UPDATE user_profiles up
SET 
  company_name = sr.organisation,
  full_name = CASE WHEN up.full_name IS NULL OR up.full_name = '' OR up.full_name = 'Not provided' THEN sr.name ELSE up.full_name END
FROM survey_responses_2022 sr
WHERE up.id = sr.user_id
  AND (up.company_name = 'Not provided' OR up.company_name IS NULL);

-- Step 4: Fill remaining from survey_responses_2021
UPDATE user_profiles up
SET 
  company_name = sr.firm_name,
  full_name = CASE WHEN up.full_name IS NULL OR up.full_name = '' OR up.full_name = 'Not provided' THEN sr.participant_name ELSE up.full_name END
FROM survey_responses_2021 sr
WHERE up.id = sr.user_id
  AND (up.company_name = 'Not provided' OR up.company_name IS NULL);

-- Step 5: Consolidate Agri Frontier - move tadlam's survey to aritchie's account
-- aritchie (9622f771) is the primary (member), tadlam (e8845639) has a 2024 survey
UPDATE survey_responses_2024
SET user_id = '9622f771-0e7d-423c-8ca5-13d0fac9edd3'
WHERE user_id = 'e8845639-76b7-48c5-b2c3-30c3bd97f282';

-- Add tadlam as a company member under aritchie
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, role_in_company, invited_by)
VALUES (
  '9622f771-0e7d-423c-8ca5-13d0fac9edd3',
  'e8845639-76b7-48c5-b2c3-30c3bd97f282',
  'tadlam@agrifrontier.com',
  'Agri Frontier Team Member',
  'team_member',
  '9622f771-0e7d-423c-8ca5-13d0fac9edd3'
) ON CONFLICT DO NOTHING;

-- Step 6: Fix the Miarakap duplicate (two emails: e.cotsoyannis and e.ravohitrarivo)
-- e.cotsoyannis (c025ee9d) has surveys in 2021-2024, make them primary
-- Check if e.ravohitrarivo has any surveys
UPDATE survey_responses_2022
SET user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
WHERE user_id = '5ce8ae5e-6e76-4c92-a83d-7a5fe0306a53'
  AND NOT EXISTS (
    SELECT 1 FROM survey_responses_2022 WHERE user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
  );

UPDATE survey_responses_2023
SET user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
WHERE user_id = '5ce8ae5e-6e76-4c92-a83d-7a5fe0306a53'
  AND NOT EXISTS (
    SELECT 1 FROM survey_responses_2023 WHERE user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
  );

UPDATE survey_responses_2024
SET user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
WHERE user_id = '5ce8ae5e-6e76-4c92-a83d-7a5fe0306a53'
  AND NOT EXISTS (
    SELECT 1 FROM survey_responses_2024 WHERE user_id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
  );

-- Add e.ravohitrarivo as company member under e.cotsoyannis
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, role_in_company, invited_by)
VALUES (
  'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9',
  '5ce8ae5e-6e76-4c92-a83d-7a5fe0306a53',
  'e.ravohitrarivo@miarakap.com',
  'Miarakap Team Member',
  'team_member',
  'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9'
) ON CONFLICT DO NOTHING;

-- Update Miarakap company name in profiles
UPDATE user_profiles SET company_name = 'Miarakap' WHERE id = 'c025ee9d-a7e3-4ab8-a049-21253e3b8ed9' AND (company_name = 'Not provided' OR company_name IS NULL);
UPDATE user_profiles SET company_name = 'Miarakap' WHERE id = '5ce8ae5e-6e76-4c92-a83d-7a5fe0306a53' AND (company_name = 'Not provided' OR company_name IS NULL);
