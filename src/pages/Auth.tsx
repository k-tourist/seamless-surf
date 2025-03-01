
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  
  const toggleMode = () => setIsSignUp(!isSignUp);
  
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
    handleGoogleSignIn,
  } = useAuthForm(isSignUp, toggleMode);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto pt-4">
        <Button 
          variant="ghost" 
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 border-0 shadow-xl dark:shadow-none dark:bg-gray-800 animate-fade-in">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/dfb369e1-9663-40cb-aff5-a1cbc09fdb7e.png" 
              alt="Logo" 
              className="h-12 w-auto mx-auto mb-2"
            />
          </div>
          <AuthForm
            isSignUp={isSignUp}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onSubmit={handleSubmit}
            onToggleMode={toggleMode}
            onGoogleSignIn={handleGoogleSignIn}
          />
        </Card>
      </div>
    </div>
  );
};

export default Auth;
