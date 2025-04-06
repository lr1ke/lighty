'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define your three themes
export type ThemeOption = 'ocean' | 'space' | 'shell' | 'dreamy' | 'daydream';

// Define theme colors for each theme
export const themeColorSets = {
  ocean: {
    'morning': 'bg-purple-800 text-purple-800', // Morning sea mist
    'evening': 'bg-indigo-900 text-indigo-200', // Evening ocean depths
    'weekly': 'bg-blue-400 text-blue-400', // Deep ocean current
    'kiez': 'bg-teal-900 text-teal-900', // Coastal waters
    'revelation': 'bg-purple-400 text-purple-400', // Bioluminescent zone
    'story': 'bg-emerald-900 text-emerald-200', // Deep sea kelp forest
  },
  space: {
    'morning': 'bg-[#E9B44C] text-black', // Cosmic morning
    'evening': 'bg-[#C84A20] text-white', // Cosmic evening
    'weekly': 'bg-[#E6D6AC] text-[#121A0F]', // Cosmic weekly
    'kiez': 'bg-[#C9A648] text-black', // Cosmic kiez
    'revelation': 'bg-[#8B3E2F] text-white', // Cosmic revelation
    'story': 'bg-[#D98E73] text-black', // Cosmic story
  },
  shell: {
    'morning': 'bg-[#E9B44C] text-black', // Shell morning (same as space)
    'evening': 'bg-[#C84A20] text-white', // Shell evening (same as space)
    'weekly': 'bg-[#E6D6AC] text-[#121A0F]', // Shell weekly (same as space)
    'kiez': 'bg-[#C9A648] text-black', // Shell kiez (same as space)
    'revelation': 'bg-[#8B3E2F] text-white', // Shell revelation (same as space)
    'story': 'bg-[#D98E73] text-black', // Shell story (same as space)
  },
  dreamy: {
    'morning': 'bg-[#5CE8D6] text-[#1A1A2E]', // Dreamy morning - teal
    'evening': 'bg-[#FF6B91] text-white', // Dreamy evening - coral pink
    'weekly': 'bg-[#A2EEFF] text-[#1A1A2E]', // Dreamy weekly - light blue
    'kiez': 'bg-[#7BE0D6] text-[#1A1A2E]', // Dreamy kiez - mint
    'revelation': 'bg-[#E87FBC] text-white', // Dreamy revelation - pink
    'story': 'bg-[#FFB6C1] text-[#1A1A2E]', // Dreamy story - light pink
  },
  daydream: {
    'morning': 'bg-[#FFB6C1] text-[#1A1A2E]', // Daydream morning - light pink
    'evening': 'bg-[#FF6B91] text-[#1A1A2E]', // Daydream evening - coral pink
    'weekly': 'bg-[#FFD700] text-[#1A1A2E]', // Daydream weekly - gold
    'kiez': 'bg-[#FFAA5E] text-[#1A1A2E]', // Daydream kiez - light orange
    'revelation': 'bg-[#E87FBC] text-[#1A1A2E]', // Daydream revelation - pink
    'story': 'bg-[#5CE8D6] text-[#1A1A2E]', // Daydream story - teal (reduced presence)
  }
};

// Define theme-specific Tailwind classes
export const themeStyles = {
  ocean: {
    // Background colors - updated to match exactly
    bgPrimary: 'bg-[#0a1428]',
    // bgSecondary: 'bg-[#0a1428]',
    bgSecondary: 'bg-[#0c2040]',
    bgTertiary: 'bg-[#0a3c5e]',
    bgHover: 'hover:bg-teal-900/20',
    
    // Text colors - updated to match exactly
    textPrimary: 'text-white',
    textSecondary: 'text-teal-400',
    textAccent: 'text-teal-400',
    
    // Border colors - updated to match exactly
    borderColor: 'border-teal-800/30',
    dividerColor: 'divide-teal-800/30',
    
    // Hover states - updated to match exactly
    hoverText: 'hover:text-teal-400',
    
    // Theme-specific elements
    icon: '🌊',
    loadingText: 'Scanning underwater data streams... Retrieving logs...',
    endText: 'You\'ve reached the shore of collective memories! 🌊'
  },
  space: {
    // Background colors
    bgPrimary: 'bg-black',
    bgSecondary: 'bg-black',
    bgTertiary: 'bg-black',
    bgHover: 'hover:bg-gray-900',
    
    // Text colors
    textPrimary: 'text-white',
    textSecondary: 'text-[#C9A648]',
    textAccent: 'text-[#8B3E2F]',
    
    // Border colors
    borderColor: 'border-[#C9A648]/30',
    dividerColor: 'divide-[#C9A648]/20',
    
    // Hover states
    hoverText: 'hover:text-[#D98E73]',
    
    // Theme-specific elements
    icon: '🌠',
    loadingText: 'Scanning interstellar data streams... Retrieving transmissions...',
    endText: 'You\'ve reached the edge of known communications! 🚀'
  },
  shell: {
    // Background colors - updated to match exactly with your design
    bgPrimary: 'bg-white',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-[#E6D6AC]',
    bgHover: 'hover:bg-[#E9B44C]/20',
    
    // Text colors - updated to match exactly with your design
    textPrimary: 'text-[#121A0F]',
    textSecondary: 'text-[#8B3E2F]',
    textAccent: 'text-[#8B3E2F]',
    
    // Border colors - updated to match exactly with your design
    borderColor: 'border-[#C84A20]',
    dividerColor: 'divide-[#C84A20]/30',
    
    // Hover states - updated to match exactly with your design
    hoverText: 'hover:text-[#C84A20]',
    
    // Theme-specific elements
    icon: '🐚',
    loadingText: 'Scanning interstellar data streams... Retrieving transmissions...',
    endText: 'You\'ve reached the edge of known communications! 🚀'
  },
  dreamy: {
    // Background colors based on the image
    bgPrimary: 'bg-[#1A1A2E]', // Dark blue/black background
    bgSecondary: 'bg-[#232338]', // Slightly lighter dark blue
    bgTertiary: 'bg-[#2C2C45]', // Even lighter dark blue
    bgHover: 'hover:bg-[#5CE8D6]/20', // Teal with transparency for hover
    bgActive: 'bg-[#5CE8D6]/20', // Teal with transparency for active state
    bgHoverStatic: 'bg-[rgba(92,232,214,0.2)]', // Same teal with transparency as static bg
    
    // Text colors
    textPrimary: 'text-[#E8E8FF]', // Light blue-white text
    textSecondary: 'text-[#A2EEFF]', // Light teal text
    textAccent: 'text-[#FF6B91]', // Coral pink accent
    
    // Border colors
    borderColor: 'border-[#5CE8D6]/30', // Teal border with transparency
    dividerColor: 'divide-[#5CE8D6]/30', // Teal divider with transparency
    
    // Hover states
    hoverText: 'hover:text-[#FF6B91]', // Hover text becomes coral pink
    
    // Theme-specific elements
    icon: '🌌',
    loadingText: 'Drifting through dreams... Collecting ethereal thoughts...',
    endText: 'You\'ve reached the edge of the dreamscape! ✨'
  },
  daydream: {
    // Background colors - bright version with more pink/coral and yellow tones
    bgPrimary: 'bg-[#F8FDFF]', // Very light blue-white background
    bgSecondary: 'bg-[#FFF5F7]', // Very light pink tint
    bgTertiary: 'bg-[#FFF9E6]', // Light yellow tint
    bgHover: 'hover:bg-[#FF6B91]/20', // Coral pink with transparency for hover
    bgActive: 'bg-[#FF6B91]/20', // Coral pink with transparency for active state
    bgHoverStatic: 'bg-[rgba(255,107,145,0.2)]', // Coral pink with transparency as static bg
    
    // Text colors
    textPrimary: 'text-[#1A1A2E]', // Dark blue text
    textSecondary: 'text-[#E87FBC]', // Pink text for secondary elements
    textAccent: 'text-[#FF6B91]', // Coral pink accent
    
    // Border colors
    borderColor: 'border-[#FF6B91]/30', // Coral pink border with transparency
    dividerColor: 'divide-[#FF6B91]/30', // Coral pink divider with transparency
    
    // Hover states
    hoverText: 'hover:text-[#FF6B91]', // Hover text becomes coral pink
    
    // Theme-specific elements
    icon: '☁️',
    loadingText: 'Floating through daydreams... Gathering bright thoughts...',
    endText: 'You\'ve reached the edge of the daydream! 🌈'
  }
};

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  themeColors: Record<string, string>;
  styles: typeof themeStyles.ocean;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with a default theme, but check localStorage first
  const [theme, setThemeState] = useState<ThemeOption>('ocean');
  
  useEffect(() => {
    // Load theme preference from localStorage on initial render
    const savedTheme = localStorage.getItem('theme') as ThemeOption;
    if (savedTheme && ['ocean', 'space', 'shell', 'dreamy', 'daydream'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);
  
  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Get the current theme colors based on the selected theme
  const themeColors = themeColorSets[theme];
  
  // Get the current theme styles
  const styles = themeStyles[theme];
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColors, styles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};