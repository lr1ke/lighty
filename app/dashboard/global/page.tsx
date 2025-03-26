// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MapPin, BookOpen } from 'lucide-react';
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
//       const res = await fetch(`/api/entries/get/global?limit=50&offset=${currentOffset}`);
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
//       if (data.length < 50) {
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
//         setOffset((prevOffset) => prevOffset + 50);
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
//     <div className="bg-[#E6F2FF] min-h-screen p-4 font-['Courier_New'] text-[#003366]">
//       {/* 90s Inspired Header */}
//       <div className="bg-[#4682B4] text-white p-4 mb-6 shadow-lg border-4 border-[#87CEEB]">
//         <h1 className="text-3xl font-bold flex items-center space-x-4">
//           <BookOpen className="w-10 h-10 text-white" />
//           <span>🌊 Global Ocean Diary 🐚</span>
//         </h1>
        
//         <div className="mt-4 flex space-x-4">
//           <button 
//             onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//             className="bg-[#87CEEB] text-[#003366] px-3 py-1 rounded hover:bg-[#ADD8E6] transition"
//           >
//             <GlobeAltIcon className="w-6 h-6 inline-block mr-2" />
//             Translate
//           </button>
          
//           <button
//             className="bg-[#87CEEB] text-[#003366] px-3 py-1 rounded hover:bg-[#ADD8E6] transition"
//             onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//           >
//             <SpeakerWaveIcon className="w-6 h-6 inline-block mr-2" />
//             Read All
//           </button>
//         </div>

//         {showTranslationOptions && (
//           <div className="mt-4 bg-[#87CEEB] p-4 rounded">
//             <select
//               className="w-full p-2 bg-white text-[#003366]"
//               value={translateTo || ''}
//               onChange={(e) => setTranslateTo(e.target.value || null)}
//             >
//               <option value="">Select Language</option>
//               <option value="en">English</option>
//               <option value="de">German</option>
//               <option value="es">Spanish</option>
//               <option value="fr">French</option>
//             </select>
//           </div>
//         )}
//       </div>

//       {/* Entries Container with 90s Scrollbar and Border */}
//       <div 
//         className="bg-white border-8 border-[#4682B4] p-4 
//         scrollbar-thin scrollbar-thumb-[#4682B4] scrollbar-track-[#87CEEB] 
//         overflow-y-auto max-h-[70vh]"
//       >
//         {entries.map(entry => (
//           <div 
//             key={entry.id}
//             className="mb-4 p-4 border-2 border-[#4682B4] bg-[#F0F8FF] 
//             hover:bg-[#E6F2FF] transition-colors"
//           >
//             {/* Entry Header */}
//             <div className="flex justify-between items-center mb-2">
//               <div className="text-sm text-[#006699]">
//                 {new Date(entry.created_at).toLocaleDateString('en-US', { 
//                   month: 'short', 
//                   day: 'numeric', 
//                   year: 'numeric' 
//                 })}
//               </div>
              
//               <button 
//                 onClick={() => toggleExpand(entry.id)}
//                 className="bg-[#4682B4] text-white px-2 py-1 rounded text-xs"
//               >
//                 {expandedIds.has(entry.id) ? 'Collapse' : 'Expand'}
//               </button>
//             </div>

//             {/* Entry Content */}
//             <div className="text-[#003366] mb-4">
//               {expandedIds.has(entry.id)
//                 ? entry.content
//                 : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//             </div>

//             {/* Entry Footer */}
//             <div className="flex justify-between items-center">
//               {/* Theme Tag */}
//               <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                 <div 
//                   className="bg-[#87CEEB] text-[#003366] px-2 py-1 
//                   rounded-full text-xs font-bold"
//                 >
//                   {entry.theme_name}
//                 </div>
//               </Link>

//               {/* Location */}
//               {entry.city && (
//                 <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                   <div className="flex items-center text-[#006699] text-xs">
//                     <MapPin className="w-4 h-4 mr-1" />
//                     {entry.city}
//                   </div>
//                 </Link>
//               )}
//             </div>
//           </div>
//         ))}

//         {/* Loading and End States */}
//         {loading && (
//           <div className="text-center text-[#4682B4] animate-pulse">
//             Loading more ocean memories...
//           </div>
//         )}

//         {!hasMore && (
//           <div className="text-center text-[#006699] bg-[#E6F2FF] p-4 rounded">
//             You've reached the shore of your memories! 🌊
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GlobalComp;



// 'use client'  with cards and  different pastell background colors for each entry

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin, Feather, BookOpen, Palette, Scissors } from 'lucide-react';
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

// const themeColors: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
//   morning: { 
//     bg: 'bg-amber-50', 
//     text: 'text-amber-800', 
//     icon: <Feather className="w-5 h-5 text-amber-600" /> 
//   },
//   evening: { 
//     bg: 'bg-indigo-50', 
//     text: 'text-indigo-800', 
//     icon: <BookOpen className="w-5 h-5 text-indigo-600" /> 
//   },
//   weekly: { 
//     bg: 'bg-emerald-50', 
//     text: 'text-emerald-800', 
//     icon: <Palette className="w-5 h-5 text-emerald-600" /> 
//   },
//   kiez: { 
//     bg: 'bg-rose-50', 
//     text: 'text-rose-800', 
//     icon: <Scissors className="w-5 h-5 text-rose-600" /> 
//   },
//   revelation: { 
//     bg: 'bg-purple-50', 
//     text: 'text-purple-800', 
//     icon: <SpeakerWaveIcon className="w-5 h-5 text-purple-600" /> 
//   },
//   story: { 
//     bg: 'bg-teal-50', 
//     text: 'text-teal-800', 
//     icon: <UserGroupIcon className="w-5 h-5 text-teal-600" /> 
//   }
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
//     <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6 bg-gradient-to-br from-white via-gray-50 to-blue-50">
//       <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 rounded-t-lg shadow-sm mb-4 sm:mb-6">
//         <div className="px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
//             <BookOpen className="w-7 h-7 text-purple-600" />
//             <span>Global Diary</span>
//           </h2>

//           <div className="flex space-x-4 items-center">
//             <button 
//               onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//               className="text-gray-600 hover:text-purple-600 transition-colors"
//             >
//               <GlobeAltIcon className="w-6 h-6" />
//             </button>

//             <button
//               className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
//               onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//             >
//               <SpeakerWaveIcon className="w-5 h-5" />
//               <span className="text-sm">Read All</span>
//             </button>
//           </div>
//         </div>

//         {showTranslationOptions && (
//           <div className="p-4 bg-purple-50 rounded-b-lg shadow-inner">
//             <label className="text-sm font-medium flex items-center space-x-2">
//               <GlobeAltIcon className="w-5 h-5 text-purple-600" />
//               <span>Translate To:</span>
//               <select
//                 className="ml-2 border p-1 rounded bg-white text-gray-800 shadow-sm"
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

//       <div className="space-y-4">
//         {entries.map(entry => {
//           const themeStyle = themeColors[entry.theme_name] || themeColors.story;
//           return (
//             <div 
//               key={entry.id} 
//               id={`entry-${entry.id}`}
//               className={`p-4 rounded-lg shadow-sm transition-all duration-300 
//                 hover:shadow-md ${themeStyle.bg} border border-transparent 
//                 hover:border-purple-200`}
//             >
//               <div className="flex space-x-4">
//                 {/* Theme Icon */}
//                 <div className="flex-shrink-0">
//                   {themeStyle.icon}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-xs text-gray-500 flex items-center space-x-2">
//                       <span>
//                         {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
//                         {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </span>
                      
//                       {entry.thread_id && (
//                         <Link href={`/dashboard/groups/${entry.thread_id}`} passHref>
//                           <button 
//                             className="text-gray-400 hover:text-purple-600 transition-colors"
//                             title={entry.thread_title || ''}
//                           >
//                             <UserGroupIcon className="w-4 h-4" />
//                           </button>
//                         </Link>
//                       )}
//                     </div>

//                     <button 
//                       onClick={() => toggleExpand(entry.id)} 
//                       className={`text-sm ${themeStyle.text} hover:opacity-75 transition-opacity`}
//                     >
//                       {expandedIds.has(entry.id) ? 'Collapse' : 'Expand'}
//                     </button>
//                   </div>

//                   <div className={`text-sm ${themeStyle.text} whitespace-pre-wrap break-words`}>
//                     {expandedIds.has(entry.id)
//                       ? entry.content
//                       : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//                   </div>

//                   <div className="mt-3 flex justify-between items-center">
//                     <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                       <button
//                         className={`flex items-center space-x-2 px-2 py-1 rounded-full 
//                           ${themeStyle.bg} ${themeStyle.text} text-xs font-medium`}
//                         title={`View all entries for ${entry.theme_name}`}
//                       >
//                         {themeStyle.icon}
//                         <span>{entry.theme_name}</span>
//                       </button>
//                     </Link>

//                     {entry.city && ( 
//                       <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 hover:text-purple-600 transition-colors"
//                           title={`View all entries for ${entry.city}`}
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
//           );
//         })}
        
//         {loading && (
//           <div className="p-4 text-center bg-purple-50 rounded-lg">
//             <span className="text-purple-600 animate-pulse">Loading more entries...</span>
//           </div>
//         )}
        
//         {!hasMore && (
//           <div className="p-4 text-center bg-gray-100 rounded-lg text-gray-500">
//             You've reached the end of your diary entries
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GlobalComp;





// 'use client'

// import React, { useEffect, useState } from 'react';
// import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
// import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
// import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
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
//   morning: 'bg-coral-100 text-coral-800',
//   evening: 'bg-gray-200 text-gray-800',
//   weekly: 'bg-gray-300 text-gray-900',
//   kiez: 'bg-coral-200 text-coral-900',
//   revelation: 'bg-gray-100 text-gray-900',
//   story: 'bg-coral-50 text-coral-900',
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
//     <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6  text-gray-900">
//       <div className=" z-10 bg-black/5 border-b border-gray-200 rounded-t-lg shadow-sm mb-4 sm:mb-6">
//         <div className="px-3 sm:px-6 py-3 sm:py-4">
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🌍 Global Diary</h2>

//           <div className="flex space-x-4 items-center">
//             <button 
//               onClick={() => setShowTranslationOptions(!showTranslationOptions)}
//               className="text-gray-600 hover:text-coral-600 transition-colors"
//             >
//               <GlobeAltIcon className="w-6 h-6" />
//             </button>

//             <button
//               className="flex items-center space-x-2 text-gray-600 hover:text-coral-600 transition-colors"
//               onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
//             >
//               <SpeakerWaveIcon className="w-5 h-5" />
//               <span className="text-sm">Read All</span>
//             </button>
//           </div>
//         </div>

//         {showTranslationOptions && (
//           <div className="p-4 bg-gray-100 rounded shadow-md">
//             <label className="text-sm font-medium">
//               Translate To:
//               <select
//                 className="ml-2 border p-1 rounded bg-white text-gray-800"
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
//           <div 
//             key={entry.id} 
//             id={`entry-${entry.id}`}
//             className="p-4 hover:bg-gray-100 transition-colors group"
//           >
//             <div className="flex space-x-2 sm:space-x-4">
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs sm:text-sm text-gray-500">
//                     {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
//                     {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {''}
                    
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
                    
//                     <button
//                       className="text-gray-400 hover:text-coral-600 transition-colors"
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
//                     {expandedIds.has(entry.id) ? '<' : '>'}
//                   </button>
//                 </div>
                
//                 <div className="mt-3 text-sm sm:text-base text-gray-800 whitespace-pre-wrap break-words">
//                   {expandedIds.has(entry.id)
//                     ? entry.content
//                     : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
//                 </div>

//                 <div className="mt-3 flex justify-between items-center text-gray-500">
//                   <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
//                     <button
//                       className={`text-xs font-medium px-2 py-1 rounded ${themeColors[entry.theme_name] || 'bg-gray-200 text-gray-700'}`}
//                       title={`View all entries for ${entry.theme_name}`}
//                     >
//                       {entry.theme_name}
//                     </button>
//                   </Link>

//                   {entry.city && ( 
//                     <Link href={`/dashboard/kiez/${entry.city}`} passHref>
//                       <button 
//                         className="flex items-center space-x-1 hover:text-coral-600 transition-colors"
//                         title={`View all entries for ${entry.city}`}
//                       >
//                         <MapPin className="w-4 h-4" />
//                         <span className="text-xs">{entry.city}</span>
//                       </button>                 
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {loading && (
//           <div className="p-4 text-gray-500 text-center">
//             Loading more entries...
//           </div>
//         )}
        
//         {!hasMore && (
//           <div className="p-4 text-gray-500 text-center">
//             You've reached the end.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GlobalComp;





'use client'

import React, { useEffect, useState } from 'react';
import { SpeakerWaveIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { readEntryContent, handleMouseEnter } from '@/utils/textToSpeech';
import { MoreHorizontal, Clock, MapPin } from 'lucide-react';
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
    morning: 'bg-yellow-300',
    evening: 'bg-blue-300',
    weekly: 'bg-red-300',
    kiez: 'bg-purple-300',
    revelation: 'bg-pink-300',
    story: 'bg-orange-300',
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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6  ">
    <div className=" top-0 z-10 bg-gradient-to-b from-blue-50 to-gray-50 border-b border-blue-100 rounded-t-lg shadow-sm mb-4 sm:mb-6">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">🌍 Global  </h2>

          <div className="flex space-x-4">
            <button onClick={() => setShowTranslationOptions(!showTranslationOptions)}>
              <GlobeAltIcon className="w-6 h-6 hover:text-blue-500" />
            </button>

            <button
              className="flex items-center space-x-2 hover:text-red-500"
              onClick={() => readEntryContent(entries.map(e => e.content).join('. '), translateTo)}
            >
              <SpeakerWaveIcon className="w-5 h-5 text-blue-300" />
              <span>Read All</span>
            </button>
          </div>
        </div>

        {showTranslationOptions && (
          <div className="p-4 bg-gray-100 rounded shadow-md">
            <label>
              <span className="text-sm font-medium">Translate To:</span>
              <select
                className="ml-2 border p-1 rounded"
                value={translateTo || ''}
                onChange={(e) => setTranslateTo(e.target.value || null)}
              >
                <option value="">None</option>
                <option value="en">English</option>
                <option value="de">German</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
                <option value="tr">Turkish</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {entries.map(entry => (

           <div key={entry.id} 
           id={`entry-${entry.id}`}
            className="p-4 hover:bg-blue-40 transition-colors">
                            <div className="flex space-x-2 sm:space-x-4">
                            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                                   {/* Darstellung von Themen */}

                    {/* Darstellung der Zeit, über */}
                <span className="text-xs sm:text-ms text-gray-400">
                    {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {''}
                    {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {''}
                    
                    {/* <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                  <button
                        className={`w-4 h-4 squared-full text-gray-500 text-sm ${themeColors[entry.theme_name] || 'bg-gray-300'}`}
                        title={`View all entries for ${entry.theme_name}`}>
                       <span className={`text-xs text-gray-600 ${themeColors[entry.theme_name] || 'text-gray-500'}`}>
                          {entry.theme_name}
                        </span>                        
                        </button>      
                </Link>   */}

                    {/* Klick nach Gruppe */}
                    {entry.thread_id && (
                    <Link href={`/dashboard/groups/${entry.thread_id}`} passHref> 
                 
                    <button className="text-gray-400 text-sm" 
                    title={entry.thread_title? entry.thread_title : ''}
                   
                    >
                        <UserGroupIcon className="w-4 h-4" />
                    </button>
                    </Link>
                  )} {''}
                                      {/* Knopf für Stimme */}
                <button
                    className="text-gray-400 text-sm hover:text-red-500"
                    onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                    onClick={() => readEntryContent(entry.content, translateTo)}
                  >
                    <SpeakerWaveIcon className="w-6 h-4 text-blue-300" />
                  </button>
                  
                  </span>
                  {/* <span className="flex items-center space-x-2 hover:text-blue-500 text-xs sm:text-xs" title={new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}>
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> 
                  </span> */}
                  {/* {entry.thread_id && (
                    <button className="text-blue-500 text-sm" title={`View thread: ${entry.theme_name}`}>
                      {entry.theme_name}
                    </button>
                  )} */}

                                    {/* symbol für gruppe */}
                    {/* {entry.thread_id && (
                    <button className="text-gray-400 text-sm" 
                    title={entry.thread_title? entry.thread_title : ''}
                    >
                        <UserGroupIcon className="w-4 h-4" />
                    </button>
                  )} */}

                  {/* Darstellung von größer als, kleiner als, über */}

                  
                  <button onClick={() => toggleExpand(entry.id)} className="text-blue-500 text-sm"
                  title={expandedIds.has(entry.id) ? 'show less' : 'expand text '}
                  >
                    {expandedIds.has(entry.id) ? '<' : '>'}
                  </button>

                  {/* Darstellung des Inhalts */}
                </div>
                <div className="mt-3 text-sm sm:text-base text-gray-800 whitespace-pre-wrap break-words">
                {expandedIds.has(entry.id)
                    ? entry.content
                    : entry.content.slice(0, 280) + (entry.content.length > 280 ? '...' : '')}
                </div>

                    {/* Unter Zeile   */}
                <div className="mt-3 flex justify-between items-center text-gray-500">
                {/* Darstellung von Themen */}
                <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                  <button
                        className={`w-4 h-4 squared-full text-gray-500 text-sm ${themeColors[entry.theme_name] || 'bg-gray-300'}`}
                        title={`View all entries for ${entry.theme_name}`}>
                       <span className={`text-xs text-gray-600 ${themeColors[entry.theme_name] || 'text-gray-500'}`}>
                          {entry.theme_name}
                        </span>                        
                        </button>      
                </Link>  
                                {/* <Link href={`/dashboard/themes/${entry.theme_id}`} passHref>
                  <button
                        className={`w-4 h-4 squared-full text-xs text-gray-600 ${themeColors[entry.theme_name] || 'bg-gray-300'}`}
                        title={`View all entries for ${entry.theme_name}`}>
                        {entry.theme_name}
                        </button>
                </Link>  */}

                    {/* Knopf für Stimme
                <button
                    className="flex items-center space-x-2 hover:text-red-500"
                    onMouseEnter={() => handleMouseEnter(entry.content, translateTo)}
                    onClick={() => readEntryContent(entry.content, translateTo)}
                  >
                    <SpeakerWaveIcon className="w-5 h-5 text-blue-300" />
                  </button> */}


                  {/* Knopf dynamisch nach Stadt */}
                  {entry.city && ( 
                  <Link href={`/dashboard/kiez/${entry.city}`} passHref>
                    <button title={`View all entries for ${entry.city}`}>
                      <span className="flex items-center space-x-1 hover:text-blue-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{entry.city}</span>
                      </span>   
                    </button>                 
                  </Link>
                  )}

      
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="p-4 text-gray-500">Loading more entries...</div>}
        {!hasMore && <div className="p-4 text-gray-500 text-center">You've reached the end.</div>}
      </div>
    </div>
  );
};

export default GlobalComp;
