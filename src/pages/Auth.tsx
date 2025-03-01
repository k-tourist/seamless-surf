
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthForm } from "@/hooks/useAuthForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
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
  );
};

export default Auth;
