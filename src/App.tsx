import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIChatbot from "@/components/AIChatbot";
import NotificationSystem from "@/components/NotificationSystem";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
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
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NotificationSystem />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/join-network" element={<JoinNetwork />} />

            {/* Company Pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/services" element={<Services />} />
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
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* AI Chatbot - Available on all pages */}
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
