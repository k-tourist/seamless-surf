
import { useEffect } from "react";
import { Settings } from "@/types";
import StyleSelect from "./settings/StyleSelect";
import ToneSelect from "./settings/ToneSelect";
import WordCountSelect from "./settings/WordCountSelect";
import WordsInput from "./settings/WordsInput";
import EmojiSelect from "./settings/EmojiSelect";

interface HeadlineSettingsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

const HeadlineSettings = ({
  settings,
  onSettingsChange,
}: HeadlineSettingsProps) => {
  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('headlineSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Only update specific fields we want to persist (excluding focus words and omissions)
      onSettingsChange({
        ...settings,
        style: parsedSettings.style || settings.style,
        tone: parsedSettings.tone || settings.tone,
        wordCount: parsedSettings.wordCount || settings.wordCount,
        useEmoji: parsedSettings.useEmoji || settings.useEmoji,
      });
    }
  }, []);

  // Set default values if not provided
  const defaultSettings: Settings = {
    model: settings.model || "gpt-4",
    style: settings.style || "email-subject",
    tone: settings.tone || "provocative",
    wordCount: settings.wordCount || "medium",
    focusWords: settings.focusWords || "",
    wordOmissions: settings.wordOmissions || "",
    randomness: settings.randomness || "medium",
    useEmoji: settings.useEmoji || "none",
  };

  const handleSettingChange = (key: keyof Settings, value: string) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };
    
    // Only save specific settings to localStorage (excluding focus words and omissions)
    if (key !== 'focusWords' && key !== 'wordOmissions') {
      const settingsToSave = {
        style: newSettings.style,
        tone: newSettings.tone,
        wordCount: newSettings.wordCount,
        useEmoji: newSettings.useEmoji,
      };
      localStorage.setItem('headlineSettings', JSON.stringify(settingsToSave));
    }
    
    onSettingsChange(newSettings);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <EmojiSelect
          value={defaultSettings.useEmoji}
          onChange={(value) => handleSettingChange("useEmoji", value)}
        />
        <StyleSelect
          value={defaultSettings.style}
          onChange={(value) => handleSettingChange("style", value)}
        />
        <ToneSelect
          value={defaultSettings.tone}
          onChange={(value) => handleSettingChange("tone", value)}
        />
      </div>
      <div className="space-y-6">
        <WordCountSelect
          value={defaultSettings.wordCount}
          onChange={(value) => handleSettingChange("wordCount", value)}
        />
        <WordsInput
          id="focus-words"
          label="Focus Words"
          placeholder="Enter words to focus on, separated by commas"
          value={defaultSettings.focusWords}
          onChange={(value) => handleSettingChange("focusWords", value)}
        />
        <WordsInput
          id="word-omissions"
          label="Word Omissions"
          placeholder="Enter words to omit, separated by commas"
          value={defaultSettings.wordOmissions}
          onChange={(value) => handleSettingChange("wordOmissions", value)}
        />
      </div>
    </div>
  );
};

export default HeadlineSettings;
