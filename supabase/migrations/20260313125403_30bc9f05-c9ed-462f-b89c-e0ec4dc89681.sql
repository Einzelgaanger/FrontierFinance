
-- Make colin primary: show_in_directory=true, company_id=NULL
UPDATE public.user_profiles 
SET show_in_directory = true,
    company_id = NULL,
    full_name = 'Colin'
WHERE id = 'bdc82c5f-2c7d-4613-9faf-8461232627bd';

-- Make julia secondary: show_in_directory=false, company_id=colin's ID
UPDATE public.user_profiles 
SET show_in_directory = false,
    company_id = 'bdc82c5f-2c7d-4613-9faf-8461232627bd'
WHERE id = '3c3178d3-4580-4f1c-bd25-06a5a1f39e73';

-- Delete old company_members record
DELETE FROM public.company_members 
WHERE id = '553eb6b3-c6ad-4a57-b361-e119cd9b83e9';

-- Create new company_members: julia as team_member under colin
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('bdc82c5f-2c7d-4613-9faf-8461232627bd', '3c3178d3-4580-4f1c-bd25-06a5a1f39e73', 'julia@lineacap.com', 'Julia', 'team_member');

-- Migrate 2022 survey data from julia to colin
UPDATE public.survey_responses_2022 
SET user_id = 'bdc82c5f-2c7d-4613-9faf-8461232627bd'
WHERE user_id = '3c3178d3-4580-4f1c-bd25-06a5a1f39e73';
