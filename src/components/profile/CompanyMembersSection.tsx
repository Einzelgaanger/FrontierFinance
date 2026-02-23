import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Loader2, Trash2, Mail, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface CompanyMember {
  id: string;
  member_email: string;
  member_name: string | null;
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
  const [showPassword, setShowPassword] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [companies, setCompanies] = useState<{ id: string; company_name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [user]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('id, company_name')
        .order('company_name');
      if (data) {
        setCompanies(data.filter(c => c.company_name && c.company_name !== 'Not provided'));
      }
    };
    fetchCompanies();
  }, []);

  // Only admins can see this section
  if (userRole !== 'admin') return null;

  const fetchMembers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Admins fetch all members; for a specific company view we'd filter by company_user_id
      const { data, error } = await supabase
        .from('company_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers((data as CompanyMember[]) || []);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (companyUserId: string) => {
    if (!newMember.email || !newMember.password) {
      toast({ title: 'Missing fields', description: 'Email and password are required', variant: 'destructive' });
      return;
    }

    try {
      setAdding(true);
      const { data, error } = await supabase.functions.invoke('add-company-member', {
        body: {
          company_user_id: companyUserId,
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

  const handleRemoveMember = async (memberId: string) => {
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
              Add secondary members to company accounts. These members can log in and access the platform but won't appear in the directory.
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
                  Create a secondary account linked to a company. This member can log in but won't be listed in the network directory.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select a company...</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.company_name}</option>
                    ))}
                  </select>
                </div>
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
                  onClick={() => handleAddMember(selectedCompany)}
                  disabled={adding || !selectedCompany || !newMember.email || !newMember.password}
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
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
