import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
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
  Plus,
  Building2,
  FileText,
  Search
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/hooks/useTheme';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logoutUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

interface SubcontractorHeaderProps {
  onMenuClick: () => void;
}

const SubcontractorHeader = ({ onMenuClick }: SubcontractorHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isDark, toggleTheme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.name ? getInitials(user.name) : 'U';
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewProposal = () => {
    navigate('/subcontractor-dashboard/find-projects');
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-50 dark:bg-[#0f1115] border-b border-gray-200 dark:border-white/5">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>

            {/* Back to Home Button */}
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9 hidden lg:flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Button>

            {/* Dashboard Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Dashboard Active</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Find Projects - Quick Link */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-medium text-xs"
              onClick={() => navigate('/subcontractor-dashboard/find-projects')}
            >
              <Search className="w-4 h-4 mr-2" /> Find Projects
            </Button>

            {/* Primary Action */}
            <Button
              onClick={handleNewProposal}
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold h-9 hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Bid
            </Button>

            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2 hidden sm:block" />

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 rounded-xl transition-all"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-accent" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded-xl h-10 transition-all"
                >
                  <Avatar className="w-8 h-8 rounded-lg ring-2 ring-transparent group-hover:ring-accent transition-all">
                    <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs uppercase">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 font-medium">{user?.role || 'Partner'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl shadow-2xl">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 font-medium">{user?.role || 'Partner'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer" onClick={() => navigate('/subcontractor-dashboard/my-profile')}>
                  <User className="w-4 h-4 mr-3" />
                  Update Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer" onClick={() => navigate('/subcontractor-dashboard/settings')}>
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                <DropdownMenuItem
                  className="text-red-500 p-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl cursor-pointer group"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SubcontractorHeader;