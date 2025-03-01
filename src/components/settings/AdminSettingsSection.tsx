
import { Card } from "@/components/ui/card";
import { UserManagementSection } from "./UserManagementSection";
import { StylePromptsSection } from "./StylePromptsSection";
import { SpecificationsSection } from "./SpecificationsSection";

export function AdminSettingsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <UserManagementSection />
      </Card>
      <Card>
        <StylePromptsSection />
      </Card>
      <Card>
        <SpecificationsSection />
      </Card>
    </div>
  );
}
