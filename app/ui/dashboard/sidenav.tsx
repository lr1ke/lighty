'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import Logo from '@/app/ui/dashboard/logo';
import React from 'react';
import StarryBackground from '@/app/ui/dashboard/starryBackground';
import UnderwaterBackground from '@/app/ui/dashboard/underwater';
import ShellBackground from '@/app/ui/dashboard/shellBackground';
import DreamyBackground from '@/app/ui/dashboard/dreamyBackground';
import DaydreamBackground from '@/app/ui/dashboard/daydreamBackground';
import { useTheme } from '@/app/context/ThemeContext';

const SideNav: React.FC = () => {
  const { theme, styles } = useTheme();
  
  // Choose background component based on theme
  // Choose background component based on theme
  const BackgroundComponent = theme === 'space' ? StarryBackground : 
                             theme === 'ocean' ? UnderwaterBackground : 
                             theme === 'dreamy' ? DreamyBackground :
                             theme === 'daydream' ? DaydreamBackground :
                             ShellBackground;


  return (
    <div className={`flex h-full flex-col px-3 py-4 md:px-1 ${styles.bgPrimary}`}>         
      <Link
        className={`mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40 relative overflow-hidden ${styles.bgActive}`}
        href="/"
      >          
        <BackgroundComponent />
        <div className="w-32 md:w-40 relative z-10">
          <Logo />
        </div>
      </Link>         

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow md:block"></div>
        <form>
          <button 
            className={`flex h-[40px] w-full items-center justify-center gap-2 rounded-md p-2 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-1 md:px-2 ${styles.bgActive} ${styles.textPrimary}`}
          >
            <PowerIcon className={`w-6 ${styles.textPrimary}`} />
            <div className={`hidden md:block ${styles.textPrimary}`}>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SideNav;

// 'use client';

// import Link from 'next/link';
// // import { usePrivy } from '@privy-io/react-auth';
// import NavLinks from '@/app/ui/dashboard/nav-links';
// import { PowerIcon } from '@heroicons/react/24/outline';
// import Logo from '@/app/ui/dashboard/logo';
// import React from 'react';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';

// const SideNav: React.FC = () => {
//   const { logout } = usePrivy();

//   const handleSignOut = () => {
//     logout();
//   };

//   return (
//     <div className="flex h-full flex-col px-3 py-4 md:px-1">         
//       <Link
//         className="mb-2 flex h-20 items-end justify-start rounded-md bg-gray-900 p-4 md:h-40"
//         href="/"
//       >
//         <StarryBackground />
//         <div className="w-32 text-white md:w-40">
//           <Logo />
//         </div>
//       </Link>         

//              <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
//       <NavLinks />
//         <button 
//           onClick={handleSignOut}
//           className="flex h-[40px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-1 md:px-2 mt-auto"
//         >
//           <PowerIcon className="w-6" />
//           <div className="hidden md:block">Sign Out</div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SideNav;