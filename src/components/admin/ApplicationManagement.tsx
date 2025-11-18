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
import { CheckCircle, XCircle, Clock, Mail, Building2, Calendar, Eye } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  company_name?: string;
  email: string;
  application_text?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  review_notes?: string;
  created_at: string;
  updated_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  applicant_name: string;
  vehicle_name: string;
  organization_website?: string;
  domicile_countries?: string[];
  role_job_title?: string;
  team_overview?: string;
  investment_thesis?: string;
  typical_check_size?: string;
  number_of_investments?: string;
  amount_raised_to_date?: string;
  supporting_documents?: string[];
  supporting_document_links?: string[];
  expectations_from_network?: string;
  how_heard_about_network?: string;
  topics_of_interest?: string[];
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

    // Set up real-time subscription for live updates
    const applicationsSubscription = supabase
      .channel('applications-live-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          console.log('Application change detected:', payload);
          // Refresh applications when any change occurs
          fetchApplications();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
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
      setApplications((data || []).map((req: any) => ({
        id: req.id,
        user_id: req.user_id,
        company_name: req.company_name || req.vehicle_name || 'Unknown',
        email: req.email,
        application_text: req.application_text || req.investment_thesis || 'No application text provided',
        status: req.status,
        admin_notes: req.admin_notes || req.review_notes,
        created_at: req.created_at,
        reviewed_at: req.reviewed_at,
        reviewed_by: req.reviewed_by,
        applicant_name: req.applicant_name || '',
        vehicle_name: req.vehicle_name || '',
        organization_website: req.organization_website,
        domicile_countries: req.domicile_countries,
        role_job_title: req.role_job_title,
        team_overview: req.team_overview,
        investment_thesis: req.investment_thesis,
        typical_check_size: req.typical_check_size,
        number_of_investments: req.number_of_investments,
        amount_raised_to_date: req.amount_raised_to_date,
        supporting_documents: req.supporting_documents,
        supporting_document_links: req.supporting_document_links,
        expectations_from_network: req.expectations_from_network,
        how_heard_about_network: req.how_heard_about_network,
        topics_of_interest: req.topics_of_interest
      })));
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

      // Update user role to member
      const { error: roleError } = await supabase
        .from('user_roles' as any)
        .update({ role: 'member' })
        .eq('user_id', selectedApp.user_id);

      if (roleError) throw roleError;

      // Send email notification
      await supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'approved',
          adminNotes
        }
      });

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

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'rejected',
          adminNotes
        }
      });

      toast({
        title: "Application Rejected",
        description: "The applicant has been notified via email."
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium px-2 py-0.5">
          <Clock className="w-2.5 h-2.5 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-medium px-2 py-0.5">
          <CheckCircle className="w-2.5 h-2.5 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-[10px] font-medium px-2 py-0.5">
          <XCircle className="w-2.5 h-2.5 mr-1" /> Rejected
        </Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading applications...</p>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'pending');
  const reviewedApps = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Membership Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review and approve membership requests</p>
        </div>
        <div className="flex gap-3">
          <div className="text-center px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
            <div className="text-base font-semibold text-amber-700">{pendingApps.length}</div>
            <div className="text-[10px] text-amber-600 font-medium">Pending</div>
          </div>
          <div className="text-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
            <div className="text-base font-semibold text-slate-700">{applications.length}</div>
            <div className="text-[10px] text-slate-600 font-medium">Total</div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingApps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Review ({pendingApps.length})
          </h3>
          {pendingApps.map((app) => (
            <Card key={app.id} className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900 mb-1">
                      {app.applicant_name || app.company_name || app.vehicle_name || 'Application'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 text-xs">
                      {app.vehicle_name && (
                        <span className="text-slate-600">{app.vehicle_name}</span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500 mb-0.5">Applicant</p>
                    <p className="font-medium text-slate-900">{app.applicant_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Role</p>
                    <p className="font-medium text-slate-900">{app.role_job_title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Vehicle</p>
                    <p className="font-medium text-slate-900">{app.vehicle_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Website</p>
                    <p className="font-medium text-slate-900 truncate">{app.organization_website || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-500 mb-0.5">Check Size</p>
                    <p className="font-medium text-slate-900">{app.typical_check_size || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Investments</p>
                    <p className="font-medium text-slate-900">{app.number_of_investments || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-0.5">Amount Raised</p>
                    <p className="font-medium text-slate-900">{app.amount_raised_to_date || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Button
                    onClick={() => handleReview(app)}
                    size="sm"
                    variant="default"
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1.5" />
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Reviewed Applications ({reviewedApps.length})
          </h3>
          {reviewedApps.map((app) => (
            <Card key={app.id} className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold text-slate-900 mb-1">
                      {app.applicant_name || app.company_name || app.vehicle_name || 'Application'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 text-xs">
                      {app.vehicle_name && (
                        <span className="text-slate-600">{app.vehicle_name}</span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              {app.admin_notes && (
                <CardContent className="pt-0">
                  <p className="text-xs text-slate-500 mb-1">Admin Notes:</p>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">{app.admin_notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications yet</p>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200">
          <DialogHeader className="border-b border-slate-200 pb-3">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Review Application - {selectedApp?.applicant_name || selectedApp?.vehicle_name || selectedApp?.company_name || 'Application'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Review all application details and make a decision
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4 pt-4">
              {/* Basic Information */}
              <div className="grid grid-cols-3 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Applicant Name</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.applicant_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Email</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Submitted</p>
                  <p className="text-slate-900 font-semibold">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Vehicle Name</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.vehicle_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Company</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.company_name || selectedApp.vehicle_name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Role/Title</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.role_job_title || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Website</p>
                  <p className="text-slate-900 font-semibold truncate">{selectedApp.organization_website || 'Not provided'}</p>
                </div>
                {selectedApp.domicile_countries && selectedApp.domicile_countries.length > 0 && (
                  <div>
                    <p className="text-slate-500 mb-1 font-medium">Domicile Countries</p>
                    <p className="text-slate-900 font-semibold">{selectedApp.domicile_countries.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Financial Information */}
              <div className="grid grid-cols-3 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Check Size</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.typical_check_size || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Number of Investments</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.number_of_investments || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1 font-medium">Amount Raised</p>
                  <p className="text-slate-900 font-semibold">{selectedApp.amount_raised_to_date || 'Not provided'}</p>
                </div>
              </div>

              {/* Detailed Sections */}
              <div className="space-y-3">
                {selectedApp.team_overview && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Team Overview</p>
                    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-md whitespace-pre-wrap leading-relaxed">
                      {selectedApp.team_overview}
                    </div>
                  </div>
                )}

                {selectedApp.investment_thesis && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Investment Thesis</p>
                    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-md whitespace-pre-wrap leading-relaxed">
                      {selectedApp.investment_thesis}
                    </div>
                  </div>
                )}

                {selectedApp.expectations_from_network && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Network Expectations</p>
                    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-md whitespace-pre-wrap leading-relaxed">
                      {selectedApp.expectations_from_network}
                    </div>
                  </div>
                )}

                {selectedApp.how_heard_about_network && (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">How They Heard About Us</p>
                    <div className="text-xs text-slate-700 bg-slate-50 border border-slate-200 p-3 rounded-md">
                      {selectedApp.how_heard_about_network}
                    </div>
                  </div>
                )}

                {(selectedApp.supporting_documents && selectedApp.supporting_documents.length > 0) || 
                 (selectedApp.supporting_document_links && selectedApp.supporting_document_links.length > 0) ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">Supporting Documents</p>
                    <div className="space-y-1.5">
                      {selectedApp.supporting_documents?.map((doc, idx) => {
                        try {
                          const parsed = JSON.parse(doc);
                          return (
                            <div key={idx} className="text-xs text-slate-600 bg-slate-50 border border-slate-200 p-2 rounded">
                              {parsed.fileName || 'Document'}
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })}
                      {selectedApp.supporting_document_links?.map((link, idx) => {
                        try {
                          const parsed = JSON.parse(link);
                          return (
                            <div key={idx} className="text-xs text-blue-600 bg-slate-50 border border-slate-200 p-2 rounded">
                              <a href={parsed.fileName} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">
                                {parsed.fileName}
                              </a>
                            </div>
                          );
                        } catch {
                          return null;
                        }
                      })}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Admin Notes */}
              <div className="border-t border-slate-200 pt-4">
                <Label htmlFor="admin-notes" className="text-xs font-semibold text-slate-700">Admin Notes (optional)</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                  className="mt-1.5 text-xs"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  These notes will be included in the email notification sent to the applicant
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 border-t border-slate-200 pt-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewDialogOpen(false)}
              disabled={reviewing}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!selectedApp || !user) return;
                try {
                  setReviewing(true);
                  const { error } = await supabase
                    .from('applications')
                    .update({
                      status: 'rejected',
                      admin_notes: adminNotes,
                      reviewed_at: new Date().toISOString(),
                      reviewed_by: user.id
                    })
                    .eq('id', selectedApp.id);
                  if (error) throw error;
                  await supabase.functions.invoke('send-application-status', {
                    body: { applicationId: selectedApp.id, status: 'rejected', adminNotes }
                  });
                  toast({ title: "Application Rejected", description: "The applicant has been notified via email." });
                  setReviewDialogOpen(false);
                  fetchApplications();
                } catch (error) {
                  console.error('Error rejecting application:', error);
                  toast({ title: "Error", description: "Failed to reject application", variant: "destructive" });
                } finally {
                  setReviewing(false);
                }
              }}
              disabled={reviewing}
              className="text-xs"
            >
              {reviewing ? 'Processing...' : (
                <>
                  <XCircle className="w-3 h-3 mr-1.5" />
                  Reject
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={async () => {
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
                  const { error: roleError } = await supabase
                    .from('user_roles' as any)
                    .update({ role: 'member' })
                    .eq('user_id', selectedApp.user_id);
                  if (roleError) throw roleError;
                  await supabase.functions.invoke('send-application-status', {
                    body: { applicationId: selectedApp.id, status: 'approved', adminNotes }
                  });
                  toast({ title: "Application Approved", description: "The user has been granted member access and notified via email." });
                  setReviewDialogOpen(false);
                  fetchApplications();
                } catch (error) {
                  console.error('Error approving application:', error);
                  toast({ title: "Error", description: "Failed to approve application", variant: "destructive" });
                } finally {
                  setReviewing(false);
                }
              }}
              disabled={reviewing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              {reviewing ? 'Processing...' : (
                <>
                  <CheckCircle className="w-3 h-3 mr-1.5" />
                  Approve
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationManagement;


