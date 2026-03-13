import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyMembership, logMemberActivity } from '@/hooks/useCompanyMembership';
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
  const { isTeamMember, companyUserId } = useCompanyMembership();
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
        if (isTeamMember && companyUserId) {
          await logMemberActivity(companyUserId, 'application_update', 'Updated application profile', 'application', application.id);
        }
      } else {
        // Create new - for members, auto-set as approved; for viewers, pending
        const status = userRole === 'member' || userRole === 'admin' ? 'approved' : 'pending';
        const { data: inserted, error } = await supabase
          .from('applications')
          .insert([{ ...applicationData, status }])
          .select('id')
          .single();
        if (error) throw error;
        if (isTeamMember && companyUserId && inserted?.id) {
          await logMemberActivity(companyUserId, 'application_submit', 'Submitted application profile', 'application', inserted.id, { vehicle_name: formData.vehicle_name });
        }
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
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-finance p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
      <button type="button" className="w-full text-left" onClick={() => setExpanded(!expanded)}>
        <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-0.5 bg-gold-500 rounded-full shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans shrink-0">Application</span>
            <h2 className="font-display font-normal text-navy-900 text-base truncate">Membership application</h2>
            <span className="text-[11px] text-slate-500 font-sans truncate hidden sm:inline">— {application ? 'View/update' : 'Fill in profile'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {getStatusBadge()}
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </button>

      {expanded && (
        <CardContent className="space-y-4 border-t border-slate-200/80 pt-4 px-4 pb-4">
          {application?.admin_notes && (
            <div className="rounded-lg bg-amber-50/80 border border-amber-200/80 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans">Admin notes</p>
              <p className="text-xs text-slate-700 font-sans mt-0.5">{application.admin_notes}</p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans border-b border-slate-200/80 pb-1.5">Basic information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Name</Label>
                <Input value={formData.applicant_name} onChange={(e) => updateField('applicant_name', e.target.value)} placeholder="Your full name" className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Email</Label>
                <Input value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Vehicle name</Label>
                <Input value={formData.vehicle_name} onChange={(e) => updateField('vehicle_name', e.target.value)} placeholder="Fund/vehicle name" className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Website</Label>
                <Input value={formData.organization_website} onChange={(e) => updateField('organization_website', e.target.value)} placeholder="https://..." className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans border-b border-slate-200/80 pb-1.5">Role & team</h3>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Role / job title</Label>
              <Textarea value={formData.role_job_title} onChange={(e) => updateField('role_job_title', e.target.value)} placeholder="Your role..." rows={2} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Team size</Label>
              <Textarea value={formData.team_size} onChange={(e) => updateField('team_size', e.target.value)} placeholder="Team details..." rows={2} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Location</Label>
              <Textarea value={formData.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Location..." rows={1} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans border-b border-slate-200/80 pb-1.5">Investment details</h3>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Investment thesis</Label>
              <Textarea value={formData.investment_thesis} onChange={(e) => updateField('investment_thesis', e.target.value)} placeholder="Investment thesis..." rows={3} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Ticket size</Label>
                <Input value={formData.typical_check_size} onChange={(e) => updateField('typical_check_size', e.target.value)} placeholder="e.g. $100k–$500k" className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-medium text-slate-500 font-sans">Number of investments</Label>
                <Input value={formData.number_of_investments} onChange={(e) => updateField('number_of_investments', e.target.value)} placeholder="Investments made" className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Capital raised</Label>
              <Textarea value={formData.amount_raised_to_date} onChange={(e) => updateField('amount_raised_to_date', e.target.value)} placeholder="Capital commitments..." rows={2} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans border-b border-slate-200/80 pb-1.5">Supporting documents</h3>
            <div className="space-y-3">
              <label className="cursor-pointer block">
                <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" disabled={uploading || uploadedFiles.length >= 10} />
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center hover:border-gold-500/50 transition-colors">
                  <Upload className="w-5 h-5 mx-auto text-gold-600 mb-0.5" />
                  <p className="text-xs text-slate-600 font-sans">{uploading ? 'Uploading…' : 'Click to upload'}</p>
                </div>
              </label>
              <div className="flex gap-2">
                <Input placeholder="Or paste a link" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} disabled={uploadedFiles.length >= 10} className="rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                <Button type="button" variant="outline" onClick={addLink} disabled={!linkInput.trim() || uploadedFiles.length >= 10} size="sm" className="rounded-lg h-8 border-slate-200 text-navy-900 hover:border-gold-500 hover:bg-gold-50/50"><LinkIcon className="w-3.5 h-3.5" /></Button>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-1.5">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50/80 rounded-lg p-1.5 border border-slate-200/80">
                      <div className="flex items-center gap-2 min-w-0">
                        {file.type === 'file' ? <FileText className="w-4 h-4 text-gold-600 flex-shrink-0" /> : <LinkIcon className="w-4 h-4 text-gold-600 flex-shrink-0" />}
                        <span className="text-sm font-sans truncate text-navy-900">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} className="text-slate-500 hover:text-navy-900"><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans border-b border-slate-200/80 pb-1.5">Network & expectations</h3>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Information sharing topics</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {INFORMATION_SHARING_TOPICS.map((topic) => (
                  <div key={topic} className="flex items-start space-x-2">
                    <Checkbox id={`profile-${topic}`} checked={formData.information_sharing_topics.includes(topic)} onCheckedChange={() => toggleTopic(topic)} className="border-slate-300 data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500" />
                    <label htmlFor={`profile-${topic}`} className="text-xs text-slate-700 font-sans cursor-pointer">{topic}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">Expectations from network</Label>
              <Textarea value={formData.expectations_from_network} onChange={(e) => updateField('expectations_from_network', e.target.value)} placeholder="What do you expect..." rows={2} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-slate-500 font-sans">How did you hear about us?</Label>
              <Textarea value={formData.how_heard_about_network} onChange={(e) => updateField('how_heard_about_network', e.target.value)} placeholder="How did you hear..." rows={1} className="rounded-lg border-slate-200 font-sans text-sm resize-none focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80">
            <Button onClick={handleSave} disabled={saving} size="sm" className="rounded-lg h-8 bg-navy-900 hover:bg-navy-800 text-white font-sans font-medium shadow-finance text-xs">
              {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving…</> : <><Save className="w-3.5 h-3.5 mr-1.5" /> Save application</>}
            </Button>
          </div>
        </CardContent>
      )}
    </div>
  );
}
