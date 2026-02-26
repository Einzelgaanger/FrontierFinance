
-- 1. Delete the duplicate 2022 survey from the secondary account (primary already has one)
DELETE FROM survey_responses_2022 
WHERE id = '41f59c6c-3739-45f7-8e24-3aa33865586f' 
  AND user_id = '95ae4b7f-ab77-43db-9014-bf8120a02742';

-- 2. Add innocent@anzaentrepreneurs.co.tz as a secondary member of Anza Capital
INSERT INTO company_members (company_user_id, member_user_id, member_email, member_name, invited_by, role_in_company)
VALUES (
  'b03a2d08-ef1a-42c3-af7c-c753af768647',
  '95ae4b7f-ab77-43db-9014-bf8120a02742',
  'innocent@anzaentrepreneurs.co.tz',
  'Innocent (Anza)',
  'b03a2d08-ef1a-42c3-af7c-c753af768647',
  'team_member'
)
ON CONFLICT ON CONSTRAINT unique_member_per_company DO NOTHING;

-- 3. Update the Anza Growth Fund profile to link to Anza Capital primary
UPDATE user_profiles 
SET company_name = 'Anza Capital',
    company_id = 'b03a2d08-ef1a-42c3-af7c-c753af768647'
WHERE id = '95ae4b7f-ab77-43db-9014-bf8120a02742';
