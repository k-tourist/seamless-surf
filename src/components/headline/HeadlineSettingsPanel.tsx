import { Settings } from "@/types";
import HeadlineSettings from "../HeadlineSettings";
import { Card } from "../ui/card";

interface HeadlineSettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const HeadlineSettingsPanel = ({
  settings,
  onSettingsChange,
}: HeadlineSettingsPanelProps) => {
  // Ensure all required properties are present
  const completeSettings = {
    ...settings,
    focusWords: settings.focusWords || "",
    wordOmissions: settings.wordOmissions || "",
    randomness: settings.randomness || "medium",
  };

  return (
    <Card className="p-6">
      <div className="space-y-8">
        <h2 className="text-lg font-semibold">Source Settings</h2>
        <HeadlineSettings
          settings={completeSettings}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </Card>
  );
};

export default HeadlineSettingsPanel;