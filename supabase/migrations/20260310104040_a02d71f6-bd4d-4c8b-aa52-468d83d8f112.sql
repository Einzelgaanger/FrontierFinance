
-- 1. Delete Nithio profile entirely
DELETE FROM public.user_profiles WHERE id = 'acff429c-e4b1-47e3-9e3b-dc0b885b9d2d';

-- 2. Link r.anang as team member under a.annan (primary with surveys)
INSERT INTO public.company_members (company_user_id, member_user_id, member_email, member_name, role_in_company)
VALUES ('c38f39d6-13b5-4116-8819-7a7d21086eab', 'aef0873e-8f0b-4363-9656-a11b0aadc330', 'r.anang@impcapadv.com', 'impact Capital Advisors', 'team_member');

-- 3. Hide duplicate Impact Capital from directory
UPDATE public.user_profiles SET show_in_directory = false WHERE id = 'aef0873e-8f0b-4363-9656-a11b0aadc330';

-- 4. Fix casing on primary to be consistent
UPDATE public.user_profiles SET company_name = 'Impact Capital Advisors' WHERE id = 'aef0873e-8f0b-4363-9656-a11b0aadc330';
