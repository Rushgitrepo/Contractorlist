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
  CreditCard,
  Home,
  Search,
  HelpCircle,
  Star,
  CheckCircle,
  Shield,
  ClipboardCheck,
  Wrench,
  PenTool,
  Globe,
  HeadphonesIcon,
  Target,
  Building2,
  Package,
  Truck,
  Network,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SignupRoleModal from "./SignupRoleModal";

const ReduxHeader = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const { isMobileMenuOpen, activeDropdown } = useAppSelector(
    (state) => state.ui
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(
        addNotification({
          type: "success",
          title: "Logged Out",
          message: "You have been successfully logged out.",
        })
      );
      // Navigate to login page
      window.location.href = '/login';
    } catch (error) {
      // Even if logout fails, redirect to login
      window.location.href = '/login';
    }
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
                className="text-black hover:text-[#fce011] transition-colors"
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
            className="flex items-center justify-center select-none flex-shrink-0 ml-22"
            onClick={() => dispatch(closeMobileMenu())}
          >
            <img
              src="/logo1.png"
              alt="Contractorlist Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-base font-medium flex-1 justify-center">
            <Link
              to="/contractors"
              className="text-black hover:text-[#fce011] transition-colors font-medium px-2"
            >
              Find Contractors
            </Link>
            <Link
              to="/projects"
              className="text-black hover:text-[#fce011] transition-colors font-medium px-2"
            >
              Find Projects
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex h-10 w-max items-center justify-center focus:outline-none disabled:pointer-events-none disabled:opacity-50 px-2 text-base font-medium text-black hover:text-[#fce011] hover:bg-gray-50 rounded-lg transition-colors bg-transparent data-[state=open]:bg-gray-50">
                  For Contractors
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[600px] p-0 shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-white">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    {/* PRODUCTS Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Wrench className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Products</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/products" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Target className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">AI Powered Project Finder</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Discover and win more projects with AI</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/products/ai-quantity-takeoff" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/20 transition-colors">
                              <Calculator className="w-5 h-5 text-[#fce011]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">AI Digital Takeoff & Estimating</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Accurate estimates in minutes, not hours</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/products/ai-chatbot" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Bot className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">AI Assistant for Contractors</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Your 24/7 intelligent business assistant</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* SERVICES Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <ClipboardList className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Services</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Hire a Dedicated Estimator</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Expert estimators on demand</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <PenTool className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Hire a Dedicated Architect</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Professional architectural services</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <Globe className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Web Design, SEO & Local Marketing</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Grow your online presence</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/contact-us" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <HeadphonesIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">24/7 Technical Support</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Round-the-clock assistance</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gradient-to-r from-[#fce011]/10 to-[#fce011]/5 border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-gray-900 mb-1">Ready to grow your business?</p>
                        <p className="text-sm text-gray-600">Start your free trial today</p>
                      </div>
                      <Link to="/signup">
                        <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex h-10 w-max items-center justify-center focus:outline-none disabled:pointer-events-none disabled:opacity-50 px-2 text-base font-medium text-black hover:text-[#fce011] hover:bg-gray-50 rounded-lg transition-colors bg-transparent data-[state=open]:bg-gray-50">
                  For Homeowners
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[600px] p-0 shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-white">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    {/* FIND & COMPARE Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Search className="w-5 h-5 text-[#fce011]" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Find & Compare</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/contractors" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Search className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Find Local Contractors</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Connect with verified pros in your area</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/contractors" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <ClipboardCheck className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Get Instant Quotes</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Compare prices from multiple contractors</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/contractors" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Star className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Verified Reviews</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Read authentic customer feedback</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* SUPPORT SERVICES Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Home className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Support Services</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/contact-us" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <MessageCircle className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Project Consultation</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Free expert advice for your project</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/contractors" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <Shield className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Contractor Verification</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Background checks & license verification</p>
                            </div>
                          </div>
                        </Link>
                        {isAuthenticated ? (
                          <Link to="/homeowner-dashboard" className="block group">
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                                <ClipboardList className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Project Management</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">Track your project from start to finish</p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <Link to="/signup" className="block group">
                            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                                <ClipboardList className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Project Management</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">Track your project from start to finish</p>
                              </div>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">Ready to start your project? Find trusted contractors today</p>
                      <Link to="/contractors">
                        <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
                          Find Contractors
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex h-10 w-max items-center justify-center focus:outline-none disabled:pointer-events-none disabled:opacity-50 px-2 text-base font-medium text-black hover:text-[#fce011] hover:bg-gray-50 rounded-lg transition-colors bg-transparent data-[state=open]:bg-gray-50">
                  For Supplier
                  <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[600px] p-0 shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-white">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 divide-x divide-gray-200">
                    {/* PRODUCTS Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Package className="w-5 h-5 text-[#fce011]" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Products</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/products" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Target className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Project Opportunities</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Discover construction projects needing supplies</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/products" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <Network className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Supplier Network</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Connect with contractors and builders</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/products" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#fce011]/10 transition-colors">
                            <div className="w-10 h-10 bg-[#fce011]/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#fce011]/30 transition-colors">
                              <TrendingUp className="w-5 h-5 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-[#fce011] transition-colors">Business Growth Tools</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Tools to expand your supply business</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>

                    {/* SERVICES Section */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-6">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Services</h3>
                      </div>
                      <div className="space-y-4">
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <ShoppingCart className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Bid Management</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Manage quotes and bids efficiently</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Inventory Management</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Track and manage your inventory</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/services" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <Globe className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">Digital Marketing</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Promote your supply business online</p>
                            </div>
                          </div>
                        </Link>
                        <Link to="/contact-us" className="block group">
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                              <HeadphonesIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">24/7 Support</h4>
                              <p className="text-xs text-gray-600 leading-relaxed">Round-the-clock assistance</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="bg-gradient-to-r from-[#fce011]/10 to-[#fce011]/5 border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-gray-900 mb-1">Ready to grow your supply business?</p>
                        <p className="text-sm text-gray-600">Join our supplier network today</p>
                      </div>
                      <Link to="/signup">
                        <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-6 py-2 rounded-lg shadow-md transition-colors">
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-50 rounded-xl transition-all duration-300 group">
                    <div className="relative h-10 w-10 rounded-full bg-[#fce011] p-[2px] shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-[#fce011] flex items-center justify-center">
                          <User className="h-4 w-4 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 shadow-xl border border-gray-200 rounded-xl">
                  <DropdownMenuLabel className="bg-white rounded-t-xl">
                    <div className="flex items-center gap-4 p-3">
                      <div className="relative">
                        <div className="h-14 w-14 rounded-full bg-[#fce011] p-[3px] shadow-lg">
                          <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                            <div className="h-11 w-11 rounded-full bg-[#fce011] flex items-center justify-center shadow-inner">
                              <User className="h-6 w-6 text-white" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-[3px] border-white shadow-md flex items-center justify-center">
                          <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 leading-tight truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 truncate">
                          {user?.email}
                        </p>
                        <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-semibold rounded-full w-fit shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Active Now
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <DropdownMenuItem asChild>
                      <Link to="/subscription" className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors group">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">Subscription</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-1">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="font-medium text-red-600 group-hover:text-red-700">Log out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                style={{ boxShadow: "0 4px 15px hsl(var(--primary) / 0.3)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <User className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Sign in</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="text-black hover:text-[#fce011] transition-colors"
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
                to="/contractors"
                className="text-black hover:text-[#fce011] transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Find Contractors
              </Link>
              <Link
                to="/projects"
                className="text-black hover:text-[#fce011] transition-colors px-4 py-2"
                onClick={() => dispatch(closeMobileMenu())}
              >
                Find Projects
              </Link>
              <div className="px-4">
                <button
                  onClick={() => handleDropdownToggle("contractors")}
                  className="w-full flex items-center justify-between text-black hover:text-[#fce011] transition-colors py-2"
                >
                  <span className="font-medium">For Contractors</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeDropdown === "contractors" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {activeDropdown === "contractors" && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                    <Link
                      to="/products"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      AI Powered Project Finder
                    </Link>
                    <Link
                      to="/products/ai-quantity-takeoff"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      AI Digital Takeoff & Estimating
                    </Link>
                    <Link
                      to="/products/ai-chatbot"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      AI Assistant for Contractors
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Hire a Dedicated Estimator
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Hire a Dedicated Architect
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Web Design, SEO & Local Marketing
                    </Link>
                    <Link
                      to="/contact-us"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      24/7 Technical Support
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-4">
                <button
                  onClick={() => handleDropdownToggle("homeowners")}
                  className="w-full flex items-center justify-between text-black hover:text-[#fce011] transition-colors py-2"
                >
                  <span className="font-medium">For Homeowners</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeDropdown === "homeowners" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {activeDropdown === "homeowners" && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                    <Link
                      to="/contractors"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Find Contractors
                    </Link>
                    <Link
                      to="/join-network"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Post a Project
                    </Link>
                    {isAuthenticated && (
                      <Link
                        to="/homeowner-dashboard"
                        className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                        onClick={() => dispatch(closeMobileMenu())}
                      >
                        My Dashboard
                      </Link>
                    )}
                    <Link
                      to="/signup"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Join as Homeowner
                    </Link>
                    <Link
                      to="/contact-us"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Help & Support
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-4">
                <button
                  onClick={() => handleDropdownToggle("supplier")}
                  className="w-full flex items-center justify-between text-black hover:text-[#fce011] transition-colors py-2"
                >
                  <span className="font-medium">For Supplier</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${activeDropdown === "supplier" ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {activeDropdown === "supplier" && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                    <Link
                      to="/products"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Project Opportunities
                    </Link>
                    <Link
                      to="/products"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Supplier Network
                    </Link>
                    <Link
                      to="/products"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Business Growth Tools
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Bid Management
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Inventory Management
                    </Link>
                    <Link
                      to="/services"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Digital Marketing
                    </Link>
                    <Link
                      to="/contact-us"
                      className="block text-gray-700 hover:text-[#fce011] transition-colors py-2"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      24/7 Support
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ReduxHeader;
