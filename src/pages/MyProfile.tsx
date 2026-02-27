import { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCompanyMembership } from '@/hooks/useCompanyMembership';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Mail, Globe, Building2, FileText, Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, Activity, User } from 'lucide-react';
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

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 min-w-0 overflow-x-hidden">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-4">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Avatar */}
                    <Avatar className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg">
                      <AvatarImage src={profile.profile_picture_url} className="object-cover" />
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl">
                        {profile.company_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploading}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                        asChild
                      >
                        <span>
                          {uploading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Change Photo
                            </>
                          )}
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleUploadAvatar}
                      disabled={uploading}
                      aria-label="Upload profile picture"
                      title="Upload profile picture"
                    />

                    {/* Name & Email */}
                    <div className="w-full pt-4 border-t border-gray-200 space-y-3">
                      {profile.full_name && (
                        <div className="space-y-1 text-center">
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span className="font-medium">Name</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                        </div>
                      )}
                      <div className="space-y-1 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">Email Address</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 break-all">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form Sections */}
            <div className="lg:col-span-8 space-y-6">
              {/* Company Information Card — read-only for team members */}
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    {isTeamMember ? 'Company' : 'Company Information'}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {isTeamMember
                      ? 'Company profile is managed by your primary account holder. Your name and email are shown below.'
                      : 'Update your company details and description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      Company Name
                    </Label>
                    {isTeamMember ? (
                      <p className="text-sm text-gray-900">{profile.company_name || '—'}</p>
                    ) : (
                      <Input
                        id="company_name"
                        value={profile.company_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Enter your company name"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      Company Website
                    </Label>
                    {isTeamMember ? (
                      <p className="text-sm text-gray-900">{profile.website ? <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.website}</a> : '—'}</p>
                    ) : (
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      Company Description
                    </Label>
                    {isTeamMember ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{profile.description || '—'}</p>
                    ) : (
                      <>
                        <Textarea
                          id="description"
                          value={profile.description}
                          onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of your company, investment focus, and key highlights"
                          rows={6}
                          className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        />
                        <p className="text-xs text-gray-500">Provide a concise overview of your company and investment strategy</p>
                      </>
                    )}
                  </div>

                  {!isTeamMember && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-lg"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Profile Section */}
              <MyApplicationSection />

              {/* Company Team Members — only for primary account */}
              <CompanyMembersSection />

              {/* Team activity log — only for primary */}
              {!membershipLoading && !isTeamMember && (
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-gray-800">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Team activity
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Who in your company did what (posts, applications, surveys)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activityLoading ? (
                      <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-gray-400" /></div>
                    ) : activityLog.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4">No team activity yet.</p>
                    ) : (
                      <ul className="space-y-2 max-h-80 overflow-y-auto">
                        {activityLog.map((entry) => (
                          <li key={entry.id} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0 text-sm">
                            <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-gray-900">{entry.member_name || entry.member_email}</span>
                              <span className="text-gray-500"> {entry.action_label || entry.action_type}</span>
                              <span className="text-gray-400 text-xs block">{new Date(entry.created_at).toLocaleString()}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Password Change Card */}
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-800">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Update your password to keep your account secure. Your new password must be at least 8 characters long and include uppercase, lowercase, number, and special character.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter your current password"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 bg-white"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter your new password"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 bg-white"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {passwordForm.newPassword && (
                      <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`w-2 h-2 rounded-full ${passwordStrength.strength === 'weak' ? 'bg-red-400' : passwordStrength.strength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                          <span className="text-gray-700 font-medium">
                            Password strength: <span className="capitalize">{passwordStrength.strength}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          {Object.entries(passwordStrength.checks).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1.5">
                              {value ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                              <span className={value ? 'text-green-600 font-medium' : 'text-gray-500'}>
                                {key === 'length' ? '8+ chars' : 
                                 key === 'uppercase' ? 'Uppercase' :
                                 key === 'lowercase' ? 'Lowercase' :
                                 key === 'number' ? 'Number' : 'Special char'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm your new password"
                        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 bg-white"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {passwordForm.confirmPassword && (
                      <div className="flex items-center gap-2 text-xs mt-1">
                        {passwordsMatch ? 
                          <><CheckCircle className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600 font-medium">Passwords match</span></> :
                          <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-500 font-medium">Passwords don't match</span></>
                        }
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={updatingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordsMatch || passwordStrength.score < 3}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    >
                      {updatingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}