
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { UserManagementSection } from "@/components/settings/UserManagementSection";
import { UserProfileSection } from "@/components/settings/UserProfileSection";
import { StylePromptsSection } from "@/components/settings/StylePromptsSection";
import { ConnectionsSection } from "@/components/settings/ConnectionsSection";
import { GradingRubricSection } from "@/components/settings/GradingRubricSection";
import { SpecificationsSection } from "@/components/settings/SpecificationsSection";
import BackToDashboard from "@/components/settings/BackToDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import MasterPromptsSection from "@/components/settings/master-prompts/MasterPromptsSection";
import SettingsIndex from "./SettingsIndex";

const Settings = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <SettingsSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <SidebarTrigger>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SidebarTrigger>
              <BackToDashboard />
            </div>
            <Routes>
              <Route path="/" element={<SettingsIndex />} />
              <Route 
                path="specifications" 
                element={
                  <ProtectedRoute requireAdmin>
                    <SpecificationsSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="users" 
                element={
                  <ProtectedRoute requireAdmin>
                    <UserManagementSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="master-prompts" 
                element={
                  <ProtectedRoute requireAdmin>
                    <MasterPromptsSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="grading-rubric" 
                element={
                  <ProtectedRoute requireAdmin>
                    <GradingRubricSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <UserProfileSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="connections" 
                element={
                  <ProtectedRoute requireAdmin>
                    <ConnectionsSection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="prompts" 
                element={
                  <ProtectedRoute>
                    <StylePromptsSection />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/settings" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
