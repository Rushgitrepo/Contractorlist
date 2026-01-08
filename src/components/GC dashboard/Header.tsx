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
  Activity,
  TrendingUp,
  Briefcase,
  Zap,
  X,
  Command,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  Users,
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
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

// Mock search results
const searchResults = [
  { id: 1, type: 'project', name: 'Austin Medical Center Expansion', icon: Building2 },
  { id: 2, type: 'project', name: 'Downtown Office Complex', icon: Building2 },
  { id: 3, type: 'team', name: 'John Smith - Project Manager', icon: Users },
  { id: 4, type: 'document', name: 'Project Proposal Q4 2024', icon: FileText },
];

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced real-time stats for GC
  const [stats] = useState({
    activeProjects: 24,
    newMessages: 8,
    totalRevenue: 12500000,
    monthlyGrowth: 15.2,
    teamCapacity: 87,
    unreadNotifications: 6
  });

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New Project Bid',
      message: 'Austin Medical Center project bid submitted successfully',
      time: '2 min ago',
      type: 'success',
      icon: CheckCircle2,
      unread: true
    },
    {
      id: 2,
      title: 'Team Update',
      message: 'Downtown Office project milestone completed',
      time: '15 min ago',
      type: 'info',
      icon: Activity,
      unread: true
    },
    {
      id: 3,
      title: 'Budget Alert',
      message: 'Industrial Warehouse project is 5% over budget',
      time: '1 hour ago',
      type: 'warning',
      icon: AlertCircle,
      unread: true
    },
    {
      id: 4,
      title: 'Document Approved',
      message: 'Building permit approved for Riverside Shopping Center',
      time: '2 hours ago',
      type: 'success',
      icon: FileText,
      unread: false
    },
  ];

  // Check theme on mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSearchResults(true);
      }
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearchResults]);

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
    : searchResults;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle2;
      case 'warning':
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Live Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400">Live</span>
            </div>

            {/* Enhanced Search with Results */}
            <div ref={searchRef} className="relative flex-1 max-w-2xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  ref={inputRef}
                  placeholder="Search projects, bids, team members, or documents..."
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
                            navigate(`/gc-dashboard/projects`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                        >
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/20 transition-colors">
                            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {result.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {result.type}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">Esc</kbd> to close
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Enhanced Quick Stats */}
            <div className="hidden xl:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
                <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div>
                  <span className="font-bold text-green-700 dark:text-green-400">{stats.activeProjects}</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1 text-xs">Projects</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow">
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-bold text-blue-700 dark:text-blue-400">${(stats.totalRevenue / 1000000).toFixed(1)}M</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1 text-xs">Revenue</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow">
                <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <div>
                  <span className="font-bold text-orange-700 dark:text-orange-400">+{stats.monthlyGrowth}%</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1 text-xs">Growth</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Quick Access */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 hidden sm:flex hover:scale-105 transition-transform"
              onClick={() => navigate('/gc-dashboard/ai-copilot')}
            >
              <Sparkles className="w-4 h-4" />
            </Button>

            {/* Calendar */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/gc-dashboard/calendar')}
            >
              <Calendar className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
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
                <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="w-4 h-4" />
                  {stats.unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
                      {stats.unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 p-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {stats.unreadNotifications} new
                    </Badge>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type);
                    return (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          "flex flex-col items-start p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                          notification.unread && "bg-blue-50/50 dark:bg-blue-900/10"
                        )}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={cn("p-2 rounded-lg", colorClass)}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
                <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    variant="ghost"
                    className="w-full text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    onClick={() => navigate('/gc-dashboard/communications')}
                  >
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced Messages */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/gc-dashboard/communications')}
            >
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
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-gray-900">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Acme Construction</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">General Contractor</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">Acme Construction</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">john@acmeconstruction.com</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => navigate('/gc-dashboard/settings')}
                >
                  <User className="w-4 h-4 mr-3" />
                  Company Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => navigate('/gc-dashboard/settings')}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => navigate('/gc-dashboard/analytics')}
                >
                  <Activity className="w-4 h-4 mr-3" />
                  Business Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects, bids..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="xl:hidden mt-3 grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Briefcase className="w-4 h-4 text-green-600" />
            <div>
              <span className="font-bold text-green-600 text-sm block">{stats.activeProjects}</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Projects</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <div>
              <span className="font-bold text-blue-600 text-sm block">${(stats.totalRevenue / 1000000).toFixed(1)}M</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <div>
              <span className="font-bold text-orange-600 text-sm block">+{stats.monthlyGrowth}%</span>
              <p className="text-xs text-gray-600 dark:text-gray-400">Growth</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;