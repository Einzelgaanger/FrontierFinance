
-- Ensure only the primary (enyonam@mirepaadvisors.com) is visible in directory
UPDATE user_profiles SET show_in_directory = true WHERE id = 'fe390a96-aad0-4b1c-aeab-293619f882e1';
UPDATE user_profiles SET show_in_directory = false WHERE id IN ('4db134ee-ff65-44c8-9299-4881491ee7bf', '2e29440b-2518-4b0b-9a84-df930ccffa21', 'e6be68d4-76e7-4331-9528-3306c73c4aeb');
