
-- Delete test users from public tables
-- user_profiles has ON DELETE CASCADE from auth.users, but we can delete directly too

DELETE FROM public.company_members WHERE member_user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037', '9480045d-a6b2-4668-ab80-b381d88adaba', '92d51cf1-4a26-4a8c-9f3d-b5d44a88b819')
OR company_user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037', '9480045d-a6b2-4668-ab80-b381d88adaba', '92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');

DELETE FROM public.user_roles WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037', '9480045d-a6b2-4668-ab80-b381d88adaba', '92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');

DELETE FROM public.user_profiles WHERE id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037', '9480045d-a6b2-4668-ab80-b381d88adaba', '92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
