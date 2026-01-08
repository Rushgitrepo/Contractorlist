import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Bell,
  Menu,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  MessageSquare,
  Calendar,
  DollarSign,
  Zap,
  Activity,
  TrendingUp,
  X,
  Command,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Target,
  Briefcase,
  Sparkles,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import NotificationCenter from '@/components/common/NotificationCenter';

interface SubcontractorHeaderProps {
  onMenuClick: () => void;
}

// Mock search results
const searchResults = [
  { id: 1, type: 'project', name: 'Downtown Medical Center Expansion', icon: Building2 },
  { id: 2, type: 'bid', name: 'Riverside High School Renovation', icon: Target },
  { id: 3, type: 'project', name: 'The Aurora Apartments Phase 2', icon: Building2 },
  { id: 4, type: 'document', name: 'Bid Proposal Template 2024', icon: FileText },
];

const SubcontractorHeader = ({ onMenuClick }: SubcontractorHeaderProps) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced real-time stats
  const [stats] = useState({
    activeBids: 3,
    newMessages: 5,
    todayEarnings: 2450,
    weeklyGrowth: 12.5,
    activeProjects: 8,
    unreadNotifications: 7
  });

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New Project Match',
      message: 'Downtown Medical Center project matches your profile',
      time: '2 min ago',
      type: 'success',
      icon: CheckCircle2,
      unread: true
    },
    {
      id: 2,
      title: 'Bid Submitted',
      message: 'Your bid for Riverside High School was submitted',
      time: '15 min ago',
      type: 'info',
      icon: Activity,
      unread: true
    },
    {
      id: 3,
      title: 'Profile View',
      message: 'Turner Construction viewed your profile',
      time: '1 hour ago',
      type: 'info',
      icon: Eye,
      unread: false
    },
  ];

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

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Live Status Indicator */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Dashboard</span>
            </div>

            {/* Enhanced Search */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={inputRef}
                  placeholder="Search projects, bids, contractors, or documents..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowSearchResults(true);
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "pl-10 pr-20 w-full transition-all duration-200",
                    isSearchFocused && "ring-2 ring-yellow-400 border-yellow-400"
                  )}
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
                              navigate('/subcontractor-dashboard/find-projects');
                            } else if (result.type === 'bid') {
                              navigate('/subcontractor-dashboard/bid-management');
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
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Enhanced Quick Stats */}
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div>
                  <span className="font-bold text-green-600">{stats.activeBids}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Active Bids</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-bold text-blue-600">${stats.todayEarnings.toLocaleString()}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Today</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Activity className="w-4 h-4 text-purple-600" />
                <div>
                  <span className="font-bold text-purple-600">+{stats.weeklyGrowth}%</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">Growth</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Quick Access */}
            <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50 border border-orange-200 hidden sm:flex">
              <Zap className="w-4 h-4" />
            </Button>

            {/* Calendar */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Calendar className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {/* Enhanced Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {stats.unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
                      {stats.unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-6">
                      Mark all read
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
                          notif.unread && "bg-blue-50/50 dark:bg-blue-900/10"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            notif.type === 'success' && "bg-green-100 dark:bg-green-900/20",
                            notif.type === 'warning' && "bg-yellow-100 dark:bg-yellow-900/20",
                            notif.type === 'info' && "bg-blue-100 dark:bg-blue-900/20"
                          )}>
                            <Icon className={cn(
                              "w-4 h-4",
                              notif.type === 'success' && "text-green-600 dark:text-green-400",
                              notif.type === 'warning' && "text-yellow-600 dark:text-yellow-400",
                              notif.type === 'info' && "text-blue-600 dark:text-blue-400"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {notif.title}
                              </p>
                              {notif.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setShowNotifications(true)}>
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Messages */}
            <Button variant="ghost" size="sm" className="relative">
              <MessageSquare className="w-4 h-4" />
              {stats.newMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 size-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center p-0">
                  {stats.newMessages}
                </Badge>
              )}
            </Button>

            {/* Enhanced Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Acme Construction</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">HVAC Specialist</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Acme Construction</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">john@acmeconstruction.com</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <Activity className="w-4 h-4 mr-3" />
                  Performance Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-4 h-4" />
            <Input
              placeholder="Search projects, bids..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden mt-4 grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <div>
              <span className="font-bold text-green-600 text-sm">{stats.activeBids}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Bids</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-bold text-blue-600 text-sm">${stats.todayEarnings.toLocaleString()}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Activity className="w-4 h-4 text-purple-600" />
            <div>
              <span className="font-bold text-purple-600 text-sm">+{stats.weeklyGrowth}%</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Growth</p>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
};

export default SubcontractorHeader;