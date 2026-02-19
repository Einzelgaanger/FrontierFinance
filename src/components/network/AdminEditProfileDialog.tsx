import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Pencil } from 'lucide-react';

interface AdminEditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSaved: () => void;
}

interface ProfileData {
  company_name: string;
  email: string;
  description: string;
  website: string;
  profile_photo_url: string;
  full_name: string;
}

export default function AdminEditProfileDialog({ open, onClose, userId, onSaved }: AdminEditProfileDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<ProfileData>({
    company_name: '',
    email: '',
    description: '',
    website: '',
    profile_photo_url: '',
    full_name: '',
  });

  useEffect(() => {
    if (open && userId) fetchProfile();
  }, [open, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('company_name, email, description, website, profile_picture_url, full_name')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setForm({
        company_name: data.company_name || '',
        email: data.email || '',
        description: data.description || '',
        website: data.website || '',
        profile_photo_url: data.profile_picture_url || '',
        full_name: data.full_name || '',
      });
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/profile.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
    setForm(prev => ({ ...prev, profile_photo_url: urlData.publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        company_name: form.company_name,
        email: form.email,
        description: form.description,
        website: form.website,
        profile_picture_url: form.profile_photo_url,
        full_name: form.full_name,
      })
      .eq('id', userId);

    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated', description: 'Changes saved successfully.' });
      onSaved();
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Photo */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={form.profile_photo_url} />
                <AvatarFallback>{form.company_name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Change photo'}
                </Label>
                <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Company / Fund Name</Label>
              <Input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://..." />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
