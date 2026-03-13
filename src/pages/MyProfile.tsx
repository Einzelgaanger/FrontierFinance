import { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyMembership } from '@/hooks/useCompanyMembership';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Mail, Globe, Building2, FileText, Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, Activity, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import MyApplicationSection from '@/components/profile/MyApplicationSection';
import CompanyMembersSection from '@/components/profile/CompanyMembersSection';

interface ActivityLogEntry {
  id: string;
  member_email: string;
  member_name: string | null;
  action_type: string;
  action_label: string | null;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
}

export default function MyProfile() {
  const { user } = useAuth();
  const { isTeamMember, companyUserId, loading: membershipLoading } = useCompanyMembership();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<{ company_name: string; profile_picture_url: string | null } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    website: '',
    profile_picture_url: '',
    full_name: ''
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong' };
  };

  const passwordStrength = checkPasswordStrength(passwordForm.newPassword);
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.confirmPassword !== '';

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Fetch company profile for team members (to show company logo)
  useEffect(() => {
    if (!companyUserId || !isTeamMember) return;
    (async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('company_name, profile_picture_url')
        .eq('id', companyUserId)
        .single();
      if (data) setCompanyProfile(data);
    })();
  }, [companyUserId, isTeamMember]);

  useEffect(() => {
    if (!user?.id || isTeamMember) return;
    (async () => {
      setActivityLoading(true);
      const { data } = await supabase
        .from('member_activity_log')
        .select('id, member_email, member_name, action_type, action_label, entity_type, entity_id, created_at')
        .eq('company_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      setActivityLog((data as ActivityLogEntry[]) || []);
      setActivityLoading(false);
    })();
  }, [user?.id, isTeamMember]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          company_name: data.company_name || '',
          description: data.description || '',
          website: data.website || '',
          profile_picture_url: data.profile_picture_url || '',
          full_name: data.full_name || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };


  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({ 
        title: 'Invalid file type', 
        description: 'Please upload PNG, JPG, or WEBP images only', 
        variant: 'destructive' 
      });
      if (e.target) e.target.value = '';
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ 
        title: 'File too large', 
        description: 'Please upload an image smaller than 2MB', 
        variant: 'destructive' 
      });
      if (e.target) e.target.value = '';
      return;
    }

    try {
      setUploading(true);

      // Determine file extension
      const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
      const timestamp = Date.now();
      const fileName = `${user.id}/avatar-${timestamp}.${ext}`;

      // Upload new avatar with unique timestamp
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { 
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('DB update error:', updateError);
        throw updateError;
      }

      // Update local state
      setProfile(prev => ({ 
        ...prev, 
        profile_picture_url: publicUrl 
      }));

      toast({ 
        title: 'Success', 
        description: 'Profile picture updated successfully' 
      });

      if (e.target) e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({ 
        title: 'Upload failed', 
        description: error.message || 'Could not upload profile picture',
        variant: 'destructive' 
      });
      if (e.target) e.target.value = '';
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('user_profiles')
        .update({
          company_name: profile.company_name,
          description: profile.description,
          website: profile.website,
          profile_picture_url: profile.profile_picture_url
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;

    // Validate
    if (passwordStrength.score < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPassword(true);

    try {
      // First, verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordForm.currentPassword,
      });

      if (signInError) {
        toast({
          title: "Invalid Current Password",
          description: "The current password you entered is incorrect.",
          variant: "destructive"
        });
        return;
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) {
        toast({
          title: "Password Update Failed",
          description: updateError.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Password Updated Successfully",
        description: "Your password has been changed successfully.",
      });

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const [descExpanded, setDescExpanded] = useState(false);
  const hasDesc = profile.description && profile.description.trim().length > 0;
  const isLongDesc = hasDesc && profile.description!.length > 120;

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#faf6f0] flex flex-col">
          <header className="border-b border-slate-200/60 bg-[#faf6f0] py-3 sm:py-4">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Account</span>
                <h1 className="text-lg sm:text-xl font-display font-normal text-navy-900">My Profile</h1>
                <div className="w-6 h-0.5 bg-gold-500 rounded-full" />
              </div>
            </div>
          </header>
          <div className="flex-1 flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gold-500" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] selection:bg-gold-500/20 selection:text-navy-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline gap-2 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Account</span>
              <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">My Profile</h1>
              <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
              <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Account and settings</p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 min-w-0 overflow-x-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: compact identity strip */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance p-4">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16 rounded-xl border border-gold-500/20 shrink-0">
                    <AvatarImage src={profile.profile_picture_url} className="object-cover" />
                    <AvatarFallback className="text-xl font-display font-normal bg-navy-900 text-gold-400 rounded-xl">
                      {profile.company_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    {profile.full_name && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span className="text-sm font-medium text-navy-900 font-sans truncate">{profile.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span className="text-xs font-medium text-navy-900 break-all font-sans truncate block" title={user?.email}>{user?.email}</span>
                    </div>
                    {isTeamMember && companyProfile && (
                      <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-slate-100">
                        <Building2 className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        {companyProfile.profile_picture_url && (
                          <Avatar className="w-5 h-5 rounded-md border border-slate-200 shrink-0">
                            <AvatarImage src={companyProfile.profile_picture_url} className="object-cover" />
                            <AvatarFallback className="text-[10px] bg-amber-100 text-amber-800">{companyProfile.company_name?.charAt(0) || 'C'}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs font-medium text-navy-900 font-sans truncate">{companyProfile.company_name}</span>
                      </div>
                    )}
                    <Label htmlFor="avatar-upload" className="mt-2 inline-block cursor-pointer">
                      <span className="text-[11px] font-medium text-gold-600 hover:text-gold-700 font-sans flex items-center gap-1">
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                        {uploading ? 'Uploading…' : 'Change photo'}
                      </span>
                    </Label>
                  </div>
                </div>
                <input id="avatar-upload" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUploadAvatar} disabled={uploading} aria-label="Upload profile picture" />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              {/* Company — compact */}
              <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-gold-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans">Company</span>
                  <h2 className="font-display font-normal text-navy-900 text-base">{isTeamMember ? 'Company' : 'Company information'}</h2>
                  <span className="text-[11px] text-slate-500 font-sans ml-1">— {isTeamMember ? 'Managed by primary.' : 'Edit below.'}</span>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <Label htmlFor="company_name" className="text-[11px] font-medium text-slate-500 font-sans shrink-0">Name</Label>
                      {isTeamMember ? (
                        <p className="text-sm font-medium text-navy-900 font-sans truncate">{profile.company_name || '—'}</p>
                      ) : (
                        <Input id="company_name" value={profile.company_name} onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))} placeholder="Company name" className="flex-1 min-w-0 rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <Label htmlFor="website" className="text-[11px] font-medium text-slate-500 font-sans shrink-0">Website</Label>
                      {isTeamMember ? (
                        profile.website ? (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gold-600 hover:text-gold-700 truncate font-sans underline decoration-gold-500/40">{profile.website}</a>
                        ) : (
                          <span className="text-sm text-slate-500 font-sans">—</span>
                        )
                      ) : (
                        <Input id="website" type="url" value={profile.website} onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))} placeholder="https://…" className="flex-1 min-w-0 rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-500 font-sans">Description</span>
                    </div>
                    {isTeamMember ? (
                      hasDesc ? (
                        <>
                          <p className={cn('text-sm text-slate-700 font-sans leading-snug', !descExpanded && 'line-clamp-2')}>{profile.description}</p>
                          {isLongDesc && (
                            <button type="button" onClick={() => setDescExpanded(!descExpanded)} className="mt-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700 font-sans">
                              {descExpanded ? 'Read less' : 'Read more'}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-slate-500 font-sans">—</span>
                      )
                    ) : (
                      <>
                        <Textarea id="description" value={profile.description} onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description of your company and investment focus" rows={3} className="resize-none rounded-lg border-slate-200 font-sans text-sm focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                        <p className="text-[11px] text-slate-500 font-sans mt-0.5">Concise overview</p>
                      </>
                    )}
                  </div>
                  {!isTeamMember && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <Button onClick={handleSave} disabled={saving} size="sm" className="rounded-lg h-8 bg-navy-900 hover:bg-navy-800 text-white font-sans font-medium shadow-finance text-xs">
                        {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving…</> : <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Save changes</>}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </div>

              {/* Application Profile Section */}
              <MyApplicationSection />

              {/* Company Team Members — only for primary account */}
              <CompanyMembersSection />

              {/* Team activity — primary only */}
              {!membershipLoading && !isTeamMember && (
                <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center gap-2">
                    <div className="w-6 h-0.5 bg-gold-500 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans">Activity</span>
                    <h2 className="font-display font-normal text-navy-900 text-base">Team activity</h2>
                    <span className="text-[11px] text-slate-500 font-sans ml-1">— Posts, applications, surveys</span>
                  </div>
                  <div className="p-3">
                    {activityLoading ? (
                      <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gold-500" /></div>
                    ) : activityLog.length === 0 ? (
                      <p className="text-xs text-slate-500 font-sans py-3">No team activity yet.</p>
                    ) : (
                      <ul className="space-y-0 max-h-56 overflow-y-auto">
                        {activityLog.map((entry) => (
                          <li key={entry.id} className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0 text-xs font-sans">
                            <User className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <span className="font-medium text-navy-900">{entry.member_name || entry.member_email}</span>
                              <span className="text-slate-500"> {entry.action_label || entry.action_type}</span>
                              <span className="text-slate-400 text-[10px] block mt-0.5">{new Date(entry.created_at).toLocaleString()}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Security — compact */}
              <div className="rounded-xl border border-slate-200/90 bg-white shadow-finance overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center gap-2">
                  <div className="w-6 h-0.5 bg-gold-500 rounded-full" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 font-sans">Security</span>
                  <h2 className="font-display font-normal text-navy-900 text-base">Password</h2>
                  <span className="text-[11px] text-slate-500 font-sans ml-1">— 8+ chars, mixed case, number, special</span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <Label htmlFor="currentPassword" className="text-[11px] font-medium text-slate-500 font-sans">Current</Label>
                    <div className="relative mt-0.5">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-600 w-3.5 h-3.5" />
                      <Input id="currentPassword" type={showCurrentPassword ? "text" : "password"} value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} placeholder="Current password" className="pl-9 pr-9 rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                      <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900" onClick={() => setShowCurrentPassword(!showCurrentPassword)} aria-label={showCurrentPassword ? "Hide password" : "Show password"}>{showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-[11px] font-medium text-slate-500 font-sans">New</Label>
                    <div className="relative mt-0.5">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-600 w-3.5 h-3.5" />
                      <Input id="newPassword" type={showNewPassword ? "text" : "password"} value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="New password" className="pl-9 pr-9 rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                      <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900" onClick={() => setShowNewPassword(!showNewPassword)} aria-label={showNewPassword ? "Hide password" : "Show password"}>{showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                    </div>
                    {passwordForm.newPassword && (
                      <div className="mt-1.5 p-2 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-sans">
                          <div className={cn('w-1.5 h-1.5 rounded-full', passwordStrength.strength === 'weak' ? 'bg-red-400' : passwordStrength.strength === 'medium' ? 'bg-amber-400' : 'bg-emerald-500')} />
                          <span className="text-slate-700 font-medium">{passwordStrength.strength}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          {Object.entries(passwordStrength.checks).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1 font-sans">
                              {value ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-red-400" />}
                              <span className={value ? 'text-emerald-700 font-medium' : 'text-slate-500'}>{key === 'length' ? '8+' : key === 'uppercase' ? 'A–Z' : key === 'lowercase' ? 'a–z' : key === 'number' ? '0–9' : 'Special'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-[11px] font-medium text-slate-500 font-sans">Confirm</Label>
                    <div className="relative mt-0.5">
                      <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-600 w-3.5 h-3.5" />
                      <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Confirm new password" className="pl-9 pr-9 rounded-lg border-slate-200 font-sans text-sm h-8 focus-visible:ring-gold-500/30 focus-visible:border-gold-500/50" />
                      <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-900" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>{showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                    </div>
                    {passwordForm.confirmPassword && (
                      <div className="flex items-center gap-1.5 text-[11px] mt-0.5 font-sans">
                        {passwordsMatch ? <><CheckCircle className="w-3 h-3 text-emerald-500" /><span className="text-emerald-600 font-medium">Match</span></> : <><XCircle className="w-3 h-3 text-red-400" /><span className="text-red-500 font-medium">No match</span></>}
                      </div>
                    )}
                  </div>
                  <div className="pt-1">
                    <Button onClick={handlePasswordChange} disabled={updatingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordsMatch || passwordStrength.score < 3} size="sm" className="w-full rounded-lg h-8 bg-navy-900 hover:bg-navy-800 text-white font-sans font-medium shadow-finance text-xs">
                      {updatingPassword ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Updating…</> : <><Lock className="w-3.5 h-3.5 mr-1.5" /> Update password</>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}