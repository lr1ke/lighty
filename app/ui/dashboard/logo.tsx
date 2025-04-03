'use client';

import { lusitana } from '@/app/ui/fonts';
import { useTheme } from '@/app/context/ThemeContext';

export default function Logo() {
  const { theme } = useTheme();
  
  // Determine text color based on theme
  const textColor = theme === 'shell' ? 'text-black' : 'text-white';
  
  return (
    <div className={`flex flex-row items-center leading-none ${textColor}`}>
      <p className={`${lusitana.className} text-[44px] font-bold`}>Lighty</p>
    </div>
  );
}

// import { GlobeAltIcon } from '@heroicons/react/24/outline';
// import { lusitana } from '@/app/ui/fonts';
// export default function Logo() {
//   return (

//         <div
//       className= "flex flex-row items-center leading-none text-white">

//       {/* <GlobeAltIcon className="h-12 w-12 rotate-[10deg]" /> */}
//       <p className="text-[44px]">Lighty</p>
//     </div>
//   );
// }