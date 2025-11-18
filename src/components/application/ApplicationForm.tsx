import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Send, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [companyName, setCompanyName] = useState('');

  // Check for existing application and get company name
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.id) return;
      
      try {
        // Get user profile for company name
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('company_name')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setCompanyName(profileData.company_name || '');
        }

        // Check for existing application
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const app = data[0];
          setExistingApplication(app);
          // Pre-fill form if application exists and can be edited
          if (app.status === 'rejected' || app.status === 'pending') {
            setFormData({
              applicant_name: app.applicant_name || '',
              email: app.email || user?.email || '',
              vehicle_name: app.vehicle_name || '',
              organization_website: app.organization_website || '',
              role_job_title: app.role_job_title || '',
              team_overview: app.team_overview || '',
              investment_thesis: app.investment_thesis || '',
              typical_check_size: app.typical_check_size || '',
              number_of_investments: app.number_of_investments || '',
              amount_raised_to_date: app.amount_raised_to_date || '',
              expectations_from_network: app.expectations_from_network || '',
              how_heard_about_network: app.how_heard_about_network || '',
            });
          }
        }
      } catch (error) {
        console.error('Error checking existing application:', error);
        toast({
          title: "Error",
          description: "Failed to check application status",
          variant: "destructive"
        });
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [user?.id, toast, user?.email]);

  const [formData, setFormData] = useState({
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    role_job_title: '',
    team_overview: '',
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    expectations_from_network: '',
    how_heard_about_network: '',
  });

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const percentComplete = Math.round((currentStep / totalSteps) * 100);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.role_job_title);
      case 2: // Organization
        return !!(formData.organization_website && formData.team_overview);
      case 3: // Investment Details
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4: // Network Expectations
        return !!(formData.expectations_from_network && formData.how_heard_about_network);
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep((s) => Math.min(totalSteps, s + 1));
  };

  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submission
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        toast({
          title: "Incomplete Application",
          description: `Please complete all required fields in Step ${i} before submitting.`,
          variant: "destructive"
        });
        setCurrentStep(i);
        return;
      }
    }

    setLoading(true);

    try {
      const applicationData = {
        user_id: user?.id,
        email: formData.email,
        company_name: companyName || 'Not provided',
        application_text: JSON.stringify(formData),
        status: 'pending',
        applicant_name: formData.applicant_name,
        vehicle_name: formData.vehicle_name,
        organization_website: formData.organization_website,
        role_job_title: formData.role_job_title,
        team_overview: formData.team_overview,
        investment_thesis: formData.investment_thesis,
        typical_check_size: formData.typical_check_size,
        number_of_investments: formData.number_of_investments,
        amount_raised_to_date: formData.amount_raised_to_date,
        expectations_from_network: formData.expectations_from_network,
        how_heard_about_network: formData.how_heard_about_network,
      };

      let error;
      if (existingApplication && (existingApplication.status === 'rejected' || existingApplication.status === 'pending')) {
        // Update existing application
        const { error: updateError } = await supabase
          .from('applications')
          .update(applicationData)
          .eq('id', existingApplication.id);
        error = updateError;
      } else {
        // Create new application
        const { error: insertError } = await supabase
          .from('applications')
          .insert([applicationData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your membership application has been submitted successfully. You will be notified via email once it's reviewed.",
      });

      // Refresh the application status
      const { data: newApp } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (newApp) {
        setExistingApplication(newApp);
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingApplication) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application status...</p>
        </div>
      </div>
    );
  }

  // If application is approved, show success message
  if (existingApplication && existingApplication.status === 'approved') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            <CardTitle>Application Approved</CardTitle>
          </div>
          <CardDescription>
            Congratulations! Your membership application has been approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              You now have member access to the ESCP Network. You can access all member features including the full network directory and detailed survey data.
            </p>
          </div>
          {existingApplication.admin_notes && (
            <div>
              <Label className="text-sm font-semibold">Admin Notes:</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {existingApplication.admin_notes}
              </p>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <p>Approved on: {new Date(existingApplication.reviewed_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If application is pending, show status
  if (existingApplication && existingApplication.status === 'pending') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2 text-orange-600">
            <Clock className="w-6 h-6" />
            <CardTitle>Application Under Review</CardTitle>
          </div>
          <CardDescription>
            Your membership application is currently being reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              We'll notify you via email once your application has been reviewed. This typically takes 2-3 business days.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Submitted on: {new Date(existingApplication.created_at).toLocaleDateString()}</p>
          </div>
          <Button
            onClick={() => setExistingApplication(null)}
            variant="outline"
            className="w-full"
          >
            Edit Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If application is rejected, allow resubmission
  if (existingApplication && existingApplication.status === 'rejected') {
    return (
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-6 h-6" />
              <CardTitle>Application Not Approved</CardTitle>
            </div>
            <CardDescription>
              Your previous application was not approved. You can submit a new application below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingApplication.admin_notes && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <Label className="text-sm font-semibold">Feedback from Admin:</Label>
                <p className="text-sm mt-1">
                  {existingApplication.admin_notes}
                </p>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p>Previous application date: {new Date(existingApplication.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
        {renderApplicationForm()}
      </div>
    );
  }

  // Render application form
  return renderApplicationForm();

  function renderApplicationForm() {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Membership Application</CardTitle>
            <CardDescription>
              Complete all sections to apply for membership in the ESCP Network
            </CardDescription>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{percentComplete}% Complete</span>
              </div>
              <Progress value={percentComplete} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">A. Basic Information</h3>
                  <p className="text-sm text-muted-foreground">Tell us about yourself</p>
                </div>

                <div>
                  <Label htmlFor="applicant_name">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="applicant_name"
                    value={formData.applicant_name}
                    onChange={(e) => updateField('applicant_name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="vehicle_name">Fund/Vehicle Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="vehicle_name"
                    value={formData.vehicle_name}
                    onChange={(e) => updateField('vehicle_name', e.target.value)}
                    placeholder="Name of your fund or investment vehicle"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="role_job_title">Your Role/Job Title <span className="text-destructive">*</span></Label>
                  <Input
                    id="role_job_title"
                    value={formData.role_job_title}
                    onChange={(e) => updateField('role_job_title', e.target.value)}
                    placeholder="e.g., Managing Partner, Investment Director"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Organization Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">B. Organization Details</h3>
                  <p className="text-sm text-muted-foreground">Information about your organization</p>
                </div>

                <div>
                  <Label htmlFor="organization_website">Organization Website <span className="text-destructive">*</span></Label>
                  <Input
                    id="organization_website"
                    type="url"
                    value={formData.organization_website}
                    onChange={(e) => updateField('organization_website', e.target.value)}
                    placeholder="https://www.example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="team_overview">Team Overview <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="team_overview"
                    value={formData.team_overview}
                    onChange={(e) => updateField('team_overview', e.target.value)}
                    placeholder="Describe your team's composition, size, and key members..."
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Include information about team size, expertise, and key personnel
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Investment Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">C. Investment Details</h3>
                  <p className="text-sm text-muted-foreground">Your investment approach and track record</p>
                </div>

                <div>
                  <Label htmlFor="investment_thesis">Investment Thesis <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={(e) => updateField('investment_thesis', e.target.value)}
                    placeholder="Describe your investment thesis, focus areas, and approach..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="typical_check_size">Typical Check Size <span className="text-destructive">*</span></Label>
                  <Input
                    id="typical_check_size"
                    value={formData.typical_check_size}
                    onChange={(e) => updateField('typical_check_size', e.target.value)}
                    placeholder="e.g., $500K - $2M"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="number_of_investments">Number of Investments to Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="number_of_investments"
                    value={formData.number_of_investments}
                    onChange={(e) => updateField('number_of_investments', e.target.value)}
                    placeholder="e.g., 15-20 companies"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount_raised_to_date">Amount Raised to Date <span className="text-destructive">*</span></Label>
                  <Input
                    id="amount_raised_to_date"
                    value={formData.amount_raised_to_date}
                    onChange={(e) => updateField('amount_raised_to_date', e.target.value)}
                    placeholder="e.g., $25M"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Network Expectations */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">D. Network Expectations</h3>
                  <p className="text-sm text-muted-foreground">How you plan to engage with the network</p>
                </div>

                <div>
                  <Label htmlFor="expectations_from_network">What do you hope to gain from the ESCP Network? <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="expectations_from_network"
                    value={formData.expectations_from_network}
                    onChange={(e) => updateField('expectations_from_network', e.target.value)}
                    placeholder="Describe your expectations and how you plan to engage with the network..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="how_heard_about_network">How did you hear about the ESCP Network? <span className="text-destructive">*</span></Label>
                  <Input
                    id="how_heard_about_network"
                    value={formData.how_heard_about_network}
                    onChange={(e) => updateField('how_heard_about_network', e.target.value)}
                    placeholder="e.g., Referral, Event, Website"
                    required
                  />
                </div>

                <div className="bg-muted/50 border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Ready to submit?</p>
                      <p className="text-muted-foreground">
                        Please review all your information before submitting. You'll receive an email notification once your application is reviewed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={goPrev}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button type="button" onClick={goNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }
};

export default ApplicationForm;
