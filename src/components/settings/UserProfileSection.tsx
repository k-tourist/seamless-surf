
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "./ProfileForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileFormData } from "./types";

export const UserProfileSection = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    timezone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, timezone")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfileData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          timezone: data.timezone || "",
        });
      }
    };

    fetchProfile();
  }, [session?.user?.id, toast]);

  const handleUpdateProfile = async (formData: ProfileFormData) => {
    if (!session?.user?.id) return;

    setIsUpdating(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        timezone: formData.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      // Update local state to reflect changes
      setProfileData(formData);
    }

    setIsUpdating(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={session?.user?.email || ""}
          disabled
          className="bg-gray-100"
        />
        <p className="text-sm text-muted-foreground">
          Email address cannot be changed
        </p>
      </div>

      <ProfileForm
        initialData={profileData}
        isUpdating={isUpdating}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
};
