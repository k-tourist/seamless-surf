
import { supabase } from "@/integrations/supabase/client";
import type { UserData } from "./types";

export const fetchAllUsers = async (): Promise<UserData[]> => {
  const { data, error } = await supabase.functions.invoke('list-users');
  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
  return data.users;
};

export const updateUserAccess = async (userId: string, isEnabled: boolean) => {
  console.log("Updating user access:", { userId, isEnabled });
  const { error } = await supabase
    .from("profiles")
    .update({ is_enabled: isEnabled })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user access:", error);
    throw error;
  }
};

export const updateAdminRole = async (userId: string, isAdmin: boolean) => {
  console.log('Updating admin role:', { userId, isAdmin, action: isAdmin ? 'add' : 'remove' });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  try {
    // Add debug logging
    console.log('Calling manage-user-role function with:', {
      userId,
      action: isAdmin ? 'add' : 'remove',
      role: 'admin'
    });

    // Call the edge function
    const { data, error } = await supabase.functions.invoke('manage-user-role', {
      body: {
        userId,
        action: isAdmin ? 'add' : 'remove',
        role: 'admin'
      }
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error("Error from edge function:", error);
      throw error;
    }

    if (!data) {
      throw new Error('No response from edge function');
    }

    return data;
  } catch (error) {
    console.error("Error updating admin role:", error);
    throw error;
  }
};
