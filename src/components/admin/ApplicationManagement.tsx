import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, XCircle, Clock, Mail, Calendar, Eye, 
  FileText, Link as LinkIcon, User, MapPin, Briefcase, DollarSign,
  Users, Target, Building2, ExternalLink, Download
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface UploadedFile {
  name: string;
  url: string;
  type: 'file' | 'link';
}

interface Application {
  id: string;
  user_id: string;
  company_name?: string;
  email: string;
  application_text?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  applicant_name: string;
  vehicle_name: string;
  organization_website?: string;
  role_job_title?: string;
  team_size?: string;
  location?: string;
  team_overview?: string;
  investment_thesis?: string;
  typical_check_size?: string;
  number_of_investments?: string;
  amount_raised_to_date?: string;
  supporting_documents?: string[];
  expectations_from_network?: string;
  how_heard_about_network?: string;
  information_sharing_topics?: string[];
  profile_picture_url?: string;
  rejection_cooldown_until?: string;
}

const ApplicationManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [processingAction, setProcessingAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchApplications();

    const applicationsSubscription = supabase
      .channel('applications-live-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => fetchApplications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsSubscription);
    };
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as Application[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (app: Application) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || '');
    setReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedApp || !user) return;

    try {
      setProcessingAction('approve');

      const { error: appError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', selectedApp.id);

      if (appError) throw appError;

      // Update user role in BOTH tables (user_roles and user_profiles)
      // The get_user_role() function primarily checks user_profiles.user_role
      const { error: roleError } = await supabase
        .from('user_roles' as any)
        .update({ role: 'member' })
        .eq('user_id', selectedApp.user_id);

      if (roleError) {
        console.warn('Failed to update user_roles:', roleError);
      }

      // CRITICAL: Also update user_profiles.user_role (this is what get_user_role() checks first)
      const { error: profileRoleError } = await supabase
        .from('user_profiles')
        .update({ user_role: 'member' })
        .eq('id', selectedApp.user_id);

      if (profileRoleError) {
        console.error('Failed to update user_profiles role:', profileRoleError);
        toast({
          title: "Role update failed",
          description: "Application was marked approved but the user could not be upgraded to member. Check RLS: admins need permission to update user_profiles.",
          variant: "destructive"
        });
        throw profileRoleError;
      }

      // Send email notification in background (never block or fail approval)
      supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'approved',
          adminNotes
        }
      }).catch((emailError) => {
        console.warn('Email notification failed:', emailError);
      });

      toast({
        title: "Application Approved",
        description: "The user has been granted member access. They can refresh the page to see member features."
      });

      setReviewDialogOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !user) return;

    try {
      setProcessingAction('reject');

      // Calculate 5 business days cooldown
      const cooldownDate = new Date();
      let businessDays = 0;
      while (businessDays < 5) {
        cooldownDate.setDate(cooldownDate.getDate() + 1);
        const dayOfWeek = cooldownDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++;
        }
      }

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_cooldown_until: cooldownDate.toISOString()
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Send email notification in background (never block reject flow)
      supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'rejected',
          adminNotes,
          cooldownDate: cooldownDate.toISOString()
        }
      }).catch((emailError) => {
        console.warn('Email notification failed:', emailError);
      });

      toast({
        title: "Application Rejected",
        description: "The applicant has been notified. They can reapply after 5 business days."
      });

      setReviewDialogOpen(false);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const parseDocuments = (docs?: string[]): UploadedFile[] => {
    if (!docs) return [];
    return docs.map(doc => {
      try {
        return JSON.parse(doc);
      } catch {
        return { name: doc, url: doc, type: 'link' as const };
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Loading applications...</p>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'pending');
  const reviewedApps = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Membership Applications</h2>
          <p className="text-sm text-muted-foreground">Review and approve membership requests</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-2xl font-bold text-amber-700">{pendingApps.length}</div>
            <div className="text-xs text-amber-600 font-medium">Pending</div>
          </div>
          <div className="text-center px-4 py-2 bg-muted border rounded-lg">
            <div className="text-2xl font-bold">{applications.length}</div>
            <div className="text-xs text-muted-foreground font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Review ({pendingApps.length})
          </h3>
          <div className="grid gap-4">
            {pendingApps.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {app.profile_picture_url ? (
                        <img 
                          src={app.profile_picture_url} 
                          alt={app.applicant_name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{app.applicant_name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          {app.vehicle_name}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{app.location || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-3 h-3" />
                      <span className="truncate">{app.typical_check_size || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button onClick={() => handleReview(app)} size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Review Full Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Reviewed Applications ({reviewedApps.length})</h3>
          <div className="grid gap-3">
            {reviewedApps.map((app) => (
              <Card key={app.id} className="bg-muted/30">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {app.profile_picture_url ? (
                        <img 
                          src={app.profile_picture_url} 
                          alt={app.applicant_name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-sm">{app.applicant_name}</CardTitle>
                        <CardDescription className="text-xs">
                          {app.vehicle_name} • Reviewed {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(app.status)}
                      <Button variant="ghost" size="sm" onClick={() => handleReview(app)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No applications yet</p>
          </CardContent>
        </Card>
      )}

      {/* Full Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-xl border-2 border-slate-200 shadow-2xl">
          {/* Formal header band */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-5">
            <div className="flex items-center gap-4">
              {selectedApp?.profile_picture_url ? (
                <img 
                  src={selectedApp.profile_picture_url} 
                  alt={selectedApp.applicant_name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <User className="w-8 h-8 text-white/90" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-slate-300 mb-0.5">Membership Application</p>
                <DialogTitle className="text-xl font-semibold text-white tracking-tight">{selectedApp?.applicant_name}</DialogTitle>
                <DialogDescription asChild>
                  <span className="flex items-center gap-2 mt-1.5 text-slate-200 text-sm">
                    <Building2 className="w-4 h-4 shrink-0 opacity-90" />
                    <span>{selectedApp?.vehicle_name}</span>
                  </span>
                </DialogDescription>
                <div className="mt-2">{getStatusBadge(selectedApp?.status || '')}</div>
              </div>
            </div>
          </div>

          <ScrollArea className="max-h-[60vh]">
            {selectedApp && (
              <div className="p-6 space-y-6 bg-slate-50/50">
                {/* Contact & submission */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Contact & Submission
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Email</Label>
                      <p className="text-sm font-medium text-slate-800 mt-1">{selectedApp.email}</p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Website</Label>
                      <a 
                        href={selectedApp.organization_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 mt-1"
                      >
                        {selectedApp.organization_website || '—'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Submitted</Label>
                      <p className="text-sm font-medium text-slate-800 mt-1">{new Date(selectedApp.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                    </div>
                  </div>
                </div>

                {/* Role & Team */}
                <div className="rounded-xl border-l-4 border-l-amber-500 border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-700/90 mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-amber-600" />
                    Role & Team
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Role / Job Title</Label>
                      <p className="text-sm text-slate-800 bg-amber-50/60 p-3 rounded-lg mt-1 border border-amber-100 whitespace-pre-wrap">
                        {selectedApp.role_job_title || '—'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Team Size & Structure</Label>
                      <p className="text-sm text-slate-800 bg-amber-50/60 p-3 rounded-lg mt-1 border border-amber-100 whitespace-pre-wrap">
                        {selectedApp.team_size || selectedApp.team_overview || '—'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Location</Label>
                      <p className="text-sm text-slate-800 bg-amber-50/60 p-3 rounded-lg mt-1 border border-amber-100 whitespace-pre-wrap">
                        {selectedApp.location || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="rounded-xl border-l-4 border-l-emerald-600 border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-700/90 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    Investment Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Investment Thesis</Label>
                      <p className="text-sm text-slate-800 bg-emerald-50/60 p-3 rounded-lg mt-1 border border-emerald-100 whitespace-pre-wrap">
                        {selectedApp.investment_thesis || '—'}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-1">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Ticket Size</Label>
                        <p className="text-sm font-semibold text-slate-800 mt-1">{selectedApp.typical_check_size || '—'}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Portfolio Size</Label>
                        <p className="text-sm font-semibold text-slate-800 mt-1">{selectedApp.number_of_investments || '—'}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Capital Raised</Label>
                        <p className="text-sm font-semibold text-slate-800 mt-1">{selectedApp.amount_raised_to_date || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Expectations */}
                <div className="rounded-xl border-l-4 border-l-blue-600 border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-700/90 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Network Expectations
                  </h4>
                  <div className="space-y-4">
                    {selectedApp.information_sharing_topics && selectedApp.information_sharing_topics.length > 0 && (
                      <div>
                        <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Topics Willing to Contribute</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedApp.information_sharing_topics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800 border-blue-200 font-medium">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">Expectations from Network</Label>
                      <p className="text-sm text-slate-800 bg-blue-50/60 p-3 rounded-lg mt-1 border border-blue-100 whitespace-pre-wrap">
                        {selectedApp.expectations_from_network || '—'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[10px] font-medium uppercase tracking-wider text-slate-400">How They Heard About Us</Label>
                      <p className="text-sm text-slate-800 bg-blue-50/60 p-3 rounded-lg mt-1 border border-blue-100 whitespace-pre-wrap">
                        {selectedApp.how_heard_about_network || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="rounded-xl border-l-4 border-l-violet-600 border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-700/90 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-600" />
                    Supporting Documents
                  </h4>
                  {parseDocuments(selectedApp.supporting_documents).length > 0 ? (
                    <div className="grid gap-2">
                      {parseDocuments(selectedApp.supporting_documents).map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-violet-50/80 p-3 rounded-lg border border-violet-100 hover:bg-violet-100/80 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {doc.type === 'file' ? (
                              <FileText className="w-4 h-4 text-violet-600" />
                            ) : (
                              <LinkIcon className="w-4 h-4 text-violet-600" />
                            )}
                            <span className="text-sm font-medium text-slate-800">{doc.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-violet-600 text-xs font-medium">
                            <span>{doc.type === 'file' ? 'Download' : 'Open'}</span>
                            {doc.type === 'file' ? (
                              <Download className="w-4 h-4" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No documents uploaded</p>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="p-6 bg-white border-t border-slate-200">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)} disabled={!!processingAction}>
              Close
            </Button>
            {selectedApp?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={!!processingAction}
                >
                  {processingAction === 'reject' ? 'Processing...' : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject (5-day cooldown)
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={!!processingAction}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {processingAction === 'approve' ? 'Processing...' : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationManagement;
