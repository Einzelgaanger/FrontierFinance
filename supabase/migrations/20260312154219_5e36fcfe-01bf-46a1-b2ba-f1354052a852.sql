
-- Fix jchamberlain email in user_profiles and make primary
UPDATE public.user_profiles 
SET email = 'jchamberlain@altreecapital.com',
    full_name = 'J Chamberlain',
    show_in_directory = true,
    user_role = 'member',
    company_id = NULL
WHERE id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b';

-- Make invteam a secondary member (hidden from directory)
UPDATE public.user_profiles 
SET show_in_directory = false,
    user_role = 'member',
    company_id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b'
WHERE id = '1929828d-3861-4fe7-a3ff-d4b137ef97d1';

-- Update existing company_members record: swap roles
-- Delete old record
DELETE FROM public.company_members 
WHERE id = 'ef1065c8-2fcb-47f0-b4d9-3ff07e0d37a8';

-- Create new company_members record with invteam as secondary under jchamberlain
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('33c9d5fd-1a00-4979-b1db-e689da0e9f1b', '1929828d-3861-4fe7-a3ff-d4b137ef97d1', 'invteam@altreecapital.com', 'Altree Capital Team', 'team_member');

-- Migrate survey data from invteam (old primary) to jchamberlain (new primary)
UPDATE public.survey_responses_2023 
SET user_id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b'
WHERE user_id = '1929828d-3861-4fe7-a3ff-d4b137ef97d1';

UPDATE public.survey_responses_2024 
SET user_id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b'
WHERE user_id = '1929828d-3861-4fe7-a3ff-d4b137ef97d1';
