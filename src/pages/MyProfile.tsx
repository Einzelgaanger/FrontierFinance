import { useState, useEffect } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Mail, Globe, Building2, FileText } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    website: '',
    profile_picture_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

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
          profile_picture_url: data.profile_picture_url || ''
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

  // Convert any image to PNG via canvas (used when uploading ICO files)
  const convertImageToPng = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 256;
          canvas.height = img.height || 256;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('PNG conversion failed'));
            resolve(blob);
          }, 'image/png', 0.92);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image smaller than 2MB', variant: 'destructive' });
      e.currentTarget.value = '';
      return;
    }

    // Handle supported types and convert unsupported (e.g., ICO) to PNG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    let uploadBlob: Blob = file;
    let uploadExt = 'png';
    let contentType = 'image/png';

    if (!allowedTypes.includes(file.type)) {
      // Try converting ICO to PNG, otherwise block
      if (file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon' || file.name.toLowerCase().endsWith('.ico')) {
        try {
          uploadBlob = await convertImageToPng(file);
          uploadExt = 'png';
          contentType = 'image/png';
        } catch (err) {
          console.error('ICO conversion failed', err);
          toast({ title: 'Unsupported format', description: 'Please upload PNG, JPG or WEBP.', variant: 'destructive' });
          e.currentTarget.value = '';
          return;
        }
      } else {
        toast({ title: 'Unsupported format', description: 'Please upload PNG, JPG or WEBP.', variant: 'destructive' });
        e.currentTarget.value = '';
        return;
      }
    } else {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') { contentType = 'image/jpeg'; uploadExt = 'jpg'; }
      else if (file.type === 'image/webp') { contentType = 'image/webp'; uploadExt = 'webp'; }
      else { contentType = 'image/png'; uploadExt = 'png'; }
    }

    try {
      setUploading(true);
      const fileName = `${user.id}/avatar.${uploadExt}`;

      console.log('Uploading avatar:', { fileName, userId: user.id, contentType, fileSize: uploadBlob.size });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, uploadBlob, { upsert: true, contentType, cacheControl: '3600' });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(uploadError.message || 'Upload failed');
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Persist the new avatar URL immediately
      setProfile(prev => ({ ...prev, profile_picture_url: publicUrl }));

      // Save to DB so it shows everywhere without needing "Save Changes"
      const { error: saveError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (saveError) {
        console.error('Avatar saved to storage but DB update failed:', saveError);
        toast({ title: 'Avatar uploaded', description: 'But failed to save to profile. Please click Save Changes.', variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Avatar uploaded and saved to your profile' });
      }
      e.currentTarget.value = '';
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      const errorMessage = error?.message || error?.error || 'Could not upload avatar';
      toast({ 
        title: 'Upload failed', 
        description: errorMessage,
        variant: 'destructive' 
      });
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
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Avatar Section */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 border-2 border-slate-200">
                    <AvatarImage src={profile.profile_picture_url} />
                    <AvatarFallback className="text-4xl bg-slate-100 text-slate-600">
                      {profile.company_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Label htmlFor="avatar-upload" className="cursor-pointer mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      className="border-slate-300 text-slate-700 hover:bg-slate-50"
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
                </div>

                {/* Email Info */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email Address</span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 ml-6">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Company Information Section */}
                <div className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        Company Name
                      </Label>
                      <Input
                        id="company_name"
                        value={profile.company_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Enter your company name"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-500" />
                        Company Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://example.com"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        Company Description
                      </Label>
                      <Textarea
                        id="description"
                        value={profile.description}
                        onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of your company, investment focus, and key highlights"
                        rows={6}
                        className="resize-none border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500">Provide a concise overview of your company and investment strategy</p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t border-slate-200">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
