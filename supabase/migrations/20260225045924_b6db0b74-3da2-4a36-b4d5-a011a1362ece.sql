
-- Fix wCap Limited: consolidate under primary user d03276a1 (nyeji@womencapital.co, has surveys)
-- Update profile for primary
UPDATE public.user_profiles SET company_name = 'wCap Limited', full_name = 'Nyeji' WHERE id = 'd03276a1-c2e2-4b9d-84e2-8d98befcc6c4' AND (company_name IS NULL OR company_name = 'Not provided');

-- Make yvonne@womencapital.co a secondary member of wCap Limited
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('d03276a1-c2e2-4b9d-84e2-8d98befcc6c4', '4098bd08-0431-4070-bd2a-f7447f8c01f4', 'yvonne@womencapital.co', 'Yvonne', 'team_member')
ON CONFLICT DO NOTHING;

UPDATE public.user_profiles SET company_name = 'wCap Limited' WHERE id = '4098bd08-0431-4070-bd2a-f7447f8c01f4';

-- Fix remaining "Not provided" profiles based on email domains
UPDATE public.user_profiles SET company_name = 'Comoé Capital' WHERE id IN ('a2fe036e-3880-4d39-9485-6590e7df3f0c', 'fd45921d-e553-4809-9c6c-adaab56dc79e') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'First Circle Capital' WHERE id = '0d4dbfdb-7274-4c9b-86a9-6726eef12950' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Lofty Inc' WHERE id IN ('af146605-2884-4ee0-9e18-5c0c934e7307', '36e6551d-4557-428b-a56c-43428e99a547') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Shortlist' WHERE id = 'a7917fd6-4dcb-4231-afee-afb4c917ea9c' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'MMFM Ltd' WHERE id = '5d6c3623-3958-4f3a-9799-e70ac5e7010d' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Anza Holdings' WHERE id = '919a9736-2655-445c-a32b-fde53d98d0d2' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Aruwa Capital' WHERE id = 'a86b4889-6c1a-4994-a3e6-11dd2554bd66' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Samawati Capital Partners' WHERE id = '025dbeea-df9c-41c6-ae51-dd8d8a231df7' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Brightmore Capital' WHERE id IN ('b263d761-3317-42ac-9a24-36f0c5a3d46f', 'db19aad9-05a9-4504-bd48-65fe830ea377') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Mirepa Capital' WHERE id IN ('4db134ee-ff65-44c8-9299-4881491ee7bf', 'e6be68d4-76e7-4331-9528-3306c73c4aeb') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Unconventional Capital' WHERE id = 'ac3e840f-7c18-4430-823e-77718838aebd' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'True Footprint' WHERE id = 'cddc1c96-e869-4bf6-9844-77128db1ac39' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Viktoria' WHERE id IN ('a1bdf56b-3974-415a-a4b2-572e8de10f19', 'ef332779-1171-4d55-b0fd-c792363226dc') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Altree Capital' WHERE id = '33c9d5fd-1a00-4979-b1db-e689da0e9f1b' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Wangara Capital' WHERE id = '903a6a48-09f5-4b39-88f5-3b86bb97345d' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Vested World' WHERE id IN ('76e94ab8-401f-4323-9bee-c0ec6e809a96', 'd7b478f0-bd36-40c4-8b07-75ef6c235d01') AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Renew Strategies' WHERE id = '36c6918f-57c2-4bc4-a511-a85a1c490cc3' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Africa Trust Group' WHERE id = '98784e9a-6ab7-4d91-b50f-6a06cd9bdc7b' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Mirepa Advisors' WHERE id = '2e29440b-2518-4b0b-9a84-df930ccffa21' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Amam Ventures' WHERE id = '8955a890-b367-4543-a401-d067f3797a4a' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Africa Growth' WHERE id = 'bed3640e-904b-41ee-af69-544bb1e09675' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Actawa' WHERE id = '39c976c8-6ba7-433b-85d2-a43943062a22' AND company_name = 'Not provided';

-- Remaining ones without clear domain mapping
UPDATE public.user_profiles SET company_name = 'Individual' WHERE id = '7f991b2c-e7a2-4eb3-bfcb-77d217c052f9' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Individual' WHERE id = '56a8aa0b-aec1-4f33-b005-9e26d99ac0f2' AND company_name = 'Not provided';
UPDATE public.user_profiles SET company_name = 'Individual' WHERE id = 'f91bcc40-279f-4828-9b4c-79456e13ee14' AND company_name = 'Not provided';
