import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, 
  Upload, X, FileText, Link as LinkIcon, User, Image, Building2, Save
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const INFORMATION_SHARING_TOPICS = [
  "Fundraising Experience",
  "Experience of getting started/launching",
  "Fund Economics (eg vehicle structuring)",
  "Due Diligence Expertise/Investment Readiness",
  "Portfolio Support/Technical Assistance",
  "Market Data (eg termsheets, valuations)",
  "Local Market Insights (Geographical or sector expertise)",
  "Co-investing Opportunities"
];

interface FormData {
  applicant_name: string;
  email: string;
  vehicle_name: string;
  organization_website: string;
  role_job_title: string;
  team_size: string;
  location: string;
  investment_thesis: string;
  typical_check_size: string;
  number_of_investments: string;
  amount_raised_to_date: string;
  expectations_from_network: string;
  how_heard_about_network: string;
  information_sharing_topics: string[];
}

interface UploadedFile {
  name: string;
  url: string;
  type: 'file' | 'link';
}

const ApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const draftTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<FormData>({
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    role_job_title: '',
    team_size: '',
    location: '',
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    expectations_from_network: '',
    how_heard_about_network: '',
    information_sharing_topics: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const percentComplete = Math.round((currentStep / totalSteps) * 100);

  // Build application data object for saving
  const buildApplicationData = useCallback((status: string) => ({
    user_id: user?.id,
    email: formData.email,
    company_name: formData.vehicle_name || 'Draft',
    application_text: JSON.stringify(formData),
    status,
    applicant_name: formData.applicant_name,
    vehicle_name: formData.vehicle_name,
    organization_website: formData.organization_website,
    role_job_title: formData.role_job_title,
    team_size: formData.team_size,
    location: formData.location,
    team_overview: formData.team_size,
    investment_thesis: formData.investment_thesis,
    typical_check_size: formData.typical_check_size,
    number_of_investments: formData.number_of_investments,
    amount_raised_to_date: formData.amount_raised_to_date,
    expectations_from_network: formData.expectations_from_network,
    how_heard_about_network: formData.how_heard_about_network,
    information_sharing_topics: formData.information_sharing_topics,
    supporting_documents: uploadedFiles.map(f => JSON.stringify(f)),
    profile_picture_url: profilePicture,
  }), [formData, uploadedFiles, profilePicture, user?.id]);

  // Save draft to database
  const saveDraft = useCallback(async () => {
    if (!user?.id || isReadOnly) return;
    
    // Only save if form has some data
    if (!formData.applicant_name && !formData.email && !formData.vehicle_name) return;

    setSavingDraft(true);
    try {
      const draftData = buildApplicationData('draft');

      if (existingApplication && (existingApplication.status === 'draft' || existingApplication.status === 'rejected' || existingApplication.status === 'pending')) {
        await supabase
          .from('applications')
          .update({ ...draftData, status: existingApplication.status === 'pending' ? 'pending' : 'draft' })
          .eq('id', existingApplication.id);
      } else if (!existingApplication) {
        const { data } = await supabase
          .from('applications')
          .insert([draftData])
          .select()
          .single();
        if (data) setExistingApplication(data);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSavingDraft(false);
    }
  }, [user?.id, formData, uploadedFiles, profilePicture, existingApplication, isReadOnly, buildApplicationData]);

  // Debounced auto-save on form changes
  useEffect(() => {
    if (isReadOnly || !user?.id) return;
    
    if (draftTimeoutRef.current) {
      clearTimeout(draftTimeoutRef.current);
    }
    draftTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 3000); // Save after 3 seconds of inactivity

    return () => {
      if (draftTimeoutRef.current) clearTimeout(draftTimeoutRef.current);
    };
  }, [formData, uploadedFiles, profilePicture]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isReadOnly && user?.id && (formData.applicant_name || formData.vehicle_name)) {
        // Use sendBeacon for reliable save on unload
        saveDraft();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveDraft, isReadOnly, user?.id, formData]);

  // Pre-fill form from application data
  const prefillForm = (app: any) => {
    setFormData({
      applicant_name: app.applicant_name || '',
      email: app.email || user?.email || '',
      vehicle_name: app.vehicle_name || '',
      organization_website: app.organization_website || '',
      role_job_title: app.role_job_title || '',
      team_size: app.team_size || '',
      location: app.location || '',
      investment_thesis: app.investment_thesis || '',
      typical_check_size: app.typical_check_size || '',
      number_of_investments: app.number_of_investments || '',
      amount_raised_to_date: app.amount_raised_to_date || '',
      expectations_from_network: app.expectations_from_network || '',
      how_heard_about_network: app.how_heard_about_network || '',
      information_sharing_topics: app.information_sharing_topics || [],
    });
    
    if (app.supporting_documents) {
      setUploadedFiles(app.supporting_documents.map((doc: string) => {
        try {
          return JSON.parse(doc);
        } catch {
          return { name: doc, url: doc, type: 'link' };
        }
      }));
    }
    
    if (app.profile_picture_url) {
      setProfilePicture(app.profile_picture_url);
    }
  };

  // Check for existing application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('company_name, profile_picture_url')
          .eq('id', user.id)
          .single();

        if (profileData?.profile_picture_url) {
          setProfilePicture(profileData.profile_picture_url);
        }

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
          
          // Check cooldown for rejected applications
          if (app.status === 'rejected' && app.rejection_cooldown_until) {
            const cooldownDate = new Date(app.rejection_cooldown_until);
            const now = new Date();
            if (cooldownDate > now) {
              const diffDays = Math.ceil((cooldownDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              setCooldownRemaining(diffDays);
            }
          }

          // Pre-fill form for all editable statuses (draft, rejected, pending)
          if (app.status === 'draft' || app.status === 'rejected' || app.status === 'pending') {
            prefillForm(app);
          }

          // For approved applications, show in read-only mode
          if (app.status === 'approved') {
            prefillForm(app);
            setIsReadOnly(true);
          }
        }
      } catch (error) {
        console.error('Error checking existing application:', error);
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [user?.id, user?.email]);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    if (isReadOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTopic = (topic: string) => {
    if (isReadOnly) return;
    setFormData(prev => ({
      ...prev,
      information_sharing_topics: prev.information_sharing_topics.includes(topic)
        ? prev.information_sharing_topics.filter(t => t !== topic)
        : [...prev.information_sharing_topics, topic]
    }));
  };

  // Profile picture upload
  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please upload an image file" });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Error", description: "Please upload a JPG, PNG, WebP, GIF, or SVG image (max 10MB)" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image must be under 10MB" });
      return;
    }

    setUploadingProfilePic(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-picture.${fileExt}`;

      // First try to remove existing file (ignore errors)
      await supabase.storage
        .from('profile-pictures')
        .remove([fileName]);

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Storage upload error:', JSON.stringify(uploadError));
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfilePicture(urlData.publicUrl);

      // Also update user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: urlData.publicUrl })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
      }

      toast({ title: "Success", description: "Company logo uploaded" });
    } catch (error) {
      console.error('Company logo upload error:', error);
      toast({ title: "Error", description: "Failed to upload company logo" });
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // File upload handler - supports up to 10 files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user?.id) return;

    if (uploadedFiles.length + files.length > 10) {
      toast({ title: "Error", description: "Maximum 10 files allowed" });
      return;
    }

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 50 * 1024 * 1024) {
          toast({ title: "Error", description: `${file.name} exceeds 50MB limit` });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('application-documents')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('application-documents')
          .getPublicUrl(fileName);

        setUploadedFiles(prev => [...prev, {
          name: file.name,
          url: urlData.publicUrl,
          type: 'file'
        }]);
      }

      toast({ title: "Success", description: "File(s) uploaded successfully" });
    } catch (error) {
      console.error('File upload error:', error);
      toast({ title: "Error", description: "Failed to upload file(s)" });
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    if (uploadedFiles.length >= 10) {
      toast({ title: "Error", description: "Maximum 10 documents allowed" });
      return;
    }
    setUploadedFiles(prev => [...prev, {
      name: linkInput,
      url: linkInput.startsWith('http') ? linkInput : `https://${linkInput}`,
      type: 'link'
    }]);
    setLinkInput('');
  };

  const removeFile = (index: number) => {
    if (isReadOnly) return;
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.organization_website);
      case 2:
        return !!(formData.role_job_title && formData.team_size && formData.location);
      case 3:
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4:
        return uploadedFiles.length > 0;
      case 5:
        return !!(formData.expectations_from_network && formData.how_heard_about_network && formData.information_sharing_topics.length > 0);
      default:
        return false;
    }
  };

  const goNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding."
      });
      return;
    }
    setCurrentStep(s => Math.min(totalSteps, s + 1));
  };

  const goPrev = () => setCurrentStep(s => Math.max(1, s - 1));

  // Explicit submit handler - NOT tied to form submit event
  const handleSubmit = async () => {
    for (let i = 1; i <= totalSteps; i++) {
      if (!validateStep(i)) {
        toast({
          title: "Incomplete Application",
          description: `Please complete all required fields in Step ${i} before submitting.`
        });
        setCurrentStep(i);
        return;
      }
    }

    setLoading(true);

    try {
      const applicationData = buildApplicationData('pending');

      let error;
      if (existingApplication && (existingApplication.status === 'draft' || existingApplication.status === 'rejected' || existingApplication.status === 'pending')) {
        const { error: updateError } = await supabase
          .from('applications')
          .update(applicationData)
          .eq('id', existingApplication.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('applications')
          .insert([applicationData]);
        error = insertError;
      }

      if (error) throw error;

      // Notify admins about the new application
      try {
        await supabase.functions.invoke('notify-admin-new-application', {
          body: {
            applicantName: formData.applicant_name,
            vehicleName: formData.vehicle_name,
            email: formData.email,
            organizationWebsite: formData.organization_website,
            location: formData.location,
            roleJobTitle: formData.role_job_title,
            typicalCheckSize: formData.typical_check_size,
            numberOfInvestments: formData.number_of_investments,
            amountRaisedToDate: formData.amount_raised_to_date,
            howHeardAboutNetwork: formData.how_heard_about_network,
          },
        });
      } catch (notifyErr) {
        console.error('Failed to notify admins:', notifyErr);
      }

      toast({
        title: "Application Submitted",
        description: "Your membership application has been submitted successfully. You will be notified via email once it's reviewed.",
      });

      const { data: newApp } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
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
        description: "Failed to submit application. Please try again."
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

  // Approved - show application in read-only mode with status banner
  if (existingApplication?.status === 'approved' && isReadOnly) {
    return (
      <div className="space-y-6">
        <Card className="max-w-6xl mx-auto border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-6 h-6" />
              <CardTitle>Application Approved — Member Profile</CardTitle>
            </div>
            <CardDescription>
              Your membership application has been approved. Below is your submitted application data. You can update your profile details anytime.
            </CardDescription>
          </CardHeader>
          {existingApplication.admin_notes && (
            <CardContent>
              <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-4">
                <Label className="text-sm font-semibold">Message from Admin:</Label>
                <p className="text-sm text-emerald-800 mt-1">{existingApplication.admin_notes}</p>
              </div>
            </CardContent>
          )}
        </Card>
        {renderApplicationForm()}
      </div>
    );
  }

  // Pending - show status banner + editable form
  if (existingApplication?.status === 'pending') {
    return (
      <div className="space-y-6">
        <Card className="max-w-6xl mx-auto border-amber-200 bg-amber-50/50">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-700">
              <Clock className="w-6 h-6" />
              <CardTitle>Application Under Review</CardTitle>
            </div>
            <CardDescription>
              Your application is being reviewed. You can still edit and update it below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Submitted on: {new Date(existingApplication.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>
        {renderApplicationForm()}
      </div>
    );
  }

  // Rejected with cooldown
  if (existingApplication?.status === 'rejected' && cooldownRemaining && cooldownRemaining > 0) {
    return (
      <Card className="max-w-2xl mx-auto border-amber-200 bg-amber-50/80">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-800">
            <XCircle className="w-6 h-6" />
            <CardTitle>Application Not Approved</CardTitle>
          </div>
          <CardDescription>
            Your previous application was not approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingApplication.admin_notes && (
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
              <Label className="text-sm font-semibold">Feedback from Admin:</Label>
              <p className="text-sm mt-1 text-slate-700">{existingApplication.admin_notes}</p>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <Clock className="w-4 h-4 inline mr-1" />
              You can reapply in <strong>{cooldownRemaining} business day(s)</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Rejected - can reapply
  if (existingApplication?.status === 'rejected') {
    return (
      <div className="space-y-6">
        <Card className="max-w-3xl mx-auto border-amber-200 bg-amber-50/80">
          <CardHeader>
            <div className="flex items-center gap-2 text-amber-800">
              <XCircle className="w-6 h-6" />
              <CardTitle>Application Not Approved</CardTitle>
            </div>
            <CardDescription>
              Your previous application was not approved. You can now submit a new application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existingApplication.admin_notes && (
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                <Label className="text-sm font-semibold">Feedback from Admin:</Label>
                <p className="text-sm mt-1 text-slate-700">{existingApplication.admin_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        {renderApplicationForm()}
      </div>
    );
  }

  return renderApplicationForm();

  function renderApplicationForm() {
    return (
      <div className="space-y-6">
        <Card className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl">
          <CardHeader className="p-8 md:p-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {isReadOnly ? 'Your Application Details' : 'ESCP Network Membership Application'}
                </CardTitle>
                <CardDescription className="text-base">
                  {isReadOnly 
                    ? 'View your submitted application information below'
                    : 'Complete all sections to apply for membership in the ESCP Network'
                  }
                </CardDescription>
              </div>
              {!isReadOnly && savingDraft && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Save className="w-4 h-4 animate-pulse" />
                  Saving...
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{percentComplete}% Complete</span>
              </div>
              <Progress value={percentComplete} className="h-2" indicatorClassName="bg-sky-600" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-8 md:p-10">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">1. Basic Information</h3>
                  <p className="text-sm text-muted-foreground">Your personal and vehicle details</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicant_name">1. Name <span className="text-sky-600">*</span></Label>
                    <Input
                      id="applicant_name"
                      value={formData.applicant_name}
                      onChange={(e) => updateField('applicant_name', e.target.value)}
                      placeholder="Your full name"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">2. Email Address <span className="text-sky-600">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="your.email@example.com"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vehicle_name">3. Vehicle Name <span className="text-sky-600">*</span></Label>
                    <Input
                      id="vehicle_name"
                      value={formData.vehicle_name}
                      onChange={(e) => updateField('vehicle_name', e.target.value)}
                      placeholder="Name of your fund or investment vehicle"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization_website">4. Vehicle Website <span className="text-sky-600">*</span></Label>
                    <Input
                      id="organization_website"
                      value={formData.organization_website}
                      onChange={(e) => updateField('organization_website', e.target.value)}
                      placeholder="https://www.example.com"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Role & Team */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">2. Role & Team</h3>
                  <p className="text-sm text-muted-foreground">Your position and team structure</p>
                </div>

                <div>
                  <Label htmlFor="role_job_title">5. Role/Job Title <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="role_job_title"
                    value={formData.role_job_title}
                    onChange={(e) => updateField('role_job_title', e.target.value)}
                    placeholder="Describe your role in the vehicle named and your previous relevant experience..."
                    rows={4}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label htmlFor="team_size">6. Team Size <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="team_size"
                    value={formData.team_size}
                    onChange={(e) => updateField('team_size', e.target.value)}
                    placeholder="What is your team size and do you have a co-founder? Include plans to grow your team, recruit a co-founder, and expected timeline. Briefly describe the respective roles of other team members, if applicable."
                    rows={5}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label htmlFor="location">7. Location <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Where are you or your team located? Indicate if you or your team plan to relocate and if so, kindly share an expected timeline."
                    rows={3}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Investment Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">3. Investment Details</h3>
                  <p className="text-sm text-muted-foreground">Your investment strategy and track record</p>
                </div>

                <div>
                  <Label htmlFor="investment_thesis">8. Investment Thesis <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={(e) => updateField('investment_thesis', e.target.value)}
                    placeholder="Please briefly describe the Vehicle's investment thesis including sector focus, geographic focus, financial instruments, target ticket size, and target fund/vehicle size."
                    rows={6}
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typical_check_size">9. Typical Check Size <span className="text-sky-600">*</span></Label>
                    <Textarea
                      id="typical_check_size"
                      value={formData.typical_check_size}
                      onChange={(e) => updateField('typical_check_size', e.target.value)}
                      placeholder="What is your typical check size in USD?"
                      rows={2}
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div>
                    <Label htmlFor="number_of_investments">10. Number of Investments <span className="text-sky-600">*</span></Label>
                    <Textarea
                      id="number_of_investments"
                      value={formData.number_of_investments}
                      onChange={(e) => updateField('number_of_investments', e.target.value)}
                      placeholder="Please state the number of investments to date and if they are committed vs disbursed."
                      rows={2}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount_raised_to_date">11. Amount Raised to Date <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="amount_raised_to_date"
                    value={formData.amount_raised_to_date}
                    onChange={(e) => updateField('amount_raised_to_date', e.target.value)}
                    placeholder="Please state the amount raised to date and target fund/vehicle size. If pre-fundraise, please state target fund/vehicle size only."
                    rows={3}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents & Profile */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">4. Company Logo & Documents</h3>
                  <p className="text-sm text-muted-foreground">Upload your company logo and supporting documents</p>
                </div>

                {/* Profile Picture / Company Logo */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    12. Company Logo / Profile Picture
                  </Label>
                  <div className="flex items-center gap-4">
                    {profilePicture ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/20">
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => setProfilePicture(null)}
                            className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                    {!isReadOnly && (
                      <div>
                        <Label htmlFor="profile-pic-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                            <Upload className="w-4 h-4" />
                            {uploadingProfilePic ? 'Uploading...' : 'Upload Logo'}
                          </div>
                        </Label>
                        <input
                          id="profile-pic-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          className="hidden"
                          onChange={handleProfilePictureUpload}
                          disabled={uploadingProfilePic}
                        />
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, GIF, SVG (max 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Supporting Documents {!isReadOnly && <span className="text-sky-600">*</span>}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Upload files or add links to supporting documents (pitch deck, track record, etc.)
                  </p>

                  {/* Upload area */}
                  {!isReadOnly && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                        <Label htmlFor="doc-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">Upload Files</p>
                          <p className="text-xs text-muted-foreground">Max 50MB per file, up to 10 files</p>
                        </Label>
                        <input
                          id="doc-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                        {uploading && <p className="text-xs text-primary mt-2">Uploading...</p>}
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            placeholder="https://link-to-document.com"
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }}
                          />
                          <Button type="button" variant="outline" onClick={addLink} size="sm">
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Add external document links</p>
                      </div>
                    </div>
                  )}

                  {/* Uploaded files list */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {file.type === 'file' ? <FileText className="w-4 h-4 flex-shrink-0" /> : <LinkIcon className="w-4 h-4 flex-shrink-0" />}
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                              {file.name}
                            </a>
                          </div>
                          {!isReadOnly && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">{uploadedFiles.length}/10 documents</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Network & Expectations */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">5. Network & Expectations</h3>
                  <p className="text-sm text-muted-foreground">Your contributions and expectations from the network</p>
                </div>

                <div>
                  <Label className="mb-3 block">
                    13. Information Sharing <span className="text-sky-600">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    The ESCP Network is a peer-to-peer learning network with an expectation of transparent information sharing amongst members. Indicate the topics where you are willing to make regular contributions.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {INFORMATION_SHARING_TOPICS.map((topic) => (
                      <div key={topic} className="flex items-start space-x-3">
                        <Checkbox
                          id={topic}
                          checked={formData.information_sharing_topics.includes(topic)}
                          onCheckedChange={() => toggleTopic(topic)}
                          disabled={isReadOnly}
                        />
                        <label
                          htmlFor={topic}
                          className="text-sm leading-tight cursor-pointer"
                        >
                          {topic}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="expectations_from_network">14. Expectations <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="expectations_from_network"
                    value={formData.expectations_from_network}
                    onChange={(e) => updateField('expectations_from_network', e.target.value)}
                    placeholder="Please let us know why you would like to join the ESCP Network and what your expectations of the network are?"
                    rows={5}
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <Label htmlFor="how_heard_about_network">15. How did you hear about us? <span className="text-sky-600">*</span></Label>
                  <Textarea
                    id="how_heard_about_network"
                    value={formData.how_heard_about_network}
                    onChange={(e) => updateField('how_heard_about_network', e.target.value)}
                    placeholder="Let us know where you heard about the ESCP Network (e.g., referral, event, website)"
                    rows={3}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
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
                <Button type="button" onClick={goNext} className="!bg-sky-600 hover:!bg-sky-700 text-white">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : !isReadOnly ? (
                <Button type="button" onClick={handleSubmit} disabled={loading} className="!bg-sky-600 hover:!bg-sky-700 text-white">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default ApplicationForm;
