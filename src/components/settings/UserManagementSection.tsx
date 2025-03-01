
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { UserTable } from "./user-management/UserTable";
import { fetchAllUsers } from "./user-management/userManagementService";
import type { UserData } from "./user-management/types";

export const UserManagementSection = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await fetchAllUsers();
      setUsers(userData);
    } catch (error: any) {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>
      <UserTable 
        users={users} 
        setUsers={(updatedUsers) => {
          setUsers(updatedUsers);
          // Reload users after a short delay to ensure backend sync
          setTimeout(loadUsers, 1000);
        }} 
      />
    </div>
  );
};
