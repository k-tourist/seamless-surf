import { HeadlineSettingsProps } from "@/types/settings";

const SettingsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};

export default SettingsContainer;