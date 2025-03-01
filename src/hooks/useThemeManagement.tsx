
import { useTheme } from "next-themes";

export const useThemeManagement = () => {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return {
    isDarkMode,
    toggleTheme
  };
};
