import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JoinNetwork = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new multi-step signup
    navigate("/signup", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to signup...</p>
      </div>
    </div>
  );
};

export default JoinNetwork;
