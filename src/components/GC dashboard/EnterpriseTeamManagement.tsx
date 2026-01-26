import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Filter,
  MoreVertical,
  Plus,
  PlayCircle,
  Mail,
  UserPlus,
  ShieldCheck,
  Globe,
  Building2
} from 'lucide-react';

/* 
  Rebuilding Team Management to align with the "Dark Glass" theme while keeping the 
  "Onboarding" table structure requested in the previous step, but dark mode.
*/

interface TeamMember {
  id: string;
  name: string;
  role: string;
  employeeId: string;
  type: string;
  status: 'In-Progress' | 'Draft' | 'Completed';
  progress: number;
  country: string;
  avatar?: string;
}

const EnterpriseTeamManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Gorde Omkar',
      role: 'You',
      employeeId: 'GOADS01',
      type: 'Direct Employee',
      status: 'In-Progress',
      progress: 20,
      country: 'India',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      id: '2',
      name: 'Darrell Steward',
      role: 'Direct Employee',
      employeeId: 'GOADS02',
      type: 'Direct Employee',
      status: 'In-Progress',
      progress: 80,
      country: 'United States',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      id: '3',
      name: 'Darlene Robertson',
      role: 'Contractor',
      employeeId: 'GOADS03',
      type: 'Contractor',
      status: 'In-Progress',
      progress: 40,
      country: 'United States',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      id: '4',
      name: 'Robert Fox',
      role: 'Direct Employee',
      employeeId: 'GOADS04',
      type: 'Direct Employee',
      status: 'Draft',
      progress: 100,
      country: 'United States',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100'
    },
    {
      id: '5',
      name: 'Courtney Henry',
      role: 'Direct Employee',
      employeeId: 'GOADS05',
      type: 'Direct Employee',
      status: 'Draft',
      progress: 20,
      country: 'United States',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100'
    }
  ];

  const filteredMembers = teamMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'employees' && m.type === 'Direct Employee') ||
      (activeTab === 'contractors' && m.type === 'Contractor') ||
      (activeTab === 'pending' && m.status === 'In-Progress');
    return matchesSearch && matchesTab;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Member Added",
      description: "Invitation email has been sent to the new team member.",
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row justify-end items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full px-6 shadow-md transition-all hover:scale-105 border-0 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 w-48 focus:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Banner Section - Always Dark for impact, or dark-themed container */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1c1e24] p-8 border-l-4 border-l-yellow-500 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Need to onboard a sub-contractor?</h2>
            <p className="text-gray-400 max-w-lg">
              Launch the automated onboarding flow to get them compliant and ready for the job site in minutes.
            </p>
          </div>
          <Button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-6 font-medium backdrop-blur-md transition-all"
          >
            <PlayCircle className="w-4 h-4 mr-2 fill-current text-yellow-500" />
            Start Onboarding
          </Button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none"></div>
      </div>

      {/* Filters/Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-1">
        <div className="flex items-center space-x-6 overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {[
            { label: 'All Members', count: 20, id: 'all' },
            { label: 'Employees', count: 19, id: 'employees' },
            { label: 'Contractors', count: 1, id: 'contractors' },
            { label: 'Pending', count: 5, id: 'pending' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 px-1 ${activeTab === tab.id
                ? 'border-yellow-500 text-yellow-600 dark:text-yellow-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {tab.label}
              <Badge
                className={`ml-1 rounded-full px-2 py-0.5 text-xs border-0 ${activeTab === tab.id
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}
              >
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#1c1e24] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-200 dark:border-white/10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{member.name}</div>
                        {member.role === 'You' && <span className="text-xs text-yellow-600 dark:text-yellow-500">You</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {member.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {member.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {/* Simple SVG Circle Pie */}
                      <div className="relative h-6 w-6">
                        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                          <path className="text-gray-200 dark:text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                          <path className="text-yellow-500" strokeDasharray={`${member.progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{member.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={`border-0 ${member.status === 'In-Progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        member.status === 'Completed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-gray-100 dark:bg-gray-500/20 text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      {member.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {member.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toast({ title: "Edit Member", description: `Opening profile for ${member.name}` })}>
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Email Sent", description: `Sent compliance reminder to ${member.name}` })}>
                          Send Reminder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                        <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10">
                          Deactivate
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

      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Invite a new person to join your GC dashboard team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required className="bg-gray-100 dark:bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" required className="bg-gray-100 dark:bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="Project Manager" required className="bg-gray-100 dark:bg-black/20" />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black">Send Invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Start Onboarding Modal */}
      <Dialog open={isOnboardingModalOpen} onOpenChange={setIsOnboardingModalOpen}>
        <DialogContent className="bg-[#1c1e24] border-white/10 text-white sm:max-w-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full"></div>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-yellow-500" />
            </div>
            <DialogTitle className="text-2xl font-bold">Launch Onboarding Flow</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select the type of subcontractor or employee you're onboarding to start the compliance and documentation flow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-6">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">Project Subcontractor</p>
                <p className="text-sm text-gray-400">Insurance, licensing, and safety certs required.</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-yellow-500/30 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30">
                <UserPlus className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-bold text-lg text-white">Full-time Employee</p>
                <p className="text-sm text-gray-400">W-4, I-9, and benefits enrollment.</p>
              </div>
            </button>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setIsOnboardingModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterpriseTeamManagement;
