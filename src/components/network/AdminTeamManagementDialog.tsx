import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import {
  Loader2, Users, Mail, UserPlus, Trash2, ArrowUpDown, KeyRound, Copy, CheckCircle, Pencil, Save, X, Crown, User, Send
} from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface TeamMember {
  id: string;
  member_user_id: string;
  member_email: string;
  member_name: string | null;
  role_in_company: string | null;
}

interface AdminTeamManagementDialogProps {
  open: boolean;
  onClose: () => void;
  companyUserId: string;
  companyName: string;
  primaryEmail: string;
  onSaved: () => void;
}

export default function AdminTeamManagementDialog({
  open, onClose, companyUserId, companyName, primaryEmail, onSaved
}: AdminTeamManagementDialogProps) {
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sendingResetTo, setSendingResetTo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingPrimaryEmail, setEditingPrimaryEmail] = useState(false);
  const [newPrimaryEmail, setNewPrimaryEmail] = useState(primaryEmail);

  // Add member form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  // Edit member
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editMemberName, setEditMemberName] = useState('');
  const [editMemberEmail, setEditMemberEmail] = useState('');

  // Password link
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  // Confirm dialogs
  const [confirmSwap, setConfirmSwap] = useState<TeamMember | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<TeamMember | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('company_members')
      .select('id, member_user_id, member_email, member_name, role_in_company')
      .eq('company_user_id', companyUserId)
      .order('member_name', { ascending: true });
    setMembers(data ?? []);
    setLoading(false);
  }, [companyUserId]);

  useEffect(() => {
    if (open && companyUserId) {
      fetchMembers();
      setNewPrimaryEmail(primaryEmail);
      setEditingPrimaryEmail(false);
      setShowAddForm(false);
      setGeneratedLink(null);
      setEditingMemberId(null);
    }
  }, [open, companyUserId, primaryEmail, fetchMembers]);

  const handleUpdatePrimaryEmail = async () => {
    if (!newPrimaryEmail || newPrimaryEmail === primaryEmail) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-team', {
      body: { action: 'update_primary_email', companyUserId, newEmail: newPrimaryEmail }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Email updated', description: `Primary email changed to ${newPrimaryEmail}` });
      setEditingPrimaryEmail(false);
      onSaved();
    }
    setSaving(false);
  };

  const handleSwapPrimary = async (member: TeamMember) => {
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-team', {
      body: { action: 'swap_primary', companyUserId, newPrimaryMemberUserId: member.member_user_id }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Primary swapped', description: data?.message });
      onSaved();
      onClose();
    }
    setSaving(false);
    setConfirmSwap(null);
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-team', {
      body: { action: 'add_member', companyUserId, memberEmail: newMemberEmail, memberName: newMemberName }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Member added', description: data?.message });
      setNewMemberEmail('');
      setNewMemberName('');
      setShowAddForm(false);
      fetchMembers();
      onSaved();
    }
    setSaving(false);
  };

  const handleUpdateMember = async (memberId: string) => {
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-team', {
      body: { action: 'update_member', memberId, memberName: editMemberName, memberEmail: editMemberEmail }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Member updated' });
      setEditingMemberId(null);
      fetchMembers();
      onSaved();
    }
    setSaving(false);
  };

  const handleRemoveMember = async (member: TeamMember) => {
    setSaving(true);
    const { data, error } = await supabase.functions.invoke('admin-manage-team', {
      body: { action: 'remove_member', memberId: member.id }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      toast({ title: 'Member removed' });
      fetchMembers();
      onSaved();
    }
    setSaving(false);
    setConfirmRemove(null);
  };

  const handleGeneratePasswordLink = async (userId: string, email: string) => {
    setGeneratingFor(userId);
    setGeneratedLink(null);
    const { data, error } = await supabase.functions.invoke('generate-password-link', {
      body: { userId, userEmail: email }
    });
    if (error || data?.error) {
      toast({ title: 'Error', description: data?.error || error?.message, variant: 'destructive' });
    } else {
      setGeneratedLink(data.link);
      toast({ title: 'Password link generated', description: 'Copy and send the link to the user. It can only be viewed once.' });
    }
    setGeneratingFor(null);
  };

  const copyLink = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  const handleSendResetEmail = async (email: string) => {
    setSendingResetTo(email);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast({ title: 'Reset email sent', description: `Password reset email sent to ${email}` });
    } catch (err: any) {
      toast({ title: 'Failed', description: err?.message || 'Could not send reset email', variant: 'destructive' });
    } finally {
      setSendingResetTo(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-amber-600" />
              Manage Team — {companyName}
            </DialogTitle>
            <DialogDescription>
              Change primary email, add/edit/remove team members, and generate password links.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Email Section */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-amber-700" />
                  <h3 className="text-sm font-semibold text-amber-900">Primary Account</h3>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {editingPrimaryEmail ? (
                    <>
                      <Input
                        value={newPrimaryEmail}
                        onChange={e => setNewPrimaryEmail(e.target.value)}
                        className="flex-1 min-w-[200px]"
                        type="email"
                      />
                      <Button size="sm" onClick={handleUpdatePrimaryEmail} disabled={saving}>
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span className="ml-1">Save</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditingPrimaryEmail(false); setNewPrimaryEmail(primaryEmail); }}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-slate-800">{primaryEmail}</span>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-900 text-[10px]">Primary</Badge>
                      <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setEditingPrimaryEmail(true)}>
                        <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                    </>
                  )}
                </div>

                {/* Password link & Reset email for primary */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={generatingFor === companyUserId}
                    onClick={() => handleGeneratePasswordLink(companyUserId, primaryEmail)}
                  >
                    {generatingFor === companyUserId ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <KeyRound className="w-3 h-3 mr-1" />}
                    Generate Password Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    disabled={sendingResetTo === primaryEmail}
                    onClick={() => handleSendResetEmail(primaryEmail)}
                  >
                    {sendingResetTo === primaryEmail ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                    Send Reset Email
                  </Button>
                </div>
              </div>

              {/* Generated Link Display */}
              {generatedLink && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-green-800 mb-2">
                    🔗 One-Time Password Link (send to the user — it expires after viewing):
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-white border border-green-300 rounded-lg p-2 break-all select-all">
                      {generatedLink}
                    </code>
                    <Button size="sm" variant="outline" onClick={copyLink}>
                      {linkCopied ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                  <p className="text-[10px] text-green-700 mt-2">
                    ⚠️ You cannot see the password. Only the person who opens this link will see it once.
                  </p>
                </div>
              )}

              <Separator />

              {/* Team Members Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Team Members ({members.length})
                  </h3>
                  <Button size="sm" variant="outline" onClick={() => setShowAddForm(!showAddForm)}>
                    <UserPlus className="w-3.5 h-3.5 mr-1" />
                    Add Member
                  </Button>
                </div>

                {/* Add Member Form */}
                {showAddForm && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Name</Label>
                        <Input value={newMemberName} onChange={e => setNewMemberName(e.target.value)} placeholder="Member name" />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} placeholder="member@company.com" type="email" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setShowAddForm(false); setNewMemberEmail(''); setNewMemberName(''); }}>Cancel</Button>
                      <Button size="sm" onClick={handleAddMember} disabled={saving || !newMemberEmail}>
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <UserPlus className="w-3.5 h-3.5 mr-1" />}
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                {/* Member List */}
                {members.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No team members yet.</p>
                ) : (
                  <div className="space-y-2">
                    {members.map(member => (
                      <div key={member.id} className="border border-slate-200 rounded-lg p-3 bg-white hover:border-amber-300 transition-colors">
                        {editingMemberId === member.id ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Input value={editMemberName} onChange={e => setEditMemberName(e.target.value)} placeholder="Name" />
                              <Input value={editMemberEmail} onChange={e => setEditMemberEmail(e.target.value)} placeholder="Email" type="email" />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setEditingMemberId(null)}>Cancel</Button>
                              <Button size="sm" onClick={() => handleUpdateMember(member.id)} disabled={saving}>
                                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                <span className="ml-1">Save</span>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-800 truncate">{member.member_name || 'Unnamed'}</span>
                                {member.role_in_company && (
                                  <Badge variant="secondary" className="text-[10px]">{member.role_in_company}</Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate">{member.member_email}</p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0"
                                title="Edit"
                                onClick={() => { setEditingMemberId(member.id); setEditMemberName(member.member_name || ''); setEditMemberEmail(member.member_email); }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0"
                                title="Send reset email"
                                disabled={sendingResetTo === member.member_email}
                                onClick={() => handleSendResetEmail(member.member_email)}
                              >
                                {sendingResetTo === member.member_email ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                              </Button>
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0"
                                title="Generate password link"
                                disabled={generatingFor === member.member_user_id}
                                onClick={() => handleGeneratePasswordLink(member.member_user_id, member.member_email)}
                              >
                                {generatingFor === member.member_user_id ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3 h-3" />}
                              </Button>
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0"
                                title="Make primary"
                                onClick={() => setConfirmSwap(member)}
                              >
                                <ArrowUpDown className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                                title="Remove"
                                onClick={() => setConfirmRemove(member)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Swap Primary */}
      <AlertDialog open={!!confirmSwap} onOpenChange={() => setConfirmSwap(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Swap Primary Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will make <strong>{confirmSwap?.member_email}</strong> the primary account for {companyName}. 
              The current primary ({primaryEmail}) will become a team member. Survey data will be migrated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmSwap && handleSwapPrimary(confirmSwap)} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Confirm Swap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Remove */}
      <AlertDialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{confirmRemove?.member_name || confirmRemove?.member_email}</strong> from {companyName}. 
              Their account will remain but will be unlinked from the company.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmRemove && handleRemoveMember(confirmRemove)} className="bg-red-600 hover:bg-red-700" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
