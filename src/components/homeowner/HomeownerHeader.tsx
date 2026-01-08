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
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [notifications] = useState(3); // Mock notification count
  const [isDark, setIsDark] = useState(false);
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

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-yellow-50"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Mobile Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="size-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">ContractorsList</span>
        </div>

        {/* Enhanced Search Bar - Desktop */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
              searchFocused ? 'text-orange-500' : 'text-gray-400'
            }`} />
            <Input
              ref={inputRef}
              placeholder="Find contractors, services, or projects..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              className={cn(
                "pl-10 pr-20 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-orange-300 dark:focus:border-orange-600 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50 transition-all",
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

          {/* Search Results Dropdown */}
          {showSearchResults && filteredResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in slide-in-from-top-2">
              <div className="p-2">
                {filteredResults.map((result) => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        // Navigate based on result type
                        if (result.type === 'project') {
                          navigate('/homeowner-dashboard/projects');
                        } else if (result.type === 'contractor') {
                          navigate('/homeowner-dashboard/contractors');
                        } else if (result.type === 'bid') {
                          navigate('/homeowner-dashboard/bids');
                        }
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Icon className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
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

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button - Mobile */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden hover:bg-yellow-50"
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-yellow-50"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 border-2 border-white text-white">
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                <Button variant="ghost" size="sm" className="text-xs h-6">
                  Mark all read
                </Button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <div 
                className={cn(
                  "p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
                  "bg-blue-50/50 dark:bg-blue-900/10"
                )}
                onClick={() => navigate('/homeowner-dashboard/bids')}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        New bid received
                      </p>
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Elite Builders submitted a bid for Kitchen Renovation
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate('/homeowner-dashboard/projects')}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Project milestone completed
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Demolition phase finished ahead of schedule
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      1 day ago
                    </p>
                  </div>
                </div>
              </div>
              <div 
                className="p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate('/homeowner-dashboard/projects')}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Payment reminder
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Next payment due for Backyard ADU project
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  // Could navigate to a notifications page if it exists
                  console.log('View all notifications');
                }}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="hidden sm:flex hover:bg-yellow-50 dark:hover:bg-gray-800 relative"
        >
          <Sun className={cn(
            "w-5 h-5 transition-all",
            isDark ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100"
          )} />
          <Moon className={cn(
            "w-5 h-5 transition-all",
            isDark ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"
          )} />
        </Button>

        {/* Post Project Button */}
        <Button 
          onClick={() => setShowPostProjectDialog(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg transition-all hover:shadow-xl font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Post Project</span>
          <span className="sm:hidden">Post</span>
        </Button>

        {/* Post Project Dialog */}
        <Dialog open={showPostProjectDialog} onOpenChange={setShowPostProjectDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Post New Project
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Create a new project listing to get bids from qualified contractors
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Project Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Kitchen Renovation, Backyard Deck, etc."
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Project Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail. Include size, materials, special requirements, etc."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full min-h-[100px]"
                />
              </div>

              {/* Project Type and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Project Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={projectForm.projectType}
                    onValueChange={(value) => setProjectForm({ ...projectForm, projectType: value })}
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="new-construction">New Construction</SelectItem>
                      <SelectItem value="remodeling">Remodeling</SelectItem>
                      <SelectItem value="addition">Addition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Budget Range <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={projectForm.budget}
                    onValueChange={(value) => setProjectForm({ ...projectForm, budget: value })}
                  >
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                      <SelectItem value="over-500k">Over $500,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location and Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-sm font-semibold text-gray-900 dark:text-white">
                    Preferred Timeline
                  </Label>
                  <Select
                    value={projectForm.timeline}
                    onValueChange={(value) => setProjectForm({ ...projectForm, timeline: value })}
                  >
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-3months">1-3 Months</SelectItem>
                      <SelectItem value="3-6months">3-6 Months</SelectItem>
                      <SelectItem value="6-12months">6-12 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Urgency Level */}
              <div className="space-y-2">
                <Label htmlFor="urgency" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Project Urgency
                </Label>
                <Select
                  value={projectForm.urgency}
                  onValueChange={(value) => setProjectForm({ ...projectForm, urgency: value })}
                >
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - No rush</SelectItem>
                    <SelectItem value="medium">Medium - Normal timeline</SelectItem>
                    <SelectItem value="high">High - Need it soon</SelectItem>
                    <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* AI Assistant Suggestion */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">AI Suggestion</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Adding photos and detailed requirements will help contractors provide more accurate bids. You can add these after posting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPostProjectDialog(false);
                  setProjectForm({
                    title: '',
                    description: '',
                    projectType: '',
                    budget: '',
                    location: '',
                    timeline: '',
                    urgency: 'medium'
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Validate form
                  if (!projectForm.title || !projectForm.description || !projectForm.projectType || !projectForm.budget || !projectForm.location) {
                    alert('Please fill in all required fields');
                    return;
                  }
                  
                  // Simulate posting project
                  console.log('Posting project:', projectForm);
                  
                  // Show success message
                  alert('Project posted successfully! Contractors will be able to view and bid on your project.');
                  
                  // Reset form and close dialog
                  setProjectForm({
                    title: '',
                    description: '',
                    projectType: '',
                    budget: '',
                    location: '',
                    timeline: '',
                    urgency: 'medium'
                  });
                  setShowPostProjectDialog(false);
                  
                  // Navigate to projects page
                  navigate('/homeowner-dashboard/projects');
                }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Post Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Avatar & Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-orange-100">
              <div className="size-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 bg-cover bg-center border-2 border-white shadow-lg cursor-pointer flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">Alex Johnson</p>
                <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                  alex.johnson@email.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/homeowner-dashboard/settings')}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/homeowner-dashboard/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/homeowner-dashboard/help')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => {
                // Handle logout
                console.log('Logging out...');
                // In a real app, this would clear auth state and redirect
                navigate('/login');
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HomeownerHeader;