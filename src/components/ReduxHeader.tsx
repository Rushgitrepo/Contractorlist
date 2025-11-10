import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";
import {
  addNotification,
  closeMobileMenu,
  openLoginModal,
  setActiveDropdown,
  toggleMobileMenu,
} from "@/store/slices/uiSlice";
import {
  BookOpen,
  BookOpen as BookOpenIcon,
  Bot,
  Calculator,
  ChevronDown,
  ClipboardList,
  DollarSign,
  FileText,
  FileText as FileTextIcon,
  LogOut,
  MessageCircle,
  Play,
  Plus,
  Settings,
  ShoppingCart,
  User,
  Users,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const ReduxHeader = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const { isMobileMenuOpen, activeDropdown } = useAppSelector(
    (state) => state.ui
  );

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(
      addNotification({
        type: "success",
        title: "Logged Out",
        message: "You have been successfully logged out.",
      })
    );
  };

  const handleDropdownToggle = (dropdownName: string) => {
    dispatch(
      setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
    );
  };

  // Don't render authentication-dependent content while loading
  if (isLoading) {
    return (
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 select-none">
              <img
                src="/logo1.png"
                alt="Contractorlist Logo"
                className="h-96 w-auto"
              />
            </Link>

            {/* Loading skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => dispatch(toggleMobileMenu())}
                className="text-black hover:text-yellow-500 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center select-none flex-shrink-0 -ml-24"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <img
              src="/logo1.png"
              alt="Contractorlist Logo"
              className="h-96 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-base font-medium flex-1 justify-center">
            {/* Get Our Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-0 h-auto text-base font-medium text-black hover:text-yellow-500 transition-colors hover:bg-transparent focus:bg-transparent active:bg-transparent"
                >
                  <span>Get Our Services</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
                  Our Services
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/services/bid-management"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Bid Management</div>
                      <div className="text-xs text-gray-500">
                        Streamlined bidding processes
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/services/cost-estimating"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <Calculator className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Cost Estimating</div>
                      <div className="text-xs text-gray-500">
                        Accurate project cost analysis
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/services/tenders-management"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <ClipboardList className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Tenders Management</div>
                      <div className="text-xs text-gray-500">
                        Efficient tender processes
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/services/procurement-pre-contract"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">
                        Procurement & Pre-Contract Management
                      </div>
                      <div className="text-xs text-gray-500">
                        Strategic procurement solutions
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/services"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50 bg-gray-50"
                  >
                    <Plus className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-600">
                        View More
                      </div>
                      <div className="text-xs text-gray-500">
                        Explore all our services
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Our Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-0 h-auto text-base font-medium text-black hover:text-yellow-500 transition-colors hover:bg-transparent focus:bg-transparent active:bg-transparent"
                >
                  <span>Our Products</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
                  Our AI Products
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/products/ai-quantity-takeoff"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">AI Quantity Take Off</div>
                      <div className="text-xs text-gray-500">
                        Automated quantity takeoff with AI
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/products/ai-cost-estimation"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">AI Cost Estimation</div>
                      <div className="text-xs text-gray-500">
                        Intelligent cost estimation
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/products/ai-chatbot"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <MessageCircle className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">AI Chat Bot</div>
                      <div className="text-xs text-gray-500">
                        24/7 intelligent customer support
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/products/ai-virtual-assistant"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <Bot className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">AI Virtual Assistant</div>
                      <div className="text-xs text-gray-500">
                        Comprehensive AI project assistant
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/products"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50 bg-gray-50"
                  >
                    <Plus className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium text-yellow-600">
                        View All Products
                      </div>
                      <div className="text-xs text-gray-500">
                        Explore our complete AI suite
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-0 h-auto text-base font-medium text-black hover:text-yellow-500 transition-colors hover:bg-transparent focus:bg-transparent active:bg-transparent"
                >
                  <span>Company</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-700">
                  About Our Company
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/about-us"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <Users className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">About Us</div>
                      <div className="text-xs text-gray-500">
                        Our story, mission, and values
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/case-studies"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <BookOpen className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Case Studies</div>
                      <div className="text-xs text-gray-500">
                        Real project success stories and results
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/videos"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <Play className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Videos</div>
                      <div className="text-xs text-gray-500">
                        Project showcases and company insights
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/articles"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <FileTextIcon className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Articles</div>
                      <div className="text-xs text-gray-500">
                        Expert insights and industry trends
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/glossary"
                    className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                  >
                    <BookOpenIcon className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Glossary</div>
                      <div className="text-xs text-gray-500">
                        Complete construction terminology guide
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="/contractors"
              className="text-black hover:text-yellow-500 transition-colors font-medium"
            >
              Find Contractors
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <Link
              to="/join-network"
              className="px-6 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(255,221,51,0.08)" }}
            >
              Join Our Network
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* <span className="hidden sm:inline text-sm font-medium">
                      {user?.name}
                    </span> */}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-black hover:text-yellow-500 transition-colors"
              >
                <User className="w-4 h-4 mr-1" />
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="text-black hover:text-yellow-500 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/services"
                className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Get Our Services
              </Link>
              <Link
                to="/products"
                className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Our Products
              </Link>
              <Link
                to="/about-us"
                className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Company
              </Link>
              <Link
                to="/contractors"
                className="text-black hover:text-yellow-500 transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Find Contractors
              </Link>
              <Link
                to="/join-network"
                className="mx-4 px-6 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow transition-colors text-center"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Join Our Network
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ReduxHeader;
