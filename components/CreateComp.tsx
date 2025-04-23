'use client';

import React, { useState, useEffect, FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useVoiceRecorder from '@/utils/useVoiceRecorder';
import { transcribeAudio } from '@/utils/transcribeAudio';
import { translateText } from '@/utils/translate';
import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { lusitana } from '@/app/ui/fonts';


interface Prompt {
  title: string;
  content: string;
  themeKey: string;
}

interface Theme {
  id: string;
  name: string;
}

const friendlyThemeNames: { [key: string]: string } = {
  morning: "Morning (De)brief",
  evening: "Evening Reflection",
  weekly: "Weekly Insights",
  kiez: "Kiez Diary",
  revelation: "Spontaneous Revelation",
  story: "Storytelling",
};

const themeOrder = ["morning", "evening", "weekly", "kiez", "revelation", "story"];

const prompts: Prompt[] = [
  {
    title: "Morning Brief",
    content: "What's top of mind?\nHow am I feeling?\nWhat am I excited about?",
    themeKey: "morning",
  },
  {
    title: "Evening Reflection",
    content: "What did I accomplish?\nWhat did I learn?\nOne little win, one challenge, one grateful moment.",
    themeKey: "evening",
  },
  {
    title: "Weekly Insights",
    content: "What gave me energy?\nWhat drained me?\nWhat could I have said no to?",
    themeKey: "weekly",
  },
  {
    title: "Kiez Diary",
    content: "How come this place inspires me? What makes this place special? What is happening?",
    themeKey: "kiez",
  },
  {
    title: "Spontaneous Revelation",
    content: "An unexpected insight, a moment of clarity, a new perspective. ",
    themeKey: "revelation",
  },
  {
    title: "Storytelling",
    content: "Whenever in doubt I tell a story. Everything is a story.",
    themeKey: "story",
  },
];


const CreateComp: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [themeId, setThemeId] = useState<string>('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeCard, setActiveCard] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [selectedThemeName, setSelectedThemeName] = useState<string>('');
  const router = useRouter();
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000;
  const { themeColors, styles } = useTheme();


  // set length of text
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

  // Fetch themes from the server
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch('/api/themes');
        const data: { themes: Theme[] } = await res.json();
        setThemes(data.themes);
      } catch (err) {
        console.error('Failed to fetch themes', err);
      }
    };
    fetchThemes();
  }, []);

    // // Fetch location when component mounts
    // useEffect(() => {
    //   const fetchLocation = async () => {
    //     setIsLoadingLocation(true);
    //     try {
    //       const data = await getVerifiedLocation();
    //       console.log('Location fetched on mount:', data);
    //       setLocationData(data);
    //     } catch (error) {
    //       console.error('Error fetching location:', error);
    //     } finally {
    //       setIsLoadingLocation(false);
    //     }
    //   };
      
    //   fetchLocation();
    // }, []);

  //audio transcription
  useEffect(() => {
    if (audioBlob) {
      handleTranscription();
    }
  }, [audioBlob]);

// theme selection
  useEffect(() => {
    if (themeId) {
      const theme = themes.find(t => t.id === themeId);
      if (theme) {
        setSelectedThemeName(theme.name);
      }
    } else {
      setSelectedThemeName('');
    }
  }, [themeId, themes]);

  // audio transcription
  const handleTranscription = async () => {
    if (!audioBlob) return;
  
    setIsTranscribing(true);
    try {
      const transcription = await transcribeAudio(audioBlob);
      if (transcription) {
        const newContent = content + (content ? '\n\n' : '') + transcription;
  
        if (newContent.length > MAX_CHARS) {
          setContent(newContent.slice(0, MAX_CHARS)); // truncate
          toast.error('Text exceeds maximum length and was truncated.');
        } else {
          setContent(newContent);
        }
      }
    } catch (err: any) {
      toast.error('Failed to transcribe audio');
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };
  

  // translation
  const handleTranslation = async () => {
    if (!content.trim()) return;
    
    setIsTranslating(true);
    try {
      const translation = await translateText(content);
      if (translation) {
        setContent(translation);
      }
    } catch (err: any) {
      toast.error('Failed to translate text');
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle theme change
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setThemeId(e.target.value);
  };

  // Handle prompt selection
  const handlePromptSelect = (themeKey: string) => {
    const theme = themes.find(t => t.name === themeKey);
    if (theme) {
      setThemeId(theme.id);
      setSelectedThemeName(theme.name);
    }
  };

  // Submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.length > MAX_CHARS) {
      setError('Entry exceeds character limit');
      toast.error('Maximum length is 500 characters.');
      return;
    }
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }
    if (!themeId) {
      setError('Please select a theme');
      return;
    }

    
    setLoading(true);
    setError('');

    try {
      const location =  await getVerifiedLocation();
      console.log('Location data received:', location); 

      const payload = {
        content,
        theme_id: themeId,
        location: location ? {
          latitude: location.location.latitude,
          longitude: location.location.longitude,
          city: location.city || 'Unknown',
          state: location.state || 'Unknown'
        } : null
      };
      
      console.log('Sending payload:', payload); 
      
      
      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.error || errorData.message || 'Failed to create entry';
        throw new Error(errorMessage);
      }
      toast.success('Entry saved successfully!');
      // router.push('/dashboard/global');
      // router.refresh();
      setContent('');
      setThemeId('');
      setSelectedThemeName('');
    } catch (err: any) {
      const message = err.message || 'An error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // switch placeholder text according to color theme 
  const { theme } = useTheme();
    // Get theme-specific placeholder text
    const getPlaceholderText = () => {
      switch (theme) {
        case 'ocean':
          return "Dive into your thoughts... Let them flow like ocean currents...";
        case 'space':
          return "Launch your thoughts into the cosmos... What's on your mind?";
        case 'shell':
          return "Whisper to the shell... What secrets would you share?";
        case 'dreamy':
          return "Enter the dreamscape... Let your imagination wander...";
        case 'daydream':
          return "Capture your day... What thoughts fill your mind?";
        default:
          return "What's on your mind?";
      }
    };

  return (
<main className={`min-h-screen py-8 relative ${styles.bgPrimary}`}>
      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 order-1 lg:order-1">
{/* select theme dropdown */}
              <div className="p-1">
                <select
                  value={themeId}
                  onChange={handleThemeChange}
                  className={`w-full mb-4 p-2 rounded ${styles.bgSecondary} ${styles.textPrimary} opacity-50 focus:outline-none focus:ring-2 focus:ring-[#E9B44C]/50 border-0`}
                >
                  <option value="">Select a Theme</option>
                  {themeOrder.map((key) => {
                    const theme = themes.find((t) => t.name === key);
                    return theme ? (
                      <option key={theme.id} value={theme.id} >
                        {friendlyThemeNames[theme.name] || theme.name}
                      </option>
                    ) : null;
                  })}
                </select>

{/* textarea */}
                <form onSubmit={handleSubmit}>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className={`w-full min-h-[400px] p-4 rounded-lg transition-all resize-none ${styles.bgSecondary} ${styles.textPrimary}
                    focus:outline-none focus:ring-2 focus:ring-[#E9B44C]/50 
                    ${charCount > MAX_CHARS ? 'border-red-500 ring-red-300' : 'border-transparent'}
                  `}
                />
{/* char count */}
                <div className="text-right text-xs mt-1">
                  <span className={charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-400'}>
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>


{/* record button */}
                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-[#C84A20]' : 'bg-[#8B3E2F] hover:bg-[#C84A20]'}`}
                      onClick={() => (isRecording ? stopRecording() : startRecording())}
                      type="button"
                      disabled={isRecording || charCount >= MAX_CHARS}
                    >
                      {isRecording ? (
                        <StopIcon className="w-6 h-6" />
                      ) : isTranscribing ? (
                        <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <MicrophoneIcon className="w-6 h-6" />
                      )}
                    </button>
{/* translate button */}
                    <button
                      type="button"
                      disabled={!content.trim() || isTranslating}
                      className="p-3 rounded-full bg-[#E9B44C] text-white hover:bg-[#C9A648] transition-all relative group disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleTranslation}
                    >
                      <GlobeAltIcon className="w-6 h-6" />
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-[#121A0F] bg-[#E6D6AC] rounded shadow-md group-hover:block">
                        {isTranslating ? 'Translating...' : 'Translate to English'}
                      </span>
                    </button>
{/* submit button */}
                    <button
                        type="submit"
                        disabled={loading || !content.trim()}
                        className={`px-4 py-2 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedThemeName && themeColors[selectedThemeName] 
                            ? themeColors[selectedThemeName] 
                            : 'bg-[#C84A20] hover:bg-[#8B3E2F]'
                        }`}
                      >
                        {loading ? 'Saving...' : 'Save Entry'}
                      </button>
                  </div>
                  {error && <p className="text-[#C84A20] mt-2">{error}</p>}
                </form>
              </div>
            </div>

{/* THeme card staple */}
            <div className="lg:col-span-1 order-2 lg:order-2">
  <div className="relative lg:min-h-[400px] min-h-[200px]">
    {prompts.map((prompt, index) => (
      <div
  key={index}
  className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
    activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
  }`}
>
  <div className={`${styles.bgPrimary} rounded-lg shadow-md p-4 border ${styles.borderColor}`}>
    <h3 className={`text-lg font-medium ${styles.textPrimary} mb-2`}>
      {prompt.title}
    </h3>
    <p className={`text-sm ${styles.textPrimary} leading-relaxed whitespace-pre-line mb-4 h-[120px] overflow-auto`}>
    {prompt.content}
    </p>
    <div className="flex justify-between items-center">
      <button
        onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
        className={`p-2 rounded-full ${
          index === 0 ? 'invisible' : `${styles.bgHover}`
        }`}
        disabled={index === 0}
      >
        <ChevronLeft className={`w-5 h-5 ${styles.textPrimary}`} />
      </button>
      <button
        onClick={() => handlePromptSelect(prompt.themeKey)}
        className={`px-4 py-2 rounded transition-colors ${themeColors[prompt.themeKey]}  ${styles.textPrimary}`}
      >
        Select
      </button>
      <button
        onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
        className={`p-2 rounded-full ${
          index === prompts.length - 1 ? 'invisible' : `${styles.bgHover}`
        }`}
        disabled={index === prompts.length - 1}
      >
        <ChevronRight className={`w-5 h-5 ${styles.textPrimary}`} />
      </button>
    </div>
  </div>
</div>

    ))}
  </div>
</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateComp;
