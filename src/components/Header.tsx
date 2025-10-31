import { Link } from "react-router-dom";
import {
  User,
  LogOut,
  Settings,
  ChevronDown,
  Building2,
  Hammer,
  Wrench,
  ClipboardList,
  Factory,
  Calculator,
  FileText,
  ShoppingCart,
  Plus,
  Users,
  BookOpen,
  Star,
  Play,
  FileText as FileTextIcon,
  BookOpen as BookOpenIcon,
  DollarSign,
  MessageCircle,
  Bot,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
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

            {/* Loading state */}
            <div className="hidden md:flex items-center space-x-8 text-base font-medium">
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
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                    <FileText className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Bid Management</div>
                      <div className="text-xs text-gray-500">
                        Streamlined bidding processes
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                    <Calculator className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Cost Estimating</div>
                      <div className="text-xs text-gray-500">
                        Accurate project cost analysis
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                    <ClipboardList className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Tenders Management</div>
                      <div className="text-xs text-gray-500">
                        Efficient tender processes
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                    <ShoppingCart className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">
                        Procurement & Pre-Contract Management
                      </div>
                      <div className="text-xs text-gray-500">
                        Strategic procurement solutions
                      </div>
                    </div>
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
                          Learn about our company
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
                          Success stories and projects
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/testimonials"
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50"
                    >
                      <Star className="h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium">Testimonials</div>
                        <div className="text-xs text-gray-500">
                          Client feedback and reviews
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
                          Company and project videos
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
                          Industry insights and news
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
                          Construction terms and definitions
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                to="/join-network"
                className="ml-2 px-6 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow transition-colors"
                style={{ boxShadow: "0 2px 8px rgba(255,221,51,0.08)" }}
              >
                Join Our Network
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-black hover:text-yellow-500 transition-colors">
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
          <Link to="/" className="flex items-center space-x-3 select-none">
            <img
              src="/logo1.png"
              alt="Contractorlist Logo"
              className="h-96 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
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
                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Bid Management</div>
                    <div className="text-xs text-gray-500">
                      Streamlined bidding processes
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                  <Calculator className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Cost Estimating</div>
                    <div className="text-xs text-gray-500">
                      Accurate project cost analysis
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                  <ClipboardList className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">Tenders Management</div>
                    <div className="text-xs text-gray-500">
                      Efficient tender processes
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-yellow-50">
                  <ShoppingCart className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium">
                      Procurement & Pre-Contract Management
                    </div>
                    <div className="text-xs text-gray-500">
                      Strategic procurement solutions
                    </div>
                  </div>
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
              to="/join-network"
              className="ml-2 px-6 py-2 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow transition-colors"
              style={{ boxShadow: "0 2px 8px rgba(255,221,51,0.08)" }}
            >
              Join Our Network
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user?.name}
                    </span>
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
                    <Link to="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
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
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center text-black hover:text-yellow-500 transition-colors"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign in
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-black hover:text-yellow-500 transition-colors">
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
};

export default Header;
