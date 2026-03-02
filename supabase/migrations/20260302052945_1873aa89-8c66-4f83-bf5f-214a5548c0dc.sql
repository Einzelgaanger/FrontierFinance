
-- Null out reviewed_by references to the test admin account
UPDATE public.applications 
SET reviewed_by = NULL 
WHERE reviewed_by = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';

-- Delete chat messages (child of chat_conversations)
DELETE FROM public.chat_messages 
WHERE conversation_id IN (
  SELECT id FROM public.chat_conversations WHERE user_id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51'
);

-- Delete chat conversations
DELETE FROM public.chat_conversations WHERE user_id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';

-- Delete activity log
DELETE FROM public.activity_log WHERE user_id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';

-- Delete user roles
DELETE FROM public.user_roles WHERE user_id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';

-- Delete user profile
DELETE FROM public.user_profiles WHERE id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';

-- Delete auth user
DELETE FROM auth.users WHERE id = 'f6c5bd5a-619f-453e-b85f-e3b564022b51';
