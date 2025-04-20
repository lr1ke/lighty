'use client';

import { lusitana } from '@/app/ui/fonts';
import ThemeSwitcher from '@/app/context/ThemeSwitcher';
import { useTheme } from '@/app/context/ThemeContext';

export default function Page() {
  const { theme, styles } = useTheme();
  
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
        How to uses this diary        
        </p>
        <ul className={`list-disc pl-5 ${styles.textPrimary} mb-4`}>
          <li className="mb-2">Create new entries to capture what is happening in your life</li>
          <li className="mb-2">View your personal entries to reflect on past experiences</li>
          <li className="mb-2">Explore global entries to connect with others</li>
          <li className="mb-2">Use the buttons around an entry to explore related topics, subgroups, or locations.</li>
          <li className="mb-2">Record your thoughts or listen to entries with the text-to-speech functionality.</li>
          <li className="mb-2">Try out our AI Assistant to analyze entries </li>
        </ul>
        
        <p className={`${styles.textSecondary} py-12 italic`}>
          "Words, works, worlds" - let's co-create a shared narrative.
        </p>

        <p className={`${styles.textSecondary} mb-4`}>
            Guidelines        </p>
        <ul className={`list-disc pl-5 ${styles.textPrimary} mb-4`}>
          <li className="mb-2">Don't sign your diary entries - keep them anonymous</li>
          <li className="mb-2">Don't use real names or identifiable details</li>
          <li className="mb-2">No product placing or propaganda allowed</li>



        </ul>
      </div>
    </main>
  );
}