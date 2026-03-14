import { useNotifications } from '@/hooks/useNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotificationWidget() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.is_read).slice(0, 5);

  if (unreadCount === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'blog': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'resource': return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleClick = (n: any) => {
    markAsRead(n.id);
    if (n.content_type === 'blog' && n.content_id) navigate(`/blogs/${n.content_id}`);
    else if (n.content_type === 'resource') navigate('/community');
    else if (n.content_type === 'comment' && n.content_id) navigate(`/blogs/${n.content_id}`);
  };

  return (
    <Card className="finance-card border-blue-200/50 bg-blue-50/30">
      <CardHeader className="px-5 py-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-display text-navy-900">
          <Bell className="w-4 h-4 text-blue-500" />
          {unreadCount} Unread
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4 space-y-2">
        {unread.map(n => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/80 transition-colors text-left"
          >
            {getIcon(n.content_type)}
            <span className="text-xs text-navy-900 font-medium truncate flex-1">{n.title}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        ))}
        {unreadCount > 5 && (
          <p className="text-[10px] text-slate-500 text-center pt-1">
            +{unreadCount - 5} more notifications
          </p>
        )}
      </CardContent>
    </Card>
  );
}
