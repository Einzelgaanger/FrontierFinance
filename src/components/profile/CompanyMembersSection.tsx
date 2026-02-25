import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Loader2, Trash2, Mail, Eye, EyeOff, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CompanyMember {
  id: string;
  member_email: string;
  member_name: string | null;
  member_user_id: string;
  company_user_id: string;
  role_in_company: string | null;
  is_active: boolean;
  created_at: string;
}

export default function CompanyMembersSection() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CompanyMember | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newMember, setNewMember] = useState({ email: '', name: '', password: '' });
  const [editForm, setEditForm] = useState({ name: '', role: '' });

  const isMember = userRole === 'member';

  useEffect(() => {
    if (!isMember) return;
    fetchMembers();
  }, [user, isMember]);

  // Only primary members see this section — they manage their own company's team.
  // Admins don't have "their" company; they manage users via Admin Panel / directory.
  if (!isMember) return null;

  const fetchMembers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_members')
        .select('*')
        .eq('company_user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMembers((data as CompanyMember[]) || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!user?.id || !newMember.email || !newMember.password) {
      toast({ title: 'Missing fields', description: 'Email and password are required', variant: 'destructive' });
      return;
    }

    try {
      setAdding(true);
      const { data, error } = await supabase.functions.invoke('add-company-member', {
        body: {
          company_user_id: user.id,
          member_email: newMember.email,
          member_name: newMember.name,
          password: newMember.password
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ title: 'Member Added', description: data.message });
      setNewMember({ email: '', name: '', password: '' });
      setDialogOpen(false);
      fetchMembers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to add member', variant: 'destructive' });
    } finally {
      setAdding(false);
    }
  };

  const handleEditMember = async () => {
    if (!editingMember) return;
    try {
      const { error } = await supabase
        .from('company_members')
        .update({
          member_name: editForm.name || editingMember.member_name,
          role_in_company: editForm.role || editingMember.role_in_company
        })
        .eq('id', editingMember.id);

      if (error) throw error;
      toast({ title: 'Member Updated' });
      setEditDialogOpen(false);
      setEditingMember(null);
      fetchMembers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      const { error } = await supabase
        .from('company_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      toast({ title: 'Member Removed' });
      fetchMembers();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const openEditDialog = (member: CompanyMember) => {
    setEditingMember(member);
    setEditForm({ name: member.member_name || '', role: member.role_in_company || '' });
    setEditDialogOpen(true);
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center text-xl text-gray-800">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Company Team Members
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage your team members. They can log in and access the platform but won&apos;t appear in the directory.
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Create a secondary account for your team. This member can log in but won&apos;t be listed in the network directory.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Member Name</Label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="member@company.com"
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={newMember.password}
                      onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Min 8 characters"
                      className="bg-white border-gray-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleAddMember}
                  disabled={adding || !newMember.email || !newMember.password}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {adding ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding...</> : <><UserPlus className="w-4 h-4 mr-2" />Add Member</>}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No secondary members added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.member_name || member.member_email}</p>
                    <p className="text-xs text-gray-500">{member.member_email}</p>
                    {member.role_in_company && (
                      <p className="text-xs text-blue-600">{member.role_in_company}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(member)}
                    className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>Update member details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label>Role in Company</Label>
              <Input
                value={editForm.role}
                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g. Analyst, Associate"
                className="bg-white border-gray-300"
              />
            </div>
            <Button onClick={handleEditMember} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
