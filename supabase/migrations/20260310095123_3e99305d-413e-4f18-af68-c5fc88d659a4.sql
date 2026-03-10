
-- 1. Transfer all survey responses from e.arthur to t.wiredu
UPDATE public.survey_responses_2021 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE public.survey_responses_2022 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE public.survey_responses_2023 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';
UPDATE public.survey_responses_2024 SET user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';

-- 2. Transfer existing team member from e.arthur to t.wiredu
UPDATE public.company_members SET company_user_id = '43415fb3-cd45-4c37-8d8e-8f945eaf89b2' WHERE company_user_id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';

-- 3. Link e.arthur as team member under t.wiredu
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('43415fb3-cd45-4c37-8d8e-8f945eaf89b2', '42a47d5b-3e27-4bdd-a2ed-045d23151874', 'e.arthur@wangaracapital.com', 'Wangara Green Ventures', 'team_member')
ON CONFLICT DO NOTHING;

-- 4. Hide e.arthur from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = '42a47d5b-3e27-4bdd-a2ed-045d23151874';

-- 5. Delete Individual account entirely
DELETE FROM public.survey_responses_2021 WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.survey_responses_2022 WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.survey_responses_2023 WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.survey_responses_2024 WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.company_members WHERE company_user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2' OR member_user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.user_roles WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.activity_log WHERE user_id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
DELETE FROM public.user_profiles WHERE id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2';
