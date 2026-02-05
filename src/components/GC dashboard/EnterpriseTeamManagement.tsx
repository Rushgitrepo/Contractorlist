import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getTeamMembers, inviteTeamMember, createTeamMember, deleteTeamMember, updateTeamMember, getProjectDiscovery, sendTeamMemberReminder } from '@/api/gc-apis';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Sparkles,
  Mail,
  UserPlus,
  ShieldCheck,
  Globe,
  Building2,
  Users,
  Briefcase,
  Zap,
  MessageSquare,
  Smartphone,
  MoreVertical
} from 'lucide-react';

/* 
  Rebuilding Team Management to align with the "Dark Glass" theme while keeping the 
  "Onboarding" table structure.
*/

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  employeeId: string;
  type: string;
  status: 'In-Progress' | 'Draft' | 'Completed';
  progress: number;
  country: string;
  avatar?: string;
  assignedProjects: { id: number; name: string }[];
}

const EnterpriseTeamManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Trades');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'sms' | 'both'>('email');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<'Direct Employee' | 'Contractor'>('Direct Employee');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Alert Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    variant: 'default'
  });

  const confirmAction = (title: string, description: string, onConfirm: () => void, variant: 'default' | 'destructive' = 'default') => {
    setAlertConfig({ isOpen: true, title, description, onConfirm, variant });
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getTeamMembers();
      const mappedMembers = data.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email || '',
        phone: m.phone || '',
        role: m.role || 'Team Member',
        employeeId: m.employee_id || 'N/A',
        type: m.type || 'Direct Employee',
        status: (m.status === 'Active' ? 'Completed' : 'In-Progress') as any,
        progress: m.progress || 0,
        country: 'United States',
        avatar: m.avatar_url,
        assignedProjects: m.assigned_projects || []
      }));
      setTeamMembers(mappedMembers);
    } catch (error) {
      console.error("Failed to load team members", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReminder = async (member: TeamMember) => {
    try {
      await sendTeamMemberReminder(parseInt(member.id));
      toast({
        title: "Reminder Sent",
        description: `Reminder email sent to ${member.name}`,
      });
    } catch (error: any) {
      console.error("Failed to send reminder:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to send reminder email",
        variant: "destructive"
      });
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const methods = inviteMethod === 'both' ? 'Email and SMS' : inviteMethod.toUpperCase();

      const memberData = {
        name,
        email,
        phone,
        role,
        type: type,
        employee_id: isEditing && employeeId ? employeeId : `EMP-${Math.floor(Math.random() * 10000)}`,
        status: 'Active'
      };

      if (isEditing && editingMemberId) {
        await updateTeamMember(Number(editingMemberId), memberData);
        toast({
          title: "Team Member Updated",
          description: `${name}'s profile has been updated.`,
        });
      } else {
        await createTeamMember(memberData);
        toast({
          title: "Team Member Added",
          description: `${name} has been added to your team. Invitation sent via ${methods}.`,
        });
      }

      setIsAddModalOpen(false);
      setIsEditing(false);
      setEditingMemberId(null);
      loadTeamMembers();
      setName('');
      setEmail('');
      setPhone('');
      setRole('');
      setEmployeeId('');
      setType('Direct Employee');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} team member`,
        variant: "destructive"
      });
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setIsEditing(true);
    setEditingMemberId(member.id.toString());
    setName(member.name);
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setRole(member.role);
    setEmployeeId(member.employeeId);
    setType(member.type as any);
    setIsAddModalOpen(true);
  };


  const handleDeleteMember = async (id: string, name: string) => {
    confirmAction(
      "Remove Team Member?",
      `Are you sure you want to remove ${name} from your team?`,
      async () => {
        try {
          await deleteTeamMember(Number(id));
          toast({
            title: "Team Member Removed",
            description: `${name} has been removed from the team.`
          });
          loadTeamMembers();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to remove team member.",
            variant: "destructive"
          });
        }
      },
      "destructive"
    );
  };

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'employees' && m.type === 'Direct Employee') ||
      (activeTab === 'contractors' && m.type === 'Contractor') ||
      (activeTab === 'pending' && m.status === 'In-Progress');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8">

      {/* Discovery & Search Hub */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#1c1e24] p-6 border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">Team Hub</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md">
                Manage your staff or discover new verified partners for your upcoming projects.
              </p>
            </div>

            <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm"
              >
                <Users size={14} /> My Team
              </button>
              <button
                onClick={() => navigate('/gc-dashboard/directory')}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Globe size={14} /> Sub Contractor Directory
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
              <Input
                placeholder="Search by name or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-gray-50 dark:bg-black/30 border-gray-200 dark:border-white/10 rounded-xl text-base font-medium focus:ring-yellow-500/20"
              />
            </div>
            <Button
              className="h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest rounded-xl shadow-sm border-0"
              onClick={() => {
                setIsEditing(false);
                setName('');
                setEmail('');
                setPhone('');
                setRole('');
                setEmployeeId('');
                setType('Direct Employee');
                setIsAddModalOpen(true);
              }}
            >
              <Plus className="mr-2" size={18} /> Add Member
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {[
              { label: 'All Members', id: 'all' },
              { label: 'Employees', id: 'employees' },
              { label: 'Contractors', id: 'contractors' },
              { label: 'Pending', id: 'pending' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-4 text-sm font-bold uppercase tracking-tight transition-colors ${activeTab === tab.id
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c1e24] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Member</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role & ID</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Projects</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="group hover:bg-gray-50 dark:hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-gray-200 dark:border-white/10 shadow-sm">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 font-bold text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm leading-none mb-1">{member.name}</div>
                          <Badge variant="outline" className="h-4 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-none text-[8px] font-bold uppercase tracking-tighter">
                            Internal Team
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{member.role}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{member.employeeId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {member.assignedProjects && member.assignedProjects.length > 0 ? (
                          <>
                            {member.assignedProjects.slice(0, 2).map((p: any) => (
                              <Badge key={p.id} variant="outline" className="text-[9px] h-5 px-1.5 whitespace-nowrap bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium">{p.name}</Badge>
                            ))}
                            {member.assignedProjects.length > 2 && (
                              <Badge variant="outline" className="text-[9px] h-5 px-1.5 bg-gray-50 dark:bg-white/5 text-gray-400 border-gray-200 dark:border-white/10">+{member.assignedProjects.length - 2}</Badge>
                            )}
                          </>
                        ) : <span className="text-[10px] text-gray-400 italic">No projects</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none",
                          member.status === 'In-Progress' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' :
                            member.status === 'Completed' ? 'bg-gray-900/10 text-gray-900 dark:text-white' :
                              'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                        )}
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-500 hover:bg-yellow-400/10 rounded-lg">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 p-1 rounded-xl shadow-lg">
                          <DropdownMenuItem className="rounded-lg font-bold" onClick={() => handleEditMember(member)}>
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-bold" onClick={() => handleSendReminder(member)}>
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                          <DropdownMenuItem className="rounded-lg font-bold text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20" onClick={() => handleDeleteMember(member.id, member.name)}>
                            Deactivate / Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            <DialogDescription>
              {isEditing ? `Update details for ${name}.` : 'Invite a new person to join your GC dashboard team.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required={inviteMethod !== 'sms'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    required={inviteMethod !== 'email'}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Position / Role</Label>
              <Input
                id="role"
                placeholder="e.g. Project Manager, Site Supervisor"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10"
              />
            </div>

            {/* <div className="space-y-3 pt-2">
              <Label className="text-gray-700 dark:text-gray-300">Invitation Method</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setInviteMethod('email')}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-xl border transition-all gap-1",
                    inviteMethod === 'email' ? "bg-yellow-400/10 border-yellow-500 text-yellow-600 dark:text-yellow-400" : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/5 text-gray-400"
                  )}
                >
                  <Mail size={16} />
                  <span className="text-[10px] font-bold uppercase">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInviteMethod('sms')}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-xl border transition-all gap-1",
                    inviteMethod === 'sms' ? "bg-yellow-400/10 border-yellow-500 text-yellow-600 dark:text-yellow-400" : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/5 text-gray-400"
                  )}
                >
                  <MessageSquare size={16} />
                  <span className="text-[10px] font-bold uppercase">SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInviteMethod('both')}
                  className={cn(
                    "flex flex-col items-center justify-center py-3 rounded-xl border transition-all gap-1",
                    inviteMethod === 'both' ? "bg-yellow-400/10 border-yellow-500 text-yellow-600 dark:text-yellow-400" : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/5 text-gray-400"
                  )}
                >
                  <div className="flex gap-1">
                    <Mail size={12} />
                    <MessageSquare size={12} />
                  </div>
                  <span className="text-[10px] font-bold uppercase">Both</span>
                </button>
              </div>
            </div> */}

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="text-gray-500">Cancel</Button>
              <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-11 px-8 rounded-xl shadow-lg shadow-yellow-500/10 transition-all active:scale-95">
                {isEditing ? 'Save Changes' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => {
        if (!open) setAlertConfig(prev => ({ ...prev, isOpen: false }));
      }}>
        <AlertDialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertConfig.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                alertConfig.onConfirm();
                setAlertConfig(prev => ({ ...prev, isOpen: false }));
              }}
              className={cn(alertConfig.variant === 'destructive' ? "bg-red-600 hover:bg-red-700 focus:ring-red-600" : "")}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnterpriseTeamManagement;
