
-- Delete survey responses for the duplicate Business Partners accounts
DELETE FROM public.survey_responses_2024 WHERE user_id IN ('355386bf-263e-4d12-b2aa-3243365291e4', 'f499760d-465b-4521-951f-6f440d0261a2');

-- Delete test account data from all public tables
DELETE FROM public.user_roles WHERE user_id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');
DELETE FROM public.user_profiles WHERE id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');
DELETE FROM public.activity_log WHERE user_id IN ('e99c4328-9cfb-4479-a953-bd5ad15cbb79', '731d16c6-e46e-482a-b3a8-cca0ee1c3399', '5d9e47a4-51a9-4a4f-b720-53b88114ac08');
