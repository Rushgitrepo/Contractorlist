import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import authService from "@/services/authService";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIChatbot from "@/components/AIChatbot";
import NotificationSystem from "@/components/NotificationSystem";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupMultiStep from "./pages/SignupMultiStep";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailNotice from "./pages/VerifyEmailNotice";
import JoinNetwork from "./pages/JoinNetwork";
import AboutUs from "./pages/AboutUs";
import CaseStudies from "./pages/CaseStudies";
import Testimonials from "./pages/Testimonials";
import Videos from "./pages/Videos";
import Articles from "./pages/Articles";
import Glossary from "./pages/Glossary";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Products from "./pages/Products";
import AIQuantityTakeOff from "./pages/AIQuantityTakeOff";
import AICostEstimation from "./pages/AICostEstimation";
import AIChatBot from "./pages/AIChatBot";
import AIVirtualAssistant from "./pages/AIVirtualAssistant";
import ServeOwnersDevelopers from "./pages/ServeOwnersDevelopers";
import ServeGeneralContractors from "./pages/ServeGeneralContractors";
import ServeSpecialtyContractors from "./pages/ServeSpecialtyContractors";
import ServePMCompanies from "./pages/ServePMCompanies";
import ServeCommercialCompanies from "./pages/ServeCommercialCompanies";
import Contractors from "./pages/Contractors";
import ContractorDetails from "./pages/ContractorDetails";
import CompanyDetails from "./pages/CompanyDetails";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Subscription from "./pages/Subscription";
import ServiceDetail from "./pages/ServiceDetail";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContractorUpdate from "./pages/ContractorUpdate";

const queryClient = new QueryClient();

// Component to initialize user data on app load
const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      // MOCK AUTH INITIALIZATION - BYPASS BACKEND
      // const accessToken = localStorage.getItem('accessToken');

      // // If we have a token but no user data in Redux, fetch user profile
      // if (accessToken) {
      //   try {
      //     const response = await authService.getProfile();
      //     if (response.data) {
      //       dispatch(setUser({
      //         id: response.data.id.toString(),
      //         name: response.data.name,
      //         email: response.data.email,
      //         role: response.data.role,
      //       }));
      //     }
      //   } catch (error) {
      //     // If token is invalid, clear it
      //     console.error('Failed to fetch user profile:', error);
      //     localStorage.removeItem('accessToken');
      //     localStorage.removeItem('refreshToken');
      //   }
      // }
    };

    initializeAuth();
  }, [dispatch]);

  return null;
};

// AppRoutes component that has access to router and store
const AppRoutes = () => {
  return (
    <>
      <AppInitializer />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupMultiStep />} />
        <Route path="/signup-old" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
        <Route path="/join-network" element={<JoinNetwork />} />

        {/* Company Pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceName" element={<ServiceDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/ai-quantity-takeoff" element={<AIQuantityTakeOff />} />
        <Route path="/products/ai-cost-estimation" element={<AICostEstimation />} />
        <Route path="/products/ai-chatbot" element={<AIChatBot />} />
        <Route path="/products/ai-virtual-assistant" element={<AIVirtualAssistant />} />
        <Route path="/serve/owners-developers" element={<ServeOwnersDevelopers />} />
        <Route path="/serve/general-contractors" element={<ServeGeneralContractors />} />
        <Route path="/serve/specialty-contractors" element={<ServeSpecialtyContractors />} />
        <Route path="/serve/pm-companies" element={<ServePMCompanies />} />
        <Route path="/serve/commercial-companies" element={<ServeCommercialCompanies />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/contractors/:id" element={<ContractorDetails />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
            <Route path="/contractor/update/:token" element={<ContractorUpdate />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* AI Chatbot - Available on all pages */}
      <AIChatbot />
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <NotificationSystem />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
