
-- Remove sejakekana@gmail.com (Individual) from directory
UPDATE user_profiles SET show_in_directory = false WHERE LOWER(email) = 'sejakekana@gmail.com';
