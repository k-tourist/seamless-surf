
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AuthFormProps {
  isSignUp: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
  onGoogleSignIn: () => void;
}

export const AuthForm = ({
  isSignUp,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleMode,
  onGoogleSignIn,
}: AuthFormProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Sign up to get started"
            : "Sign in to access your account"}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onGoogleSignIn}
        disabled={loading}
      >
        <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              minLength={5}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              minLength={6}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={onToggleMode}
          className="text-sm"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
};
