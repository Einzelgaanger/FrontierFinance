import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  ClipboardList, CheckCircle, Clock, XCircle, Loader2, Save,
  Upload, X, FileText, Link as LinkIcon, User, Image, ChevronDown, ChevronUp
} from 'lucide-react';

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

interface UploadedFile {
  name: string;
  url: string;
  type: 'file' | 'link';
}

export default function MyApplicationSection() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');

  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
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
    information_sharing_topics: [] as string[],
  });

  useEffect(() => {
    fetchApplication();
  }, [user]);

  const fetchApplication = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const app = data[0];
        setApplication(app);
        populateForm(app);
      } else {
        // No application exists - set defaults
        setApplication(null);
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (app: any) => {
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
        try { return JSON.parse(doc); }
        catch { return { name: doc, url: doc, type: 'link' }; }
      }));
    }
  };

  const updateField = (field: string, value: string | string[]) => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user?.id) return;
    if (uploadedFiles.length + files.length > 10) {
      toast({ title: "Error", description: "Maximum 10 files allowed" });
      return;
    }
    setUploading(true);
    const newFiles: UploadedFile[] = [];
    try {
      for (const file of Array.from(files)) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('application-documents')
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('application-documents')
          .getPublicUrl(fileName);
        newFiles.push({ name: file.name, url: urlData.publicUrl, type: 'file' });
      }
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast({ title: "Success", description: `${newFiles.length} file(s) uploaded` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload files", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    if (!linkInput.trim() || uploadedFiles.length >= 10) return;
    setUploadedFiles(prev => [...prev, { name: linkInput, url: linkInput, type: 'link' }]);
    setLinkInput('');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const applicationData = {
        user_id: user.id,
        email: formData.email,
        company_name: formData.vehicle_name || 'Not provided',
        application_text: JSON.stringify(formData),
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
      };

      if (application) {
        // Update existing
        const { error } = await supabase
          .from('applications')
          .update(applicationData)
          .eq('id', application.id);
        if (error) throw error;
      } else {
        // Create new - for members, auto-set as approved; for viewers, pending
        const status = userRole === 'member' || userRole === 'admin' ? 'approved' : 'pending';
        const { error } = await supabase
          .from('applications')
          .insert([{ ...applicationData, status }]);
        if (error) throw error;
      }

      toast({ title: 'Success', description: 'Application profile updated successfully' });
      await fetchApplication();
    } catch (error: any) {
      console.error('Error saving application:', error);
      toast({ title: 'Error', description: error.message || 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (!application) return <Badge variant="outline" className="text-gray-500 border-gray-300">Not Submitted</Badge>;
    switch (application.status) {
      case 'approved': return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Not Approved</Badge>;
      default: return <Badge variant="outline">{application.status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl text-gray-800">Membership Application</CardTitle>
              <CardDescription className="text-gray-600">
                {application ? 'View and update your application details' : 'Fill in your membership application profile'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6 border-t border-gray-100 pt-6">
          {application?.admin_notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800">Admin Notes:</p>
              <p className="text-sm text-blue-700 mt-1">{application.admin_notes}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Name</Label>
                <Input value={formData.applicant_name} onChange={(e) => updateField('applicant_name', e.target.value)} placeholder="Your full name" className="bg-white border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" className="bg-white border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Vehicle Name</Label>
                <Input value={formData.vehicle_name} onChange={(e) => updateField('vehicle_name', e.target.value)} placeholder="Fund/vehicle name" className="bg-white border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Website</Label>
                <Input value={formData.organization_website} onChange={(e) => updateField('organization_website', e.target.value)} placeholder="https://..." className="bg-white border-gray-300" />
              </div>
            </div>
          </div>

          {/* Role & Team */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Role & Team</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Role/Job Title</Label>
              <Textarea value={formData.role_job_title} onChange={(e) => updateField('role_job_title', e.target.value)} placeholder="Your role..." rows={3} className="bg-white border-gray-300 resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Team Size</Label>
              <Textarea value={formData.team_size} onChange={(e) => updateField('team_size', e.target.value)} placeholder="Team details..." rows={3} className="bg-white border-gray-300 resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Location</Label>
              <Textarea value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Location..." rows={2} className="bg-white border-gray-300 resize-none" />
            </div>
          </div>

          {/* Investment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Investment Details</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Investment Thesis</Label>
              <Textarea value={formData.investment_thesis} onChange={(e) => updateField('investment_thesis', e.target.value)} placeholder="Investment thesis..." rows={4} className="bg-white border-gray-300 resize-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Ticket Size</Label>
                <Input value={formData.typical_check_size} onChange={(e) => updateField('typical_check_size', e.target.value)} placeholder="e.g., $100k-$500k" className="bg-white border-gray-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Number of Investments</Label>
                <Input value={formData.number_of_investments} onChange={(e) => updateField('number_of_investments', e.target.value)} placeholder="Investments made" className="bg-white border-gray-300" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Capital Raised</Label>
              <Textarea value={formData.amount_raised_to_date} onChange={(e) => updateField('amount_raised_to_date', e.target.value)} placeholder="Capital commitments..." rows={3} className="bg-white border-gray-300 resize-none" />
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Supporting Documents</h3>
            <div className="space-y-3">
              <label className="cursor-pointer">
                <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" disabled={uploading || uploadedFiles.length >= 10} />
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Click to upload files'}</p>
                </div>
              </label>
              <div className="flex gap-2">
                <Input placeholder="Or paste a link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} disabled={uploadedFiles.length >= 10} className="bg-white border-gray-300" />
                <Button type="button" variant="outline" onClick={addLink} disabled={!linkInput.trim() || uploadedFiles.length >= 10} size="sm"><LinkIcon className="w-4 h-4" /></Button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {file.type === 'file' ? <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" /> : <LinkIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        <span className="text-sm truncate">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Network & Expectations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Network & Expectations</h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Information Sharing Topics</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {INFORMATION_SHARING_TOPICS.map((topic) => (
                  <div key={topic} className="flex items-start space-x-2">
                    <Checkbox id={`profile-${topic}`} checked={formData.information_sharing_topics.includes(topic)} onCheckedChange={() => toggleTopic(topic)} />
                    <label htmlFor={`profile-${topic}`} className="text-sm text-gray-700 cursor-pointer">{topic}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Expectations from Network</Label>
              <Textarea value={formData.expectations_from_network} onChange={(e) => updateField('expectations_from_network', e.target.value)} placeholder="What do you expect..." rows={3} className="bg-white border-gray-300 resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">How did you hear about us?</Label>
              <Textarea value={formData.how_heard_about_network} onChange={(e) => updateField('how_heard_about_network', e.target.value)} placeholder="How did you hear..." rows={2} className="bg-white border-gray-300 resize-none" />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-lg">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Application Profile</>}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
