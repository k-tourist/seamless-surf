
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export const ResetPasswordDialog = ({
  isOpen,
  onClose,
  userId,
  userEmail,
}: ResetPasswordDialogProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting to reset password for user:', userId);
      
      // Call the Supabase Edge Function to reset the password
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: {
          userId,
          newPassword
        }
      });

      if (error) throw error;

      console.log('Password reset response:', data);

      toast({
        title: "Password updated",
        description: `Password successfully reset for ${userEmail}`,
      });
      
      setNewPassword("");
      onClose();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error resetting password",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new password for {userEmail}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
