import React, { useState, useEffect, useCallback } from 'react';
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
  Upload, X, FileText, Link as LinkIcon, User, Image
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

          // Pre-fill form if can be edited
          if (app.status === 'rejected' || app.status === 'pending') {
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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleTopic = (topic: string) => {
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
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    setUploadingProfilePic(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-picture.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfilePicture(urlData.publicUrl);

      // Also update user_profiles
      await supabase
        .from('user_profiles')
        .update({ profile_picture_url: urlData.publicUrl })
        .eq('id', user.id);

      toast({ title: "Success", description: "Profile picture uploaded" });
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast({ title: "Error", description: "Failed to upload profile picture", variant: "destructive" });
    } finally {
      setUploadingProfilePic(false);
    }
  };

  // File upload handler - supports up to 10 files
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user?.id) return;

    if (uploadedFiles.length + files.length > 10) {
      toast({ title: "Error", description: "Maximum 10 files allowed", variant: "destructive" });
      return;
    }

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('application-documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('application-documents')
          .getPublicUrl(fileName);

        newFiles.push({
          name: file.name,
          url: urlData.publicUrl,
          type: 'file'
        });
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({ title: "Success", description: `${newFiles.length} file(s) uploaded` });
    } catch (error) {
      console.error('File upload error:', error);
      toast({ title: "Error", description: "Failed to upload files", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    if (uploadedFiles.length >= 10) {
      toast({ title: "Error", description: "Maximum 10 items allowed", variant: "destructive" });
      return;
    }

    setUploadedFiles(prev => [...prev, { name: linkInput, url: linkInput, type: 'link' }]);
    setLinkInput('');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.organization_website);
      case 2: // Role & Team
        return !!(formData.role_job_title && formData.team_size && formData.location);
      case 3: // Investment Details
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4: // Documents & Profile
        return uploadedFiles.length > 0; // At least one document required
      case 5: // Network & Expectations
        return !!(formData.expectations_from_network && formData.how_heard_about_network && formData.information_sharing_topics.length > 0);
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
    setCurrentStep(s => Math.min(totalSteps, s + 1));
  };

  const goPrev = () => setCurrentStep(s => Math.max(1, s - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        company_name: formData.vehicle_name,
        application_text: JSON.stringify(formData),
        status: 'pending',
        applicant_name: formData.applicant_name,
        vehicle_name: formData.vehicle_name,
        organization_website: formData.organization_website,
        role_job_title: formData.role_job_title,
        team_size: formData.team_size,
        location: formData.location,
        team_overview: formData.team_size, // Keep for backward compatibility
        investment_thesis: formData.investment_thesis,
        typical_check_size: formData.typical_check_size,
        number_of_investments: formData.number_of_investments,
        amount_raised_to_date: formData.amount_raised_to_date,
        expectations_from_network: formData.expectations_from_network,
        how_heard_about_network: formData.how_heard_about_network,
        information_sharing_topics: formData.information_sharing_topics,
        supporting_documents: uploadedFiles.map(f => JSON.stringify(f)),
        profile_picture_url: profilePicture,
      };

      let error;
      if (existingApplication && (existingApplication.status === 'rejected' || existingApplication.status === 'pending')) {
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

  // Approved
  if (existingApplication?.status === 'approved') {
    return (
      <Card className="max-w-2xl mx-auto border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-6 h-6" />
            <CardTitle>Application Approved</CardTitle>
          </div>
          <CardDescription>
            Congratulations! Your membership application has been approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm text-emerald-800">
              You now have member access to the ESCP Network. You can access all member features including the full network directory and detailed survey data.
            </p>
          </div>
          {existingApplication.admin_notes && (
            <div>
              <Label className="text-sm font-semibold">Message from Admin:</Label>
              <p className="text-sm text-muted-foreground mt-1 bg-white p-3 rounded border">
                {existingApplication.admin_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Pending
  if (existingApplication?.status === 'pending') {
    return (
      <Card className="max-w-2xl mx-auto border-amber-200 bg-amber-50/50">
        <CardHeader>
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="w-6 h-6" />
            <CardTitle>Application Under Review</CardTitle>
          </div>
          <CardDescription>
            Your membership application is currently being reviewed by our team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
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

  // Rejected with cooldown
  if (existingApplication?.status === 'rejected' && cooldownRemaining && cooldownRemaining > 0) {
    return (
      <Card className="max-w-2xl mx-auto border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-6 h-6" />
            <CardTitle>Application Not Approved</CardTitle>
          </div>
          <CardDescription>
            Your previous application was not approved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingApplication.admin_notes && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <Label className="text-sm font-semibold">Feedback from Admin:</Label>
              <p className="text-sm mt-1">{existingApplication.admin_notes}</p>
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
        <Card className="max-w-3xl mx-auto border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-6 h-6" />
              <CardTitle>Application Not Approved</CardTitle>
            </div>
            <CardDescription>
              Your previous application was not approved. You can now submit a new application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existingApplication.admin_notes && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <Label className="text-sm font-semibold">Feedback from Admin:</Label>
                <p className="text-sm mt-1">{existingApplication.admin_notes}</p>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl">
          <CardHeader className="p-8 md:p-10">
            <CardTitle className="text-2xl md:text-3xl">ESCP Network Membership Application</CardTitle>
            <CardDescription className="text-base">
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
                    <Label htmlFor="applicant_name">1. Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="applicant_name"
                      value={formData.applicant_name}
                      onChange={(e) => updateField('applicant_name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">2. Email Address <span className="text-destructive">*</span></Label>
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
                    <Label htmlFor="vehicle_name">3. Vehicle Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="vehicle_name"
                      value={formData.vehicle_name}
                      onChange={(e) => updateField('vehicle_name', e.target.value)}
                      placeholder="Name of your fund or investment vehicle"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization_website">4. Vehicle Website <span className="text-destructive">*</span></Label>
                    <Input
                      id="organization_website"
                      value={formData.organization_website}
                      onChange={(e) => updateField('organization_website', e.target.value)}
                      placeholder="https://www.example.com"
                      required
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
                  <Label htmlFor="role_job_title">5. Role/Job Title <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="role_job_title"
                    value={formData.role_job_title}
                    onChange={(e) => updateField('role_job_title', e.target.value)}
                    placeholder="Describe your role in the vehicle named and your previous relevant experience..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="team_size">6. Team Size <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="team_size"
                    value={formData.team_size}
                    onChange={(e) => updateField('team_size', e.target.value)}
                    placeholder="What is your team size and do you have a co-founder? Include plans to grow your team, recruit a co-founder, and expected timeline. Briefly describe the respective roles of other team members, if applicable."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">7. Location <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="Where are you or your team located? Indicate if you or your team plan to relocate and if so, kindly share an expected timeline."
                    rows={3}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Investment Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">3. Investment Details</h3>
                  <p className="text-sm text-muted-foreground">Your investment approach and track record</p>
                </div>

                <div>
                  <Label htmlFor="investment_thesis">8. Investment Thesis <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={(e) => updateField('investment_thesis', e.target.value)}
                    placeholder="Describe your vehicle's investment thesis i.e. target market(s), geography, sector(s), lens, instrument(s) etc."
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typical_check_size">9. Ticket Size <span className="text-destructive">*</span></Label>
                    <Input
                      id="typical_check_size"
                      value={formData.typical_check_size}
                      onChange={(e) => updateField('typical_check_size', e.target.value)}
                      placeholder="Average ticket size in USD (e.g., $100k-$500k)"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="number_of_investments">10. Portfolio <span className="text-destructive">*</span></Label>
                    <Input
                      id="number_of_investments"
                      value={formData.number_of_investments}
                      onChange={(e) => updateField('number_of_investments', e.target.value)}
                      placeholder="How many investments has your vehicle made to date?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount_raised_to_date">11. Capital Raised <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="amount_raised_to_date"
                    value={formData.amount_raised_to_date}
                    onChange={(e) => updateField('amount_raised_to_date', e.target.value)}
                    placeholder="Describe the soft and hard capital commitments secured by your vehicle to date, including whether you have personally contributed capital."
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 4: Documents & Profile */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">4. Profile & Documents</h3>
                  <p className="text-sm text-muted-foreground">Upload your profile picture and supporting documents</p>
                </div>

                {/* Profile Picture */}
                <div className="border rounded-lg p-4 bg-muted/30">
                  <Label className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    Profile Picture
                  </Label>
                  <div className="flex items-center gap-4">
                    {profilePicture ? (
                      <div className="relative">
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setProfilePicture(null)}
                          className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed">
                        <Image className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                          disabled={uploadingProfilePic}
                        />
                        <Button type="button" variant="outline" size="sm" disabled={uploadingProfilePic} asChild>
                          <span>
                            {uploadingProfilePic ? 'Uploading...' : 'Upload Photo'}
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">This will also be set as your profile picture</p>
                    </div>
                  </div>
                </div>

                {/* Supporting Documents */}
                <div className="border rounded-lg p-4">
                  <Label className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" />
                    12. Supporting Documents <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your pitch deck, one-pager or other relevant documents (up to 10 files, max 50MB each)
                  </p>

                  {/* File Upload */}
                  <div className="space-y-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading || uploadedFiles.length >= 10}
                      />
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                          {uploading ? 'Uploading...' : 'Click to upload files'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, PPT, XLS, PNG, JPG (max 50MB each)
                        </p>
                      </div>
                    </label>

                    {/* Link Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or paste a link (e.g., Google Drive, Dropbox)"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        disabled={uploadedFiles.length >= 10}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={addLink}
                        disabled={!linkInput.trim() || uploadedFiles.length >= 10}
                      >
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium">{uploadedFiles.length}/10 files added</p>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 min-w-0">
                              {file.type === 'file' ? (
                                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                              ) : (
                                <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                              <span className="text-sm truncate">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Network Expectations */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">5. Network & Expectations</h3>
                  <p className="text-sm text-muted-foreground">Your contributions and expectations from the network</p>
                </div>

                <div>
                  <Label className="mb-3 block">
                    13. Information Sharing <span className="text-destructive">*</span>
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
                  <Label htmlFor="expectations_from_network">14. Expectations <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="expectations_from_network"
                    value={formData.expectations_from_network}
                    onChange={(e) => updateField('expectations_from_network', e.target.value)}
                    placeholder="Please let us know why you would like to join the ESCP Network and what your expectations of the network are?"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="how_heard_about_network">15. How did you hear about us? <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="how_heard_about_network"
                    value={formData.how_heard_about_network}
                    onChange={(e) => updateField('how_heard_about_network', e.target.value)}
                    placeholder="Let us know where you heard about the ESCP Network (e.g., referral, event, website)"
                    rows={3}
                    required
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
                <Button type="button" onClick={goNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading}>
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
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    );
  }
};

export default ApplicationForm;
