import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getBadge, getNextBadge, getProgressToNextBadge } from '@/utils/badgeSystem';
import type { Badge } from '@/utils/badgeSystem';

interface GamificationState {
  totalPoints: number;
  currentBadge: Badge;
  nextBadge: Badge | null;
  progressToNext: number;
  loginStreak: number;
  longestStreak: number;
  aiUsageCount: number;
  blogPostsCount: number;
  commentsCount: number;
  commentsReceivedCount: number;
  contentReadsCount: number;
  loading: boolean;
}

export function useGamification() {
  const { user } = useAuth();
  const hasTrackedLogin = useRef(false);
  const [state, setState] = useState<GamificationState>({
    totalPoints: 0,
    currentBadge: getBadge(0),
    nextBadge: getNextBadge(0),
    progressToNext: 0,
    loginStreak: 0,
    longestStreak: 0,
    aiUsageCount: 0,
    blogPostsCount: 0,
    commentsCount: 0,
    commentsReceivedCount: 0,
    contentReadsCount: 0,
    loading: true,
  });

  const fetchCredits = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      const pts = data.total_points || 0;
      setState(prev => ({
        ...prev,
        totalPoints: pts,
        currentBadge: getBadge(pts),
        nextBadge: getNextBadge(pts),
        progressToNext: getProgressToNextBadge(pts),
        loginStreak: data.login_streak || 0,
        longestStreak: (data as any).longest_streak || 0,
        aiUsageCount: data.ai_usage_count || 0,
        blogPostsCount: data.blog_posts_count || 0,
        commentsCount: (data as any).comments_count || 0,
        commentsReceivedCount: (data as any).comments_received_count || 0,
        contentReadsCount: (data as any).content_reads_count || 0,
        loading: false,
      }));
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user?.id]);

  // Track daily login on mount
  useEffect(() => {
    if (!user?.id || hasTrackedLogin.current) return;
    hasTrackedLogin.current = true;

    const trackLogin = async () => {
      try {
        await supabase.rpc('track_daily_login', { p_user_id: user.id });
      } catch (e) {
        console.error('Error tracking daily login:', e);
      }
      fetchCredits();
    };
    trackLogin();
  }, [user?.id, fetchCredits]);

  const trackContentRead = useCallback(async (contentType: 'blog' | 'resource', contentId: string) => {
    if (!user?.id) return;
    
    // Check if already read
    const { data: existing } = await supabase
      .from('content_reads')
      .select('id, is_marked_unread')
      .eq('user_id', user.id)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .maybeSingle();

    if (existing && !existing.is_marked_unread) return; // Already read and not marked unread

    if (existing?.is_marked_unread) {
      // Just mark as read again, no points
      await supabase
        .from('content_reads')
        .update({ is_marked_unread: false, read_at: new Date().toISOString() })
        .eq('id', existing.id);
      return;
    }

    // First time reading - award points
    await supabase
      .from('content_reads')
      .insert({ user_id: user.id, content_type: contentType, content_id: contentId });

    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_activity_type: 'content_read',
      p_points: 2,
      p_description: `Read a ${contentType} for the first time`,
    });

    fetchCredits();
  }, [user?.id, fetchCredits]);

  const trackComment = useCallback(async () => {
    if (!user?.id) return;
    await supabase.rpc('award_points', {
      p_user_id: user.id,
      p_activity_type: 'comment_made',
      p_points: 3,
      p_description: 'Posted a comment',
    });
    fetchCredits();
  }, [user?.id, fetchCredits]);

  const markAsUnread = useCallback(async (contentType: 'blog' | 'resource', contentId: string) => {
    if (!user?.id) return;
    await supabase
      .from('content_reads')
      .update({ is_marked_unread: true })
      .eq('user_id', user.id)
      .eq('content_type', contentType)
      .eq('content_id', contentId);
  }, [user?.id]);

  return { ...state, trackContentRead, trackComment, markAsUnread, refetch: fetchCredits };
}
