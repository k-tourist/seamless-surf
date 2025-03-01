
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { session, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!session) {
        navigate("/auth", { state: { from: location.pathname } });
      } else if (requireAdmin && !isAdmin) {
        navigate("/");
      }
      setLocalLoading(false);
    }
  }, [session, isAdmin, navigate, requireAdmin, isLoading, location.pathname]);

  if (isLoading || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
