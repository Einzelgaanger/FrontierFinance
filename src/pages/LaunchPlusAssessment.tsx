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
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0">
          <img 
            src="/Launch+2.jpg" 
            alt="Launch+ Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
        </div>
        <Card className="max-w-2xl w-full backdrop-blur-xl bg-slate-900/40 shadow-2xl rounded-3xl border border-white/10 relative z-10">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-4 bg-green-500/20 rounded-full backdrop-blur-sm border border-green-500/30">
                <CheckCircle2 className="h-20 w-20 text-green-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-4">Thank You!</h2>
            <p className="text-xl text-gray-200 mb-8">
              Your assessment has been submitted successfully. We will review your information and get back to you soon.
            </p>
            <p className="text-sm text-gray-400">
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
          <Card className="shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/40 rounded-3xl animate-fade-in hover:shadow-blue-500/20 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-blue-900/50 rounded-t-3xl pb-8 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm border border-blue-500/30">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Basic Information</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-300">Tell us about yourself and your fund</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-base font-semibold text-gray-200">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name', { required: true })}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <span className="text-sm text-red-400">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-200">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-sm text-red-400">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_whatsapp" className="text-base font-semibold text-gray-200">Phone / WhatsApp</Label>
                  <Input
                    id="phone_whatsapp"
                    {...register('phone_whatsapp')}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_name" className="text-base font-semibold text-gray-200">Fund Name *</Label>
                  <Input
                    id="fund_name"
                    {...register('fund_name', { required: true })}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="Your Fund Name"
                  />
                  {errors.fund_name && <span className="text-sm text-red-400">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_website" className="text-base font-semibold text-gray-200">Fund Website</Label>
                  <Input
                    id="fund_website"
                    {...register('fund_website')}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="https://yourfund.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile" className="text-base font-semibold text-gray-200">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    {...register('linkedin_profile')}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-base font-semibold text-gray-200">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl transition-all backdrop-blur-sm"
                  rows={3}
                  placeholder="Your complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_social_media" className="text-base font-semibold text-gray-200">Other Social Media</Label>
                <Textarea
                  id="other_social_media"
                  {...register('other_social_media')}
                  className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl transition-all backdrop-blur-sm"
                  rows={2}
                  placeholder="Instagram, X (Twitter), Facebook, etc."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card className="shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/40 rounded-3xl animate-fade-in hover:shadow-purple-500/20 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 rounded-t-3xl pb-8 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-full backdrop-blur-sm border border-purple-500/30">
                  <Briefcase className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Stage of Fund</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-300">Help us understand where you are in your journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
                      className="flex items-start space-x-4 p-5 border-2 border-white/10 bg-slate-800/30 rounded-2xl hover:bg-slate-700/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
                    >
                      <Checkbox
                        checked={fundStages.includes(stage.value)}
                        onCheckedChange={() => handleCheckboxChange('fund_stages', stage.value)}
                        className="mt-1 border-white/20"
                      />
                      <div className="flex-1">
                        <Label className="font-bold text-base cursor-pointer text-gray-200">{stage.label}</Label>
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="stage_explanation" className="text-base font-semibold text-gray-200">
                  If you fall between two stages, please explain (Optional)
                </Label>
                <p className="text-sm text-gray-400">Note: If you selected "concept" or "scale" stage, this opportunity may not be the right fit for you.</p>
                <Textarea
                  id="stage_explanation"
                  {...register('stage_explanation')}
                  className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-purple-500 rounded-xl transition-all backdrop-blur-sm"
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
            <Card className="shadow-2xl border border-white/10 backdrop-blur-xl bg-slate-900/40 rounded-3xl animate-fade-in hover:shadow-amber-500/20 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-900/50 via-purple-900/50 to-blue-900/50 rounded-t-3xl pb-8 border-b border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-full backdrop-blur-sm border border-amber-500/30">
                    <Target className="w-6 h-6 text-amber-400" />
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">Eligibility for LAUNCH+</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-300">Tell us about your needs and current status</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {/* Services Interest */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Which LAUNCH+ services are you interested in? (Select all that apply)
                  </Label>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-base font-semibold text-purple-300 bg-purple-900/30 p-3 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                        Shared Services (Mandatory, Phase I - Partially Subsidized)
                      </p>
                      {[
                        'Shared back-office services (accounting, finance, tax, legal, HR)',
                        'Fund administration services',
                        'Capacity building and knowledge services (strategy, governance, impact measurement)'
                      ].map((service) => (
                        <div key={service} className="flex items-start space-x-4 p-4 border-2 border-white/10 bg-slate-800/30 rounded-2xl hover:bg-slate-700/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                          <Checkbox
                            checked={interestedServices.includes(service)}
                            onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                            className="mt-1 border-white/20"
                          />
                          <Label className="cursor-pointer text-sm leading-relaxed text-gray-300">{service}</Label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-base font-semibold text-green-300 bg-green-900/30 p-3 rounded-xl border border-green-500/30 backdrop-blur-sm">
                        Capital Support (Optional, Phase II - Repayable)
                      </p>
                      {[
                        'Op-Ex line of credit',
                        'Warehousing line of credit'
                      ].map((service) => (
                        <div key={service} className="flex items-start space-x-4 p-4 border-2 border-white/10 bg-slate-800/30 rounded-2xl hover:bg-slate-700/30 hover:border-green-500/50 transition-all duration-300 backdrop-blur-sm">
                          <Checkbox
                            checked={interestedServices.includes(service)}
                            onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                            className="mt-1 border-white/20"
                          />
                          <Label className="cursor-pointer text-sm leading-relaxed text-gray-300">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Geographical Focus */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Geographic Focus (Select all regions you invest in)
                  </Label>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'East Africa',
                      'West Africa',
                      'Central Africa',
                      'Southern Africa',
                      'North Africa',
                      'Pan-African'
                    ].map((region) => (
                      <div 
                        key={region} 
                        className="flex items-center space-x-3 p-4 border-2 border-white/10 bg-slate-800/30 rounded-2xl hover:bg-slate-700/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                      >
                        <Checkbox
                          checked={geographicalFocus.includes(region)}
                          onCheckedChange={() => handleCheckboxChange('geographical_focus', region)}
                          className="border-white/20"
                        />
                        <Label className="cursor-pointer text-sm text-gray-300">{region}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legal Status */}
                <div className="space-y-3">
                  <Label htmlFor="legal_status" className="text-base font-semibold text-gray-200">
                    Legal Status / Structure
                  </Label>
                  <Input
                    id="legal_status"
                    {...register('legal_status')}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                    placeholder="e.g., LLC, Limited Partnership, Trust"
                  />
                </div>

                {/* Operations vs Domicile */}
                <div className="space-y-3">
                  <Label htmlFor="operations_vs_domicile" className="text-base font-semibold text-gray-200">
                    Operations vs Domiciliation Locations
                  </Label>
                  <Textarea
                    id="operations_vs_domicile"
                    {...register('operations_vs_domicile')}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl transition-all backdrop-blur-sm"
                    rows={3}
                    placeholder="Where do you operate vs where are you legally domiciled?"
                  />
                </div>

                {/* Capital Raised */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Capital Raised to Date (USD)
                  </Label>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_grants" className="text-sm text-gray-300">Grants</Label>
                      <Input
                        id="capital_raised_grants"
                        type="number"
                        {...register('capital_raised_grants', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_first_loss" className="text-sm text-gray-300">First Loss Capital</Label>
                      <Input
                        id="capital_raised_first_loss"
                        type="number"
                        {...register('capital_raised_first_loss', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_equity" className="text-sm text-gray-300">Equity</Label>
                      <Input
                        id="capital_raised_equity"
                        type="number"
                        {...register('capital_raised_equity', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_debt" className="text-sm text-gray-300">Debt</Label>
                      <Input
                        id="capital_raised_debt"
                        type="number"
                        {...register('capital_raised_debt', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_senior" className="text-sm text-gray-300">Senior Capital</Label>
                      <Input
                        id="capital_raised_senior"
                        type="number"
                        {...register('capital_raised_senior', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_raised_other" className="text-sm text-gray-300">Other</Label>
                      <Input
                        id="capital_raised_other"
                        type="number"
                        {...register('capital_raised_other', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_other_description" className="text-sm text-gray-300">
                      If "Other", please describe
                    </Label>
                    <Textarea
                      id="capital_raised_other_description"
                      {...register('capital_raised_other_description')}
                      className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl transition-all backdrop-blur-sm"
                      rows={2}
                      placeholder="Describe other capital sources..."
                    />
                  </div>
                </div>

                {/* Investment Activity */}
                <div className="space-y-4">
                  <Label className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Investment Activity
                  </Label>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investments_count" className="text-sm text-gray-300">Number of Investments Made</Label>
                      <Input
                        id="investments_count"
                        type="number"
                        {...register('investments_count', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_committed" className="text-sm text-gray-300">Capital Committed (USD)</Label>
                      <Input
                        id="capital_committed"
                        type="number"
                        {...register('capital_committed', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capital_disbursed" className="text-sm text-gray-300">Capital Disbursed (USD)</Label>
                      <Input
                        id="capital_disbursed"
                        type="number"
                        {...register('capital_disbursed', { valueAsNumber: true })}
                        className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl h-12 transition-all backdrop-blur-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Program Expectations */}
                <div className="space-y-3">
                  <Label htmlFor="program_expectations" className="text-base font-semibold text-gray-200">
                    What are your expectations from the LAUNCH+ program? (Max 250 words) *
                  </Label>
                  <Textarea
                    id="program_expectations"
                    {...register('program_expectations', { 
                      required: true,
                      maxLength: 1500
                    })}
                    className="border-2 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500 rounded-xl transition-all backdrop-blur-sm"
                    rows={6}
                    placeholder="Tell us what you hope to achieve through LAUNCH+..."
                  />
                  {errors.program_expectations && (
                    <span className="text-sm text-red-400">This field is required (max 250 words)</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/Launch+2.jpg" 
          alt="Launch+ Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-4">
            LAUNCH+ Capital Facility
          </h1>
          <p className="text-gray-300 text-xl">Assessment Questionnaire</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-300">
              Section {currentSection} of {totalSections}
            </span>
            <span className="text-sm font-medium text-blue-400">
              {Math.round((currentSection / totalSections) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden shadow-inner border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-blue-500/50"
              style={{ width: `${(currentSection / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="mb-8">
          {renderSection()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentSection === 1}
            variant="outline"
            className="rounded-xl px-8 py-3 border-2 border-blue-500/30 bg-slate-800/50 text-gray-200 hover:border-blue-500 hover:bg-blue-500/20 transition-all duration-200 disabled:opacity-30"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Previous
          </Button>
          
          {currentSection === totalSections ? (
            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="rounded-xl px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-xl px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200 text-white font-semibold"
            >
              Next
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchPlusAssessment;
