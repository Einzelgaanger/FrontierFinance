import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, User, Briefcase, Target, Rocket, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface AssessmentFormData {
  full_name: string;
  address: string;
  phone_whatsapp: string;
  email: string;
  fund_name: string;
  fund_website: string;
  linkedin_profile: string;
  other_social_media: string;
  fund_stages: string[];
  stage_explanation: string;
  interested_services: string[];
  geographical_focus: string[];
  legal_status: string;
  operations_vs_domicile: string;
  capital_raised_grants: number;
  capital_raised_first_loss: number;
  capital_raised_equity: number;
  capital_raised_debt: number;
  capital_raised_senior: number;
  capital_raised_other: number;
  capital_raised_other_description: string;
  investments_count: number;
  capital_committed: number;
  capital_disbursed: number;
  program_expectations: string;
}

const LaunchPlusAssessment = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AssessmentFormData>();

  const fundStages = watch('fund_stages') || [];
  const interestedServices = watch('interested_services') || [];
  const geographicalFocus = watch('geographical_focus') || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentSection]);

  const totalSections = 3;

  const handleCheckboxChange = (field: 'fund_stages' | 'interested_services' | 'geographical_focus', value: string) => {
    const currentValues = watch(field) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setValue(field, newValues);
  };

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('launch_plus_assessments').insert([{
        ...data,
        submission_status: 'completed'
      }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Assessment submitted successfully!');
      
      setTimeout(() => {
        window.location.href = 'https://escpnetwork.net/';
      }, 3000);
    } catch (error: any) {
      toast.error('Failed to submit assessment. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0 opacity-10">
          <img 
            src="/Launch+2.jpg" 
            alt="Launch+ Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-blue-200 relative z-10">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-green-100 rounded-full border-2 border-green-300">
                <CheckCircle2 className="h-20 w-20 text-green-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-amber-600 bg-clip-text text-transparent mb-4">Thank You!</h2>
            <p className="text-xl text-gray-700 mb-8">
              Your assessment has been submitted successfully. We will review your information and get back to you soon.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to our website...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Card className="shadow-xl border-2 border-blue-200 bg-white rounded-3xl animate-fade-in hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-100 via-blue-50 to-amber-50 rounded-t-3xl pb-8 border-b-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-full shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-800">Basic Information</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Tell us about yourself and your fund</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-base font-semibold text-gray-700">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name', { required: true })}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_whatsapp" className="text-base font-semibold text-gray-700">Phone / WhatsApp</Label>
                  <Input
                    id="phone_whatsapp"
                    {...register('phone_whatsapp')}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_name" className="text-base font-semibold text-gray-700">Fund Name *</Label>
                  <Input
                    id="fund_name"
                    {...register('fund_name', { required: true })}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="Your Fund Name"
                  />
                  {errors.fund_name && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_website" className="text-base font-semibold text-gray-700">Fund Website</Label>
                  <Input
                    id="fund_website"
                    {...register('fund_website')}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="https://yourfund.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile" className="text-base font-semibold text-gray-700">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    {...register('linkedin_profile')}
                    className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl h-12 transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold text-gray-700">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl transition-all"
                  rows={3}
                  placeholder="Your complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_social_media" className="text-base font-semibold text-gray-700">Other Social Media</Label>
                <Textarea
                  id="other_social_media"
                  {...register('other_social_media')}
                  className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl transition-all"
                  rows={2}
                  placeholder="Instagram, X (Twitter), Facebook, etc."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card className="shadow-xl border-2 border-blue-200 bg-white rounded-3xl animate-fade-in hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-100 via-blue-50 to-amber-50 rounded-t-3xl pb-8 border-b-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-full shadow-md">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-800">Stage of Fund</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Help us understand where you are in your journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-bold text-blue-800">
                  Which stage best represents your current fund? (Select all that apply)
                </Label>
                
                <div className="space-y-4">
                  {[
                    { 
                      value: 'concept', 
                      label: 'Concept Stage', 
                      description: 'Developing investment thesis, refining model, investment approach and incorporating manager innovations. You seek catalytic grant capital to cover fund design and early market testing.' 
                    },
                    { 
                      value: 'pilot', 
                      label: 'Pilot Stage', 
                      description: 'Working with a budget of $500k-$2M. Team materially consists of founding partners. A permanent legal vehicle may not yet be in place. You are fundraising and seeking further financial and technical support to validate investment thesis, build a team, and show early traction.' 
                    },
                    { 
                      value: 'implementation', 
                      label: 'Implementation Stage', 
                      description: 'Successfully raised approximately $2-5 million for investing and targeting a sub $20 million fund size. Secured funding to partially cover fund operations and to support team expansion. Able to articulate the components of sustainable fund economics and have begun assessing optimal fund vehicle structures and domiciliation. You seek investment capital (commercial and/or catalytic) to reach scale.' 
                    },
                    { 
                      value: 'scale', 
                      label: 'Scale Stage', 
                      description: 'Target ≥ $20 million in AUM. Established team, legal vehicle, governance, and back-office operations in place. Demonstrated your fund\'s investment thesis and capabilities, and have a material pipeline aligned to your investment thesis. You seek access to DFI capital and other institutional LPs.' 
                    }
                  ].map((stage) => (
                    <div 
                      key={stage.value} 
                      className="flex items-start space-x-4 p-5 border-2 border-blue-200 bg-blue-50/50 rounded-2xl hover:bg-blue-100/50 hover:border-blue-400 transition-all duration-300 hover:shadow-md"
                    >
                      <Checkbox
                        checked={fundStages.includes(stage.value)}
                        onCheckedChange={() => handleCheckboxChange('fund_stages', stage.value)}
                        className="mt-1 border-blue-400"
                      />
                      <div className="flex-1">
                        <Label className="font-bold text-base cursor-pointer text-gray-800">{stage.label}</Label>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="stage_explanation" className="text-base font-semibold text-gray-700">
                  If you fall between two stages, please explain (Optional)
                </Label>
                <p className="text-sm text-gray-600">Note: If you selected "concept" or "scale" stage, this opportunity may not be the right fit for you.</p>
                <Textarea
                  id="stage_explanation"
                  {...register('stage_explanation')}
                  className="border-2 border-blue-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-400/20 rounded-xl transition-all"
                  rows={5}
                  placeholder="Describe where you are in your fund journey..."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 3:
        return (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-xl border-2 border-blue-200 bg-white rounded-3xl animate-fade-in hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-100 via-blue-50 to-blue-100 rounded-t-3xl pb-8 border-b-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-600 rounded-full shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-blue-800">Eligibility for LAUNCH+</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600">Tell us about your needs and current status</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="interested_services" className="text-base font-semibold text-gray-700">Interested Services (Select all that apply)</Label>
                    {[
                      { value: 'investment', label: 'Investment' },
                      { value: 'technical_assistance', label: 'Technical Assistance' },
                      { value: 'networking', label: 'Networking' },
                      { value: 'capacity_building', label: 'Capacity Building' },
                      { value: 'other', label: 'Other' },
                    ].map(service => (
                      <div key={service.value} className="flex items-center space-x-3">
                        <Checkbox
                          checked={interestedServices.includes(service.value)}
                          onCheckedChange={() => handleCheckboxChange('interested_services', service.value)}
                          className="border-amber-400"
                          id={`service-${service.value}`}
                        />
                        <Label htmlFor={`service-${service.value}`} className="cursor-pointer text-gray-800">{service.label}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="geographical_focus" className="text-base font-semibold text-gray-700">Geographical Focus (Select all that apply)</Label>
                    {[
                      { value: 'local', label: 'Local' },
                      { value: 'regional', label: 'Regional' },
                      { value: 'national', label: 'National' },
                      { value: 'international', label: 'International' },
                    ].map(region => (
                      <div key={region.value} className="flex items-center space-x-3">
                        <Checkbox
                          checked={geographicalFocus.includes(region.value)}
                          onCheckedChange={() => handleCheckboxChange('geographical_focus', region.value)}
                          className="border-amber-400"
                          id={`region-${region.value}`}
                        />
                        <Label htmlFor={`region-${region.value}`} className="cursor-pointer text-gray-800">{region.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legal_status" className="text-base font-semibold text-gray-700">Legal Status</Label>
                  <Input
                    id="legal_status"
                    {...register('legal_status')}
                    className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                    placeholder="Describe your fund's legal status"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operations_vs_domicile" className="text-base font-semibold text-gray-700">Operations vs Domicile</Label>
                  <Textarea
                    id="operations_vs_domicile"
                    {...register('operations_vs_domicile')}
                    className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl transition-all"
                    rows={3}
                    placeholder="Explain your operations and domicile setup"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_grants" className="text-base font-semibold text-gray-700">Capital Raised - Grants</Label>
                    <Input
                      id="capital_raised_grants"
                      type="number"
                      {...register('capital_raised_grants', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_first_loss" className="text-base font-semibold text-gray-700">Capital Raised - First Loss</Label>
                    <Input
                      id="capital_raised_first_loss"
                      type="number"
                      {...register('capital_raised_first_loss', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_equity" className="text-base font-semibold text-gray-700">Capital Raised - Equity</Label>
                    <Input
                      id="capital_raised_equity"
                      type="number"
                      {...register('capital_raised_equity', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_debt" className="text-base font-semibold text-gray-700">Capital Raised - Debt</Label>
                    <Input
                      id="capital_raised_debt"
                      type="number"
                      {...register('capital_raised_debt', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_senior" className="text-base font-semibold text-gray-700">Capital Raised - Senior</Label>
                    <Input
                      id="capital_raised_senior"
                      type="number"
                      {...register('capital_raised_senior', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_other" className="text-base font-semibold text-gray-700">Capital Raised - Other</Label>
                    <Input
                      id="capital_raised_other"
                      type="number"
                      {...register('capital_raised_other', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capital_raised_other_description" className="text-base font-semibold text-gray-700">If Other, please describe</Label>
                  <Textarea
                    id="capital_raised_other_description"
                    {...register('capital_raised_other_description')}
                    className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl transition-all"
                    rows={3}
                    placeholder="Describe other capital sources"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="investments_count" className="text-base font-semibold text-gray-700">Number of Investments</Label>
                    <Input
                      id="investments_count"
                      type="number"
                      {...register('investments_count', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_committed" className="text-base font-semibold text-gray-700">Capital Committed</Label>
                    <Input
                      id="capital_committed"
                      type="number"
                      {...register('capital_committed', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_disbursed" className="text-base font-semibold text-gray-700">Capital Disbursed</Label>
                    <Input
                      id="capital_disbursed"
                      type="number"
                      {...register('capital_disbursed', { valueAsNumber: true })}
                      className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl h-12 transition-all"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program_expectations" className="text-base font-semibold text-gray-700">Program Expectations</Label>
                  <Textarea
                    id="program_expectations"
                    {...register('program_expectations')}
                    className="border-2 border-amber-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:ring-amber-400/20 rounded-xl transition-all"
                    rows={5}
                    placeholder="Describe your expectations from the LAUNCH+ program"
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden p-4">
      {/* Background image */}
      <div className="fixed inset-0 z-0 opacity-10">
        <img 
          src="/Launch+2.jpg" 
          alt="Launch+ Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 max-w-5xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-amber-600 bg-clip-text text-transparent mb-3">
            LAUNCH+ Assessment
          </h1>
          <p className="text-gray-600 text-lg">Section {currentSection} of {totalSections}</p>
          
          {/* Progress Bar */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${(currentSection / totalSections) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {renderSection()}

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {currentSection > 1 && (
            <Button
              type="button"
              onClick={handlePrevious}
              variant="outline"
              className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl px-6"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentSection < totalSections ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg rounded-xl px-8"
              >
                Next Section
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-600 to-blue-600 hover:from-amber-700 hover:to-blue-700 text-white shadow-lg rounded-xl px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPlusAssessment;
