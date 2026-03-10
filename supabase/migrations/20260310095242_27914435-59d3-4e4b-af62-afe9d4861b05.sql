
-- Delete all data for test accounts
DELETE FROM public.survey_responses_2021 WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.survey_responses_2022 WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.survey_responses_2023 WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.survey_responses_2024 WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.company_members WHERE company_user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819') OR member_user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.activity_log WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.user_roles WHERE user_id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
DELETE FROM public.user_profiles WHERE id IN ('ff44f561-86f7-485a-a25e-0a59e2b23037','9480045d-a6b2-4668-ab80-b381d88adaba','92d51cf1-4a26-4a8c-9f3d-b5d44a88b819');
