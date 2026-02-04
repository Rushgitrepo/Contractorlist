import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Menu,
  Sun,
  Moon,
  Building2,
  User,
  Settings,
  LogOut,
  Search,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logoutUser } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
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
  const { toast } = useToast();


  const handleNewProject = () => {
    navigate('/gc-dashboard/my-projects');
    // Trigger new project modal - this will be handled by MyProjects component
    setTimeout(() => {
      const event = new CustomEvent('openNewProjectModal');
      window.dispatchEvent(event);
    }, 100);
  };

  // Get page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/overview')) return 'Dashboard Overview';
    if (location.pathname.includes('/my-projects')) return 'My Projects';
    if (location.pathname.includes('/communications')) return 'Communication';
    if (location.pathname.includes('/project-discovery')) return 'Project Discovery';
    if (location.pathname.includes('/directory')) return 'Sub Contractor Directory';
    if (location.pathname.includes('/settings')) return 'Settings';
    if (location.pathname.includes('/customer-support')) return 'Customer Support';
    return 'GC Dashboard';
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-50 dark:bg-[#0f1115] border-b border-gray-200 dark:border-white/5">
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

          </div>

          {/* Right Section - Actions, Theme & Profile */}
          <div className="flex items-center gap-2">
            {/* Primary Action - New Project */}
            <Button
              onClick={handleNewProject}
              className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold h-9 hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-accent" />
              ) : (
                <Moon className="w-4 h-4 text-gray-700" />
              )}
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded-lg h-9"
                >
                  <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent group-hover:ring-accent transition-all">
                    <AvatarImage src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=150&h=150" className="object-cover" />
                    <AvatarFallback className="bg-accent text-accent-foreground font-semibold">AC</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-gray-900 dark:text-white">
                    Profile
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="bg-accent text-accent-foreground font-bold text-xs">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 font-medium">{user?.role || 'Guest'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => navigate('/gc-dashboard/settings')}
                >
                  <User className="w-4 h-4 mr-3" />
                  Update Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                  onClick={() => navigate('/gc-dashboard/settings')}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-gray-900 dark:text-white p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
