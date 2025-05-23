


// import React, { useState, useEffect, FC } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import useVoiceRecorder from '@/utils/useVoiceRecorder';
// import { transcribeAudio } from '@/utils/transcribeAudio';
// import { translateText } from '@/utils/translate';
// import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';
// import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';


// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Prompt {
//   title: string;
//   content: string;
//   themeKey: string;
// }

// interface Theme {
//   id: string;
//   name: string;
// }

// interface PromptCardProps {
//   title: string;
//   content: string;
//   isActive: boolean;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
//   onSelect: () => void;
// }

// const friendlyThemeNames: { [key: string]: string } = {
//   morning: "Morning (De)brief",
//   evening: "Evening Reflection",
//   weekly: "Weekly Insights",
//   kiez: "Kiez Diary",
//   revelation: "Spontaneous Revelation",
//   story: "Storytelling",
// };

// const themeOrder = ["morning", "evening", "weekly", "kiez", "revelation", "story"];


// const PromptCard: FC<PromptCardProps> = ({ title, content, isActive, onNext, onPrev, isFirst, isLast, onSelect }) => (
//   <div className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
//     <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//       <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
//       <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line mb-4">{content}</p>
//       <div className="flex justify-between items-center">
//         <button
//           onClick={onPrev}
//           className={`p-2 rounded-full ${isFirst ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'}`}
//           disabled={isFirst}
//         >
//           <ChevronLeft className="w-5 h-5 text-gray-600" />
//         </button>
//         <button
//           onClick={onSelect}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Select
//         </button>
//         <button
//           onClick={onNext}
//           className={`p-2 rounded-full ${isLast ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'}`}
//           disabled={isLast}
//         >
//           <ChevronRight className="w-5 h-5 text-gray-600" />
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const prompts: Prompt[] = [
//   {
//     title: "Morning (De)brief",
//     content: "What's top of mind?\nHow am I feeling?\nWhat am I excited about?",
//     themeKey: "morning",
//   },
//   {
//     title: "Evening Reflection",
//     content: "What did I accomplish?\nWhat did I learn?\nOne little win, one challenge, one grateful moment.",
//     themeKey: "evening",
//   },
//   {
//     title: "Weekly Insights",
//     content: "What gave me energy?\nWhat drained me?\nWhat could I have said no to?",
//     themeKey: "weekly",
//   },
//   {
//     title: "Kiez Diary",
//     content: "What makes me feel aligned or misaligned with the place I'm currently in?",
//     themeKey: "kiez",
//   },
//   {
//     title: "Spontaneous Revelation",
//     content: "Save what feels like a sudden flash of insight.",
//     themeKey: "revelation",
//   },
//   {
//     title: "Storytelling",
//     content: "Whenever in doubt I tell a story.",
//     themeKey: "story",
//   },
// ];

// const CreateComp: FC = () => {
//   const [content, setContent] = useState<string>('');
//   const [themeId, setThemeId] = useState<string>('');
//   const [themes, setThemes] = useState<Theme[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [activeCard, setActiveCard] = useState<number>(0);
//   const [isTranslating, setIsTranslating] = useState<boolean>(false);
//   const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

//   const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

//   useEffect(() => {
//     const fetchThemes = async () => {
//       try {
//         const res = await fetch('/api/themes');
//         const data: { themes: Theme[] } = await res.json();
//         setThemes(data.themes);
//       } catch (err) {
//         console.error('Failed to fetch themes', err);
//       }
//     };
//     fetchThemes();
//   }, []);

//   useEffect(() => {
//     if (audioBlob) {
//       handleTranscription();
//     }
//   }, [audioBlob]);


//   const handlePromptSelect = (themeKey: string) => {
//     const selectedTheme = themes.find(t => t.name === themeKey);
//     if (selectedTheme) {
//       setThemeId(selectedTheme.id);
//       setActiveCard(prompts.findIndex(p => p.themeKey === themeKey));
//     }
//   };

//   const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = e.target.value;
//     setThemeId(selectedId);
//     const theme = themes.find(t => t.id === selectedId);
//     if (theme) {
//       const promptIndex = prompts.findIndex(p => p.themeKey === theme.name);
//       if (promptIndex !== -1) {
//         setActiveCard(promptIndex);
//       }
//     }
//   };

//   const handleTranscription = async (): Promise<void> => {
//     if (!audioBlob) return;
//     setIsTranscribing(true);
//     const text = await transcribeAudio(audioBlob);
//     setIsTranscribing(false);
//     if (text) setContent((prev) => prev + ' ' + text);
//   };

//   const handleTranslation = async (): Promise<void> => {
//     if (!content.trim()) return;
//     setIsTranslating(true);
//     const translatedText = await translateText(content);
//     if (translatedText) setContent(translatedText);
//     setIsTranslating(false);
//   };

//   // const getLocation = async (): Promise<string> => {
//   //   return new Promise((resolve, reject) => {
//   //     if (!navigator.geolocation) {
//   //       toast.error('Geolocation is not supported by your browser');
//   //       return reject('Geolocation not supported');
//   //     }
//   //     navigator.geolocation.getCurrentPosition(
//   //       async (position) => {
//   //         try {
//   //           const { latitude, longitude } = position.coords;
//   //           const response = await fetch(
//   //             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//   //           );
//   //           const data = await response.json();
//   //           const locationString: string = data.address.city ||
//   //             data.address.town ||
//   //             data.address.village ||
//   //             data.address.suburb ||
//   //             data.address.municipality ||
//   //             `${latitude}, ${longitude}`;
//   //           resolve(locationString);
//   //         } catch (err) {
//   //           console.error('Location fetch error:', err);
//   //           reject(err);
//   //         }
//   //       },
//   //       (error) => {
//   //         toast.error('Unable to retrieve your location');
//   //         reject(error);
//   //       }
//   //     );
//   //   });
//   // };

//   const getLocation = (): Promise<Coordinates | null> => {
//     return new Promise((resolve) => {
//       if (!navigator.geolocation) {
//         resolve(null);
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => resolve(null)
//       );
//     });
//   };


//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!content.trim() || !themeId) {
//       setError('Please select a theme and write some content.');
//       toast.error('Please select a theme and write some content.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     try {
//       // const coords = await getLocation();
//       const finalLocation = await getLocation();

//       const res = await fetch('/api/entries/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content,
//           theme_id: themeId,
//           location: finalLocation,
//         }),
//       });
//       const result: { message?: string; error?: string } = await res.json();
//       if (!res.ok) {
//         setError(result.error || 'Error creating entry');
//         toast.error(result.error || 'Error creating entry');
//       } else {
//         setContent('');
//         setThemeId('');
//         toast.success(result.message || 'Entry created successfully');
//       }
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : 'Unknown error occurred';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };



//   return (
//     <main className="min-h-screen bg-gray-50 py-8">
//       <div className="w-full max-w-7xl mx-auto">
//         <div className="w-full max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 order-2 lg:order-1">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                 <select
//                   value={themeId}
//                   onChange={handleThemeChange}
//                   className="w-full mb-4 p-2 rounded border border-gray-300"
//                 >
//                   <option value="">Select a Theme</option>
//                   {themeOrder.map((key) => {
//                     const theme = themes.find((t) => t.name === key);
//                     return theme ? (
//                       <option key={theme.id} value={theme.id}>
//                         {friendlyThemeNames[theme.name] || theme.name}
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//         <form onSubmit={handleSubmit}>
//         <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Start writing or use voice input..."
//         className="w-full min-h-[400px] p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none"
//         />

//         <div className="flex items-center space-x-4 mt-4">
//         <button
//           className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
//           onClick={() => (isRecording ? stopRecording() : startRecording())}
//           type="button"
//         >
//           {isRecording ? (
//             <StopIcon className="w-6 h-6" />
//           ) : isTranscribing ? (
//             <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
//           ) : (
//             <MicrophoneIcon className="w-6 h-6" />
//           )}
//         </button>

//         <button
//           type="button"
//           disabled={!content.trim() || isTranslating}
//           className="p-3 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-all relative group"
//           onClick={handleTranslation}
//         >
//           <GlobeAltIcon className="w-6 h-6" />
//           <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md group-hover:block">
//             {isTranslating ? 'Translating...' : 'Translate to English'}
//           </span>
//         </button>

//         <button
//           type="submit"
//           disabled={loading || !content.trim()}
//           className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
//         >
//           {loading ? 'Saving...' : 'Save Entry'}
//         </button>
//         </div>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//         </form>
//         </div>
//         </div>

//         <div className="lg:col-span-1 order-1 lg:order-2">
//               <div className="relative h-[300px] lg:h-auto">
//                 {prompts.map((prompt, index) => (
//                   <div
//                     key={index}
//                     className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
//                       activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
//                     }`}
//                   >
//                     <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">{prompt.title}</h3>
//                       <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line mb-4">{prompt.content}</p>
//                       <div className="flex justify-between items-center">
//                         <button
//                           onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
//                           className={`p-2 rounded-full ${
//                             index === 0 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'
//                           }`}
//                           disabled={index === 0}
//                         >
//                           <ChevronLeft className="w-5 h-5 text-gray-600" />
//                         </button>
//                         <button
//                           onClick={() => handlePromptSelect(prompt.themeKey)}
//                           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         >
//                           Select
//                         </button>
//                         <button
//                           onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
//                           className={`p-2 rounded-full ${
//                             index === prompts.length - 1 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'
//                           }`}
//                           disabled={index === prompts.length - 1}
//                         >
//                           <ChevronRight className="w-5 h-5 text-gray-600" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//         </div>
//         </div>
//         </div>
//         </main>
//         );
//         };

// export default CreateComp;

// import React, { useState, useEffect, FC } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import useVoiceRecorder from '@/utils/useVoiceRecorder';
// import { transcribeAudio } from '@/utils/transcribeAudio';
// import { translateText } from '@/utils/translate';
// import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';
// import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Prompt {
//   title: string;
//   content: string;
//   themeKey: string;
// }

// interface Theme {
//   id: string;
//   name: string;
// }

// interface PromptCardProps {
//   title: string;
//   content: string;
//   isActive: boolean;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
//   onSelect: () => void;
// }

// const friendlyThemeNames: { [key: string]: string } = {
//   morning: "Morning (De)brief",
//   evening: "Evening Reflection",
//   weekly: "Weekly Insights",
//   kiez: "Kiez Diary",
//   revelation: "Spontaneous Revelation",
//   story: "Storytelling",
// };

// const themeOrder = ["morning", "evening", "weekly", "kiez", "revelation", "story"];

// const themeColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C]',
//   evening: 'bg-[#C84A20]',
//   weekly: 'bg-[#E6D6AC]',
//   kiez: 'bg-[#C9A648]',
//   revelation: 'bg-[#8B3E2F]',
//   story: 'bg-[#D98E73]',
// };

// const PromptCard: FC<PromptCardProps> = ({ title, content, isActive, onNext, onPrev, isFirst, isLast, onSelect }) => (
//   <div className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
//     <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//       <h3 className="text-lg font-medium text-[#8B3E2F] mb-2">{title}</h3>
//       <p className="text-sm text-[#121A0F] leading-relaxed whitespace-pre-line mb-4">{content}</p>
//       <div className="flex justify-between items-center">
//         <button
//           onClick={onPrev}
//           className={`p-2 rounded-full ${isFirst ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'}`}
//           disabled={isFirst}
//         >
//           <ChevronLeft className="w-5 h-5 text-[#8B3E2F]" />
//         </button>
//         <button
//           onClick={onSelect}
//           className="px-4 py-2 bg-[#C84A20] text-white rounded hover:bg-[#8B3E2F] transition-colors"
//         >
//           Select
//         </button>
//         <button
//           onClick={onNext}
//           className={`p-2 rounded-full ${isLast ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'}`}
//           disabled={isLast}
//         >
//           <ChevronRight className="w-5 h-5 text-[#8B3E2F]" />
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const prompts: Prompt[] = [
//   {
//     title: "Morning (De)brief",
//     content: "What's top of mind?\nHow am I feeling?\nWhat am I excited about?",
//     themeKey: "morning",
//   },
//   {
//     title: "Evening Reflection",
//     content: "What did I accomplish?\nWhat did I learn?\nOne little win, one challenge, one grateful moment.",
//     themeKey: "evening",
//   },
//   {
//     title: "Weekly Insights",
//     content: "What gave me energy?\nWhat drained me?\nWhat could I have said no to?",
//     themeKey: "weekly",
//   },
//   {
//     title: "Kiez Diary",
//     content: "What makes me feel aligned or misaligned with the place I'm currently in?",
//     themeKey: "kiez",
//   },
//   {
//     title: "Spontaneous Revelation",
//     content: "Save what feels like a sudden flash of insight.",
//     themeKey: "revelation",
//   },
//   {
//     title: "Storytelling",
//     content: "Whenever in doubt I tell a story.",
//     themeKey: "story",
//   },
// ];

// const CreateComp: FC = () => {
//   const [content, setContent] = useState<string>('');
//   const [themeId, setThemeId] = useState<string>('');
//   const [themes, setThemes] = useState<Theme[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [activeCard, setActiveCard] = useState<number>(0);
//   const [isTranslating, setIsTranslating] = useState<boolean>(false);
//   const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

//   const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

//   useEffect(() => {
//     const fetchThemes = async () => {
//       try {
//         const res = await fetch('/api/themes');
//         const data: { themes: Theme[] } = await res.json();
//         setThemes(data.themes);
//       } catch (err) {
//         console.error('Failed to fetch themes', err);
//       }
//     };
//     fetchThemes();
//   }, []);

//   useEffect(() => {
//     if (audioBlob) {
//       handleTranscription();
//     }
//   }, [audioBlob]);

//   const handlePromptSelect = (themeKey: string) => {
//     const selectedTheme = themes.find(t => t.name === themeKey);
//     if (selectedTheme) {
//       setThemeId(selectedTheme.id);
//       setActiveCard(prompts.findIndex(p => p.themeKey === themeKey));
//     }
//   };

//   const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = e.target.value;
//     setThemeId(selectedId);
//     const theme = themes.find(t => t.id === selectedId);
//     if (theme) {
//       const promptIndex = prompts.findIndex(p => p.themeKey === theme.name);
//       if (promptIndex !== -1) {
//         setActiveCard(promptIndex);
//       }
//     }
//   };

  // const handleTranscription = async (): Promise<void> => {
  //   if (!audioBlob) return;
  //   setIsTranscribing(true);
  //   const text = await transcribeAudio(audioBlob);
  //   setIsTranscribing(false);
  //   if (text) setContent((prev) => prev + ' ' + text);
  // };

  // const handleTranslation = async (): Promise<void> => {
  //   if (!content.trim()) return;
  //   setIsTranslating(true);
  //   const translatedText = await translateText(content);
  //   if (translatedText) setContent(translatedText);
  //   setIsTranslating(false);
  // };

  // const getLocation = (): Promise<Coordinates | null> => {
  //   return new Promise((resolve) => {
  //     if (!navigator.geolocation) {
  //       resolve(null);
  //       return;
  //     }
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => {
  //         resolve({
  //           latitude: pos.coords.latitude,
  //           longitude: pos.coords.longitude,
  //         });
  //       },
  //       () => resolve(null)
  //     );
  //   });
  // };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!content.trim() || !themeId) {
//       setError('Please select a theme and write some content.');
//       toast.error('Please select a theme and write some content.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     try {
//       const finalLocation = await getLocation();

//       const res = await fetch('/api/entries/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content,
//           theme_id: themeId,
//           location: finalLocation,
//         }),
//       });
//       const result: { message?: string; error?: string } = await res.json();
//       if (!res.ok) {
//         setError(result.error || 'Error creating entry');
//         toast.error(result.error || 'Error creating entry');
//       } else {
//         setContent('');
//         setThemeId('');
//         toast.success(result.message || 'Entry created successfully');
//       }
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : 'Unknown error occurred';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-white py-8">
//       <div className="w-full max-w-7xl mx-auto">
//         <div className="w-full max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 order-2 lg:order-1">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//                 <select
//                   value={themeId}
//                   onChange={handleThemeChange}
//                   className="w-full mb-4 p-2 rounded border border-[#C9A648] bg-white text-[#121A0F] focus:outline-none focus:ring-2 focus:ring-[#E9B44C]"
//                 >
//                   <option value="">Select a Theme</option>
//                   {themeOrder.map((key) => {
//                     const theme = themes.find((t) => t.name === key);
//                     return theme ? (
//                       <option key={theme.id} value={theme.id}>
//                         {friendlyThemeNames[theme.name] || theme.name}
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder="Start writing or use voice input..."
//                     className="w-full min-h-[400px] p-4 rounded-lg border border-[#C9A648] focus:outline-none focus:ring-2 focus:ring-[#E9B44C] transition-all resize-none text-[#121A0F]"
//                   />

//                   <div className="flex items-center space-x-4 mt-4">
//                     <button
//                       className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-[#C84A20]' : 'bg-[#8B3E2F] hover:bg-[#C84A20]'}`}
//                       onClick={() => (isRecording ? stopRecording() : startRecording())}
//                       type="button"
//                     >
//                       {isRecording ? (
//                         <StopIcon className="w-6 h-6" />
//                       ) : isTranscribing ? (
//                         <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
//                       ) : (
//                         <MicrophoneIcon className="w-6 h-6" />
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       disabled={!content.trim() || isTranslating}
//                       className="p-3 rounded-full bg-[#E9B44C] text-white hover:bg-[#C9A648] transition-all relative group"
//                       onClick={handleTranslation}
//                     >
//                       <GlobeAltIcon className="w-6 h-6" />
//                       <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-[#121A0F] rounded shadow-md group-hover:block">
//                         {isTranslating ? 'Translating...' : 'Translate to English'}
//                       </span>
//                     </button>

//                     <button
//                       type="submit"
//                       disabled={loading || !content.trim()}
//                       className="px-4 py-2 bg-[#C84A20] text-white rounded-lg hover:bg-[#8B3E2F] transition-all"
//                     >
//                       {loading ? 'Saving...' : 'Save Entry'}
//                     </button>
//                   </div>
//                   {error && <p className="text-[#C84A20] mt-2">{error}</p>}
//                 </form>
//               </div>
//             </div>

//             <div className="lg:col-span-1 order-1 lg:order-2">
//               <div className="relative h-[300px] lg:h-auto">
//                 {prompts.map((prompt, index) => (
//                   <div
//                     key={index}
//                     className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
//                       activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
//                     }`}
//                   >
//                     <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//                       <h3 className="text-lg font-medium text-[#8B3E2F] mb-2">{prompt.title}</h3>
//                       <p className="text-sm text-[#121A0F] leading-relaxed whitespace-pre-line mb-4">{prompt.content}</p>
//                       <div className="flex justify-between items-center">
//                         <button
//                           onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
//                           className={`p-2 rounded-full ${
//                             index === 0 ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'
//                           }`}
//                           disabled={index === 0}
//                         >
//                           <ChevronLeft className="w-5 h-5 text-[#8B3E2F]" />
//                         </button>
//                         <button
//                           onClick={() => handlePromptSelect(prompt.themeKey)}
//                           className="px-4 py-2 bg-[#C84A20] text-white rounded hover:bg-[#8B3E2F] transition-colors"
//                         >
//                           Select
//                         </button>
//                         <button
//                           onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
//                           className={`p-2 rounded-full ${
//                             index === prompts.length - 1 ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'
//                           }`}
//                           disabled={index === prompts.length - 1}
//                         >
//                           <ChevronRight className="w-5 h-5 text-[#8B3E2F]" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <style jsx global>{`
//         ::selection {
//           background-color: rgba(200, 74, 32, 0.3);
//           color: #121A0F;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default CreateComp;


// import React, { useState, useEffect, FC } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import useVoiceRecorder from '@/utils/useVoiceRecorder';
// import { transcribeAudio } from '@/utils/transcribeAudio';
// import { translateText } from '@/utils/translate';
// import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';
// import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Prompt {
//   title: string;
//   content: string;
//   themeKey: string;
// }

// interface Theme {
//   id: string;
//   name: string;
// }

// interface PromptCardProps {
//   title: string;
//   content: string;
//   isActive: boolean;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
//   onSelect: () => void;
//   themeKey: string;
// }

// const friendlyThemeNames: { [key: string]: string } = {
//   morning: "Morning (De)brief",
//   evening: "Evening Reflection",
//   weekly: "Weekly Insights",
//   kiez: "Kiez Diary",
//   revelation: "Spontaneous Revelation",
//   story: "Storytelling",
// };

// const themeOrder = ["morning", "evening", "weekly", "kiez", "revelation", "story"];

// const themeColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C]',
//   evening: 'bg-[#C84A20]',
//   weekly: 'bg-[#E6D6AC]',
//   kiez: 'bg-[#C9A648]',
//   revelation: 'bg-[#8B3E2F]',
//   story: 'bg-[#D98E73]',
// };

// const themeButtonColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C] hover:bg-[#C9A648]',
//   evening: 'bg-[#C84A20] hover:bg-[#8B3E2F]',
//   weekly: 'bg-[#E6D6AC] hover:bg-[#C9A648]',
//   kiez: 'bg-[#C9A648] hover:bg-[#E9B44C]',
//   revelation: 'bg-[#8B3E2F] hover:bg-[#C84A20]',
//   story: 'bg-[#D98E73] hover:bg-[#C84A20]',
// };

// const PromptCard: FC<PromptCardProps> = ({ title, content, isActive, onNext, onPrev, isFirst, isLast, onSelect, themeKey }) => (
//   <div className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
//     <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//       <h3 className="text-lg font-medium text-[#8B3E2F] mb-2">{title}</h3>
//       <p className="text-sm text-[#121A0F] leading-relaxed whitespace-pre-line mb-4">{content}</p>
//       <div className="flex justify-between items-center">
//         <button
//           onClick={onPrev}
//           className={`p-2 rounded-full ${isFirst ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'}`}
//           disabled={isFirst}
//         >
//           <ChevronLeft className="w-5 h-5 text-[#8B3E2F]" />
//         </button>
//         <button
//           onClick={onSelect}
//           className={`px-4 py-2 text-white rounded transition-colors ${themeButtonColors[themeKey] || 'bg-[#C84A20] hover:bg-[#8B3E2F]'}`}
//         >
//           Select
//         </button>
//         <button
//           onClick={onNext}
//           className={`p-2 rounded-full ${isLast ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'}`}
//           disabled={isLast}
//         >
//           <ChevronRight className="w-5 h-5 text-[#8B3E2F]" />
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const prompts: Prompt[] = [
//   {
//     title: "Morning (De)brief",
//     content: "What's top of mind?\nHow am I feeling?\nWhat am I excited about?",
//     themeKey: "morning",
//   },
//   {
//     title: "Evening Reflection",
//     content: "What did I accomplish?\nWhat did I learn?\nOne little win, one challenge, one grateful moment.",
//     themeKey: "evening",
//   },
//   {
//     title: "Weekly Insights",
//     content: "What gave me energy?\nWhat drained me?\nWhat could I have said no to?",
//     themeKey: "weekly",
//   },
//   {
//     title: "Kiez Diary",
//     content: "What makes me feel aligned or misaligned with the place I'm currently in?",
//     themeKey: "kiez",
//   },
//   {
//     title: "Spontaneous Revelation",
//     content: "Save what feels like a sudden flash of insight.",
//     themeKey: "revelation",
//   },
//   {
//     title: "Storytelling",
//     content: "Whenever in doubt I tell a story.",
//     themeKey: "story",
//   },
// ];

// const CreateComp: FC = () => {
//   const [content, setContent] = useState<string>('');
//   const [themeId, setThemeId] = useState<string>('');
//   const [themes, setThemes] = useState<Theme[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [activeCard, setActiveCard] = useState<number>(0);
//   const [isTranslating, setIsTranslating] = useState<boolean>(false);
//   const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
//   const [selectedThemeName, setSelectedThemeName] = useState<string>('');

//   const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

//   useEffect(() => {
//     const fetchThemes = async () => {
//       try {
//         const res = await fetch('/api/themes');
//         const data: { themes: Theme[] } = await res.json();
//         setThemes(data.themes);
//       } catch (err) {
//         console.error('Failed to fetch themes', err);
//       }
//     };
//     fetchThemes();
//   }, []);

//   useEffect(() => {
//     if (audioBlob) {
//       handleTranscription();
//     }
//   }, [audioBlob]);

//   useEffect(() => {
//     // Update selected theme name when theme ID changes
//     if (themeId) {
//       const theme = themes.find(t => t.id === themeId);
//       if (theme) {
//         setSelectedThemeName(theme.name);
//       }
//     } else {
//       setSelectedThemeName('');
//     }
//   }, [themeId, themes]);

//   const handlePromptSelect = (themeKey: string) => {
//     const selectedTheme = themes.find(t => t.name === themeKey);
//     if (selectedTheme) {
//       setThemeId(selectedTheme.id);
//       setSelectedThemeName(themeKey);
//       setActiveCard(prompts.findIndex(p => p.themeKey === themeKey));
//     }
//   };

//   const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = e.target.value;
//     setThemeId(selectedId);
//     const theme = themes.find(t => t.id === selectedId);
//     if (theme) {
//       setSelectedThemeName(theme.name);
//       const promptIndex = prompts.findIndex(p => p.themeKey === theme.name);
//       if (promptIndex !== -1) {
//         setActiveCard(promptIndex);
//       }
//     } else {
//       setSelectedThemeName('');
//     }
//   };

//   const handleTranscription = async (): Promise<void> => {
//     if (!audioBlob) return;
//     setIsTranscribing(true);
//     const text = await transcribeAudio(audioBlob);
//     setIsTranscribing(false);
//     if (text) setContent((prev) => prev + ' ' + text);
//   };

//   const handleTranslation = async (): Promise<void> => {
//     if (!content.trim()) return;
//     setIsTranslating(true);
//     const translatedText = await translateText(content);
//     if (translatedText) setContent(translatedText);
//     setIsTranslating(false);
//   };

//   const getLocation = (): Promise<Coordinates | null> => {
//     return new Promise((resolve) => {
//       if (!navigator.geolocation) {
//         resolve(null);
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve({
//             latitude: pos.coords.latitude,
//             longitude: pos.coords.longitude,
//           });
//         },
//         () => resolve(null)
//       );
//     });
//   };


//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     if (!content.trim() || !themeId) {
//       setError('Please select a theme and write some content.');
//       toast.error('Please select a theme and write some content.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     try {
//       const finalLocation = await getLocation();

//       const res = await fetch('/api/entries/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content,
//           theme_id: themeId,
//           location: finalLocation,
//         }),
//       });
//       const result: { message?: string; error?: string } = await res.json();
//       if (!res.ok) {
//         setError(result.error || 'Error creating entry');
//         toast.error(result.error || 'Error creating entry');
//       } else {
//         setContent('');
//         setThemeId('');
//         setSelectedThemeName('');
//         toast.success(result.message || 'Entry created successfully');
//       }
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : 'Unknown error occurred';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-white py-8">
//       <div className="w-full max-w-7xl mx-auto">
//         <div className="w-full max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 order-2 lg:order-1">
//               <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//                 <select
//                   value={themeId}
//                   onChange={handleThemeChange}
//                   className="w-full mb-4 p-2 rounded border border-[#C9A648] bg-white text-[#121A0F] focus:outline-none focus:ring-2 focus:ring-[#E9B44C]"
//                 >
//                   <option value="">Select a Theme</option>
//                   {themeOrder.map((key) => {
//                     const theme = themes.find((t) => t.name === key);
//                     return theme ? (
//                       <option key={theme.id} value={theme.id}>
//                         {friendlyThemeNames[theme.name] || theme.name}
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder="Start writing or use voice input..."
//                     className="w-full min-h-[400px] p-4 rounded-lg border border-[#C9A648] focus:outline-none focus:ring-2 focus:ring-[#E9B44C] transition-all resize-none text-[#121A0F]"
//                   />

//                   <div className="flex items-center space-x-4 mt-4">
//                     <button
//                       className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-[#C84A20]' : 'bg-[#8B3E2F] hover:bg-[#C84A20]'}`}
//                       onClick={() => (isRecording ? stopRecording() : startRecording())}
//                       type="button"
//                     >
//                       {isRecording ? (
//                         <StopIcon className="w-6 h-6" />
//                       ) : isTranscribing ? (
//                         <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
//                       ) : (
//                         <MicrophoneIcon className="w-6 h-6" />
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       disabled={!content.trim() || isTranslating}
//                       className="p-3 rounded-full bg-[#E9B44C] text-white hover:bg-[#C9A648] transition-all relative group"
//                       onClick={handleTranslation}
//                     >
//                       <GlobeAltIcon className="w-6 h-6" />
//                       <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-[#121A0F] rounded shadow-md group-hover:block">
//                         {isTranslating ? 'Translating...' : 'Translate to English'}
//                       </span>
//                     </button>

//                     <button
//                       type="submit"
//                       disabled={loading || !content.trim()}
//                       className={`px-4 py-2 text-white rounded-lg transition-all ${
//                         selectedThemeName && themeButtonColors[selectedThemeName] 
//                           ? themeButtonColors[selectedThemeName] 
//                           : 'bg-[#C84A20] hover:bg-[#8B3E2F]'
//                       }`}
//                     >
//                       {loading ? 'Saving...' : 'Save Entry'}
//                     </button>
//                   </div>
//                   {error && <p className="text-[#C84A20] mt-2">{error}</p>}
//                 </form>
//               </div>
//             </div>

//             <div className="lg:col-span-1 order-1 lg:order-2">
//               <div className="relative h-[300px] lg:h-auto">
//                 {prompts.map((prompt, index) => (
//                   <div
//                     key={index}
//                     className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
//                       activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
//                     }`}
//                   >
//                     <div className="bg-white rounded-lg shadow-sm p-6 border border-[#C9A648]">
//                       <h3 className="text-lg font-medium text-[#8B3E2F] mb-2">{prompt.title}</h3>
//                       <p className="text-sm text-[#121A0F] leading-relaxed whitespace-pre-line mb-4">{prompt.content}</p>
//                       <div className="flex justify-between items-center">
//                         <button
//                           onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
//                           className={`p-2 rounded-full ${
//                             index === 0 ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'
//                           }`}
//                           disabled={index === 0}
//                         >
//                           <ChevronLeft className="w-5 h-5 text-[#8B3E2F]" />
//                         </button>
//                         <button
//                           onClick={() => handlePromptSelect(prompt.themeKey)}
//                           className={`px-4 py-2 text-white rounded transition-colors ${themeButtonColors[prompt.themeKey] || 'bg-[#C84A20] hover:bg-[#8B3E2F]'}`}
//                         >
//                           Select
//                         </button>
//                         <button
//                           onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
//                           className={`p-2 rounded-full ${
//                             index === prompts.length - 1 ? 'invisible' : 'bg-[#E6D6AC] hover:bg-[#E9B44C]'
//                           }`}
//                           disabled={index === prompts.length - 1}
//                         >
//                           <ChevronRight className="w-5 h-5 text-[#8B3E2F]" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <style jsx global>{`
//         ::selection {
//           background-color: rgba(200, 74, 32, 0.3);
//           color: #121A0F;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default CreateComp;


// dark mode soviet style theme with dark greenish background
// import React, { useState, useEffect, FC } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import useVoiceRecorder from '@/utils/useVoiceRecorder';
// import { transcribeAudio } from '@/utils/transcribeAudio';
// import { translateText } from '@/utils/translate';
// import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-hot-toast';
// import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
// import StarryBackground from '@/app/ui/dashboard/starryBackground';

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }

// interface Prompt {
//   title: string;
//   content: string;
//   themeKey: string;
// }

// interface Theme {
//   id: string;
//   name: string;
// }

// interface PromptCardProps {
//   title: string;
//   content: string;
//   isActive: boolean;
//   onNext: () => void;
//   onPrev: () => void;
//   isFirst: boolean;
//   isLast: boolean;
//   onSelect: () => void;
//   themeKey: string;
// }

// const friendlyThemeNames: { [key: string]: string } = {
//   morning: "Morning (De)brief",
//   evening: "Evening Reflection",
//   weekly: "Weekly Insights",
//   kiez: "Kiez Diary",
//   revelation: "Spontaneous Revelation",
//   story: "Storytelling",
// };

// const themeOrder = ["morning", "evening", "weekly", "kiez", "revelation", "story"];

// const themeColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C]',
//   evening: 'bg-[#C84A20]',
//   weekly: 'bg-[#E6D6AC]',
//   kiez: 'bg-[#C9A648]',
//   revelation: 'bg-[#8B3E2F]',
//   story: 'bg-[#D98E73]',
// };

// const themeButtonColors: Record<string, string> = {
//   morning: 'bg-[#E9B44C] hover:bg-[#C9A648]',
//   evening: 'bg-[#C84A20] hover:bg-[#8B3E2F]',
//   weekly: 'bg-[#E6D6AC] hover:bg-[#C9A648] text-[#121A0F]',
//   kiez: 'bg-[#C9A648] hover:bg-[#E9B44C]',
//   revelation: 'bg-[#8B3E2F] hover:bg-[#C84A20]',
//   story: 'bg-[#D98E73] hover:bg-[#C84A20]',
// };

// const PromptCard: FC<PromptCardProps> = ({ title, content, isActive, onNext, onPrev, isFirst, isLast, onSelect, themeKey }) => (
//   <div className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
//     <div className="bg-[#1A2215] rounded-lg shadow-md p-6 border border-[#C9A648]/50">
//       <h3 className="text-lg font-medium text-[#E9B44C] mb-2">{title}</h3>
//       <p className="text-sm text-[#E6D6AC] leading-relaxed whitespace-pre-line mb-4">{content}</p>
//       <div className="flex justify-between items-center">
//         <button
//           onClick={onPrev}
//           className={`p-2 rounded-full ${isFirst ? 'invisible' : 'bg-[#121A0F] hover:bg-[#8B3E2F]/70'}`}
//           disabled={isFirst}
//         >
//           <ChevronLeft className="w-5 h-5 text-[#E6D6AC]" />
//         </button>
//         <button
//           onClick={onSelect}
//           className={`px-4 py-2 text-white rounded transition-colors ${themeButtonColors[themeKey] || 'bg-[#C84A20] hover:bg-[#8B3E2F]'}`}
//         >
//           Select
//         </button>
//         <button
//           onClick={onNext}
//           className={`p-2 rounded-full ${isLast ? 'invisible' : 'bg-[#121A0F] hover:bg-[#8B3E2F]/70'}`}
//           disabled={isLast}
//         >
//           <ChevronRight className="w-5 h-5 text-[#E6D6AC]" />
//         </button>
//       </div>
//     </div>
//   </div>
// );

// const prompts: Prompt[] = [
//   {
//     title: "Morning (De)brief",
//     content: "What's top of mind?\nHow am I feeling?\nWhat am I excited about?",
//     themeKey: "morning",
//   },
//   {
//     title: "Evening Reflection",
//     content: "What did I accomplish?\nWhat did I learn?\nOne little win, one challenge, one grateful moment.",
//     themeKey: "evening",
//   },
//   {
//     title: "Weekly Insights",
//     content: "What gave me energy?\nWhat drained me?\nWhat could I have said no to?",
//     themeKey: "weekly",
//   },
//   {
//     title: "Kiez Diary",
//     content: "What makes me feel aligned or misaligned with the place I'm currently in?",
//     themeKey: "kiez",
//   },
//   {
//     title: "Spontaneous Revelation",
//     content: "Save what feels like a sudden flash of insight.",
//     themeKey: "revelation",
//   },
//   {
//     title: "Storytelling",
//     content: "Whenever in doubt I tell a story.",
//     themeKey: "story",
//   },
// ];

// const CreateComp: FC = () => {
//   const [content, setContent] = useState<string>('');
//   const [themeId, setThemeId] = useState<string>('');
//   const [themes, setThemes] = useState<Theme[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [activeCard, setActiveCard] = useState<number>(0);
//   const [isTranslating, setIsTranslating] = useState<boolean>(false);
//   const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
//   const [selectedThemeName, setSelectedThemeName] = useState<string>('');

//   const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

//   useEffect(() => {
//     const fetchThemes = async () => {
//       try {
//         const res = await fetch('/api/themes');
//         const data: { themes: Theme[] } = await res.json();
//         setThemes(data.themes);
//       } catch (err) {
//         console.error('Failed to fetch themes', err);
//       }
//     };
//     fetchThemes();
//   }, []);

//   useEffect(() => {
//     if (audioBlob) {
//       handleTranscription();
//     }
//   }, [audioBlob]);

//   const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = e.target.value;
//     setThemeId(selectedId);
    
//     // Find the theme name for the selected ID
//     const selectedTheme = themes.find(theme => theme.id === selectedId);
//     setSelectedThemeName(selectedTheme?.name || '');
//   };

//   const handlePromptSelect = (themeKey: string) => {
//     const theme = themes.find(t => t.name === themeKey);
//     if (theme) {
//       setThemeId(theme.id);
//       setSelectedThemeName(themeKey);
      
//       // Find the prompt content
//       const prompt = prompts.find(p => p.themeKey === themeKey);
//       if (prompt) {
//         // Add the prompt questions as a template in the textarea
//         setContent(prompt.content);
//       }
//     }
//   };

//   const handleTranscription = async () => {
//     if (!audioBlob) return;
    
//     setIsTranscribing(true);
//     try {
//       const transcript = await transcribeAudio(audioBlob);
//       if (transcript) {
//         setContent(prev => prev ? `${prev}\n\n${transcript}` : transcript);
//       }
//     } catch (err) {
//       console.error('Transcription error:', err);
//       toast.error('Failed to transcribe audio');
//     } finally {
//       setIsTranscribing(false);
//     }
//   };

//   const handleTranslation = async () => {
//     if (!content.trim()) return;
    
//     setIsTranslating(true);
//     try {
//       const translated = await translateText(content, 'en');
//       if (translated) {
//         setContent(translated);
//       }
//     } catch (err) {
//       console.error('Translation error:', err);
//       toast.error('Failed to translate text');
//     } finally {
//       setIsTranslating(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!content.trim() || !themeId) {
//       setError('Please provide content and select a theme');
//       return;
//     }
    
//     setLoading(true);
//     setError('');
    
//     try {
//       let finalLocation = null;
      
//       try {
//         finalLocation = await getVerifiedLocation();
//       } catch (locErr) {
//         console.log('Location not available:', locErr);
//       }
      
//       const res = await fetch('/api/entries/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           content,
//           theme_id: themeId,
//           location: finalLocation,
//         }),
//       });
//       const result: { message?: string; error?: string } = await res.json();
//       if (!res.ok) {
//         setError(result.error || 'Error creating entry');
//         toast.error(result.error || 'Error creating entry');
//       } else {
//         setContent('');
//         setThemeId('');
//         setSelectedThemeName('');
//         toast.success(result.message || 'Entry created successfully');
//       }
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : 'Unknown error occurred';
//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-[#121A0F] py-8 relative">
//       <div className="absolute inset-0 overflow-hidden opacity-20">
//         <div className="absolute w-1 h-1 bg-[#E6D6AC] rounded-full top-[10%] left-[20%] animate-pulse"></div>
//         <div className="absolute w-1 h-1 bg-[#E6D6AC] rounded-full top-[30%] left-[80%] animate-pulse"></div>
//         <div className="absolute w-1 h-1 bg-[#E6D6AC] rounded-full top-[50%] left-[10%] animate-pulse"></div>
//         <div className="absolute w-1 h-1 bg-[#E6D6AC] rounded-full top-[70%] left-[60%] animate-pulse"></div>
//         <div className="absolute w-1 h-1 bg-[#E6D6AC] rounded-full top-[90%] left-[30%] animate-pulse"></div>
//         <div className="absolute w-2 h-2 bg-[#E9B44C] rounded-full top-[15%] left-[70%] animate-pulse"></div>
//         <div className="absolute w-2 h-2 bg-[#E9B44C] rounded-full top-[45%] left-[40%] animate-pulse"></div>
//         <div className="absolute w-2 h-2 bg-[#E9B44C] rounded-full top-[75%] left-[85%] animate-pulse"></div>
//       </div>
      
//       <div className="w-full max-w-7xl mx-auto relative z-10">
//         <div className="w-full max-w-6xl mx-auto px-4">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 order-2 lg:order-1">
//               <div className="bg-[#1A2215] rounded-lg shadow-md p-6 border border-[#C9A648]/50">
//                 <select
//                   value={themeId}
//                   onChange={handleThemeChange}
//                   className="w-full mb-4 p-2 rounded border border-[#C9A648]/50 bg-[#121A0F] text-[#E6D6AC] focus:outline-none focus:ring-2 focus:ring-[#E9B44C]/50"
//                 >
//                   <option value="">Select a Theme</option>
//                   {themeOrder.map((key) => {
//                     const theme = themes.find((t) => t.name === key);
//                     return theme ? (
//                       <option key={theme.id} value={theme.id}>
//                         {friendlyThemeNames[theme.name] || theme.name}
//                       </option>
//                     ) : null;
//                   })}
//                 </select>

//                 <form onSubmit={handleSubmit}>
//                   <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder="Start writing or use voice input..."
//                     className="w-full min-h-[400px] p-4 rounded-lg border border-[#C9A648]/50 bg-[#121A0F] focus:outline-none focus:ring-2 focus:ring-[#E9B44C]/50 transition-all resize-none text-[#E6D6AC] placeholder-[#E6D6AC]/50"
//                   />

//                   <div className="flex items-center space-x-4 mt-4">
//                     <button
//                       className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-[#C84A20]' : 'bg-[#8B3E2F] hover:bg-[#C84A20]'}`}
//                       onClick={() => (isRecording ? stopRecording() : startRecording())}
//                       type="button"
//                     >
//                       {isRecording ? (
//                         <StopIcon className="w-6 h-6" />
//                       ) : isTranscribing ? (
//                         <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
//                       ) : (
//                         <MicrophoneIcon className="w-6 h-6" />
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       disabled={!content.trim() || isTranslating}
//                       className="p-3 rounded-full bg-[#E9B44C] text-white hover:bg-[#C9A648] transition-all relative group disabled:opacity-50 disabled:cursor-not-allowed"
//                       onClick={handleTranslation}
//                     >
//                       <GlobeAltIcon className="w-6 h-6" />
//                       <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-[#121A0F] bg-[#E6D6AC] rounded shadow-md group-hover:block">
//                         {isTranslating ? 'Translating...' : 'Translate to English'}
//                       </span>
//                     </button>

//                     <button
//                       type="submit"
//                       disabled={loading || !content.trim()}
//                       className={`px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
//                         selectedThemeName && themeButtonColors[selectedThemeName] 
//                           ? themeButtonColors[selectedThemeName] 
//                           : 'bg-[#C84A20] hover:bg-[#8B3E2F]'
//                       }`}
//                     >
//                       {loading ? 'Saving...' : 'Save Entry'}
//                     </button>
//                   </div>
//                   {error && <p className="text-[#C84A20] mt-2">{error}</p>}
//                 </form>
//               </div>
//             </div>

//             <div className="lg:col-span-1 order-1 lg:order-2">
//               <div className="relative h-[300px] lg:h-auto">
//                 {prompts.map((prompt, index) => (
//                   <div
//                     key={index}
//                     className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
//                       activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
//                     }`}
//                   >
//                     <div className="bg-[#1A2215] rounded-lg shadow-md p-6 border border-[#C9A648]/50">
//                       <h3 className="text-lg font-medium text-[#E9B44C] mb-2">{prompt.title}</h3>
//                       <p className="text-sm text-[#E6D6AC] leading-relaxed whitespace-pre-line mb-4">{prompt.content}</p>
//                       <div className="flex justify-between items-center">
//                         <button
//                           onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
//                           className={`p-2 rounded-full ${
//                             index === 0 ? 'invisible' : 'bg-[#121A0F] hover:bg-[#8B3E2F]/70'
//                           }`}
//                           disabled={index === 0}
//                         >
//                           <ChevronLeft className="w-5 h-5 text-[#E6D6AC]" />
//                         </button>
//                         <button
//                           onClick={() => handlePromptSelect(prompt.themeKey)}
//                           className={`px-4 py-2 text-white rounded transition-colors ${themeButtonColors[prompt.themeKey] || 'bg-[#C84A20] hover:bg-[#8B3E2F]'}`}
//                         >
//                           Select
//                         </button>
//                         <button
//                           onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
//                           className={`p-2 rounded-full ${
//                             index === prompts.length - 1 ? 'invisible' : 'bg-[#121A0F] hover:bg-[#8B3E2F]/70'
//                           }`}
//                           disabled={index === prompts.length - 1}
//                         >
//                           <ChevronRight className="w-5 h-5 text-[#E6D6AC]" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <style jsx global>{`
//         ::selection {
//           background-color: rgba(233, 180, 76, 0.3);
//           color: #E6D6AC;
//         }
        
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 0.2;
//           }
//           50% {
//             opacity: 0.8;
//           }
//         }
        
//         .animate-pulse {
//           animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//           animation-delay: calc(var(--tw-animate-delay, 0) * 1s);
//         }
//       `}</style>
//     </main>
//   );
// };

// export default CreateComp;

// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest) {
//   try {
//     // Extract threadId from the URL
//     const url = new URL(req.url);
//     const pathnameParts = url.pathname.split('/');
//     const threadId = pathnameParts[pathnameParts.length - 1];

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 });
//     }

//     const threadResult = await sql`
//       SELECT id, title, description, created_at
//       FROM threads
//       WHERE id = ${threadId}
//     `;

//     const entriesResult = await sql`
//       SELECT
//         e.id AS entry_id,
//         e.content,
//         e.created_at AS entry_created_at,
//         e.theme_id,
//         t.name AS theme_name,
//         e.thread_id
//       FROM entries e
//       LEFT JOIN themes t ON e.theme_id = t.id
//       WHERE e.thread_id = ${threadId}
//       ORDER BY e.created_at DESC
//     `;

//     return NextResponse.json(
//       {
//         thread: threadResult[0] || null,
//         entries: entriesResult,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error fetching thread entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const threadId = searchParams.get('threadId');
//     console.log('Fetching Thread ID:', threadId);

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing threadId' }, { status: 400 });
//     }

//     const thread = await sql`
//       SELECT * FROM threads WHERE id = ${threadId}
//     `;

//     const entries = await sql`
//       SELECT 
//         e.id AS entry_id,
//         e.content,
//         e.created_at AS entry_created_at,
//         e.theme_id,
//         t.name AS theme_name
//       FROM entries e
//       LEFT JOIN themes t ON e.theme_id = t.id
//       WHERE e.thread_id = ${threadId}
//       ORDER BY e.created_at DESC
//     `;

//     return NextResponse.json({
//       thread: thread[0] || null,
//       entries,
//     });
//   } catch (error) {
//     console.error('Error fetching group entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// import { NextRequest, NextResponse } from 'next/server';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// export async function GET(req: NextRequest, context: { params: { threadId: string } }) {
//   try {
//     const { threadId } = context.params;

//     if (!threadId) {
//       return NextResponse.json({ error: 'Missing thread ID' }, { status: 400 });
//     }

//     // ✅ Fetch thread metadata
//     const threadResult = await sql`
//       SELECT id, title, description, created_at 
//       FROM threads 
//       WHERE id = ${threadId};
//     `;

//     if (threadResult.length === 0) {
//       return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
//     }

//     const thread = threadResult[0];

//     // ✅ Fetch entries for the thread
//     const entries = await sql`
//       SELECT 
//         id as entry_id, 
//         content, 
//         created_at as entry_created_at, 
//         theme_id 
//       FROM entries 
//       WHERE thread_id = ${threadId}
//       ORDER BY created_at DESC;
//     `;

//     return NextResponse.json({ thread, entries }, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching thread entries:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }



// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from 'next/navigation';




// interface Entry {
//     id: string;
//     theme_id: string;
//     thread_id: string | null;
//     content: string;
//     city: string;
//     state: string;
//     location: string;
//     created_at: string;
//   }

// const KiezPage: React.FC = () => {
//   const [entries, setEntries] = useState<Entry[]>([]);
//   const [cityInfo, setCityInfo] = useState<{ name: string; state?: string; } | null>(null);   
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [offset, setOffset] = useState<number>(0);
//   const limit = 20;
//   const params = useParams();
//   const city = params?.city as string; 


//   // const fetchEntries = async () => {
//   //   if (loading || !hasMore) return;
//   //   setLoading(true);
//   //   try {
//   //     const res = await fetch(`/api/entries/get/kiez?limit=${limit}&offset=${offset}`);
//   //     const data = await res.json();
//   //     if (!res.ok) throw new Error(data.error || "Failed to fetch entries");


//   //     setEntries((prev) => {
//   //       const existingIds = new Set(prev.map(entry => entry.id));
//   //       const newUniqueEntries = data.filter((entry: Entry) => !existingIds.has(entry.id));
//   //       return [...prev, ...newUniqueEntries];
//   //     });
      
//   //           setHasMore(data.length === limit);
//   //     setOffset((prev) => prev + limit);
//   //   } catch (err: any) {
//   //     setError(err.message || "Unknown error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchEntries = async () => {
//     if (loading || !hasMore || !city) return;
//     setLoading(true);
//     try {
    
//       const res = await fetch(`/api/entries/get/kiez?city=${encodeURIComponent(city)}&limit=${limit}&offset=${offset}`);

//       // const res = await fetch(`/api/entries/get/kiez?city=${encodeURIComponent$city)}&limit=${limit}&offset=${offset}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to fetch entries");
  
//       // Extract entries and city
//       const newEntries = data.entries || [];
//       setCityInfo(data.city || null);
  
//       setEntries((prev) => {
//         const existingIds = new Set(prev.map(entry => entry.id));
//         const uniqueNewEntries = newEntries.filter((entry: Entry) => !existingIds.has(entry.id));
//         return [...prev, ...uniqueNewEntries];
//       });
  
//       setHasMore(newEntries.length === limit); // if we received fewer than `limit`, we're at the end
//       setOffset((prev) => prev + limit);
//     } catch (err: any) {
//       setError(err.message || "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   useEffect(() => {
//     fetchEntries();
//     const handleScroll = () => {
//       if (
//         window.innerHeight + document.documentElement.scrollTop + 100 >=
//         document.documentElement.offsetHeight
//       ) {
//         fetchEntries();
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const grouped = entries.reduce<Record<string, Entry[]>>((acc, entry) => {
//     acc[entry.city] = acc[entry.city] || [];
//     acc[entry.city].push(entry);
//     return acc;
//   }, {});

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-4">Kiez Diary</h1>
//       {error && <p className="text-red-500">{error}</p>}

//       {Object.keys(grouped).map((city) => (
//         <div key={city} className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">{city}</h2>
//           {grouped[city].map((entry) => (
//             <div key={entry.id} className="p-4 bg-white shadow rounded mb-2">
//               <p className="text-gray-800">{entry.content}</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {entry.state} • {new Date(entry.created_at).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       ))}

//       {loading && <p className="text-center mt-4">Loading more...</p>}
//       {!hasMore && <p className="text-center mt-4 text-gray-500">No more entries.</p>}
//     </div>
//   );
// };

// export default KiezPage;