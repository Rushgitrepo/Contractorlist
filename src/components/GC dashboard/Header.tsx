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

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check theme on mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
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
    if (location.pathname.includes('/help')) return 'Support';
    return 'GC Dashboard';
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

        

         
          </div>

          {/* Right Section - Actions, Theme & Profile */}
          <div className="flex items-center gap-2">
            {/* Primary Action - New Project */}
            <Button
              onClick={handleNewProject}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-9 hidden sm:flex"
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
                <Sun className="w-4 h-4 text-yellow-500" />
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
                  <Avatar className="w-8 h-8 cursor-pointer ring-2 ring-transparent group-hover:ring-yellow-400 dark:group-hover:ring-yellow-500 transition-all">
                    <AvatarImage src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=150&h=150" className="object-cover" />
                    <AvatarFallback className="bg-yellow-400 dark:bg-yellow-500 text-black font-semibold">AC</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-gray-900 dark:text-white">
                    Profile
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center text-gray-900 shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">Acme Construction</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">General Contractor</p>
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
                <DropdownMenuItem className="text-red-600 dark:text-red-400 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer">
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
