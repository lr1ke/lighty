
// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, ChevronUp, Clock, ChevronDown, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';


// interface Entry {
//   id: string;
//   theme_id: string;
//   theme_name: string;
//   thread_id: string | null;
//   thread_title: string | null;
//   content: string;
//   location: string | null;
//   city: string | null;
//   state: string | null;
//   created_at: string;
// }

// const themeColors: Record<string, string> = {
//     morning: 'bg-yellow-300',
//     evening: 'bg-blue-300',
//     weekly: 'bg-red-300',
//     kiez: 'bg-purple-300',
//     revelation: 'bg-pink-300',
//     story: 'bg-orange-300',
//   };  

//   const themeColors: Record<string, string> = {
//     'morning': 'bg-cyan-900 text-cyan-200', // Morning sea mist
//     'evening': 'bg-indigo-900 text-indigo-200', // Evening ocean depths
//     'weekly': 'bg-blue-900 text-blue-200', // Deep ocean current
//     'kiez': 'bg-teal-900 text-teal-200', // Coastal waters
//     'revelation': 'bg-purple-900 text-purple-200', // Bioluminescent zone
//     'story': 'bg-emerald-900 text-emerald-200', // Deep sea kelp forest
//   };



// const LIMIT = 50;

// const GlobalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());




//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || 'Failed to fetch entries');
//       }
//       const data: Entry[] = await res.json();
//     setEntries((prev) => {
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

//   const toggleExpand = (id: string) => {
//     setExpandedIds(prev => {
//       const newSet = new Set(prev);
//       newSet.has(id) ? newSet.delete(id) : newSet.add(id);
//       return newSet;
//     });
//   };



//   return (
//     <div className="max-w-2xl mx-auto bg-[#0a1428] min-h-screen text-teal-200 relative overflow-hidden">
//       <div className="relative z-10">
//         <div className="sticky top-0 z-20 bg-[#0a2c46] bg-opacity-90 backdrop-blur-sm border-b border-teal-800/30 shadow-lg">
//           <div className="px-6 py-4 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-teal-300 flex items-center space-x-3">
//               <span>🌊 Groupoid Ocean <button>🐚</button></span>
//             </h2>

//             <div className="flex space-x-4">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="hover:text-teal-500 transition-colors"
//               >🌍
//                 {/* <GlobeAltIcon className="w-6 h-6" /> */}
//               </button>

//               <button
//                 className="flex items-center space-x-2 hover:text-teal-400 transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5 text-teal-300" />
//               </button>
//             </div>
//           </div>

//           {showTranslationOptions && (
//             <div className="p-4 bg-[#0a3c5e] rounded-b-lg shadow-xl border-t border-teal-800/30">
//               <label className="text-sm font-medium">
//                 Communication Protocol:
//                 <select
//                   className="ml-2 border border-teal-700 bg-[#0a2c46] text-teal-200 p-1 rounded"
//                   value={translateTo || ''}
//                   onChange={(e) => setTranslateTo(e.target.value || null)}
//                 >
//                   <option value="" className="bg-[#0a2c46]">Native Comm</option>
//                   <option value="en" className="bg-[#0a2c46]">Terran English</option>
//                   <option value="de" className="bg-[#0a2c46]">Ocean German</option>
//                   <option value="es" className="bg-[#0a2c46]">Coastal Spanish</option>
//                   <option value="fr" className="bg-[#0a2c46]">Maritime French</option>
//                   <option value="ru" className="bg-[#0a2c46]">Wave Russian</option>
//                   <option value="zh" className="bg-[#0a2c46]">Reef Chinese</option>
//                   <option value="hi" className="bg-[#0a2c46]">Monsoon Hindi</option>
//                   <option value="ar" className="bg-[#0a2c46]">Tide Arabic</option>
//                   <option value="tr" className="bg-[#0a2c46]">Current Turkish</option>
//                   <option value="it" className="bg-[#0a2c46]">Offshore Italian</option>
//                   <option value="pt" className="bg-[#0a2c46]">Onshore Portuguese</option>
//                 </select>
//               </label>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="p-4 mb-4 text-red-300 bg-red-900/30 rounded-lg border border-red-700/30">
//             Transmission Breach: {error}
//           </div>
//         )}

//         <div className="divide-y divide-teal-800/30">
//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//              id={`entry-${entry.id}`}
//               className="p-4 hover:bg-teal-900/20 transition-colors relative group"
//             >
//               <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg "></div>
//               <div className="flex space-x-3 relative z-10">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
                    
//                   <span className="flex items-center text-xs sm:text-sm text-teal-600 hover:text-teal-500 transition-colors">
//                   <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                       <button
//                         className={`flex items-center justify-center w-5 h-2 squared-full ${themeColors[entry.theme_name.trim()] || 'bg-gray-500'} text-xs`} 
//                         title={`View all entries for ${entry.theme_name}`}
//                       >
//                         </button> 
//                     </Link> 
//                     <span className="ml-2">
//                       {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
//                       {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
//                     </span>




//                     <button
//                       className="text-gray-400 hover:text-coral-600 transition-colors ml-2"
//                       onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                       onClick={() => readEntryContent(entry.content, translateTo)}
//                     >
//                       <SpeakerWaveIcon className="w-6 h-4 text-gray-400" />
//                     </button>
//                   </span>
                  
//                   <button 
//                     onClick={() => toggleExpand(entry.id)} 
//                     className="text-gray-500 hover:text-coral-600 text-sm transition-colors"
//                     title={expandedIds.has(entry.id) ? 'show less' : 'expand text'}
//                   >
//                     {expandedIds.has(entry.id) ?   <ChevronUp /> : <MoreHorizontal />}
//                   </button>
//                 </div>

//                   <p className="mt-2 text-white whitespace-pre-wrap text-sm leading-relaxed font-mono">
//                     {expandedIds.has(entry.id)
//                       ? entry.content
//                       : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//                   </p>

//                   <div className="mt-3 flex justify-between items-center text-teal-400 text-opacity-70">

//                     <span className="flex items-center space-x-2 hover:text-teal-300 transition-colors">
//                     {entry.thread_id && (
//                       <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
//                         <button 
//                           className="text-gray-400 hover:text-coral-600 transition-colors" 
//                           title={entry.thread_title || ''}
//                         >
//                           <UserGroupIcon className="w-4 h-4" />
//                         </button>
//                       </Link>
//                     )} {''}
//                     </span>

//                     {entry.city && ( 
//                       <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                         <button 
//                           title={`View all entries for ${entry.city}`}
//                           className="flex items-center space-x-1 hover:text-teal-300 transition-colors"
//                         >
//                           <MapPin className="w-4 h-4" />
//                           <span className="text-xs">{entry.city}</span>
//                         </button>                 
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {loading && (
//             <div className="p-4 text-teal-500 text-center">
//               Scanning underwater data streams... Retrieving logs...
//             </div>
//           )}
          
//           {!hasMore && (
//             <div className="p-4 text-teal-600 text-center">
//               You've reached the shore of collective memories! 🌊
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { 
//             transform: translateY(0);
//             opacity: 0.1;
//           }
//           50% { 
//             transform: translateY(-20px);
//             opacity: 0.3;
//           }
//         }
//         body {
//           background-color: #0a1428;
//         }
//         ::selection {
//           background-color: rgba(0, 255, 255, 0.2);
//         }
//       `}</style>
//     </div>
//   );
// };
// export default GlobalComp;


// dark themed soviet retro 
// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, ChevronUp, Clock, ChevronDown, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';

// interface Entry {
//   id: string;
//   theme_id: string;
//   theme_name: string;
//   thread_id: string | null;
//   thread_title: string | null;
//   content: string;
//   location: string | null;
//   city: string | null;
//   state: string | null;
//   created_at: string;
// }

// const themeColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C]',
//   evening: 'bg-[#C84A20]',
//   weekly: 'bg-[#E6D6AC]',
//   kiez: 'bg-[#C9A648]',
//   revelation: 'bg-[#8B3E2F]',
//   story: 'bg-[#D98E73]',
// };

// const LIMIT = 50;

// const GlobalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
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

//   const toggleExpand = (id: string) => {
//     setExpandedIds(prev => {
//       const newSet = new Set(prev);
//       newSet.has(id) ? newSet.delete(id) : newSet.add(id);
//       return newSet;
//     });
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-[#121A0F] min-h-screen text-[#E6D6AC] relative overflow-hidden">
//       <div className="relative z-10">
//         <div className="sticky top-0 z-20 bg-[#121A0F] bg-opacity-90 backdrop-blur-sm border-b border-[#C9A648] shadow-lg">
//           <div className="px-6 py-4 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-[#E9B44C] flex items-center space-x-3">
//               <span>Groupoid Cosmic <button>🌠</button></span>
//             </h2>

//             <div className="flex space-x-4">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="hover:text-[#C84A20] transition-colors"
//               >🌍
//               </button>

//               <button
//                 className="flex items-center space-x-2 hover:text-[#E9B44C] transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5 text-[#E9B44C]" />
//               </button>
//             </div>
//           </div>

//           {showTranslationOptions && (
//             <div className="p-4 bg-[#1A2415] rounded-b-lg shadow-xl border-t border-[#C9A648]">
//               <label className="text-sm font-medium">
//                 Communication Protocol:
//                 <select
//                   className="ml-2 border border-[#C9A648] bg-[#121A0F] text-[#E6D6AC] p-1 rounded"
//                   value={translateTo || ''}
//                   onChange={(e) => setTranslateTo(e.target.value || null)}
//                 >
//                   <option value="" className="bg-[#121A0F]">Native Comm</option>
//                   <option value="en" className="bg-[#121A0F]">Terran English</option>
//                   <option value="de" className="bg-[#121A0F]">Martian German</option>
//                   <option value="es" className="bg-[#121A0F]">Orbital Spanish</option>
//                   <option value="fr" className="bg-[#121A0F]">Stellar French</option>
//                   <option value="ru" className="bg-[#121A0F]">Cosmic Russian</option>
//                   <option value="zh" className="bg-[#121A0F]">Nebula Chinese</option>
//                   <option value="hi" className="bg-[#121A0F]">Solar Hindi</option>
//                   <option value="ar" className="bg-[#121A0F]">Asteroid Arabic</option>
//                   <option value="tr" className="bg-[#121A0F]">Galactic Turkish</option>
//                   <option value="it" className="bg-[#121A0F]">Interstellar Italian</option>
//                   <option value="pt" className="bg-[#121A0F]">Planetary Portuguese</option>
//                 </select>
//               </label>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="p-4 mb-4 text-[#C84A20] bg-[#1A2415] rounded-lg border border-[#C84A20]">
//             Transmission Breach: {error}
//           </div>
//         )}

//         <div className="divide-y divide-[#C9A648]/30">
//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//               id={`entry-${entry.id}`}
//               className="p-4 hover:bg-[#1A2415] transition-colors relative group"
//             >
//               <div className="absolute inset-0 bg-[#C9A648]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//               <div className="flex space-x-3 relative z-10">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
                    
//                     <span className="flex items-center text-xs sm:text-sm text-[#C9A648] hover:text-[#E9B44C] transition-colors">
//                       <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                         <button
//                           className={`flex items-center justify-center w-5 h-2 squared-full ${themeColors[entry.theme_name.trim()] || 'bg-[#C84A20]'} text-xs`} 
//                           title={`View all entries for ${entry.theme_name}`}
//                         >
//                         </button> 
//                       </Link> 
//                       <span className="ml-2">
//                         {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
//                       </span>

//                       <button
//                         className="text-[#C9A648] hover:text-[#C84A20] transition-colors ml-2"
//                         onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                         onClick={() => readEntryContent(entry.content, translateTo)}
//                       >
//                         <SpeakerWaveIcon className="w-6 h-4 text-[#C9A648]" />
//                       </button>
//                     </span>
                    
//                     <button 
//                       onClick={() => toggleExpand(entry.id)} 
//                       className="text-[#C9A648] hover:text-[#C84A20] text-sm transition-colors"
//                       title={expandedIds.has(entry.id) ? 'show less' : 'expand text'}
//                     >
//                       {expandedIds.has(entry.id) ? <ChevronUp /> : <MoreHorizontal />}
//                     </button>
//                   </div>

//                   <p className="mt-2 text-[#E6D6AC] whitespace-pre-wrap text-sm leading-relaxed font-mono">
//                     {expandedIds.has(entry.id)
//                       ? entry.content
//                       : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//                   </p>

//                   <div className="mt-3 flex justify-between items-center text-[#C9A648] text-opacity-70">
//                     <span className="flex items-center space-x-2 hover:text-[#E9B44C] transition-colors">
//                       {entry.thread_id && (
//                         <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
//                           <button 
//                             className="text-[#C9A648] hover:text-[#C84A20] transition-colors" 
//                             title={entry.thread_title || ''}
//                           >
//                             <UserGroupIcon className="w-4 h-4" />
//                           </button>
//                         </Link>
//                       )} {''}
//                     </span>

//                     {entry.city && ( 
//                       <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                         <button 
//                           title={`View all entries for ${entry.city}`}
//                           className="flex items-center space-x-1 hover:text-[#E9B44C] transition-colors"
//                         >
//                           <MapPin className="w-4 h-4" />
//                           <span className="text-xs">{entry.city}</span>
//                         </button>                 
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {loading && (
//             <div className="p-4 text-[#E9B44C] text-center">
//               Scanning interstellar data streams... Retrieving transmissions...
//             </div>
//           )}
          
//           {!hasMore && (
//             <div className="p-4 text-[#C9A648] text-center">
//               You've reached the edge of known communications! 🚀
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { 
//             transform: translateY(0);
//             opacity: 0.1;
//           }
//           50% { 
//             transform: translateY(-20px);
//             opacity: 0.3;
//           }
//         }
//         body {
//           background-color: #121A0F;
//         }
//         ::selection {
//           background-color: rgba(201, 166, 72, 0.3);
//           color: #E6D6AC;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GlobalComp;


'use client'

import React, { useEffect, useState } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, ChevronUp, Clock, ChevronDown, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Entry {
  id: string;
  theme_id: string;
  theme_name: string;
  thread_id: string | null;
  thread_title: string | null;
  content: string;
  location: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
}

const themeColors: Record<string, string> = {
  morning: 'bg-[#E9B44C]',
  evening: 'bg-[#C84A20]',
  weekly: 'bg-[#E6D6AC]',
  kiez: 'bg-[#C9A648]',
  revelation: 'bg-[#8B3E2F]',
  story: 'bg-[#D98E73]',
};

const LIMIT = 50;

const GlobalComp: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [translateTo, setTranslateTo] = useState<string | null>(null);
  const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchEntries = async (currentOffset: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
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

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen text-[#121A0F] relative overflow-hidden">
      <div className="relative z-10">
        <div className="sticky top-0 z-20 bg-[#E9B44C] bg-opacity-90 backdrop-blur-sm border-b border-[#C84A20] shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#8B3E2F] flex items-center space-x-3">
              <span> Groupoid Cosmic <button>🌠</button></span>
            </h2>

            <div className="flex space-x-4">
              <button 
                onClick={() => setShowTranslationOptions(!showTranslationOptions)}
                className="hover:text-[#C84A20] transition-colors"
              >🌍
              </button>

              <button
                className="flex items-center space-x-2 hover:text-[#8B3E2F] transition-colors"
                onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
              >
                <SpeakerWaveIcon className="w-5 h-5 text-[#8B3E2F]" />
              </button>
            </div>
          </div>

          {showTranslationOptions && (
            <div className="p-4 bg-[#E6D6AC] rounded-b-lg shadow-xl border-t border-[#C84A20]">
              <label className="text-sm font-medium text-[#8B3E2F]">
                Communication Protocol:
                <select
                  className="ml-2 border border-[#C84A20] bg-[#E9B44C] text-[#121A0F] p-1 rounded"
                  value={translateTo || ''}
                  onChange={(e) => setTranslateTo(e.target.value || null)}
                >
                  <option value="" className="bg-[#E9B44C]">Native Comm</option>
                  <option value="en" className="bg-[#E9B44C]">Terran English</option>
                  <option value="de" className="bg-[#E9B44C]">Martian German</option>
                  <option value="es" className="bg-[#E9B44C]">Orbital Spanish</option>
                  <option value="fr" className="bg-[#E9B44C]">Stellar French</option>
                  <option value="ru" className="bg-[#E9B44C]">Cosmic Russian</option>
                  <option value="zh" className="bg-[#E9B44C]">Nebula Chinese</option>
                  <option value="hi" className="bg-[#E9B44C]">Solar Hindi</option>
                  <option value="ar" className="bg-[#E9B44C]">Asteroid Arabic</option>
                  <option value="tr" className="bg-[#E9B44C]">Galactic Turkish</option>
                  <option value="it" className="bg-[#E9B44C]">Interstellar Italian</option>
                  <option value="pt" className="bg-[#E9B44C]">Planetary Portuguese</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 mb-4 text-[#C84A20] bg-[#E6D6AC] rounded-lg border border-[#C84A20]">
            Transmission Breach: {error}
          </div>
        )}

        <div className="divide-y divide-[#C84A20]/30">
          {entries.map(entry => (
            <div 
              key={entry.id} 
              id={`entry-${entry.id}`}
              className="p-4 hover:bg-[#E9B44C]/20 transition-colors relative group"
            >
              <div className="absolute inset-0 bg-[#C9A648]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
              <div className="flex space-x-3 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    
                    <span className="flex items-center text-xs sm:text-sm text-[#8B3E2F] hover:text-[#C84A20] transition-colors">
                      <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                        <button
                          className={`flex items-center justify-center w-5 h-2 squared-full ${themeColors[entry.theme_name.trim()] || 'bg-[#C84A20]'} text-xs`} 
                          title={`View all entries for ${entry.theme_name}`}
                        >
                        </button> 
                      </Link> 
                      <span className="ml-2">
                        {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                      </span>

                      <button
                        className="text-[#8B3E2F] hover:text-[#C84A20] transition-colors ml-2"
                        onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                        onClick={() => readEntryContent(entry.content, translateTo)}
                      >
                        <SpeakerWaveIcon className="w-6 h-4 text-[#8B3E2F]" />
                      </button>
                    </span>
                    
                    <button 
                      onClick={() => toggleExpand(entry.id)} 
                      className="text-[#8B3E2F] hover:text-[#C84A20] text-sm transition-colors"
                      title={expandedIds.has(entry.id) ? 'show less' : 'expand text'}
                    >
                      {expandedIds.has(entry.id) ? <ChevronUp /> : <MoreHorizontal />}
                    </button>
                  </div>

                  <p className="mt-2 text-[#121A0F] whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {expandedIds.has(entry.id)
                      ? entry.content
                      : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
                  </p>

                  <div className="mt-3 flex justify-between items-center text-[#8B3E2F] text-opacity-80">
                    <span className="flex items-center space-x-2 hover:text-[#C84A20] transition-colors">
                      {entry.thread_id && (
                        <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
                          <button 
                            className="text-[#8B3E2F] hover:text-[#C84A20] transition-colors" 
                            title={entry.thread_title || ''}
                          >
                            <UserGroupIcon className="w-4 h-4" />
                          </button>
                        </Link>
                      )} {''}
                    </span>

                    {entry.city && ( 
                      <Link href={`/dashboard/kiez/${entry.city}`} passHref>
                        <button 
                          title={`View all entries for ${entry.city}`}
                          className="flex items-center space-x-1 hover:text-[#C84A20] transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs">{entry.city}</span>
                        </button>                 
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="p-4 text-[#8B3E2F] text-center">
              Scanning interstellar data streams... Retrieving transmissions...
            </div>
          )}
          
          {!hasMore && (
            <div className="p-4 text-[#8B3E2F] text-center">
              You've reached the edge of known communications! 🚀
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
          // background-color: #E6D6AC;
        }
        ::selection {
          background-color: rgba(200, 74, 32, 0.3);
          color: #121A0F;
        }
      `}</style>
    </div>
  );
};

export default GlobalComp;

// very much beige hintergrund mit türkiser schrift
// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, ChevronUp, Clock, ChevronDown, MapPin } from 'lucide-react';
// import toast from 'react-hot-toast';
// import Link from 'next/link';

// interface Entry {
//   id: string;
//   theme_id: string;
//   theme_name: string;
//   thread_id: string | null;
//   thread_title: string | null;
//   content: string;
//   location: string | null;
//   city: string | null;
//   state: string | null;
//   created_at: string;
// }

// // Colors extracted from the coastal shrine photo
// const themeColors: Record<string, string> = {
//   'morning': 'bg-[#8ECBD6] text-white', // Light turquoise blue
//   'evening': 'bg-[#5B9EAD] text-white', // Medium sea blue
//   'weekly': 'bg-[#D6C6B7] text-[#3D5A66]', // Sandy beige
//   'kiez': 'bg-[#3D5A66] text-white', // Deep sea blue
//   'revelation': 'bg-[#91B3BD] text-white', // Soft blue-gray
//   'story': 'bg-[#E5DED3] text-[#3D5A66]', // Shell white
// };

// const LIMIT = 50;

// const GlobalComp: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [translateTo, setTranslateTo] = useState<string | null>(null);
//   const [showTranslationOptions, setShowTranslationOptions] = useState<boolean>(false);
//   const [offset, setOffset] = useState<number>(0);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

//   const fetchEntries = async (currentOffset: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/entries/get/global?limit=${LIMIT}&offset=${currentOffset}`);
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

//   const toggleExpand = (id: string) => {
//     setExpandedIds(prev => {
//       const newSet = new Set(prev);
//       newSet.has(id) ? newSet.delete(id) : newSet.add(id);
//       return newSet;
//     });
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-[#E5DED3] min-h-screen text-[#3D5A66] relative overflow-hidden">
//       <div className="relative z-10">
//         <div className="sticky top-0 z-20 bg-gradient-to-r from-[#5B9EAD] to-[#8ECBD6] backdrop-blur-sm border-b border-[#91B3BD] shadow-md">
//           <div className="px-6 py-4 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-white flex items-center space-x-3">
//               <span>🌊 Groupoid Ocean <button>🐚</button></span>
//             </h2>

//             <div className="flex space-x-4">
//               <button 
//                 onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//                 className="text-white hover:text-[#E5DED3] transition-colors"
//               >🌍
//               </button>

//               <button
//                 className="flex items-center space-x-2 text-white hover:text-[#E5DED3] transition-colors"
//                 onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//               >
//                 <SpeakerWaveIcon className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {showTranslationOptions && (
//             <div className="p-4 bg-[#91B3BD] rounded-b-lg shadow-md border-t border-[#5B9EAD]">
//               <label className="text-sm font-medium text-white">
//                 Communication Protocol:
//                 <select
//                   className="ml-2 border border-[#5B9EAD] bg-[#8ECBD6] text-white p-1 rounded"
//                   value={translateTo || ''}
//                   onChange={(e) => setTranslateTo(e.target.value || null)}
//                 >
//                   <option value="" className="bg-[#8ECBD6]">Native Comm</option>
//                   <option value="en" className="bg-[#8ECBD6]">Terran English</option>
//                   <option value="de" className="bg-[#8ECBD6]">Ocean German</option>
//                   <option value="es" className="bg-[#8ECBD6]">Coastal Spanish</option>
//                   <option value="fr" className="bg-[#8ECBD6]">Maritime French</option>
//                   <option value="ru" className="bg-[#8ECBD6]">Wave Russian</option>
//                   <option value="zh" className="bg-[#8ECBD6]">Reef Chinese</option>
//                   <option value="hi" className="bg-[#8ECBD6]">Monsoon Hindi</option>
//                   <option value="ar" className="bg-[#8ECBD6]">Tide Arabic</option>
//                   <option value="tr" className="bg-[#8ECBD6]">Current Turkish</option>
//                   <option value="it" className="bg-[#8ECBD6]">Offshore Italian</option>
//                   <option value="pt" className="bg-[#8ECBD6]">Onshore Portuguese</option>
//                 </select>
//               </label>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="p-4 mb-4 text-[#A25B5B] bg-[#F5E6E6] rounded-lg border border-[#D6A3A3]">
//             Transmission Breach: {error}
//           </div>
//         )}

//         <div className="divide-y divide-[#D6C6B7]">
//           {entries.map(entry => (
//             <div 
//               key={entry.id} 
//               id={`entry-${entry.id}`}
//               className="p-4 hover:bg-[#D6C6B7]/30 transition-colors relative group"
//             >
//               <div className="absolute inset-0 bg-[#D6C6B7]/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//               <div className="flex space-x-3 relative z-10">
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
                    
//                     <span className="flex items-center text-xs sm:text-sm text-[#5B9EAD] hover:text-[#3D5A66] transition-colors">
//                       <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                         <button
//                           className={`flex items-center justify-center w-5 h-2 squared-full ${themeColors[entry.theme_name.trim()] || 'bg-[#91B3BD]'} text-xs`} 
//                           title={`View all entries for ${entry.theme_name}`}
//                         >
//                         </button> 
//                       </Link> 
//                       <span className="ml-2">
//                         {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
//                       </span>

//                       <button
//                         className="text-[#5B9EAD] hover:text-[#3D5A66] transition-colors ml-2"
//                         onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
//                         onClick={() => readEntryContent(entry.content, translateTo)}
//                       >
//                         <SpeakerWaveIcon className="w-6 h-4" />
//                       </button>
//                     </span>
                    
//                     <button 
//                       onClick={() => toggleExpand(entry.id)} 
//                       className="text-[#5B9EAD] hover:text-[#3D5A66] text-sm transition-colors"
//                       title={expandedIds.has(entry.id) ? 'show less' : 'expand text'}
//                     >
//                       {expandedIds.has(entry.id) ? <ChevronUp /> : <MoreHorizontal />}
//                     </button>
//                   </div>

//                   <p className="mt-2 text-[#3D5A66] whitespace-pre-wrap text-sm leading-relaxed">
//                     {expandedIds.has(entry.id)
//                       ? entry.content
//                       : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//                   </p>

//                   <div className="mt-3 flex justify-between items-center text-[#5B9EAD]">
//                     <span className="flex items-center space-x-2 hover:text-[#3D5A66] transition-colors">
//                       {entry.thread_id && (
//                         <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
//                           <button 
//                             className="text-[#5B9EAD] hover:text-[#3D5A66] transition-colors" 
//                             title={entry.thread_title || ''}
//                           >
//                             <UserGroupIcon className="w-4 h-4" />
//                           </button>
//                         </Link>
//                       )} {''}
//                     </span>

//                     {entry.city && ( 
//                       <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                         <button 
//                           title={`View all entries for ${entry.city}`}
//                           className="flex items-center space-x-1 hover:text-[#3D5A66] transition-colors"
//                         >
//                           <MapPin className="w-4 h-4" />
//                           <span className="text-xs">{entry.city}</span>
//                         </button>                 
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {loading && (
//             <div className="p-4 text-[#5B9EAD] text-center">
//               Scanning underwater data streams... Retrieving logs...
//             </div>
//           )}
          
//           {!hasMore && (
//             <div className="p-4 text-[#5B9EAD] text-center">
//               You've reached the shore of collective memories! 🌊
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { 
//             transform: translateY(0);
//             opacity: 0.1;
//           }
//           50% { 
//             transform: translateY(-20px);
//             opacity: 0.3;
//           }
//         }
//         body {
//           background-color: #E5DED3;
//         }
//         ::selection {
//           background-color: rgba(142, 203, 214, 0.3);
//           color: #3D5A66;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GlobalComp;


