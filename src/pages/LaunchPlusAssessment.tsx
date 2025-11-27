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
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, User, Briefcase, Target, Rocket } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border-0">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle2 className="h-20 w-20 text-green-600" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Thank You!</h2>
            <p className="text-xl text-gray-700 mb-8">
              Your assessment has been submitted successfully. We will review your information and get back to you soon.
            </p>
            <p className="text-sm text-gray-600">
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
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-t-3xl pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Basic Information</CardTitle>
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
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
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
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_whatsapp" className="text-base font-semibold text-gray-700">Phone / WhatsApp</Label>
                  <Input
                    id="phone_whatsapp"
                    {...register('phone_whatsapp')}
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_name" className="text-base font-semibold text-gray-700">Fund Name *</Label>
                  <Input
                    id="fund_name"
                    {...register('fund_name', { required: true })}
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="Your Fund Name"
                  />
                  {errors.fund_name && <span className="text-sm text-red-600">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_website" className="text-base font-semibold text-gray-700">Fund Website</Label>
                  <Input
                    id="fund_website"
                    {...register('fund_website')}
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="https://yourfund.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile" className="text-base font-semibold text-gray-700">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    {...register('linkedin_profile')}
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold text-gray-700">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={3}
                  placeholder="Your complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_social_media" className="text-base font-semibold text-gray-700">Other Social Media</Label>
                <Textarea
                  id="other_social_media"
                  {...register('other_social_media')}
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={2}
                  placeholder="Instagram, X (Twitter), Facebook, etc."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 rounded-t-3xl pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stage of Fund</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Help us understand where you are in your journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                      className="flex items-start space-x-4 p-5 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
                    >
                      <Checkbox
                        checked={fundStages.includes(stage.value)}
                        onCheckedChange={() => handleCheckboxChange('fund_stages', stage.value)}
                        className="mt-1"
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
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={5}
                  placeholder="Describe where you are in your fund journey..."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 3:
        return (
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl animate-fade-in hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-t-3xl pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Eligibility for LAUNCH+</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Tell us about your needs and current status</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              {/* Services Interest */}
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Which LAUNCH+ services are you interested in? (Select all that apply)
                </Label>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-base font-semibold text-purple-700 bg-purple-50 p-3 rounded-xl border border-purple-200">
                      Shared Services (Mandatory, Phase I - Partially Subsidized)
                    </p>
                    {[
                      'Shared back-office services (accounting, finance, tax, legal, HR)',
                      'Fund administration services',
                      'Capacity building and knowledge services (strategy, governance, impact measurement)'
                    ].map((service) => (
                      <div key={service} className="flex items-start space-x-4 p-4 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
                        <Checkbox
                          checked={interestedServices.includes(service)}
                          onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                          className="mt-1"
                        />
                        <Label className="cursor-pointer text-sm leading-relaxed text-gray-700">{service}</Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-base font-semibold text-green-700 bg-green-50 p-3 rounded-xl border border-green-200">
                      Capital Support (Optional, Phase II - Repayable)
                    </p>
                    {[
                      'Op-Ex line of credit',
                      'Warehousing line of credit'
                    ].map((service) => (
                      <div key={service} className="flex items-start space-x-4 p-4 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
                        <Checkbox
                          checked={interestedServices.includes(service)}
                          onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                          className="mt-1"
                        />
                        <Label className="cursor-pointer text-sm leading-relaxed text-gray-700">{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Geographical Focus */}
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Geographical Focus (Select all that apply)
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
                    'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa',
                    'Middle East', 'Other'
                  ].map((region) => (
                    <div key={region} className="flex items-center space-x-3 p-4 border-2 border-blue-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
                      <Checkbox
                        checked={geographicalFocus.includes(region)}
                        onCheckedChange={() => handleCheckboxChange('geographical_focus', region)}
                      />
                      <Label className="cursor-pointer font-medium text-gray-700">{region}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Status */}
              <div className="space-y-3">
                <Label htmlFor="legal_status" className="text-base font-semibold text-gray-700">
                  Fund's Current Legal Status (Structure and date)
                </Label>
                <Textarea
                  id="legal_status"
                  {...register('legal_status')}
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={3}
                  placeholder="e.g., LLC incorporated in Delaware, January 2023"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="operations_vs_domicile" className="text-base font-semibold text-gray-700">
                  Fund Operations vs. Legal Domiciliation
                </Label>
                <Textarea
                  id="operations_vs_domicile"
                  {...register('operations_vs_domicile')}
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={3}
                  placeholder="Describe where your fund operates vs. where it is legally domiciled"
                />
              </div>

              {/* Capital Raised */}
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Capital Raised to Date (USD Equivalent)
                </Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { field: 'capital_raised_grants', label: 'Grants' },
                    { field: 'capital_raised_first_loss', label: 'First Loss or Guarantee' },
                    { field: 'capital_raised_equity', label: 'Equity' },
                    { field: 'capital_raised_debt', label: 'Debt' },
                    { field: 'capital_raised_senior', label: 'Senior Capital' },
                    { field: 'capital_raised_other', label: 'Other' }
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <Label htmlFor={item.field} className="font-semibold text-gray-700">{item.label}</Label>
                      <Input
                        id={item.field}
                        type="number"
                        step="0.01"
                        {...register(item.field as any, { valueAsNumber: true })}
                        className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capital_raised_other_description" className="font-semibold text-gray-700">
                    Other - Please specify
                  </Label>
                  <Input
                    id="capital_raised_other_description"
                    {...register('capital_raised_other_description')}
                    className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                    placeholder="Describe other capital sources"
                  />
                </div>
              </div>

              {/* Investments */}
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Investment Activity</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investments_count" className="font-semibold text-gray-700">Number of Investments</Label>
                    <Input
                      id="investments_count"
                      type="number"
                      {...register('investments_count', { valueAsNumber: true })}
                      className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_committed" className="font-semibold text-gray-700">Capital Committed (USD)</Label>
                    <Input
                      id="capital_committed"
                      type="number"
                      step="0.01"
                      {...register('capital_committed', { valueAsNumber: true })}
                      className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_disbursed" className="font-semibold text-gray-700">Capital Disbursed (USD)</Label>
                    <Input
                      id="capital_disbursed"
                      type="number"
                      step="0.01"
                      {...register('capital_disbursed', { valueAsNumber: true })}
                      className="border-2 border-blue-200 focus:border-blue-500 rounded-xl h-12 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Program Expectations */}
              <div className="space-y-3">
                <Label htmlFor="program_expectations" className="text-base font-semibold text-gray-700">
                  What are you looking to get out of the LAUNCH+ Program? (250 words max)
                </Label>
                <Textarea
                  id="program_expectations"
                  {...register('program_expectations')}
                  className="border-2 border-blue-200 focus:border-blue-500 rounded-xl transition-all"
                  rows={6}
                  placeholder="Explain your expectations from the program..."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative min-h-[40vh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF2025(Day2)-87+(1).webp)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/75 to-purple-900/80"></div>
        
        <div className="relative z-10 flex items-center justify-center min-h-[40vh] px-4">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm shadow-2xl">
                <Rocket className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              LAUNCH+ Assessment
            </h1>
            <p className="text-xl sm:text-2xl text-white/95 mb-4 max-w-3xl mx-auto font-medium px-2">
              Help us understand your fund better
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-12 overflow-hidden rounded-t-[3rem] bg-amber-50 -mt-12">
        <div className="absolute top-0 left-0 right-0 h-14 bg-amber-50 rounded-t-[3rem]"></div>
        
        {/* Floating Orbs */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative container mx-auto px-4 max-w-5xl">
          {/* Progress Bar */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentSection >= step 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <p className={`text-sm mt-2 font-medium transition-colors ${
                    currentSection >= step ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Fund Stage' : 'Eligibility'}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(currentSection / totalSections) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
            }} 
            onKeyDown={(e) => { 
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }} 
            className="space-y-8"
          >
            {renderSection()}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1}
                className="group px-8 py-6 text-lg rounded-full border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-500 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Previous
              </Button>

              {currentSection < totalSections ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="group px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl transition-all hover:scale-105"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="group px-8 py-6 text-lg rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:shadow-2xl transition-all hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Assessment
                      <CheckCircle2 className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* Section Info */}
          <div className="text-center mt-8 text-sm text-gray-600">
            Section {currentSection} of {totalSections}
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LaunchPlusAssessment;