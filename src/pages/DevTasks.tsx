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
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feedback',
        variant: 'destructive',
      });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
