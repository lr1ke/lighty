


import React, { useState, useEffect, FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useVoiceRecorder from '@/utils/useVoiceRecorder';
import { transcribeAudio } from '@/utils/transcribeAudio';
import { translateText } from '@/utils/translate';
import { MicrophoneIcon, StopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getVerifiedLocation } from '@/utils/getVerifiedLocation';
import StarryBackground from '@/app/ui/dashboard/starryBackground';


interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Prompt {
  title: string;
  content: string;
  themeKey: string;
}

interface Theme {
  id: string;
  name: string;
}

interface PromptCardProps {
  title: string;
  content: string;
  isActive: boolean;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSelect: () => void;
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


const PromptCard: FC<PromptCardProps> = ({ title, content, isActive, onNext, onPrev, isFirst, isLast, onSelect }) => (
  <div className={`absolute top-0 left-0 w-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line mb-4">{content}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className={`p-2 rounded-full ${isFirst ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'}`}
          disabled={isFirst}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={onSelect}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select
        </button>
        <button
          onClick={onNext}
          className={`p-2 rounded-full ${isLast ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'}`}
          disabled={isLast}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);

const prompts: Prompt[] = [
  {
    title: "Morning (De)brief",
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
    content: "What makes me feel aligned or misaligned with the place I'm currently in?",
    themeKey: "kiez",
  },
  {
    title: "Spontaneous Revelation",
    content: "Save what feels like a sudden flash of insight.",
    themeKey: "revelation",
  },
  {
    title: "Storytelling",
    content: "Whenever in doubt I tell a story.",
    themeKey: "story",
  },
];

const CreateComp: FC = () => {
  const [content, setContent] = useState<string>('');
  const [themeId, setThemeId] = useState<string>('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeCard, setActiveCard] = useState<number>(0);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const { isRecording, audioBlob, startRecording, stopRecording } = useVoiceRecorder();

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

  useEffect(() => {
    if (audioBlob) {
      handleTranscription();
    }
  }, [audioBlob]);


  const handlePromptSelect = (themeKey: string) => {
    const selectedTheme = themes.find(t => t.name === themeKey);
    if (selectedTheme) {
      setThemeId(selectedTheme.id);
      setActiveCard(prompts.findIndex(p => p.themeKey === themeKey));
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setThemeId(selectedId);
    const theme = themes.find(t => t.id === selectedId);
    if (theme) {
      const promptIndex = prompts.findIndex(p => p.themeKey === theme.name);
      if (promptIndex !== -1) {
        setActiveCard(promptIndex);
      }
    }
  };

  const handleTranscription = async (): Promise<void> => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    const text = await transcribeAudio(audioBlob);
    setIsTranscribing(false);
    if (text) setContent((prev) => prev + ' ' + text);
  };

  const handleTranslation = async (): Promise<void> => {
    if (!content.trim()) return;
    setIsTranslating(true);
    const translatedText = await translateText(content);
    if (translatedText) setContent(translatedText);
    setIsTranslating(false);
  };

  // const getLocation = async (): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     if (!navigator.geolocation) {
  //       toast.error('Geolocation is not supported by your browser');
  //       return reject('Geolocation not supported');
  //     }
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         try {
  //           const { latitude, longitude } = position.coords;
  //           const response = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //           );
  //           const data = await response.json();
  //           const locationString: string = data.address.city ||
  //             data.address.town ||
  //             data.address.village ||
  //             data.address.suburb ||
  //             data.address.municipality ||
  //             `${latitude}, ${longitude}`;
  //           resolve(locationString);
  //         } catch (err) {
  //           console.error('Location fetch error:', err);
  //           reject(err);
  //         }
  //       },
  //       (error) => {
  //         toast.error('Unable to retrieve your location');
  //         reject(error);
  //       }
  //     );
  //   });
  // };

  const getLocation = (): Promise<Coordinates | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => resolve(null)
      );
    });
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!content.trim() || !themeId) {
      setError('Please select a theme and write some content.');
      toast.error('Please select a theme and write some content.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // const coords = await getLocation();
      const finalLocation = await getLocation();

      const res = await fetch('/api/entries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          theme_id: themeId,
          location: finalLocation,
        }),
      });
      const result: { message?: string; error?: string } = await res.json();
      if (!res.ok) {
        setError(result.error || 'Error creating entry');
        toast.error(result.error || 'Error creating entry');
      } else {
        setContent('');
        setThemeId('');
        toast.success(result.message || 'Entry created successfully');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <select
                  value={themeId}
                  onChange={handleThemeChange}
                  className="w-full mb-4 p-2 rounded border border-gray-300"
                >
                  <option value="">Select a Theme</option>
                  {themeOrder.map((key) => {
                    const theme = themes.find((t) => t.name === key);
                    return theme ? (
                      <option key={theme.id} value={theme.id}>
                        {friendlyThemeNames[theme.name] || theme.name}
                      </option>
                    ) : null;
                  })}
                </select>

        <form onSubmit={handleSubmit}>
        <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing or use voice input..."
        className="w-full min-h-[400px] p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none"
        />

        <div className="flex items-center space-x-4 mt-4">
        <button
          className={`p-3 rounded-full text-white transition-all ${isRecording ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={() => (isRecording ? stopRecording() : startRecording())}
          type="button"
        >
          {isRecording ? (
            <StopIcon className="w-6 h-6" />
          ) : isTranscribing ? (
            <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
          ) : (
            <MicrophoneIcon className="w-6 h-6" />
          )}
        </button>

        <button
          type="button"
          disabled={!content.trim() || isTranslating}
          className="p-3 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-all relative group"
          onClick={handleTranslation}
        >
          <GlobeAltIcon className="w-6 h-6" />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-md group-hover:block">
            {isTranslating ? 'Translating...' : 'Translate to English'}
          </span>
        </button>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all"
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        </div>
        </div>

        <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="relative h-[300px] lg:h-auto">
                {prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className={`absolute top-0 left-0 w-full transition-all duration-500 transform ${
                      activeCard === index ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'
                    }`}
                  >
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{prompt.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line mb-4">{prompt.content}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setActiveCard(Math.max(0, activeCard - 1))}
                          className={`p-2 rounded-full ${
                            index === 0 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          disabled={index === 0}
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handlePromptSelect(prompt.themeKey)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => setActiveCard(Math.min(prompts.length - 1, activeCard + 1))}
                          className={`p-2 rounded-full ${
                            index === prompts.length - 1 ? 'invisible' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                          disabled={index === prompts.length - 1}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
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
