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
              className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9 hidden lg:flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]"
            >
              <Building2 className="w-4 h-4" />
              Home
            </Button>

            {/* Terminal Indicator */}
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 shadow-sm font-bold">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-900 dark:text-white">Active Terminal</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Find Missions - Quick Link */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold uppercase tracking-widest text-[10px]"
              onClick={() => navigate('/subcontractor-dashboard/find-projects')}
            >
              <Search className="w-4 h-4 mr-2" /> Find Missions
            </Button>

            {/* Primary Action */}
            <Button
              onClick={handleNewProposal}
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold h-9 px-4 rounded-xl hidden sm:flex uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
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
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-1">{user?.name || 'User'}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{user?.role || 'Partner'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 rounded-2xl shadow-2xl">
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground font-black shadow-lg">
                      {userInitials}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-tight">{user?.name || 'User'}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user?.role || 'Partner'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl cursor-pointer group" onClick={() => navigate('/subcontractor-dashboard/my-profile')}>
                  <User className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl cursor-pointer group" onClick={() => navigate('/subcontractor-dashboard/settings')}>
                  <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent" />
                  <span className="text-xs font-bold uppercase tracking-widest">Terminal Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-100 dark:bg-white/5" />
                <DropdownMenuItem
                  className="text-red-500 p-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl cursor-pointer group"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sign Out Terminal</span>
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