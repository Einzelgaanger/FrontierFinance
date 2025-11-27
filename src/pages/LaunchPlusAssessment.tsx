import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, User, Briefcase, Target, Send } from 'lucide-react';

// Validation schemas for each section
const section1Schema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  phone_whatsapp: z.string().optional(),
  fund_name: z.string().min(1, 'Fund name is required').max(200, 'Fund name must be less than 200 characters'),
  fund_website: z.string().optional(),
  linkedin_profile: z.string().optional(),
  address: z.string().optional(),
  other_social_media: z.string().optional(),
});

const section2Schema = z.object({
  fund_stages: z.array(z.string()).min(1, 'Please select at least one fund stage'),
  stage_explanation: z.string().optional(),
});

const section3Schema = z.object({
  interested_services: z.array(z.string()).min(1, 'Please select at least one service'),
  geographical_focus: z.array(z.string()).min(1, 'Please select at least one geographical focus'),
  legal_status: z.string().optional(),
  operations_vs_domicile: z.string().optional(),
  capital_raised_grants: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_first_loss: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_equity: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_debt: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_senior: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_other: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_raised_other_description: z.string().optional(),
  investments_count: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_committed: z.number().min(0, 'Must be 0 or greater').optional(),
  capital_disbursed: z.number().min(0, 'Must be 0 or greater').optional(),
  program_expectations: z.string().optional(),
});

const fullSchema = section1Schema.merge(section2Schema).merge(section3Schema);

type AssessmentFormData = z.infer<typeof fullSchema>;

const LaunchPlusAssessment = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<AssessmentFormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  });

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
    trigger(field);
  };

  const validateSection = async (section: number): Promise<boolean> => {
    let fieldsToValidate: (keyof AssessmentFormData)[] = [];
    
    switch(section) {
      case 1:
        fieldsToValidate = ['full_name', 'email', 'phone_whatsapp', 'fund_name', 'fund_website', 'linkedin_profile', 'address', 'other_social_media'];
        break;
      case 2:
        fieldsToValidate = ['fund_stages', 'stage_explanation'];
        break;
      case 3:
        fieldsToValidate = ['interested_services', 'geographical_focus', 'legal_status', 'operations_vs_domicile', 'program_expectations'];
        break;
    }

    const result = await trigger(fieldsToValidate);
    
    if (!result) {
      toast.error('Please complete all required fields before proceeding');
    }
    
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateSection(currentSection);
    if (isValid && currentSection < totalSections) {
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

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    try {
      // Clean data - remove empty values but keep 0 and false
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        // Keep the value if it's not null, undefined, or empty string
        // But keep 0, false, and empty arrays
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        } else if (value === 0 || (typeof value === 'boolean' && value === false) || (Array.isArray(value) && value.length === 0)) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, unknown>);

      console.log('Submitting assessment data:', { 
        fieldsCount: Object.keys(cleanData).length,
        hasEmail: !!cleanData.email,
        hasFundName: !!cleanData.fund_name
      });

      // Type assertion needed because we're dynamically building the insert object
      // Validation ensures required fields (email, full_name, fund_name) are present
      const insertPayload = {
        ...cleanData,
        submission_status: 'completed',
        ip_address: null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      };
      
      const { data: insertData, error } = await supabase
        .from('launch_plus_assessments')
        // @ts-expect-error - TypeScript can't infer the exact shape, but validation ensures required fields exist
        .insert([insertPayload])
        .select();

      if (error) {
        console.error('Supabase submission error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Provide more specific error messages
        let errorMessage = 'Failed to submit assessment. Please try again.';
        if (error.code === '23505') {
          errorMessage = 'This email has already been used. Please use a different email address.';
        } else if (error.code === '23503') {
          errorMessage = 'Invalid data. Please check all fields and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }

      if (!insertData || insertData.length === 0) {
        throw new Error('No data returned from server. Submission may have failed.');
      }

      console.log('Assessment submitted successfully:', insertData[0]?.id);
      setIsSubmitted(true);
      toast.success('Assessment submitted successfully!');
      
      // Redirect to homepage after successful submission
      // Can be configured via VITE_APP_URL if needed
      const redirectUrl = import.meta.env.VITE_APP_URL || 'https://escpnetwork.net/';
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000);
    } catch (error: unknown) {
      const errorMessage = 
        (error instanceof Error && error.message) ||
        (typeof error === 'object' && error !== null && 'error' in error && typeof (error as { error?: { message?: string } }).error?.message === 'string' 
          ? (error as { error: { message: string } }).error.message 
          : null) ||
        'Failed to submit assessment. Please check your connection and try again.';
      
      console.error('Submission error details:', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white shadow-lg border border-gray-200">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-50 rounded-full border-2 border-green-200">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-lg text-gray-700 mb-8">
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

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Card className="shadow-md border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-700 rounded">
                  <User className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Basic Information</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Tell us about yourself and your fund</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && <span className="text-sm text-red-600">{errors.full_name.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_whatsapp" className="text-sm font-medium text-gray-700">Phone / WhatsApp</Label>
                  <Input
                    id="phone_whatsapp"
                    {...register('phone_whatsapp')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_name" className="text-sm font-medium text-gray-700">Fund Name *</Label>
                  <Input
                    id="fund_name"
                    {...register('fund_name')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="Your Fund Name"
                  />
                  {errors.fund_name && <span className="text-sm text-red-600">{errors.fund_name.message}</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_website" className="text-sm font-medium text-gray-700">Fund Website</Label>
                  <Input
                    id="fund_website"
                    {...register('fund_website')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="https://yourfund.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile" className="text-sm font-medium text-gray-700">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    {...register('linkedin_profile')}
                    className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={3}
                  placeholder="Your complete address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_social_media" className="text-sm font-medium text-gray-700">Other Social Media</Label>
                <Textarea
                  id="other_social_media"
                  {...register('other_social_media')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={2}
                  placeholder="Instagram, X (Twitter), Facebook, etc."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 2:
        return (
          <Card className="shadow-md border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-700 rounded">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Stage of Fund</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Help us understand where you are in your journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium text-gray-900">
                  Which stage best represents your current fund? (Select all that apply) *
                </Label>
                
                <div className="space-y-3">
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
                      className="flex items-start space-x-3 p-4 border border-gray-300 bg-white rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        checked={fundStages.includes(stage.value)}
                        onCheckedChange={() => handleCheckboxChange('fund_stages', stage.value)}
                        className="mt-1 border-gray-400"
                      />
                      <div className="flex-1">
                        <Label className="font-medium text-sm cursor-pointer text-gray-900">{stage.label}</Label>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.fund_stages && <span className="text-sm text-red-600">{errors.fund_stages.message}</span>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="stage_explanation" className="text-sm font-medium text-gray-700">
                  If you fall between two stages, please explain (Optional)
                </Label>
                <p className="text-sm text-gray-500">Note: If you selected "concept" or "scale" stage, this opportunity may not be the right fit for you.</p>
                <Textarea
                  id="stage_explanation"
                  {...register('stage_explanation')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={5}
                  placeholder="Describe where you are in your fund journey..."
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case 3:
        return (
          <Card className="shadow-md border border-gray-200 bg-white">
            <CardHeader className="bg-gray-50 border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-700 rounded">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900">Eligibility for LAUNCH+</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">Tell us about your needs and current status</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Interested Services (Select all that apply) *</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'shared_back_office', label: 'Shared Back-office Services' },
                      { value: 'fund_administration', label: 'Fund Administration' },
                      { value: 'capacity_building', label: 'Capacity Building/TA Support' },
                      { value: 'opex_financing', label: 'Op-ex Financing' },
                      { value: 'warehousing_capital', label: 'Warehousing Lines of Credit' },
                    ].map(service => (
                      <div key={service.value} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          checked={interestedServices.includes(service.value)}
                          onCheckedChange={() => handleCheckboxChange('interested_services', service.value)}
                          className="border-gray-400"
                          id={`service-${service.value}`}
                        />
                        <Label htmlFor={`service-${service.value}`} className="cursor-pointer text-sm text-gray-700">{service.label}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.interested_services && <span className="text-sm text-red-600">{errors.interested_services.message}</span>}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Geographical Focus (Select all that apply) *</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'west_africa', label: 'West Africa' },
                      { value: 'east_africa', label: 'East Africa' },
                      { value: 'central_africa', label: 'Central Africa' },
                      { value: 'southern_africa', label: 'Southern Africa' },
                      { value: 'north_africa', label: 'North Africa' },
                    ].map(region => (
                      <div key={region.value} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          checked={geographicalFocus.includes(region.value)}
                          onCheckedChange={() => handleCheckboxChange('geographical_focus', region.value)}
                          className="border-gray-400"
                          id={`region-${region.value}`}
                        />
                        <Label htmlFor={`region-${region.value}`} className="cursor-pointer text-sm text-gray-700">{region.label}</Label>
                      </div>
                    ))}
                  </div>
                  {errors.geographical_focus && <span className="text-sm text-red-600">{errors.geographical_focus.message}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="legal_status" className="text-sm font-medium text-gray-700">Legal Status</Label>
                <Input
                  id="legal_status"
                  {...register('legal_status')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                  placeholder="Describe your fund's legal status"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operations_vs_domicile" className="text-sm font-medium text-gray-700">Operations vs Domicile</Label>
                <Textarea
                  id="operations_vs_domicile"
                  {...register('operations_vs_domicile')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={3}
                  placeholder="Explain your operations and domicile setup"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Capital Raised (in USD)</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_grants" className="text-xs text-gray-600">Grants</Label>
                    <Input
                      id="capital_raised_grants"
                      type="number"
                      {...register('capital_raised_grants', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_first_loss" className="text-xs text-gray-600">First Loss</Label>
                    <Input
                      id="capital_raised_first_loss"
                      type="number"
                      {...register('capital_raised_first_loss', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_equity" className="text-xs text-gray-600">Equity</Label>
                    <Input
                      id="capital_raised_equity"
                      type="number"
                      {...register('capital_raised_equity', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_debt" className="text-xs text-gray-600">Debt</Label>
                    <Input
                      id="capital_raised_debt"
                      type="number"
                      {...register('capital_raised_debt', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_senior" className="text-xs text-gray-600">Senior Capital</Label>
                    <Input
                      id="capital_raised_senior"
                      type="number"
                      {...register('capital_raised_senior', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_raised_other" className="text-xs text-gray-600">Other</Label>
                    <Input
                      id="capital_raised_other"
                      type="number"
                      {...register('capital_raised_other', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capital_raised_other_description" className="text-sm font-medium text-gray-700">If Other, please describe</Label>
                <Textarea
                  id="capital_raised_other_description"
                  {...register('capital_raised_other_description')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={3}
                  placeholder="Describe other capital sources"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Investment Information</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investments_count" className="text-xs text-gray-600">Number of Investments</Label>
                    <Input
                      id="investments_count"
                      type="number"
                      {...register('investments_count', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_committed" className="text-xs text-gray-600">Capital Committed (USD)</Label>
                    <Input
                      id="capital_committed"
                      type="number"
                      {...register('capital_committed', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_disbursed" className="text-xs text-gray-600">Capital Disbursed (USD)</Label>
                    <Input
                      id="capital_disbursed"
                      type="number"
                      {...register('capital_disbursed', { valueAsNumber: true })}
                      className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md h-10"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program_expectations" className="text-sm font-medium text-gray-700">What do you expect from the LAUNCH+ program? (Max 250 words)</Label>
                <Textarea
                  id="program_expectations"
                  {...register('program_expectations')}
                  className="border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500 rounded-md"
                  rows={5}
                  placeholder="Describe your expectations from the LAUNCH+ program..."
                  maxLength={1500}
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden p-4">
      {/* Background image */}
      <div className="fixed inset-0 z-0 opacity-20">
        <img 
          src="/Launch%2B2.jpg" 
          alt="Launch+ Background" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/Launch+2.jpg";
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            LAUNCH+ Assessment
          </h1>
          <p className="text-base text-gray-600">Section {currentSection} of {totalSections}</p>
          
          {/* Progress Bar */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-full bg-gray-700 rounded-full transition-all duration-500"
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
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentSection < totalSections ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-6"
              >
                Next Section
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-md px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Assessment
                    <Send className="ml-2 h-4 w-4" />
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
