
import { useState } from "react";
import { Shield, User, Loader2, Key } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { UserRowProps } from "./types";
import { updateUserAccess, updateAdminRole } from "./userManagementService";
import { ResetPasswordDialog } from "./ResetPasswordDialog";

export const UserTableRow = ({ user, onUserUpdate }: UserRowProps) => {
  const [updating, setUpdating] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const { toast } = useToast();

  const handleAccessToggle = async (checked: boolean) => {
    try {
      setUpdating(true);
      await updateUserAccess(user.id, checked);
      onUserUpdate({ ...user, is_enabled: checked });
      toast({
        title: "Success",
        description: `User access ${checked ? "enabled" : "disabled"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating user access",
        description: error.message,
        variant: "destructive",
      });
      // Reset to original state on error
      onUserUpdate({ ...user });
    } finally {
      setUpdating(false);
    }
  };

  const handleAdminToggle = async (checked: boolean) => {
    const originalState = user.is_admin;
    try {
      setUpdating(true);
      console.log('Updating admin status:', { userId: user.id, isAdmin: checked });
      
      // Optimistically update UI
      onUserUpdate({ ...user, is_admin: checked });
      
      // Perform the backend operation
      await updateAdminRole(user.id, checked);
      
      toast({
        title: "Success",
        description: `Admin rights ${checked ? "granted" : "revoked"}`,
      });
    } catch (error: any) {
      console.error('Error updating admin role:', error);
      
      // Reset to original state on error
      onUserUpdate({ ...user, is_admin: originalState });
      
      toast({
        title: "Error updating admin rights",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="flex items-center gap-2">
        <User className="h-4 w-4" />
        {user.email}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {updating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Switch
              checked={user.is_enabled}
              onCheckedChange={handleAccessToggle}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          {updating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Switch
              checked={user.is_admin}
              onCheckedChange={handleAdminToggle}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsResetPasswordOpen(true)}
          className="flex items-center gap-2"
        >
          <Key className="h-4 w-4" />
          Reset Password
        </Button>
        <ResetPasswordDialog
          isOpen={isResetPasswordOpen}
          onClose={() => setIsResetPasswordOpen(false)}
          userId={user.id}
          userEmail={user.email}
        />
      </TableCell>
    </TableRow>
  );
};
