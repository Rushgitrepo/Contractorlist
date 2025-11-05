import { useAppSelector } from "@/store/hooks";
import { Navigate } from "react-router-dom";
import ContractorDashboard from "./ContractorDashboard";
import ClientDashboard from "./ClientDashboard";

const Dashboard = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route based on user role
  if (user?.role === 'contractor') {
    return <ContractorDashboard />;
  } else {
    return <ClientDashboard />;
  }
};

export default Dashboard;