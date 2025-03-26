// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="bg-white dark:bg-[#1E2329] min-h-screen flex flex-col">
//       <div className="absolute top-0 left-0 right-0 md:top-0 md:pt-0 pt-16">
//         {/* Header */}
//         <div className="max-w-2xl mx-auto">
//           <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#1E2329]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
//             <div className="px-4 py-3 flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personal</h2>
              
//               <div className="flex items-center space-x-3">
//                 <button 
//                   onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                   className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//                 >
//                   <GlobeAltIcon className="w-5 h-5" />
//                 </button>

//               <button
//                 className="flex items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5" />
//                 <span className="text-sm hidden md:block">Read All</span>
//               </button>
//             </div>
//           </div>

//             {showTranslationOptions && (
//               <div className="px-4 pb-3">
//                 <div className="bg-gray-100 dark:bg-[#2C3340] rounded-lg p-2">
//                   <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
//                     Translate To
//                   </label>
//                   <select
//                     className="w-full bg-white dark:bg-[#3A4150] border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200"
//                     value={translateTo || ''}
//                     onChange={(e) => setTranslateTo(e.target.value || null)}
//                   >
//                     <option value="">None</option>
//                     <option value="en">English</option>
//                     <option value="de">German</option>
//                     <option value="es">Spanish</option>
//                     <option value="fr">French</option>
//                     <option value="ru">Russian</option>
//                     <option value="zh">Chinese</option>
//                     <option value="hi">Hindi</option>
//                     <option value="ar">Arabic</option>
//                     <option value="tr">Turkish</option>
//                     <option value="it">Italian</option>
//                     <option value="pt">Portuguese</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Error Handling */}
//           {error && (
//             <div className="px-4 py-2 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200">
//               <p className="text-sm">{error}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex-grow pt-16 md:pt-0">
//         {/* Entries List */}
//         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//           {entries.map(entry => (
//             <div key={entry.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#2C3340] transition-colors">
//               <div className="flex items-start space-x-3">
//                 <button
//                   className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//                   onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                   onClick={() => readEntryContent(entry.content, translateTo)}
//                 >
//                   <SpeakerWaveIcon className="w-5 h-5 mt-1" />
//                 </button>

//                 <div className="flex-1 min-w-0">
//                   <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
//                     {entry.content}
//                   </p>

//                   <div className="mt-2 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
//                     <span className="flex items-center space-x-1">
//                       <Clock className="w-4 h-4" />
//                       <span>
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </span>
                    
//                     <span>
//                       {new Date(entry.created_at).toLocaleDateString()}
//                     </span>

//                     {entry.location && (
//                       <span className="flex items-center space-x-1">
//                         <MapPin className="w-4 h-4" />
//                         <span>{entry.city}</span>
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <button className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
//                   <MoreHorizontal className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Loading and End of List Indicators */}
//         {loading && (
//           <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
//             Loading...
//           </div>
//         )}

//         {!hasMore && (
//           <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
//             No more entries
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PersonalComp;


// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="bg-white dark:bg-[#1E2329] min-h-screen">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#1E2329]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
//           <div className="px-4 py-3 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personal</h2>
            
//             <div className="flex items-center space-x-3">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//               >
//                 <GlobeAltIcon className="w-5 h-5" />
//               </button>

//               <button
//                 className="flex items-center space-x-2 text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5" />
//                 <span className="text-sm hidden md:block">Read All</span>
//               </button>
//             </div>
//           </div>

//           {showTranslationOptions && (
//             <div className="px-4 pb-3">
//               <div className="bg-gray-100 dark:bg-[#2C3340] rounded-lg p-2">
//                 <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
//                   Translate To
//                 </label>
//                 <select
//                   className="w-full bg-white dark:bg-[#3A4150] border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm text-gray-800 dark:text-gray-200"
//                   value={translateTo || ''}
//                   onChange={(e) => setTranslateTo(e.target.value || null)}
//                 >
//                   <option value="">None</option>
//                   <option value="en">English</option>
//                   <option value="de">German</option>
//                   <option value="es">Spanish</option>
//                   <option value="fr">French</option>
//                   <option value="ru">Russian</option>
//                   <option value="zh">Chinese</option>
//                   <option value="hi">Hindi</option>
//                   <option value="ar">Arabic</option>
//                   <option value="tr">Turkish</option>
//                   <option value="it">Italian</option>
//                   <option value="pt">Portuguese</option>
//                 </select>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error Handling */}
//         {error && (
//           <div className="px-4 py-2 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200">
//             <p className="text-sm">{error}</p>
//           </div>
//         )}

//         {/* Entries List */}
//         <div className="divide-y divide-gray-200 dark:divide-gray-700">
//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//               className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#2C3340] transition-colors"
//             >
//               <div className="flex items-start space-x-3">
//                 <button
//                   className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//                   onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                   onClick={() => readEntryContent(entry.content, translateTo)}
//                 >
//                   <SpeakerWaveIcon className="w-5 h-5 mt-1" />
//                 </button>

//                 <div className="flex-1 min-w-0">
//                   <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">
//                     {entry.content}
//                   </p>

//                   <div className="mt-2 flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs">
//                     <span className="flex items-center space-x-1">
//                       <Clock className="w-4 h-4" />
//                       <span>
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </span>
                    
//                     <span>
//                       {new Date(entry.created_at).toLocaleDateString()}
//                     </span>

//                     {entry.location && (
//                       <span className="flex items-center space-x-1">
//                         <MapPin className="w-4 h-4" />
//                         <span>{entry.city}</span>
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <button className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
//                   <MoreHorizontal className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Loading and End of List Indicators */}
//         {loading && (
//           <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
//             Loading...
//           </div>
//         )}

//         {!hasMore && (
//           <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
//             No more entries
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PersonalComp;



// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);
  
//   // New state for theme management
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
//     // Check local storage or system preference on initial load
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) return savedTheme === 'dark';
//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });

//   // Toggle theme function
//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
//     // Apply theme to document root
//     document.documentElement.classList.toggle('dark', newTheme);
//   };

//   // Apply theme on component mount
//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDarkMode);
//   }, []);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E2329] text-[#262B33] dark:text-gray-200 min-h-screen transition-colors duration-300">
//       <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#1E2329]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
//         <div className="px-4 py-4 flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-[#262B33] dark:text-gray-100">Personal</h2>
          
//           <div className="flex items-center space-x-4">
//             {/* Theme Toggle Button */}
//             <button 
//               onClick={toggleTheme}
//               className="text-[#5C6470] dark:text-gray-300 hover:text-[#262B33] dark:hover:text-white transition-colors"
//               aria-label="Toggle theme"
//             >
//               {isDarkMode ? (
//                 <SunIcon className="w-5 h-5" />
//               ) : (
//                 <MoonIcon className="w-5 h-5" />
//               )}
//             </button>

//             <button 
//               onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//               className="text-[#5C6470] dark:text-gray-300 hover:text-[#262B33] dark:hover:text-white transition-colors"
//             >
//               <GlobeAltIcon className="w-5 h-5" />
//             </button>

//             <button
//               className="flex items-center space-x-2 text-[#5C6470] dark:text-gray-300 hover:text-[#262B33] dark:hover:text-white transition-colors"
//               onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//             >
//               <SpeakerWaveIcon className="w-5 h-5" />
//               <span className="text-sm">Read All</span>
//             </button>
//           </div>
//         </div>

//         {showTranslationOptions && (
//           <div className="px-4 pb-4">
//             <div className="bg-[#F3F4F6] dark:bg-[#2C3340] rounded-lg p-3">
//               <label className="block text-xs text-[#5C6470] dark:text-gray-400 mb-2">
//                 Translate To
//               </label>
//               <select
//                 className="w-full bg-white dark:bg-[#2C3340] border border-gray-200 dark:border-gray-700 rounded-md p-2 text-sm text-[#262B33] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={translateTo || ''}
//                 onChange={(e) => setTranslateTo(e.target.value || null)}
//               >
//                 <option value="">None</option>
//                 <option value="en">English</option>
//                 <option value="de">German</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="ru">Russian</option>
//                 <option value="zh">Chinese</option>
//                 <option value="hi">Hindi</option>
//                 <option value="ar">Arabic</option>
//                 <option value="tr">Turkish</option>
//                 <option value="it">Italian</option>
//                 <option value="pt">Portuguese</option>
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="px-4 py-3 bg-red-50 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 mb-4">
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       <div className="divide-y divide-gray-200 dark:divide-gray-700">
//         {entries.map(entry => (
//           <div 
//             key={entry.id} 
//             className="px-4 py-4 hover:bg-[#F3F4F6] dark:hover:bg-[#2C3340] transition-colors group"
//           >
//             <div className="flex items-start space-x-3">
//               <button
//                 className="text-[#5C6470] dark:text-gray-300 hover:text-[#262B33] dark:hover:text-white transition-colors"
//                 onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                 onClick={() => readEntryContent(entry.content, translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5 mt-1" />
//               </button>

//               <div className="flex-1 min-w-0">
//                 <p className="text-[#262B33] dark:text-gray-200 text-sm whitespace-pre-wrap">
//                   {entry.content}
//                 </p>

//                 <div className="mt-2 flex items-center justify-between text-[#5C6470] dark:text-gray-400 text-xs">
//                   <span className="flex items-center space-x-1">
//                     <Clock className="w-4 h-4" />
//                     <span>
//                       {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </span>
                  
//                   <span>
//                     {new Date(entry.created_at).toLocaleDateString()}
//                   </span>

//                   {entry.location && (
//                     <span className="flex items-center space-x-1">
//                       <MapPin className="w-4 h-4" />
//                       <span>{entry.city}</span>
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <button className="text-[#5C6470] dark:text-gray-300 hover:text-[#262B33] dark:hover:text-white transition-colors">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && (
//         <div className="px-4 py-3 text-[#5C6470] dark:text-gray-400 text-center">
//           Loading...
//         </div>
//       )}

//       {!hasMore && (
//         <div className="px-4 py-3 text-[#5C6470] dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-700">
//           No more entries
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalComp;



// 'use client' clean balck gray white style

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="max-w-2xl mx-auto bg-white dark:bg-[#0b0b0b] text-black dark:text-white min-h-screen">
//       <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0b0b0b]/90 backdrop-blur-md border-b dark:border-gray-800 border-gray-200 px-4 py-3 flex justify-between items-center">
//         <h1 className="text-2xl font-semibold text-black dark:text-white">Personal</h1>
        
//         <div className="flex items-center space-x-3">
//           <button 
//             onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//             className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
//           >
//             <GlobeAltIcon className="w-5 h-5" />
//           </button>
          
//           <button
//             className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-1"
//             onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//           >
//             <SpeakerWaveIcon className="w-5 h-5" />
//             <span className="text-sm">Read All</span>
//           </button>
//         </div>
//       </div>

//       {showTranslationOptions && (
//         <div className="bg-gray-100 dark:bg-gray-900 p-4 border-b dark:border-gray-800 border-gray-200">
//           <div className="max-w-md mx-auto">
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Translate To
//             </label>
//             <select
//               className="w-full p-2 border dark:border-gray-700 border-gray-300 rounded-md bg-white dark:bg-[#1a1a1a] text-black dark:text-white"
//               value={translateTo || ''}
//               onChange={(e) => setTranslateTo(e.target.value || null)}
//             >
//               <option value="">None</option>
//               <option value="en">English</option>
//               <option value="de">German</option>
//               <option value="es">Spanish</option>
//               <option value="fr">French</option>
//               <option value="ru">Russian</option>
//               <option value="zh">Chinese</option>
//               <option value="hi">Hindi</option>
//               <option value="ar">Arabic</option>
//               <option value="tr">Turkish</option>
//               <option value="it">Italian</option>
//               <option value="pt">Portuguese</option>
//             </select>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-md m-4">
//           {error}
//         </div>
//       )}

//       <div className="divide-y dark:divide-gray-800 divide-gray-200">
//         {entries.map(entry => (
//           <div 
//             key={entry.id} 
//             className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
//           >
//             <div className="flex items-start space-x-3">
//               <button
//                 className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
//                 onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                 onClick={() => readEntryContent(entry.content, translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5" />
//               </button>

//               <div className="flex-1 min-w-0">
//                 <p className="text-black dark:text-white whitespace-pre-wrap text-sm">
//                   {entry.content}
//                 </p>

//                 <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
//                   <span>
//                     {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                   <span>{new Date(entry.created_at).toLocaleDateString()}</span>
//                   {entry.location && (
//                     <span className="flex items-center space-x-1">
//                       <MapPin className="w-4 h-4" />
//                       <span>{entry.city}</span>
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && (
//         <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//           Loading...
//         </div>
//       )}

//       {!hasMore && (
//         <div className="p-4 text-center text-gray-500 dark:text-gray-400 border-t dark:border-gray-800 border-gray-200">
//           No more entries
//         </div>
//       )}
//     </div>
//   );
// };

// export default PersonalComp;



// 'use client' bauhaus style

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="max-w-4xl mx-auto bg-white text-black font-['UniversLight']">
//       <div className="container mx-auto px-4 py-8">
//         <header className="grid grid-cols-3 items-center border-b-2 border-black pb-4 mb-8">
//           <div className="col-span-1">
//             <h1 className="text-4xl font-bold tracking-tight uppercase">Personal</h1>
//           </div>
          
//           <div className="col-span-1 flex justify-center">
//             <div className="inline-block p-2 bg-red-500 text-white">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="hover:opacity-80 transition-opacity"
//               >
//                 <GlobeAltIcon className="w-6 h-6" />
//               </button>
//             </div>
//           </div>
          
//           <div className="col-span-1 flex justify-end">
//             <button
//               className="flex items-center space-x-2 bg-blue-500 text-white p-2"
//               onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//             >
//               <SpeakerWaveIcon className="w-5 h-5" />
//               <span>Read All</span>
//             </button>
//           </div>
//         </header>

//         {showTranslationOptions && (
//           <div className="bg-yellow-300 p-4 mb-8 text-center">
//             <label className="block mb-2 font-bold">
//               Translate To:
//             </label>
//             <select
//               className="w-full bg-white border-2 border-black p-2"
//               value={translateTo || ''}
//               onChange={(e) => setTranslateTo(e.target.value || null)}
//             >
//               <option value="">None</option>
//               <option value="en">English</option>
//               <option value="de">German</option>
//               <option value="es">Spanish</option>
//               <option value="fr">French</option>
//               <option value="ru">Russian</option>
//               <option value="zh">Chinese</option>
//               <option value="hi">Hindi</option>
//               <option value="ar">Arabic</option>
//               <option value="tr">Turkish</option>
//               <option value="it">Italian</option>
//               <option value="pt">Portuguese</option>
//             </select>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-500 text-white p-4 mb-4 text-center">
//             Error: {error}
//           </div>
//         )}

//         <div className="space-y-4">
//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//               className="grid grid-cols-12 gap-4 p-4 border-2 border-black hover:bg-gray-100 transition-colors"
//             >
//               <div className="col-span-1 flex items-center justify-center bg-blue-500 text-white">
//                 <button
//                   onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                   onClick={() => readEntryContent(entry.content, translateTo)}
//                 >
//                   <SpeakerWaveIcon className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="col-span-11">
//                 <p className="text-sm mb-4 text-gray-800">{entry.content}</p>

//                 <div className="grid grid-cols-3 text-xs text-gray-600">
//                   <div className="flex items-center space-x-2">
//                     <Clock className="w-4 h-4" />
//                     <span>
//                       {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </div>
                  
//                   <div className="text-center">
//                     {new Date(entry.created_at).toLocaleDateString()}
//                   </div>

//                   {entry.location && (
//                     <div className="flex items-center justify-end space-x-2">
//                       <MapPin className="w-4 h-4" />
//                       <span>{entry.city}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {loading && (
//           <div className="text-center p-4 bg-yellow-300">
//             Loading...
//           </div>
//         )}

//         {!hasMore && (
//           <div className="text-center p-4 bg-blue-500 text-white">
//             End of Entries
//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
        
//         body {
//           font-family: 'Roboto', sans-serif;
//           background-color: white;
//         }

//         /* Bauhaus-inspired geometric styles */
//         * {
//           box-sizing: border-box;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PersonalComp;



'use client'

import React, { useEffect, useState } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, Clock, MapPin, Waves } from 'lucide-react';
import toast from 'react-hot-toast';
import UnderwaterBackground from '@/app/ui/dashboard/underwater';
interface Entry {
  id: string;
  theme_id: string;
  thread_id: string | null;
  content: string;
  location: string;
  city: string;
  created_at: string;
}

const LIMIT = 50;

const PersonalComp: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchEntries = async (currentOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to fetch entries');
      }
      const data: Entry[] = await res.json();
      setEntries((prev) => {
        const existingIds = new Set(prev.map(entry => entry.id));
        const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
        return [...prev, ...newUniqueEntries];
      });
      if (data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (err: any) {
      const message = err.message || 'Unknown error';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(offset);
  }, [offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
        setOffset((prevOffset) => prevOffset + LIMIT);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="max-w-2xl mx-auto bg-[#0a1428] min-h-screen text-teal-200 relative overflow-hidden">

      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-[#0a2c46] bg-opacity-90 backdrop-blur-sm border-b border-teal-800/30 shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-teal-300 flex items-center space-x-3">
              {/* <Waves className="w-8 h-8 text-teal-500" /> */}
              <span>🌊 Single Ocean Diary <button>🐚</button></span>
            </h2>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowTranslationOptions(!showTranslationOptions)}
                className="hover:text-teal-500 transition-colors"
              >
                <GlobeAltIcon className="w-6 h-6" />
              </button>

              <button
                className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
                onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
              >
                <SpeakerWaveIcon className="w-5 h-5 text-teal-300" />
              </button>
            </div>
          </div>

          {showTranslationOptions && (
            <div className="p-4 bg-[#0a3c5e] rounded-b-lg shadow-xl border-t border-teal-800/30">
              <label className="text-sm font-medium">
                Communication Protocol:
                <select
                  className="ml-2 border border-teal-700 bg-[#0a2c46] text-teal-200 p-1 rounded"
                  value={translateTo || ''}
                  onChange={(e) => setTranslateTo(e.target.value || null)}
                >
                  <option value="" className="bg-[#0a2c46]">Native Comm</option>
                  <option value="en" className="bg-[#0a2c46]"> English</option>
                  <option value="de" className="bg-[#0a2c46]"> German</option>
                  <option value="es" className="bg-[#0a2c46]"> Spanish</option>
                  <option value="fr" className="bg-[#0a2c46]"> French</option>
                  <option value="ru" className="bg-[#0a2c46]"> Russian</option>
                  <option value="zh" className="bg-[#0a2c46]"> Chinese</option>
                  <option value="hi" className="bg-[#0a2c46]"> Hindi</option>
                  <option value="ar" className="bg-[#0a2c46]"> Arabic</option>
                  <option value="tr" className="bg-[#0a2c46]"> Turkish</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-4 text-red-300 bg-red-900/30 rounded-lg border border-red-700/30">
            Transmission Breach: {error}
          </div>
        )}

        <div className="divide-y divide-teal-800/30">
          {entries.map(entry => (
            <div 
              key={entry.id} 
              className="p-4 hover:bg-teal-900/20 transition-colors relative group"
            >
              <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg border-l-4 border-teal-500"></div>
              <div className="flex space-x-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
                      onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                      onClick={() => readEntryContent(entry.content, translateTo)}
                    >
                      <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                    </button>
                    <MoreHorizontal className="w-5 h-5 text-teal-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <p className="mt-2 text-white whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {entry.content}
                  </p>

                  <div className="mt-3 flex justify-between items-center text-teal-400 text-opacity-70">
                    <span className="flex items-center space-x-2 hover:text-teal-300 transition-colors">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </span>
                    <span className="text-xs sm:text-sm">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    {entry.location && (
                      <span className="flex items-center space-x-1 hover:text-teal-300 transition-colors">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{entry.city}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="p-4 text-teal-500 text-center">
              Scanning underwater data streams... Retrieving logs...
            </div>
          )}
          {!hasMore && (
            <div className="p-4 text-teal-600 text-center">
             You've reached the shore of your memories! 🌊
          </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0);
            opacity: 0.1;
          }
          50% { 
            transform: translateY(-20px);
            opacity: 0.3;
          }
        }
        body {
          background-color: #0a1428;
        }
        ::selection {
          background-color: rgba(0, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PersonalComp;



// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin, Rocket } from 'lucide-react';
// import toast from 'react-hot-toast';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);
  

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });
//       if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="max-w-2xl mx-auto bg-[#0a0a1a] min-h-screen text-cyan-200 relative overflow-hidden">
//       <div className="relative z-10">
//         <div className=" bg-[#0a0a2a] bg-opacity-90 backdrop-blur-sm border-b border-cyan-800/30 shadow-lg">

//           <div className="px-6 py-4 flex justify-between items-center">
//             <h2 className="text-3xl font-bold text-cyan-400 flex items-center space-x-3">
           

//               <span>Monoid</span>
//             </h2>

//             <div className="flex space-x-4">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="hover:text-cyan-500 transition-colors"
//               >
//                 <GlobeAltIcon className="w-6 h-6" />
//               </button>

//               <button
//                 className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5 text-cyan-300" />
//               </button>
//             </div>
//           </div>

//           {showTranslationOptions && (
//             <div className="p-4 bg-[#15153a] rounded-b-lg shadow-xl border-t border-cyan-800/30">

//               <label className="text-sm font-medium">
//                 Universal Translator:
//                 <select
//                   className="ml-2 border border-cyan-700 bg-[#0a0a2a] text-cyan-200 p-1 rounded"
//                   value={translateTo || ''}
//                   onChange={(e) => setTranslateTo(e.target.value || null)}
//                 >
//                   <option value="" className="bg-[#0a0a2a]">Native Dialect</option>
//                   <option value="en" className="bg-[#0a0a2a]">Terran English</option>
//                   <option value="de" className="bg-[#0a0a2a]">Galactic German</option>
//                   <option value="es" className="bg-[#0a0a2a]">Cosmic Spanish</option>
//                   {/* Other translation options remain the same */}
//                 </select>
//               </label>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="p-4 mb-4 text-red-300 bg-red-900/30 rounded-lg border border-red-700/30">
//             Transmission Error: {error}
//           </div>
//         )}

//         <div className="divide-y divide-cyan-800/30">



//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//               className="p-4 hover:bg-cyan-900/20 transition-colors relative group"
//             >
//               <div className="absolute inset-0 bg-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//               <div className="flex space-x-3 relative z-10">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <button
//                       className="flex items-center space-x-2 hover:text-cyan-400 transition-colors"
//                       onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                       onClick={() => readEntryContent(entry.content, translateTo)}
//                     >
//                       <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
//                     </button>
//                     <MoreHorizontal className="w-5 h-5 text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity" />
//                   </div>

//                   {/* <p className="mt-2 text-cyan-100 whitespace-pre-wrap text-sm leading-relaxed"> */}
//                   <p className="mt-2 text-white whitespace-pre-wrap text-sm leading-relaxed">

//                     {entry.content}
//                   </p>

//                   <div className="mt-3 flex justify-between items-center text-cyan-400 text-opacity-70">
//                     <span className="flex items-center space-x-2 hover:text-cyan-300 transition-colors">
//                       <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span className="text-xs sm:text-sm">
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
//                     </span>
//                     <span className="text-xs sm:text-sm">
//                       {new Date(entry.created_at).toLocaleDateString()}
//                     </span>
//                     {entry.location && (
//                       <span className="flex items-center space-x-1 hover:text-cyan-300 transition-colors">
//                         <MapPin className="w-4 h-4" />
//                         <span className="text-xs">{entry.city}</span>
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="p-4 text-cyan-500 text-center">
//               Scanning data streams... Retrieving logs...
//             </div>
//           )}
//           {!hasMore && (
//             <div className="p-4 text-cyan-500 text-center">
//               End of transmission. No more logs available.
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes twinkle {
//           0%, 100% { opacity: 0.5; }
//           50% { opacity: 0.2; }
//         }
//         body {
//           background-color: #0a0a1a;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default PersonalComp;


// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Entry {
//   id: string;
//   theme_id: string;
//   thread_id: string | null;
//   content: string;
//   location: string;
//   city: string;
//   created_at: string;
// }

// const LIMIT = 50;

// const PersonalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/personal?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...newUniqueEntries];
//       });      if (data.length < LIMIT) {
//         setHasMore(false);
//       }
//     } catch (err: any) {
//       const message = err.message || 'Unknown error';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEntries(offset);
//   }, [offset]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !loading) {
//         setOffset((prevOffset) => prevOffset + LIMIT);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [hasMore, loading]);

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="top-0 z-10 bg-white border-b border-gray-200">
//         <div className="px-6 py-4">
//           <h2 className="text-2xl font-bold text-gray-800">Personal</h2>

//           <div className="flex space-x-4">
//             <button onClick={() => setShowTranslationOptions(!showTranslationOptions)}>
//               <GlobeAltIcon className="w-6 h-6 hover:text-blue-500" />
//             </button>

//             <button
//               className="flex items-center space-x-2 hover:text-red-500"
//               onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//             >
//               <SpeakerWaveIcon className="w-5 h-5 text-blue-300" />
//               <span>Read All</span>
//             </button>
//           </div>
//         </div>

//         {showTranslationOptions && (
//           <div className="p-4 bg-gray-100 rounded shadow-md">
//             <label>
//               <span className="text-sm font-medium">Translate To:</span>
//               <select
//                 className="ml-2 border p-1 rounded"
//                 value={translateTo || ''}
//                 onChange={(e) => setTranslateTo(e.target.value || null)}
//               >
//                 <option value="">None</option>
//                 <option value="en">English</option>
//                 <option value="de">German</option>
//                 <option value="es">Spanish</option>
//                 <option value="fr">French</option>
//                 <option value="ru">Russian</option>
//                 <option value="zh">Chinese</option>
//                 <option value="hi">Hindi</option>
//                 <option value="ar">Arabic</option>
//                 <option value="tr">Turkish</option>
//                 <option value="it">Italian</option>
//                 <option value="pt">Portuguese</option>
//               </select>
//             </label>
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200 text-sm">
//           {error}
//         </div>
//       )}

//       <div className="divide-y divide-gray-200">
//         {entries.map(entry => (
//           <div key={entry.id} className="p-4 hover:bg-blue-50 transition-colors">
//             <div className="flex space-x-3">
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <button
//                     className="flex items-center space-x-2 hover:text-red-500"
//                     onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                     onClick={() => readEntryContent(entry.content, translateTo)}
//                   >
//                     <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//                   </button>
//                   <MoreHorizontal className="w-5 h-5 text-blue-300" />
//                 </div>

//                 <p className="mt-2 text-gray-900 whitespace-pre-wrap">{entry.content}</p>

//                 <div className="mt-3 flex justify-between items-center text-gray-500">
//                   <span className="flex items-center space-x-2 hover:text-blue-500">
//                     <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span className="text-xs sm:text-sm">
//                       {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </span>
//                   <span className="text-xs sm:text-sm">{new Date(entry.created_at).toLocaleDateString()}</span>
//                   {entry.location && (
//                     <span className="flex items-center space-x-1 hover:text-blue-500">
//                       <MapPin className="w-4 h-4" />
//                       <span className="text-xs">{entry.city}</span>
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//         {loading && <div className="p-4 text-gray-500">Loading more entries...</div>}
//         {!hasMore && <div className="p-4 text-gray-500 text-center">You’ve reached the end.</div>}
//       </div>
//     </div>
//   );
// };

// export default PersonalComp;




// // 'use client'

// // import React, { useEffect, useState } from 'react';
// // import { SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// // import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// // import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
// // import toast from 'react-hot-toast';

// // interface Entry {
// //   id: string;
// //   theme_id: string;
// //   thread_id: string | null;
// //   content: string;
// //   location: string;
// //   created_at: string;
// // }



// // const PersonalComp: React.FC = () => {
// //   const [entries, setEntries] = useState<Entry[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [error, setError] = useState<string>('');
// // const [translateTo, setTranslateTo] = useState<string | null>(null);

// //   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);

// //   useEffect(() => {
// //     const fetchEntries = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await fetch('/api/entries/get/personal');
// //         const data = await res.json();
// //         if (!res.ok) throw new Error(data.error || 'Failed to fetch entries');
// //         setEntries(data);
// //       } catch (err: any) {
// //         setError(err.message || 'Unknown error');
// //         toast.error(err.message || 'Unknown error');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchEntries();
// //   }, []);

// //   return (
// //     <div className="max-w-2xl mx-auto">
// //       <div className="top-0 z-10 bg-white border-b border-gray-200">
// //         <div className="px-6 py-4">
// //           <h2 className="text-2xl font-bold text-gray-800">Personal</h2>

// //           <div className="flex space-x-4">
// //             <button onClick={() => setShowTranslationOptions(!showTranslationOptions)}>
// //               <GlobeAltIcon className="w-6 h-6 hover:text-blue-500" />
// //             </button>

// //             <button
// //               className="flex items-center space-x-2 hover:text-red-500"
// //                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}

// //             >
// //               <SpeakerWaveIcon className="w-5 h-5 text-blue-300" />
// //               <span>Read All</span>
// //             </button>
// //           </div>
// //         </div>

// //         {showTranslationOptions && (
// //           <div className="p-4 bg-gray-100 rounded shadow-md">
// //             <label>
// //               <span className="text-sm font-medium">Translate To:</span>
// //               <select
// //                 className="ml-2 border p-1 rounded"
// //                 value={translateTo || ''}
// //                 onChange={(e) => setTranslateTo(e.target.value)}
// //               >
// //                 <option value="">None</option>
// //                 <option value="en">English</option>
// //                 <option value="de">German</option>
// //                 <option value="es">Spanish</option>
// //                 <option value="fr">French</option>
// //                 <option value="ru">Russian</option>
// //                 <option value="zh">Chinese</option>
// //                 <option value="hi">Hindi</option>
// //                 <option value="ar">Arabic</option>
// //                 <option value="tr">Turkish</option>
// //                 <option value="it">Italian</option>
// //                 <option value="pt">Portuguese</option>
// //               </select>
// //             </label>
// //           </div>
// //         )}
// //       </div>

// //       {error && (
// //         <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200 text-sm">
// //           {error}
// //         </div>
// //       )}

// //       <div className="divide-y divide-gray-200">
// //         {entries.map(entry => (
// //           <div key={entry.id} className="p-4 hover:bg-blue-50 transition-colors">
// //             <div className="flex space-x-3">
// //               <div className="flex-1 min-w-0">
// //                 <div className="flex items-center justify-between">
// //                   <button

// //                     className="flex items-center space-x-2 hover:text-red-500"
// //                     onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
// //                     onClick={() => readEntryContent(entry.content, translateTo)}

// //                   >
// //                     <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5" />
// //                   </button>
// //                   <MoreHorizontal className="w-5 h-5 text-blue-300" />
// //                 </div>

// //                 <p className="mt-2 text-gray-900 whitespace-pre-wrap">{entry.content}</p>

// //                 <div className="mt-3 flex justify-between items-center text-gray-500">
// //                   <span className="flex items-center space-x-2 hover:text-blue-500">
// //                     <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
// //                     <span className="text-xs sm:text-sm">
// //                       {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
// //                     </span>
// //                   </span>
// //                   <span className="text-xs sm:text-sm">{new Date(entry.created_at).toLocaleDateString()}</span>
// //                   {entry.location && (
// //                     <span className="flex items-center space-x-1 hover:text-blue-500">
// //                       <MapPin className="w-4 h-4" />
// //                       <span className="text-xs">{entry.location}</span>
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default PersonalComp;



