import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AssessmentFormData>();

  const fundStages = watch('fund_stages') || [];
  const interestedServices = watch('interested_services') || [];
  const geographicalFocus = watch('geographical_focus') || [];

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
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-accent flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-success/10 rounded-full">
                <CheckCircle2 className="h-20 w-20 text-success" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-primary mb-4">Thank You!</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Your assessment has been submitted successfully. We will review your information and get back to you soon.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting you to our website...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">LAUNCH+ Assessment</h1>
          <p className="text-lg text-muted-foreground">Help us understand your fund better</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <Card className="shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">Section 1: Basic Information</CardTitle>
              <CardDescription>Tell us about yourself and your fund</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Name *</Label>
                  <Input
                    id="full_name"
                    {...register('full_name', { required: true })}
                    className="border-primary/20"
                  />
                  {errors.full_name && <span className="text-sm text-destructive">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: true })}
                    className="border-primary/20"
                  />
                  {errors.email && <span className="text-sm text-destructive">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_whatsapp">Phone / WhatsApp</Label>
                  <Input
                    id="phone_whatsapp"
                    {...register('phone_whatsapp')}
                    className="border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_name">Fund Name *</Label>
                  <Input
                    id="fund_name"
                    {...register('fund_name', { required: true })}
                    className="border-primary/20"
                  />
                  {errors.fund_name && <span className="text-sm text-destructive">This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fund_website">Fund Website</Label>
                  <Input
                    id="fund_website"
                    {...register('fund_website')}
                    className="border-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_profile"
                    {...register('linkedin_profile')}
                    className="border-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  className="border-primary/20"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_social_media">Other Social Media (Instagram, X, etc.)</Label>
                <Textarea
                  id="other_social_media"
                  {...register('other_social_media')}
                  className="border-primary/20"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Stage of Fund */}
          <Card className="shadow-lg">
            <CardHeader className="bg-accent/5">
              <CardTitle className="text-2xl">Section 2: Stage of Fund</CardTitle>
              <CardDescription>Help us understand where you are in your journey</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Which stage best represents your current fund? (Select all that apply)
                </Label>
                
                <div className="space-y-4">
                  {[
                    { value: 'concept', label: 'Concept Stage', description: 'Developing investment thesis, refining model. Seeking catalytic grant capital for fund design and early market testing.' },
                    { value: 'pilot', label: 'Pilot Stage', description: 'Budget $500k-$2M. Team consists of founding partners. May not have permanent legal vehicle. Fundraising and seeking support to validate thesis.' },
                    { value: 'implementation', label: 'Implementation Stage', description: 'Raised ~$2-5M for investing. Targeting sub $20M fund size. Secured partial operational funding. Assessing optimal fund structures.' },
                    { value: 'scale', label: 'Scale Stage', description: 'Target ≥$20M AUM. Established team, legal vehicle, governance, and operations. Demonstrated investment thesis. Seeking DFI and institutional capital.' }
                  ].map((stage) => (
                    <div key={stage.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                      <Checkbox
                        checked={fundStages.includes(stage.value)}
                        onCheckedChange={() => handleCheckboxChange('fund_stages', stage.value)}
                      />
                      <div className="flex-1">
                        <Label className="font-semibold cursor-pointer">{stage.label}</Label>
                        <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage_explanation">
                  If you fall between two stages, please explain (Optional)
                </Label>
                <Textarea
                  id="stage_explanation"
                  {...register('stage_explanation')}
                  className="border-primary/20"
                  rows={4}
                  placeholder="Describe where you are in your fund journey..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Eligibility */}
          <Card className="shadow-lg">
            <CardHeader className="bg-success/5">
              <CardTitle className="text-2xl">Section 3: Eligibility for LAUNCH+</CardTitle>
              <CardDescription>Tell us about your needs and current status</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {/* Services Interest */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Which LAUNCH+ services are you interested in? (Select all that apply)
                </Label>
                
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted-foreground">Shared Services (Mandatory, Phase I):</p>
                  {[
                    'Shared back-office services (accounting, finance, tax, legal, HR)',
                    'Fund administration services',
                    'Capacity building and knowledge services'
                  ].map((service) => (
                    <div key={service} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                      <Checkbox
                        checked={interestedServices.includes(service)}
                        onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                      />
                      <Label className="cursor-pointer">{service}</Label>
                    </div>
                  ))}

                  <p className="text-sm font-medium text-muted-foreground mt-6">Capital Support (Optional, Phase II):</p>
                  {[
                    'Op-Ex line of credit',
                    'Warehousing line of credit'
                  ].map((service) => (
                    <div key={service} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                      <Checkbox
                        checked={interestedServices.includes(service)}
                        onCheckedChange={() => handleCheckboxChange('interested_services', service)}
                      />
                      <Label className="cursor-pointer">{service}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographical Focus */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Geographical Focus (Select all that apply)
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
                    'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa',
                    'Middle East', 'Other'
                  ].map((region) => (
                    <div key={region} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/5">
                      <Checkbox
                        checked={geographicalFocus.includes(region)}
                        onCheckedChange={() => handleCheckboxChange('geographical_focus', region)}
                      />
                      <Label className="cursor-pointer">{region}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Status */}
              <div className="space-y-2">
                <Label htmlFor="legal_status">Fund's Current Legal Status (Structure and date)</Label>
                <Textarea
                  id="legal_status"
                  {...register('legal_status')}
                  className="border-primary/20"
                  rows={3}
                  placeholder="e.g., LLC incorporated in Delaware, January 2023"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operations_vs_domicile">Fund Operations vs. Legal Domiciliation</Label>
                <Textarea
                  id="operations_vs_domicile"
                  {...register('operations_vs_domicile')}
                  className="border-primary/20"
                  rows={3}
                  placeholder="Describe where your fund operates vs. where it is legally domiciled"
                />
              </div>

              {/* Capital Raised */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  How much have you raised to date? (USD Equivalent)
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
                      <Label htmlFor={item.field}>{item.label}</Label>
                      <Input
                        id={item.field}
                        type="number"
                        step="0.01"
                        {...register(item.field as any, { valueAsNumber: true })}
                        className="border-primary/20"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capital_raised_other_description">Other (please specify)</Label>
                  <Input
                    id="capital_raised_other_description"
                    {...register('capital_raised_other_description')}
                    className="border-primary/20"
                    placeholder="Describe other capital sources"
                  />
                </div>
              </div>

              {/* Investments */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Investment Activity</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investments_count">Number of Investments</Label>
                    <Input
                      id="investments_count"
                      type="number"
                      {...register('investments_count', { valueAsNumber: true })}
                      className="border-primary/20"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_committed">Capital Committed (USD)</Label>
                    <Input
                      id="capital_committed"
                      type="number"
                      step="0.01"
                      {...register('capital_committed', { valueAsNumber: true })}
                      className="border-primary/20"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capital_disbursed">Capital Disbursed (USD)</Label>
                    <Input
                      id="capital_disbursed"
                      type="number"
                      step="0.01"
                      {...register('capital_disbursed', { valueAsNumber: true })}
                      className="border-primary/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Program Expectations */}
              <div className="space-y-2">
                <Label htmlFor="program_expectations">
                  What are you looking to get out of the LAUNCH+ Program? (250 words max)
                </Label>
                <Textarea
                  id="program_expectations"
                  {...register('program_expectations')}
                  className="border-primary/20"
                  rows={6}
                  placeholder="Describe your expectations and goals..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-6 pb-12">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="px-16 py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaunchPlusAssessment;