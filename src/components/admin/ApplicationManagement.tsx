import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const [reviewing, setReviewing] = useState(false);

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
      setReviewing(true);

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
        throw profileRoleError;
      }

      // Send email notification (don't throw on email failure - approval already succeeded)
      try {
        await supabase.functions.invoke('send-application-status', {
          body: {
            applicationId: selectedApp.id,
            status: 'approved',
            adminNotes
          }
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Don't fail the whole approval if email fails
      }

      toast({
        title: "Application Approved",
        description: "The user has been granted member access and notified via email."
      });

      setReviewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !user) return;

    try {
      setReviewing(true);

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

      // Send email notification
      await supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'rejected',
          adminNotes,
          cooldownDate: cooldownDate.toISOString()
        }
      });

      toast({
        title: "Application Rejected",
        description: "The applicant has been notified via email. They can reapply after 5 business days."
      });

      setReviewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setReviewing(false);
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
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-4">
              {selectedApp?.profile_picture_url ? (
                <img 
                  src={selectedApp.profile_picture_url} 
                  alt={selectedApp.applicant_name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <DialogTitle className="text-xl">{selectedApp?.applicant_name}</DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{selectedApp?.vehicle_name}</span>
                    {getStatusBadge(selectedApp?.status || '')}
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] px-6">
            {selectedApp && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{selectedApp.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Website</Label>
                    <a 
                      href={selectedApp.organization_website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      {selectedApp.organization_website || 'N/A'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Submitted</Label>
                    <p className="text-sm font-medium">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                {/* Role & Team */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Role & Team
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Role/Job Title</Label>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedApp.role_job_title || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Team Size & Structure</Label>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedApp.team_size || selectedApp.team_overview || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                        {selectedApp.location || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Investment Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Investment Details
                  </h4>
                  <div>
                    <Label className="text-xs text-muted-foreground">Investment Thesis</Label>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedApp.investment_thesis || 'Not provided'}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Ticket Size</Label>
                      <p className="text-sm font-medium">{selectedApp.typical_check_size || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Portfolio Size</Label>
                      <p className="text-sm font-medium">{selectedApp.number_of_investments || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Capital Raised</Label>
                      <p className="text-sm font-medium">{selectedApp.amount_raised_to_date || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Network Expectations */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Network Expectations
                  </h4>
                  {selectedApp.information_sharing_topics && selectedApp.information_sharing_topics.length > 0 && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Topics Willing to Contribute</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedApp.information_sharing_topics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-muted-foreground">Expectations from Network</Label>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedApp.expectations_from_network || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">How They Heard About Us</Label>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedApp.how_heard_about_network || 'Not provided'}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Supporting Documents */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4" />
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
                          className="flex items-center justify-between bg-muted/50 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {doc.type === 'file' ? (
                              <FileText className="w-4 h-4 text-primary" />
                            ) : (
                              <LinkIcon className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="text-xs">{doc.type === 'file' ? 'Download' : 'Open'}</span>
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
                    <p className="text-sm text-muted-foreground">No documents uploaded</p>
                  )}
                </div>

                <Separator />

                {/* Admin Notes */}
                <div className="space-y-3">
                  <Label htmlFor="admin-notes" className="font-semibold">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision (will be included in the email to applicant)..."
                    rows={4}
                    disabled={selectedApp.status !== 'pending'}
                  />
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="p-6 pt-0 border-t">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)} disabled={reviewing}>
              Close
            </Button>
            {selectedApp?.status === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={reviewing}
                >
                  {reviewing ? 'Processing...' : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject (5-day cooldown)
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={reviewing}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {reviewing ? 'Processing...' : (
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
