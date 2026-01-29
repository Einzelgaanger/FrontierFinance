import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  FileText,
  User,
  Calendar,
  ExternalLink,
  ShieldOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface Feedback {
  id: string;
  message: string;
  page_url: string;
  page_name: string | null;
  user_email: string | null;
  user_role: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export default function DevTasks() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const { toast } = useToast();
  const { userRole, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only fetch feedback if user is an admin
    if (!authLoading && userRole === 'admin') {
      fetchFeedback();
    } else if (!authLoading && userRole !== 'admin') {
      setLoading(false);
    }
  }, [userRole, authLoading]);

  const fetchFeedback = async () => {
    // Double-check admin status before fetching
    if (userRole !== 'admin') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Handle "table doesn't exist" error (42P01)
        if (error.code === '42P01' || error.message?.includes('relation') && error.message?.includes('does not exist')) {
          console.warn('Feedback table does not exist. Migration needs to be applied:', error);
          setTableMissing(true);
          toast({
            title: 'Database Migration Required',
            description: 'The feedback table does not exist. Please run the migration: supabase/migrations/20260127000000_create_feedback_table.sql',
            variant: 'destructive',
          });
          setFeedback([]);
          return;
        }
        // Handle 404 errors gracefully (RLS blocking access)
        if (error.code === 'PGRST116' || error.message?.includes('404')) {
          console.warn('Feedback table not accessible (likely RLS restriction):', error);
          setFeedback([]);
          return;
        }
        throw error;
      }
      setFeedback((data || []) as Feedback[]);
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      // Handle "table doesn't exist" error
      if (error.code === '42P01' || (error.message?.includes('relation') && error.message?.includes('does not exist'))) {
        setTableMissing(true);
        toast({
          title: 'Database Migration Required',
          description: 'The feedback table does not exist. Please run the migration: supabase/migrations/20260127000000_create_feedback_table.sql',
          variant: 'destructive',
        });
      } else if (error.code !== 'PGRST116' && !error.message?.includes('404')) {
        toast({
          title: 'Error',
          description: 'Failed to load feedback',
          variant: 'destructive',
        });
      }
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (id: string, updates: Partial<Feedback>) => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Updated',
        description: 'Feedback status updated successfully',
      });

      fetchFeedback();
      if (selectedFeedback?.id === id) {
        setSelectedFeedback({ ...selectedFeedback, ...updates } as Feedback);
      }
    } catch (error: any) {
      console.error('Error updating feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feedback',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const saveAdminNotes = async () => {
    if (!selectedFeedback) return;

    await updateFeedback(selectedFeedback.id, { admin_notes: adminNotes });
    setAdminNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch = 
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.page_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.page_url.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: feedback.length,
    open: feedback.filter(f => f.status === 'open').length,
    in_progress: feedback.filter(f => f.status === 'in_progress').length,
    resolved: feedback.filter(f => f.status === 'resolved').length,
    closed: feedback.filter(f => f.status === 'closed').length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show access denied message for non-admin users
  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <ShieldOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              This page is only accessible to administrators. You need admin privileges to view and manage feedback.
            </p>
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold">{userRole || 'unknown'}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Development Tasks & Feedback
          </h1>
          <p className="text-gray-600">Manage user feedback and track development tasks</p>
        </div>
        {tableMissing && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Database Migration Required</h3>
                  <p className="text-red-800 mb-4">
                    The feedback table does not exist in your database. You need to apply the migration to create it.
                  </p>
                  <div className="bg-white p-4 rounded-md border border-red-200 mb-4">
                    <p className="text-sm font-mono text-gray-800 mb-2">Migration file:</p>
                    <code className="text-sm text-gray-700">supabase/migrations/20260127000000_create_feedback_table.sql</code>
                  </div>
                  <div className="space-y-2 text-sm text-red-800">
                    <p className="font-semibold">To apply the migration:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Open your Supabase Dashboard</li>
                      <li>Go to SQL Editor</li>
                      <li>Copy and paste the contents of the migration file</li>
                      <li>Click "Run" to execute the migration</li>
                      <li>Refresh this page after the migration completes</li>
                    </ol>
                  </div>
                  <Button
                    onClick={() => {
                      setTableMissing(false);
                      fetchFeedback();
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry After Migration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
              <div className="text-sm text-gray-600">Open</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
              <div className="text-sm text-gray-600">Closed</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Feedback List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={fetchFeedback} size="icon">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback List */}
            <div className="space-y-3">
              {filteredFeedback.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    No feedback found
                  </CardContent>
                </Card>
              ) : (
                filteredFeedback.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedFeedback?.id === item.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedFeedback(item);
                      setAdminNotes(item.admin_notes || '');
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(item.status)}
                            <Badge className={getStatusColor(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">
                            {item.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {item.page_name || item.page_url}
                            </span>
                            {item.user_email && (
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {item.user_email}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1">
            {selectedFeedback ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Feedback Details</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFeedback(null)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedFeedback.status}
                      onValueChange={(value) =>
                        updateFeedback(selectedFeedback.id, { status: value as any })
                      }
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div>
                    <Label>Priority</Label>
                    <Select
                      value={selectedFeedback.priority}
                      onValueChange={(value) =>
                        updateFeedback(selectedFeedback.id, { priority: value as any })
                      }
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <Label>Message</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedFeedback.message}
                    </div>
                  </div>

                  {/* Page Info */}
                  <div>
                    <Label>Page</Label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      <div className="font-medium">{selectedFeedback.page_name || 'Unknown'}</div>
                      <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {selectedFeedback.page_url}
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  {selectedFeedback.user_email && (
                    <div>
                      <Label>User</Label>
                      <div className="p-3 bg-gray-50 rounded-md text-sm">
                        <div>{selectedFeedback.user_email}</div>
                        {selectedFeedback.user_role && (
                          <div className="text-gray-500 text-xs mt-1">
                            Role: {selectedFeedback.user_role}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <Label>Admin Notes</Label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this feedback..."
                      rows={4}
                    />
                    <Button
                      onClick={saveAdminNotes}
                      disabled={updating}
                      className="mt-2 w-full"
                      size="sm"
                    >
                      Save Notes
                    </Button>
                  </div>

                  {/* Timestamps */}
                  <div className="pt-4 border-t space-y-1 text-xs text-gray-500">
                    <div>Created: {format(new Date(selectedFeedback.created_at), 'MMM d, yyyy HH:mm')}</div>
                    <div>Updated: {format(new Date(selectedFeedback.updated_at), 'MMM d, yyyy HH:mm')}</div>
                    {selectedFeedback.resolved_at && (
                      <div>Resolved: {format(new Date(selectedFeedback.resolved_at), 'MMM d, yyyy HH:mm')}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Select a feedback item to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
