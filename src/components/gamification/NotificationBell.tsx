import { useState, useRef, useEffect } from 'react';
import { Bell, BookOpen, MessageSquare, Award, Flame, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'resource': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'badge': return <Award className="w-4 h-4 text-gold-500" />;
      case 'streak': return <Flame className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleClick = (n: any) => {
    markAsRead(n.id);
    if (n.content_type === 'blog' && n.content_id) {
      navigate(`/blogs/${n.content_id}`);
    } else if (n.content_type === 'resource' && n.content_id) {
      navigate('/community');
    } else if (n.content_type === 'comment' && n.content_id) {
      navigate(`/blogs/${n.content_id}`);
    }
    setOpen(false);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-[70vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="font-display text-sm font-medium text-navy-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 20).map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 border-b border-slate-50',
                    !n.is_read && 'bg-blue-50/50'
                  )}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(n.content_type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm truncate', !n.is_read ? 'font-semibold text-navy-900' : 'text-slate-700')}>
                      {n.title}
                    </p>
                    {n.message && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{n.message}</p>}
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
