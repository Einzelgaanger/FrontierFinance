
-- Hide Amam Ventures (both accounts) from directory
UPDATE user_profiles SET show_in_directory = false WHERE id IN ('19353827-4423-4705-bf33-98a5626ccace', '8955a890-b367-4543-a401-d067f3797a4a');

-- Hide Business Partners International from directory
UPDATE user_profiles SET show_in_directory = false WHERE id = 'f499760d-465b-4521-951f-6f440d0261a2';

-- Remove team member lelemba@africatrustgroup.com from ATG Samata
DELETE FROM company_members WHERE id = '2e5f7337-73f4-4bbf-884d-efc4ee65ec9c';
