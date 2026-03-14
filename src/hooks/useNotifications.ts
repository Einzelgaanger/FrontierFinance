import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  content_type: string;
  content_id: string | null;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data as Notification[]);
      setUnreadCount(data.filter((n: any) => !n.is_read).length);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();

    // Real-time subscription
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', id);
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
    fetchNotifications();
  }, [user?.id, fetchNotifications]);

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch: fetchNotifications };
}
