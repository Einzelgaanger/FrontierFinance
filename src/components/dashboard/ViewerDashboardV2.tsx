// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Link, Plus, CheckCircle, Users, ArrowRight, Rocket, BarChart3 } from 'lucide-react';
import { CountrySelector } from '@/components/survey/CountrySelector';

const ViewerDashboardV2 = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const [formData, setFormData] = useState({
    // Background Information
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    domicile_countries: [] as string[],
    
    // Team Information
    role_job_title: '',
    team_overview: '',
    
    // Vehicle Information
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    supporting_documents: [] as string[],
    supporting_document_links: [] as string[],
    
    // Network Expectations
    expectations_from_network: '',
    how_heard_about_network: '',
    topics_of_interest: [] as string[],
  });

  const topics = [
    'Investment Opportunities',
    'Market Research',
    'Due Diligence',
    'Regulatory Updates',
    'Technology Trends',
    'ESG Practices',
    'Risk Management',
    'Fundraising',
    'Exit Strategies',
    'Networking Events'
  ];

  const surveyYears = [
    { year: '2021', path: '/survey/2021', available: true },
    { year: '2022', path: '/survey/2022', available: true },
    { year: '2023', path: '/survey/2023', available: true },
    { year: '2024', path: '/survey/2024', available: true }
  ];

  const uploadToDatabase = async (file: File, userId: string) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const fileData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: base64Data,
          uploadedAt: new Date().toISOString()
        };
        resolve(JSON.stringify(fileData));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const uploadedFiles: string[] = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive"
          });
          continue;
        }
        const fileData = await uploadToDatabase(file, user?.id || 'anonymous');
        uploadedFiles.push(fileData);
        toast({
          title: "File Uploaded Successfully",
          description: `${file.name} uploaded to database`,
          variant: "default"
        });
      }
      setFormData(prev => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, ...uploadedFiles]
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLinkUpload = async (link: string) => {
    if (!link.trim()) return;
    
    setUploading(true);
    try {
      const linkData = {
        fileName: link,
        fileSize: 0,
        fileType: 'link',
        data: link,
        uploadedAt: new Date().toISOString()
      };
      
      setFormData(prev => ({
        ...prev,
        supporting_document_links: [...prev.supporting_document_links, JSON.stringify(linkData)]
      }));
      
      toast({
        title: "Link Added Successfully",
        description: "Document link added to your application",
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Link Addition Failed",
        description: "Failed to add link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics_of_interest: prev.topics_of_interest.includes(topic)
        ? prev.topics_of_interest.filter(t => t !== topic)
        : [...prev.topics_of_interest, topic]
    }));
  };


  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.organization_website && formData.domicile_countries.length > 0);
      case 2:
        return !!(formData.role_job_title && formData.team_overview);
      case 3:
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4:
        return !!(formData.expectations_from_network && formData.how_heard_about_network);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateSection(currentSection)) {
      toast({
        title: "Incomplete Section",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentSection === 4) {
      await handleSubmit();
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(4)) {
      toast({
        title: "Incomplete Application",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        user_id: user?.id,
        email: formData.email,
        company_name: formData.vehicle_name, // Using vehicle_name as company_name for compatibility
        applicant_name: formData.applicant_name,
        vehicle_name: formData.vehicle_name,
        organization_website: formData.organization_website,
        domicile_countries: formData.domicile_countries || [],
        role_job_title: formData.role_job_title,
        team_overview: formData.team_overview,
        investment_thesis: formData.investment_thesis,
        typical_check_size: formData.typical_check_size,
        number_of_investments: formData.number_of_investments,
        amount_raised_to_date: formData.amount_raised_to_date,
        supporting_documents: formData.supporting_documents || [],
        supporting_document_links: formData.supporting_document_links || [],
        expectations_from_network: formData.expectations_from_network,
        how_heard_about_network: formData.how_heard_about_network,
        topics_of_interest: formData.topics_of_interest || [],
        status: 'pending'
      };

      const { error } = await supabase
        .from('applications')
        .insert([applicationData]);

      if (error) {
        throw error;
      }

      setShowSuccessMessage(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been submitted for review. We'll get back to you soon.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (section: number) => {
    switch (section) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full text-blue-700 text-xs font-semibold">
                  Step 1 of 4
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">Tell Us About You! 👋</h3>
              <p className="text-gray-700 mb-6 text-base">Let's start with the basics - who you are and what your organization does.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicant_name" className="text-gray-700 font-medium">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_name" className="text-gray-700 font-medium">Vehicle/Organization Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_name: e.target.value }))}
                  placeholder="Enter vehicle or organization name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization_website" className="text-gray-700 font-medium">Organization Website *</Label>
                <Input
                  id="organization_website"
                  value={formData.organization_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization_website: e.target.value }))}
                  placeholder="https://example.com"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Domicile Countries *</Label>
              <CountrySelector
                value={formData.domicile_countries || []}
                onChange={(countries) => setFormData(prev => ({ ...prev, domicile_countries: countries }))}
                placeholder="Select countries where your organization is domiciled"
                label="Domicile Countries"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 rounded-full text-green-700 text-xs font-semibold">
                  Step 2 of 4
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3">Your Amazing Team! 👥</h3>
              <p className="text-gray-700 mb-6 text-base">We'd love to know more about your team and your role in the organization.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role_job_title" className="text-gray-700 font-semibold">Your Role/Job Title *</Label>
                <Input
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_job_title: e.target.value }))}
                  placeholder="e.g., Managing Partner, Investment Director"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_overview" className="text-gray-700 font-semibold">Team Overview *</Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_overview: e.target.value }))}
                  placeholder="Describe your team structure, key members, and their backgrounds"
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 shadow-sm"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full text-purple-700 text-xs font-semibold">
                  Step 3 of 4
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-3">Your Investment Strategy! 💼</h3>
              <p className="text-gray-700 mb-6 text-base">Share details about your investment vehicle and what makes your approach unique.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="investment_thesis" className="text-gray-700 font-semibold">Investment Thesis *</Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_thesis: e.target.value }))}
                  placeholder="Describe your investment strategy, focus areas, and approach"
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typical_check_size" className="text-gray-700 font-semibold">Typical Check Size *</Label>
                  <Select
                    value={formData.typical_check_size}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, typical_check_size: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm">
                      <SelectValue placeholder="Select check size range" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="under-100k" className="hover:bg-purple-50">Under $100K</SelectItem>
                      <SelectItem value="100k-500k" className="hover:bg-purple-50">$100K - $500K</SelectItem>
                      <SelectItem value="500k-1m" className="hover:bg-purple-50">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m" className="hover:bg-purple-50">$1M - $5M</SelectItem>
                      <SelectItem value="5m-10m" className="hover:bg-purple-50">$5M - $10M</SelectItem>
                      <SelectItem value="over-10m" className="hover:bg-purple-50">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number_of_investments" className="text-gray-700 font-semibold">Number of Investments *</Label>
                  <Select
                    value={formData.number_of_investments}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, number_of_investments: value }))}
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm">
                      <SelectValue placeholder="Select number of investments" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="1-5" className="hover:bg-purple-50">1-5</SelectItem>
                      <SelectItem value="6-10" className="hover:bg-purple-50">6-10</SelectItem>
                      <SelectItem value="11-20" className="hover:bg-purple-50">11-20</SelectItem>
                      <SelectItem value="21-50" className="hover:bg-purple-50">21-50</SelectItem>
                      <SelectItem value="over-50" className="hover:bg-purple-50">Over 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount_raised_to_date" className="text-gray-700 font-semibold">Amount Raised to Date *</Label>
                <Select
                  value={formData.amount_raised_to_date}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, amount_raised_to_date: value }))}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm">
                    <SelectValue placeholder="Select amount raised" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="under-10m" className="hover:bg-purple-50">Under $10M</SelectItem>
                    <SelectItem value="10m-25m" className="hover:bg-purple-50">$10M - $25M</SelectItem>
                    <SelectItem value="25m-50m" className="hover:bg-purple-50">$25M - $50M</SelectItem>
                    <SelectItem value="50m-100m" className="hover:bg-purple-50">$50M - $100M</SelectItem>
                    <SelectItem value="100m-250m" className="hover:bg-purple-50">$100M - $250M</SelectItem>
                    <SelectItem value="over-250m" className="hover:bg-purple-50">Over $250M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Supporting Documents */}
              <div className="space-y-4">
                <Label className="text-gray-700 font-semibold">Supporting Documents</Label>
                <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 bg-purple-50/50 hover:bg-purple-50 transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <p className="text-sm text-gray-700 mb-4 font-medium">
                      Upload supporting documents (pitch decks, financials, etc.)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      aria-label="Upload supporting documents"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-white shadow-sm hover:shadow-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Max 5 files, 10MB each</p>
                  </div>
                  
                  {/* Display uploaded files */}
                  {formData.supporting_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Uploaded Files:</p>
                      {formData.supporting_documents.map((fileData, index) => {
                        const parsedData = JSON.parse(fileData);
                        return (
                          <div key={index} className="flex items-center text-xs text-gray-600 bg-white px-3 py-2 rounded-lg">
                            <FileText className="w-3 h-3 mr-2 text-purple-500" />
                            <span className="truncate">{parsedData.fileName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {/* Document Links */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold">Document Links (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste document links here"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleLinkUpload(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Paste document links here"]') as HTMLInputElement;
                        if (input?.value) {
                          handleLinkUpload(input.value);
                          input.value = '';
                        }
                      }}
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-white shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Display uploaded links */}
                  {formData.supporting_document_links.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.supporting_document_links.map((linkData, index) => {
                        const parsedData = JSON.parse(linkData);
                        return (
                          <div key={index} className="flex items-center text-xs text-gray-600 bg-white px-3 py-2 rounded-lg">
                            <Link className="w-3 h-3 mr-2 text-purple-500" />
                            <span className="truncate">{parsedData.fileName}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full text-orange-700 text-xs font-semibold">
                  Step 4 of 4
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">What Are You Looking For? 🎯</h3>
              <p className="text-gray-700 mb-6 text-base">Help us understand how we can best support you and what brought you here.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expectations_from_network" className="text-gray-700 font-semibold">What do you expect from the CFF Network? *</Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectations_from_network: e.target.value }))}
                  placeholder="Describe how you plan to use the network and what value you hope to gain"
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="how_heard_about_network" className="text-gray-700 font-semibold">How did you hear about the CFF Network? *</Label>
                <Textarea
                  id="how_heard_about_network"
                  value={formData.how_heard_about_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, how_heard_about_network: e.target.value }))}
                  placeholder="Tell us how you discovered the CFF Network"
                  rows={3}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-gray-700 font-semibold">Topics of Interest (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2 bg-white p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
                      <Checkbox
                        id={topic}
                        checked={formData.topics_of_interest.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                        className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                      />
                      <Label htmlFor={topic} className="text-sm font-normal text-gray-700 cursor-pointer">
                        {topic}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showSuccessMessage) {
    return (
      <div
        className="min-h-screen bg-slate-900/80"
        style={{
          backgroundImage: 'url(/CFF.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 px-8 py-10 shadow-sm">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Application submitted
            </h1>
            <p className="text-sm text-gray-600 mb-6 max-w-xl mx-auto leading-relaxed">
              Thank you for your interest in joining the CFF Network. Your application has been received and will be reviewed by the team.
              You can expect a response within <span className="font-semibold text-gray-900">5–7 business days</span>.
            </p>
            <Button
              onClick={() => {
                setShowSuccessMessage(false);
                setShowApplicationForm(false);
                setCurrentSection(1);
                setFormData({
                  applicant_name: '',
                  email: user?.email || '',
                  vehicle_name: '',
                  organization_website: '',
                  domicile_countries: [],
                  role_job_title: '',
                  team_overview: '',
                  investment_thesis: '',
                  typical_check_size: '',
                  number_of_investments: '',
                  amount_raised_to_date: '',
                  supporting_documents: [],
                  supporting_document_links: [],
                  expectations_from_network: '',
                  how_heard_about_network: '',
                  topics_of_interest: [],
                });
              }}
              className="px-6 py-3 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Submit another application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Preview/Landing Page
  if (!showApplicationForm) {
    return (
      <div
        className="min-h-screen bg-slate-900/80"
        style={{
          backgroundImage: 'url(/CFF.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Application Overview */}
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                  Membership application
                </h2>
                <p className="text-sm text-gray-600">
                  Share a concise overview of your organization and investment activity to help us assess fit with the CFF Network.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-700">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">1. Organization details</p>
                  <p className="text-xs text-gray-500">Basic information and domicile</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">2. Team & role</p>
                  <p className="text-xs text-gray-500">Your role and team overview</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">3. Investment profile</p>
                  <p className="text-xs text-gray-500">Strategy, tickets and capital raised</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">4. Network expectations</p>
                  <p className="text-xs text-gray-500">How you plan to engage</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 mt-2">
                <p className="text-xs text-gray-500 mb-3">
                  Typical completion time: 10–15 minutes.
                </p>
                <Button
                  onClick={() => navigate('/application')}
                  className="w-full justify-center px-6 py-3 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  size="lg"
                >
                  <span>Start application</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Viewer tools */}
            <div className="flex flex-col gap-6">
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Network overview</h3>
                    <p className="text-xs text-gray-500">
                      High-level view of the CFF fund manager community.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-700">
                  <div>
                    <p className="font-semibold text-gray-900">200+</p>
                    <p className="text-gray-500">fund managers</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">25+</p>
                    <p className="text-gray-500">countries</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Survey library</h3>
                    <p className="text-xs text-gray-500">
                      Access ESCP survey instruments from 2021–2024.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(survey.path)}
                      className="h-9 text-xs font-medium border-gray-300 text-gray-800 hover:bg-gray-100 rounded-md"
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Four years of data on local capital providers and MSME financing.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Learning and events</h3>
                    <p className="text-xs text-gray-500">
                      Webinars, workshops and curated resources for fund managers.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  As the platform evolves, this space will host structured learning content,
                  recordings and practical tools for managers across the network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-900/80"
      style={{
        backgroundImage: 'url(/CFF.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Header with Back Button */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setShowApplicationForm(false)}
            className="flex items-center border-gray-300 text-gray-800 hover:bg-gray-100 bg-white shadow-sm"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Overview
          </Button>
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            Membership application
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Provide a concise overview of your organization, team and investment activity to support the review process.
          </p>
        </div>
      </div>
      
      {/* Application Form */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm">
          <div className="p-8 md:p-10">
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Step {currentSection} of 4</span>
                  <span className="text-gray-900">{Math.round((currentSection / 4) * 100)}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentSection / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Form Content */}
              {renderSection(currentSection)}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 1}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-3 font-semibold"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Previous
                </Button>
                
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-3 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full font-bold"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </span>
                  ) : currentSection === 4 ? (
                    <span className="flex items-center">
                      Submit Application 🚀
                      <CheckCircle className="w-5 h-5 ml-2" />
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Next
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewerDashboardV2;
