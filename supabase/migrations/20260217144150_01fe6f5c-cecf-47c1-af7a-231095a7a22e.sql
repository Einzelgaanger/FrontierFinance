
-- =====================================================
-- PART 1: Add missing foreign key indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON public.applications (reviewed_by);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications (user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback (user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resource_comments_user_id ON public.learning_resource_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resource_likes_user_id ON public.learning_resource_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created_by ON public.learning_resources (created_by);
CREATE INDEX IF NOT EXISTS idx_website_feedback_user_id ON public.website_feedback (user_id);

-- =====================================================
-- PART 2: Drop unused indexes
-- =====================================================
DROP INDEX IF EXISTS public.idx_user_profiles_company_id;
DROP INDEX IF EXISTS public.idx_user_profiles_is_active;
DROP INDEX IF EXISTS public.idx_feedback_status;
DROP INDEX IF EXISTS public.idx_feedback_created_at;
DROP INDEX IF EXISTS public.idx_feedback_page_path;
DROP INDEX IF EXISTS public.idx_blogs_user_id;
DROP INDEX IF EXISTS public.idx_survey_2021_firm;
DROP INDEX IF EXISTS public.idx_survey_2022_email;
DROP INDEX IF EXISTS public.idx_survey_2022_completed_at;
DROP INDEX IF EXISTS public.idx_survey_2023_email;
DROP INDEX IF EXISTS public.idx_survey_2023_organisation;
DROP INDEX IF EXISTS public.idx_survey_2023_completed_at;
DROP INDEX IF EXISTS public.idx_blog_comments_user_id;
DROP INDEX IF EXISTS public.idx_survey_2024_organisation;
DROP INDEX IF EXISTS public.idx_survey_2024_completed_at;
DROP INDEX IF EXISTS public.idx_feedback_page_url;
DROP INDEX IF EXISTS public.idx_learning_resources_topic;
DROP INDEX IF EXISTS public.idx_learning_resources_media_type;
DROP INDEX IF EXISTS public.idx_learning_resources_category;
DROP INDEX IF EXISTS public.idx_learning_resources_type;
DROP INDEX IF EXISTS public.idx_learning_resources_featured;
DROP INDEX IF EXISTS public.idx_launch_plus_email;

-- =====================================================
-- PART 3: Fix RLS initplan - wrap auth.uid() in (select ...)
-- Also consolidate duplicate permissive policies
-- =====================================================

-- === user_profiles ===
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile details" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.user_profiles;

CREATE POLICY "Users can view profiles" ON public.user_profiles
  FOR SELECT USING (
    (select auth.uid()) IS NOT NULL
  );

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (
    id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Users can update own or admin updates" ON public.user_profiles
  FOR UPDATE USING (
    id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === user_roles ===
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update any user role" ON public.user_roles;

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can update any user role" ON public.user_roles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === blogs ===
DROP POLICY IF EXISTS "Users can create their own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can update their own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can delete their own blogs" ON public.blogs;

CREATE POLICY "Users can create their own blogs" ON public.blogs
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own blogs" ON public.blogs
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own blogs" ON public.blogs
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === blog_comments ===
DROP POLICY IF EXISTS "Users can create comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.blog_comments;

CREATE POLICY "Users can create comments" ON public.blog_comments
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own comments" ON public.blog_comments
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own comments" ON public.blog_comments
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === blog_likes ===
DROP POLICY IF EXISTS "Users can select own blog likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Users can insert own blog likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Users can delete own blog likes" ON public.blog_likes;

CREATE POLICY "Users can select own blog likes" ON public.blog_likes
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own blog likes" ON public.blog_likes
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own blog likes" ON public.blog_likes
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === user_credits ===
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

CREATE POLICY "Users can view their own credits" ON public.user_credits
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits
  FOR UPDATE USING ((select auth.uid()) = user_id);

-- === activity_log ===
DROP POLICY IF EXISTS "Users can view their own activity log" ON public.activity_log;
DROP POLICY IF EXISTS "Users can create their own activity log" ON public.activity_log;

CREATE POLICY "Users can view their own activity log" ON public.activity_log
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create their own activity log" ON public.activity_log
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- === chat_conversations ===
DROP POLICY IF EXISTS "Users can select own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.chat_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.chat_conversations;

CREATE POLICY "Users can select own conversations" ON public.chat_conversations
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own conversations" ON public.chat_conversations
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own conversations" ON public.chat_conversations
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === chat_messages ===
DROP POLICY IF EXISTS "Users can select messages of own conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert messages into own conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own messages in own conversations" ON public.chat_messages;

CREATE POLICY "Users can select messages of own conversations" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = (select auth.uid()))
  );

CREATE POLICY "Users can insert messages into own conversations" ON public.chat_messages
  FOR INSERT WITH CHECK (
    user_id = (select auth.uid())
    AND EXISTS (SELECT 1 FROM chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = (select auth.uid()))
  );

CREATE POLICY "Users can delete their own messages in own conversations" ON public.chat_messages
  FOR DELETE USING (
    user_id = (select auth.uid())
    AND EXISTS (SELECT 1 FROM chat_conversations c WHERE c.id = chat_messages.conversation_id AND c.user_id = (select auth.uid()))
  );

-- === feedback ===
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;
DROP POLICY IF EXISTS "Admins can update feedback" ON public.feedback;

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Admins can update feedback" ON public.feedback
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === launch_plus_assessments ===
DROP POLICY IF EXISTS "admins_can_view_assessments" ON public.launch_plus_assessments;

CREATE POLICY "admins_can_view_assessments" ON public.launch_plus_assessments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === applications ===
DROP POLICY IF EXISTS "Users can create own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;

CREATE POLICY "Users can view own or admins view all applications" ON public.applications
  FOR SELECT USING (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Users can create own applications" ON public.applications
  FOR INSERT WITH CHECK (
    (select auth.uid()) IS NOT NULL
    AND user_id = (select auth.uid())
    AND company_name IS NOT NULL
    AND email IS NOT NULL
    AND application_text IS NOT NULL
  );

CREATE POLICY "Users can update own or admins update all applications" ON public.applications
  FOR UPDATE USING (
    user_id = (select auth.uid())
    OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === learning_resources ===
DROP POLICY IF EXISTS "Admins can insert learning resources" ON public.learning_resources;
DROP POLICY IF EXISTS "Admins can update learning resources" ON public.learning_resources;
DROP POLICY IF EXISTS "Admins can delete learning resources" ON public.learning_resources;

CREATE POLICY "Admins can insert learning resources" ON public.learning_resources
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Admins can update learning resources" ON public.learning_resources
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Admins can delete learning resources" ON public.learning_resources
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role = 'admin')
  );

-- === learning_resource_likes ===
DROP POLICY IF EXISTS "Users can insert own learning resource like" ON public.learning_resource_likes;
DROP POLICY IF EXISTS "Users can delete own learning resource like" ON public.learning_resource_likes;

CREATE POLICY "Users can insert own learning resource like" ON public.learning_resource_likes
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own learning resource like" ON public.learning_resource_likes
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === learning_resource_comments ===
DROP POLICY IF EXISTS "Users can create learning resource comment" ON public.learning_resource_comments;
DROP POLICY IF EXISTS "Users can update own learning resource comment" ON public.learning_resource_comments;
DROP POLICY IF EXISTS "Users can delete own learning resource comment" ON public.learning_resource_comments;

CREATE POLICY "Users can create learning resource comment" ON public.learning_resource_comments
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own learning resource comment" ON public.learning_resource_comments
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own learning resource comment" ON public.learning_resource_comments
  FOR DELETE USING ((select auth.uid()) = user_id);

-- === survey_responses_2021 ===
DROP POLICY IF EXISTS "Users can manage their own 2021 survey" ON public.survey_responses_2021;
DROP POLICY IF EXISTS "Completed 2021 surveys viewable by members and admins" ON public.survey_responses_2021;

CREATE POLICY "Users can manage or view 2021 survey" ON public.survey_responses_2021
  FOR ALL USING (
    (select auth.uid()) = user_id
    OR (
      submission_status = 'completed'
      AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role IN ('member', 'admin'))
    )
  ) WITH CHECK ((select auth.uid()) = user_id);

-- === survey_responses_2022 ===
DROP POLICY IF EXISTS "Users can manage their own 2022 survey" ON public.survey_responses_2022;
DROP POLICY IF EXISTS "Completed 2022 surveys viewable by members and admins" ON public.survey_responses_2022;

CREATE POLICY "Users can manage or view 2022 survey" ON public.survey_responses_2022
  FOR ALL USING (
    (select auth.uid()) = user_id
    OR (
      submission_status = 'completed'
      AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role IN ('member', 'admin'))
    )
  ) WITH CHECK ((select auth.uid()) = user_id);

-- === survey_responses_2023 ===
DROP POLICY IF EXISTS "Users can manage their own 2023 survey" ON public.survey_responses_2023;
DROP POLICY IF EXISTS "Completed 2023 surveys viewable by members and admins" ON public.survey_responses_2023;

CREATE POLICY "Users can manage or view 2023 survey" ON public.survey_responses_2023
  FOR ALL USING (
    (select auth.uid()) = user_id
    OR (
      submission_status = 'completed'
      AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role IN ('member', 'admin'))
    )
  ) WITH CHECK ((select auth.uid()) = user_id);

-- === survey_responses_2024 ===
DROP POLICY IF EXISTS "Users can manage their own 2024 survey" ON public.survey_responses_2024;
DROP POLICY IF EXISTS "Completed 2024 surveys viewable by members and admins" ON public.survey_responses_2024;

CREATE POLICY "Users can manage or view 2024 survey" ON public.survey_responses_2024
  FOR ALL USING (
    (select auth.uid()) = user_id
    OR (
      submission_status = 'completed'
      AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = (select auth.uid()) AND role IN ('member', 'admin'))
    )
  ) WITH CHECK ((select auth.uid()) = user_id);
