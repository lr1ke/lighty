'use client'

import React from 'react';
import { useTheme, ThemeOption } from './ThemeContext';
import { Palette, Moon, Waves, Sparkles, Cloud } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  // Define theme-specific styles
  const switcherStyles = {
    ocean: {
      container: "flex items-center justify-center space-x-1",
      activeButton: "p-2 rounded-full bg-[#2C5D7C] text-white",
      inactiveButton: "p-2 rounded-full text-[#2C5D7C] hover:bg-[#B8D9EF]"
    },
    space: {
      container: "flex items-center justify-center space-x-1",
      activeButton: "p-2 rounded-full bg-[#E9B44C] text-[#121A0F]",
      inactiveButton: "p-2 rounded-full text-[#E6D6AC] hover:bg-[#232B1C]"
    },
    shell: {
      container: "flex items-center justify-center space-x-1",
      activeButton: "p-2 rounded-full bg-[#3D5A66] text-white",
      inactiveButton: "p-2 rounded-full text-[#3D5A66] hover:bg-[#A7C7D1]"
    },
    dreamy: {
      container: "flex items-center justify-center space-x-1",
      activeButton: "p-2 rounded-full bg-[#5CE8D6] text-[#1A1A2E]",
      inactiveButton: "p-2 rounded-full text-[#A2EEFF] hover:bg-[#232338]"
    },
    daydream: {
      container: "flex items-center justify-center space-x-1",
      activeButton: "p-2 rounded-full bg-[#5CE8D6] text-[#1A1A2E]",
      inactiveButton: "p-2 rounded-full text-[#3D7A99] hover:bg-[#E6F8FC]"
    }
  };
  
  // Get current theme styles
  const currentStyle = switcherStyles[theme];
  
  const themes: { value: ThemeOption; icon: React.ReactNode; label: string }[] = [
    { value: 'ocean', icon: <Waves className="w-4 h-4" />, label: 'Ocean' },
    { value: 'space', icon: <Moon className="w-4 h-4" />, label: 'Space' },
    { value: 'shell', icon: <Palette className="w-4 h-4" />, label: 'Shell' },
    { value: 'dreamy', icon: <Sparkles className="w-4 h-4" />, label: 'Dreamy' },
    { value: 'daydream', icon: <Cloud className="w-4 h-4" />, label: 'Daydream' }

  ];
  
  return (
    <div className={currentStyle.container}>
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={theme === themeOption.value ? currentStyle.activeButton : currentStyle.inactiveButton}
          title={`Switch to ${themeOption.label} theme`}
        >
          {themeOption.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;