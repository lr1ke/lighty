'use client';

import { lusitana } from '@/app/ui/fonts';
import ThemeSwitcher from '@/app/context/ThemeSwitcher';
import { useTheme } from '@/app/context/ThemeContext';

export default function Page() {
  const { styles } = useTheme();
  
  return (
    <main className={`p-6 ${styles.bgPrimary} min-h-screen ${styles.textPrimary}`}>
      <div className={`flex justify-between items-center mb-8`}>
        <h1 className={`${lusitana.className} text-xl md:text-2xl ${styles.textAccent}`}>
        </h1>
        
        <div className="flex items-center">
          <ThemeSwitcher />
        </div>
      </div>
      
      <div className={`max-w-3xl mx-auto ${styles.bgSecondary} rounded-lg p-6 shadow-lg ${styles.borderColor} border`}>
        <p className={`${styles.textPrimary} mb-4`}>
          Dear journaler, 
        </p>
        
        <p className={`${styles.textSecondary} mb-4`}>
        {/* How to use this diary         */}
        </p>
        <ul className={`list-disc pl-5 ${styles.textPrimary} mb-4`}>
          <li className="mb-2">create new entries to capture what is happening in your life</li>
          <p className={`${styles.textSecondary} italic mb-2`}>"This room moves at the same speed as the clouds."</p>
          <li className="mb-2">view your personal entries to reflect on past experiences</li>
          <p className={`${styles.textSecondary} italic mb-2`}>"This room gets as wide as an ocean at the other end."</p>
          <li className="mb-2">record your thoughts or listen to entries</li>
          <p className={`${styles.textSecondary} italic mb-2`}>"Stay until the room is blue."</p>
          <li className="mb-2">explore global entries to connect with others</li>
          <p className={`${styles.textSecondary} italic mb-2`}>"Find other rooms that exist in this space"</p>
          <li className="mb-2">explore related topics, subgroups, or locations.</li>
          <p className={`${styles.textSecondary} italic mb-2`}>"Many rooms, many dreams, many countries in this space."</p>
          <li className="mb-2">try out our AI Assistant to analyze entries </li>
          <p className={`${styles.textSecondary} italic mb-2`}>"This room slowly evaporates every day."(Yoko Ono)</p>
          {/* <p className={`${styles.textSecondary} italic mb-2`}>(Yoko Ono)</p> */}

        </ul>
        
        {/* <p className={`${styles.textSecondary} py-12 italic`}> */}
          {/* Words, works, worlds" - let's co-create a shared narrative. */}
          {/* Let's write together, dream together, co-create music of the mind */}
        {/* </p> */}

        <p className={`${styles.textPrimary} mb-4`}>
            Guidelines        </p>
        <ul className={`list-disc pl-5 ${styles.textPrimary} mb-4`}>
          <li className="mb-2">Don't sign your diary entries</li>
          <li className="mb-2">Don't use real names or identifiable details</li>
          <li className="mb-2">No product placing, no propaganda </li>



        </ul>
      </div>
    </main>
  );
}