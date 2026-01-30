import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Calendar,
  Zap,
  X,
  Command,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShoppingCart,
  Target,
  Building2,
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
import { useTheme } from '@/hooks/useTheme';

import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

interface SupplierHeaderProps {
  onMenuClick: () => void;
}

// Mock search results
const searchResults = [
  { id: 1, type: 'product', name: 'Portland Cement - Type I', icon: Package },
  { id: 2, type: 'order', name: 'ORD-001 - Turner Construction', icon: ShoppingCart },
  { id: 3, type: 'product', name: 'Rebar #4 - 20ft', icon: Package },
  { id: 4, type: 'contractor', name: 'ABC Construction', icon: Building2 },
];

const SupplierHeader = ({ onMenuClick }: SupplierHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced real-time stats
  const [stats] = useState({
    monthlyRevenue: 156240,
    activeProducts: 1247,
    pendingOrders: 18,
    monthlyGrowth: 12.5,
    unreadNotifications: 5,
    newMessages: 7
  });

  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New RFQ Received',
      message: 'Turner Construction requesting 500 bags of cement',
      time: '2 min ago',
      unread: true,
      icon: CheckCircle2
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Rebar #4 inventory below minimum threshold',
      time: '15 min ago',
      unread: true,
      icon: AlertCircle
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: '$24,500 payment from ABC Construction',
      time: '1 hour ago',
      unread: false,
      icon: CheckCircle2
    }
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

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
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
                placeholder="Search products, orders, contractors, or documents..."
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
                  isSearchFocused && "ring-2 ring-accent border-accent"
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
                          if (result.type === 'product') {
                            navigate('/supplier-dashboard/catalog');
                          } else if (result.type === 'order') {
                            navigate('/supplier-dashboard/orders');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <div className="p-2 bg-accent/10 dark:bg-accent/10 rounded-lg">
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

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Enhanced Quick Stats */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <span className="font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Monthly</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-4 h-4 text-blue-600" />
              <div>
                <span className="font-bold text-blue-600">{stats.activeProducts.toLocaleString()}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Products</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 dark:bg-accent/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-accent" />
              <div>
                <span className="font-bold text-accent">+{stats.monthlyGrowth}%</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Growth</span>
              </div>
            </div>
          </div>

          {/* AI Assistant Quick Access */}
          <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10 border border-accent/20 hidden sm:flex">
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
              <Button variant="ghost" size="sm" className="relative">
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
                          notif.type === 'order' && "bg-green-100 dark:bg-green-900/20",
                          notif.type === 'inventory' && "bg-accent/20 dark:bg-accent/20",
                          notif.type === 'payment' && "bg-blue-100 dark:bg-blue-900/20"
                        )}>
                          <Icon className={cn(
                            "w-4 h-4",
                            notif.type === 'order' && "text-green-600 dark:text-green-400",
                            notif.type === 'inventory' && "text-accent",
                            notif.type === 'payment' && "text-blue-600 dark:text-blue-400"
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
                <Button variant="ghost" size="sm" className="w-full text-xs">
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
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">BuildMart Supply</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Material Supplier</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuLabel className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">BuildMart Supply</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">info@buildmartsupply.com</p>
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
                Company Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <Settings className="w-4 h-4 mr-3" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                <Activity className="w-4 h-4 mr-3" />
                Business Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                onClick={handleLogout}
              >
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
            placeholder="Search products, orders..."
            className="pl-10 w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default SupplierHeader;