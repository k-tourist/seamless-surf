import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TimezoneSelect } from "./TimezoneSelect";
import { ProfileFormProps } from "./types";

export const ProfileForm = ({ initialData, isUpdating, onSubmit }: ProfileFormProps) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <TimezoneSelect 
        value={formData.timezone}
        onChange={(value) => setFormData({ ...formData, timezone: value })}
      />

      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
};