'use client'

import SideNav from '@/app/ui/dashboard/sidenav';
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext';

// Create a wrapper component that can access the theme context
const DashboardContent = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  
  // Get the appropriate background color based on the theme
  const getBackgroundColor = () => {
    switch (theme) {
      case 'dreamy':
        return 'bg-[#1a1a2e]'; // Dark violet background for dreamy theme
      case 'daydream':
        return 'bg-white'; // White background for daydream theme
      case 'ocean':
        // return 'bg-[#0a1428]';     
        return 'bg-[#0c2040]'; 
      case 'space':
        return 'bg-black';
      case 'shell':
        // return 'bg-[#1a1814]';
        return 'bg-white'; // White background for daydream theme

      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()}`}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow md:overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </ThemeProvider>
  );
}

