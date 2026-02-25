
-- Fix klakhani's company name - they're i2i Ventures, not Kapita
UPDATE user_profiles SET company_name = 'i2i Ventures' WHERE id = '2c278626-c968-48e2-8419-25282a85a15b';

-- Now the Network directory should exclude secondary members (company_members)
-- Let me also check if the Network page query already filters them out
