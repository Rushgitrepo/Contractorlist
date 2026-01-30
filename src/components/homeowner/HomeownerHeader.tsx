import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  Plus,
  Menu,
  Moon,
  Sun,
  Settings,
  User,
  LogOut,
  HelpCircle,
  X,
  Command,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Users,
  FolderOpen,
  Eye,
  Home,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HomeownerHeaderProps {
  onMenuClick: () => void;
}

// Mock search results
const searchResults = [
  { id: 1, type: 'project', name: 'Kitchen Renovation', icon: FolderOpen },
  { id: 2, type: 'contractor', name: 'Elite Builders', icon: Building2 },
  { id: 3, type: 'bid', name: 'BID-001 - Backyard ADU', icon: FileText },
  { id: 4, type: 'contractor', name: 'Summit Roofing', icon: Users },
];

const HomeownerHeader = ({ onMenuClick }: HomeownerHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isDark, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [notifications] = useState(3); // Mock notification count
  const [showPostProjectDialog, setShowPostProjectDialog] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    projectType: '',
    budget: '',
    location: '',
    timeline: '',
    urgency: 'medium'
  });

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const filteredResults = searchQuery
    ? searchResults.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSearchResults(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-4 md:px-8 z-20 shadow-sm dark:border-gray-800">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-accent/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Back to Home Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="hidden lg:flex items-center gap-2 hover:bg-accent/10"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">Home</span>
        </Button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="size-8 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <span className="text-accent-foreground font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">ContractorsList</span>
        </div>

        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? 'text-accent' : 'text-gray-400'}`} />
            <Input
              ref={inputRef}
              placeholder="Find contractors, services, or projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              className={cn(
                "pl-10 pr-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-accent dark:focus:border-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-accent/10 transition-all",
                searchFocused && "shadow-sm"
              )}
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchResults(true);
              }}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden lg:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 text-xs font-mono text-muted-foreground">
                <Command className="w-3 h-3" />K
              </kbd>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchResults(false);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {showSearchResults && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in slide-in-from-top-2">
              <div className="p-2">
                {filteredResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        if (result.type === 'project') navigate('/homeowner-dashboard/projects');
                        else if (result.type === 'contractor') navigate('/homeowner-dashboard/contractors');
                        else if (result.type === 'bid') navigate('/homeowner-dashboard/bids');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{result.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{result.type}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {result.type}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden hover:bg-accent/10"
        >
          <Search className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative hover:bg-accent/10">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-accent border-2 border-white text-accent-foreground">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs h-6">Mark all read</Button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => navigate('/homeowner-dashboard/bids')}>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">New bid received</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Elite Builders submitted a bid for Kitchen Renovation</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <Button variant="ghost" size="sm" className="w-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" onClick={toggleTheme} className="hidden sm:flex hover:bg-accent/10 dark:hover:bg-gray-800 relative">
          <Sun className={cn("w-5 h-5 transition-all", isDark ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100")} />
          <Moon className={cn("w-5 h-5 transition-all", isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute")} />
        </Button>

        <Button onClick={() => setShowPostProjectDialog(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-all hover:shadow-xl font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Post Project</span>
          <span className="sm:hidden">Post</span>
        </Button>

        <Dialog open={showPostProjectDialog} onOpenChange={setShowPostProjectDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <Plus className="w-5 h-5 text-accent-foreground" />
                </div>
                Post New Project
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Create a new project listing to get bids from qualified contractors
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-white">Project Title <span className="text-red-500">*</span></Label>
                <Input id="title" placeholder="e.g., Kitchen Renovation, Backyard Deck, etc." value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-white">Project Description <span className="text-red-500">*</span></Label>
                <Textarea id="description" placeholder="Describe your project in detail..." value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="min-h-[100px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-semibold text-gray-900 dark:text-white">Project Type <span className="text-red-500">*</span></Label>
                  <Select value={projectForm.projectType} onValueChange={(value) => setProjectForm({ ...projectForm, projectType: value })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-semibold text-gray-900 dark:text-white">Budget Range <span className="text-red-500">*</span></Label>
                  <Select value={projectForm.budget} onValueChange={(value) => setProjectForm({ ...projectForm, budget: value })}>
                    <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-4 bg-accent/10 dark:bg-accent/20 rounded-lg border border-accent/20 dark:border-accent/30">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">AI Suggestion</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Detailed requirements help get accurate bids.</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowPostProjectDialog(false)}>Cancel</Button>
              <Button onClick={() => setShowPostProjectDialog(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">Post Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-accent/20">
              <div className="size-8 rounded-full bg-accent border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-accent-foreground font-semibold text-sm">A</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">alex.johnson@email.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/homeowner-dashboard/settings')}>
              <User className="mr-2 h-4 w-4" /><span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /><span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HomeownerHeader;