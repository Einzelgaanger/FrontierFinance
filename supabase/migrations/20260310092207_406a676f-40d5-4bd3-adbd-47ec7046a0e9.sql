
-- Add r.anang as secondary member under a.annan (primary)
INSERT INTO company_members (company_user_id, member_user_id, member_email, role_in_company)
VALUES ('c38f39d6-13b5-4116-8819-7a7d21086eab', 'aef0873e-8f0b-4363-9656-a11b0aadc330', 'r.anang@impcapadv.com', 'team_member')
ON CONFLICT DO NOTHING;
