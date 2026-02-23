import { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Loader2, FileText, User } from 'lucide-react';

interface LogEntry {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

export default function AccountabilityTracker() {
  const { user, isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isSuperAdmin) {
      setLoading(false);
      return;
    }
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('activity_logs' as any)
        .select('id, user_id, action, details, created_at')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Error fetching activity logs:', error);
        setLoading(false);
        return;
      }
      setLogs((data as LogEntry[]) || []);
      setLoading(false);
    };
    fetchLogs();
  }, [user, isSuperAdmin]);

  if (!user) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Please sign in.</p>
        </div>
      </SidebarLayout>
    );
  }

  if (!isSuperAdmin) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-[40vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access restricted</CardTitle>
              <CardDescription>This page is only available to the super admin.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  const actionLabel: Record<string, string> = {
    blog_post_created: 'Blog post created',
    learning_resource_created: 'Learning resource created',
    user_registered: 'User registered',
    application_submitted: 'Application submitted',
    application_approved: 'Application approved',
    application_rejected: 'Application rejected',
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accountability Tracker</h1>
          <p className="text-muted-foreground">
            Activity log for posts, signups, and key actions across the platform.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Activity log
            </CardTitle>
            <CardDescription>Recent actions (posts, applications, etc.)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {logs.map((log) => (
                  <li
                    key={log.id}
                    className="flex flex-wrap items-start gap-2 rounded-lg border p-3 bg-card"
                  >
                    <Badge variant="secondary" className="shrink-0">
                      {actionLabel[log.action] || log.action}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                    {log.details && typeof log.details === 'object' && (
                      <span className="text-sm">
                        {log.details.title && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {(log.details.title as string).toString()}
                          </span>
                        )}
                        {log.details.blog_id && (
                          <span className="text-muted-foreground ml-1">
                            (ID: {(log.details.blog_id as string).toString().slice(0, 8)}…)
                          </span>
                        )}
                      </span>
                    )}
                    {log.user_id && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.user_id.slice(0, 8)}…
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
