
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 text-center">
      <div className="animate-fade-in space-y-6 max-w-lg">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Page Not Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-6">
          <Button 
            size="lg" 
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-5 w-5" />
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
